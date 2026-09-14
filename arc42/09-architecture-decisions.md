# 9. Architecture Decisions

## Overview

This section records the **Architecture Decision Records (ADRs)** for the Semi-Boarding Meal Management System using the Nygard ADR format extended with alternatives analysis and cross-section architectural implications. Each record captures the operational context, options evaluated, rationale, and consequences of significant technical and architectural choices.

### Decision Log

| ID | Title | Status | Date | Primary Driver |
|:---|:---|:---:|:---:|:---|
| **ADR-001** | Modular Monolith Architecture over Microservices | Accepted | 2026-09-14 | Simplicity, Low Latency, ACID Guarantees |
| **ADR-002** | Strict Temporal Cutoff Guard with Emergency Triage Workflow | Accepted | 2026-09-14 | `#reliable`, Operational Boundary Discipline |
| **ADR-003** | Lightweight Vanilla Frontend Stack over Heavy SPA Frameworks | Accepted | 2026-09-14 | `#usable`, Instant Cold Starts, Low-Power Kiosks |
| **ADR-004** | Push-Based WebSocket Event Distribution for Demand Rollup | Accepted | 2026-09-14 | `#efficient`, Sub-Second Real-Time Visibility |

---

## ADR-001: Modular Monolith Architecture over Microservices

**Status:** Accepted  
**Date:** 2026-09-14  

### Context
The Semi-Boarding Meal Management System serves primary school campuses with 30–60 classrooms and 1,000–2,500 daily student meals. Operations require high transactional consistency between student roll-calls, cutoff locking, recipe ingredient calculations, and kitchen batch tracking. A distributed microservices architecture was considered but would introduce distributed transaction challenges (Saga orchestrators, two-phase commits), network latency across campus LAN, and high DevOps maintenance costs for school IT staff.

### Decision
We adopt a **Modular Monolith** architecture built on Node.js and Express.js, organized around Domain-Driven Design (DDD) boundaries (`Participation`, `Demand`, `Preparation`), backed by a single ACID-compliant PostgreSQL 15 database.

### Alternatives Considered
| Alternative | Why Rejected |
|:---|:---|
| **Microservices Architecture** | Excessive operational overhead, distributed network failure points, complex cross-service eventual consistency during the critical 15-minute morning roll-call rush. |
| **Serverless Functions (FaaS)** | Unacceptable cold-start latency spikes during the 07:45–08:00 AM peak roll-call window; complex local on-premise school hosting. |

### Consequences
- **Positive:** Guaranteed relational ACID transactions across all modules; single-command Docker deployment; minimal memory and hardware footprint for on-premise school servers.
- **Negative:** Independent scaling of isolated modules is not possible (mitigated by the fact that morning load profile is uniform and easily handled by a single Node.js instance).

---

## ADR-002: Strict Temporal Cutoff Guard with Emergency Triage Workflow

**Status:** Accepted  
**Date:** 2026-09-14  

### Context
In semi-boarding operations, cooking shifts commence immediately at 08:00 AM. Uncontrolled student attendance modifications after this deadline lead to dish over/under-production, food waste, or supply shortfalls. However, legitimate emergencies (e.g. school bus breakdown, sudden illness) inevitably occur after 08:00 AM.

### Decision
We implement a **two-phase temporal state barrier**:
1. Server-side middleware (`CutoffPolicyGuard`) intercepts all attendance write endpoints. Any direct update submitted after **08:00:00 AM** is rejected with `409 Conflict`.
2. Post-cutoff alterations must be submitted via a dedicated **Emergency Change Request Form** (`F-DMD-03`), which registers in `meal_demand_changes` with `PENDING` status, alerting the Meal Manager via WebSocket for explicit approval or rejection before altering kitchen cooking targets.

### Alternatives Considered
| Alternative | Why Rejected |
|:---|:---|
| **Soft Cutoff with Warning** | Teachers frequently ignored soft warnings, leading to ongoing recipe discrepancies in the kitchen. |
| **Complete Hard Lock (No Amendments)** | Causes operational breakdown when children arrive late due to traffic and are left without lunch rations. |

### Consequences
- **Positive:** Protects kitchen prep stability; ensures 100% auditability for school financial accounting and parental billing.
- **Negative:** Requires Meal Manager to actively monitor and approve exceptions during the 08:00–08:30 AM transition window.

---

## ADR-003: Lightweight Vanilla Frontend Stack over Heavy SPA Frameworks

**Status:** Accepted  
**Date:** 2026-09-14  

### Context
Client endpoints in the school include teacher smartphones, aged classroom tablets, and wall-mounted kitchen touch kiosks with limited CPU/RAM. Heavy SPA frameworks (React, Angular, Next.js) produce large JavaScript bundles that suffer from slow hydration and require periodic npm dependency maintenance.

### Decision
We build the entire client presentation layer using **Semantic HTML5, ES6 Modules, and native CSS Custom Properties (Design Tokens)** with zero runtime UI framework dependencies.

### Alternatives Considered
| Alternative | Why Rejected |
|:---|:---|
| **React + Vite** | Adds framework runtime bundle overhead; higher memory usage on low-cost Android kiosks. |
| **Next.js (SSR)** | Unnecessary server rendering overhead for authenticated school intranet portal screens. |

### Consequences
- **Positive:** Instant cold starts (< 500ms); zero build complexity or npm package rot; minimal client memory usage.
- **Negative:** Developers must write clean native DOM manipulation code and manage state without framework abstractions.

---

## ADR-004: Push-Based WebSocket Event Distribution for Demand Rollup

**Status:** Accepted  
**Date:** 2026-09-14  

### Context
During the 07:45–08:00 AM check-in window, 50+ classrooms submit roll-calls within minutes. The Meal Manager dashboard must display an up-to-the-second aggregated total of meals to prepare. Standard HTTP short-polling generates unnecessary database load and introduces a 5–10 second display lag.

### Decision
We implement **Socket.io over WSS** to establish real-time pub/sub channels (`CLASS_ROSTER_LOCKED`, `EMERGENCY_AMENDMENT_PENDING`, `STATION_BATCH_COMPLETED`).

### Alternatives Considered
| Alternative | Why Rejected |
|:---|:---|
| **HTTP Short Polling (every 3s)** | Generates hundreds of redundant database queries per minute during peak network congestion. |
| **Server-Sent Events (SSE)** | Unidirectional only; lacks native bi-directional client acknowledgement protocols supported by Socket.io. |

### Consequences
- **Positive:** Sub-second dashboard updates (< 1.0s) fulfilling Quality Goal #2; instant audio/visual alerts for emergency requests.
- **Negative:** Requires persistent connection state and reconnection logic for mobile clients switching Wi-Fi access points.
