# 9. Architecture Decisions

## Overview

This section records the **Architecture Decision Records (ADRs)** for the Semi-Boarding Meal Management System using the Nygard ADR format extended with alternatives analysis and cross-section architectural implications. Each record captures the operational context, options evaluated, rationale, and consequences of significant technical and architectural choices under the External Catering Operating Model.

### Decision Log

| ID | Title | Status | Date | Primary Driver |
|:---|:---|:---:|:---:|:---|
| **ADR-001** | Modular Monolith Architecture over Microservices | Accepted | 2026-09-17 | Simplicity, Low Latency, ACID Guarantees |
| **ADR-002** | Strict 08:30 AM Cutoff Guard with Configurable Buffer Margin Engine | Accepted | 2026-09-17 | `#reliable`, Operational Timeline Discipline |
| **ADR-003** | Lightweight Vanilla Frontend Stack across 4 Role Portals | Accepted | 2026-09-17 | `#usable`, Instant Cold Starts, Zero-Dependency |
| **ADR-004** | Dynamic VietQR Generation & Webhook Reconciliation for Fee Collection | Accepted | 2026-09-17 | `#reliable`, Automated Financial Settlement |

---

## ADR-001: Modular Monolith Architecture over Microservices

**Status:** Accepted  
**Date:** 2026-09-17  

### Context
The Semi-Boarding Meal Management System serves primary school campuses with 30–60 classrooms and 1,000–2,500 daily student meals. Operations require high transactional consistency between student roll-calls, cutoff locking, catering order dispatches, receiving inspection, and monthly billing calculations. A distributed microservices architecture was considered but would introduce distributed transaction challenges (Saga orchestrators, two-phase commits), network latency across campus LAN, and high DevOps maintenance costs for school IT staff.

### Decision
We adopt a **Modular Monolith** architecture built on Node.js and Express.js, organized around Domain-Driven Design (DDD) boundaries across all 8 business domains, backed by a single ACID-compliant PostgreSQL 15 database.

### Alternatives Considered
| Alternative | Why Rejected |
|:---|:---|
| **Microservices Architecture** | Excessive operational overhead, distributed network failure points, complex cross-service eventual consistency during the critical 15-minute morning roll-call rush. |
| **Serverless Functions (FaaS)** | Unacceptable cold-start latency spikes during the 08:00–08:30 AM peak roll-call window; complex local on-premise school hosting. |

### Consequences
- **Positive:** Guaranteed relational ACID transactions across all modules; single-command Docker deployment; minimal memory and hardware footprint for on-premise school servers.
- **Negative:** Independent scaling of isolated modules is not possible (mitigated by the fact that morning load profile is uniform and easily handled by a single Node.js instance).
- **Risks created (→ Section 11):** None.

---

## ADR-002: Strict 08:30 AM Cutoff Guard with Configurable Buffer Margin Engine

**Status:** Accepted  
**Date:** 2026-09-17  

### Context
Under the external catering vendor model, purchase orders must be finalized and dispatched before **08:45 AM** so that catering production lines can cook, pack thermal containers, and deliver hot meals to the school dock by **10:30 AM**. Uncontrolled attendance changes after 08:30 AM cause incorrect order quantities, resulting in food shortfalls or financial waste.

### Decision
We implement a two-tier demand protection strategy:
1. Server-side middleware (`AttendanceCutoffGuard`) intercepts attendance write endpoints. Any direct update submitted after **08:30:00 AM** is rejected with `409 Conflict`.
2. The `BufferCalculationEngine` applies a configurable safety buffer ($0\%\text{--}10\%$, default $3\%\text{--}5\%$) to absorb minor late arrivals or unexpected visitors without requiring order modifications.

### Alternatives Considered
| Alternative | Why Rejected |
|:---|:---|
| **Soft Cutoff with Warning** | Teachers frequently ignored soft warnings, leading to ongoing catering order mismatches. |
| **Zero Buffer Margin (Exact Attendance Only)** | Inevitable morning bus delays or traffic incidents left arriving children without hot meal portions. |

### Consequences
- **Positive:** Protects catering vendor delivery deadlines; guarantees 100% auditable purchase order quantities; absorbs minor student count fluctuations.
- **Negative:** Requires Semi-Boarding Coordinator to review and approve the safety buffer margin daily prior to dispatch.
- **Risks created (→ Section 11):** `RISK-02` (Excessive buffer margin inflating monthly catering costs).

---

## ADR-003: Lightweight Vanilla Frontend Stack across 4 Role Portals

**Status:** Accepted  
**Date:** 2026-09-17  

### Context
Client endpoints in the school ecosystem range from teacher smartphones and aged tablets to administrative desktop displays and parents' consumer phones. Heavy SPA frameworks (React, Angular, Next.js) produce large JavaScript bundles that suffer from slow hydration and require periodic npm dependency maintenance.

### Decision
We build the entire client presentation layer using **Semantic HTML5, ES6 Modules, and native CSS Custom Properties (Design Tokens)** with zero runtime UI framework dependencies, structured into 4 autonomous role portals (`/coordinator`, `/accountant`, `/parent`, `/admin`).

### Alternatives Considered
| Alternative | Why Rejected |
|:---|:---|
| **React + Vite** | Adds framework runtime bundle overhead; higher memory usage on low-cost Android devices. |
| **Next.js (SSR)** | Unnecessary server rendering overhead for authenticated school intranet portal screens. |

### Consequences
- **Positive:** Instant cold starts (< 500ms); zero build complexity or npm package rot; minimal client memory usage.
- **Negative:** Developers must write clean native DOM manipulation code and manage state without framework abstractions.
- **Risks created (→ Section 11):** None.

---

## ADR-004: Dynamic VietQR Generation & Webhook Reconciliation for Fee Collection

**Status:** Accepted  
**Date:** 2026-09-17  

### Context
School accountants traditionally spend dozens of hours manually checking bank transaction statements against student rosters, leading to delays and errors in tracking paid, unpaid, or partially paid student meal fees.

### Decision
We integrate with the National Payment Network (VietQR / Napas). For every monthly student meal invoice generated by the system, a dynamic VietQR payload is rendered containing the invoice reference and exact amount. When the parent transfers funds, an incoming webhook from the payment gateway automatically transitions the invoice status from `unpaid` to `paid`.

### Alternatives Considered
| Alternative | Why Rejected |
|:---|:---|
| **Manual Cash Collection at School Gate** | High operational burden, security risks, and slow accounting reconciliation. |
| **Static School Bank Account QR Code** | Parents frequently omit the student identifier in the transfer description, causing manual matching bottlenecks. |

### Consequences
- **Positive:** Fully automated, sub-second fee reconciliation; zero manual transfer description parsing; streamlined 3-state tracking (`unpaid`, `partial`, `paid`).
- **Negative:** Requires external banking webhook integration and HTTPS connectivity.
- **Risks created (→ Section 11):** None.
