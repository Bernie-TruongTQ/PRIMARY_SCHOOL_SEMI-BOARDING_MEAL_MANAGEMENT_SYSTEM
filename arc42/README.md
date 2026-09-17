# arc42 Architecture Documentation — Primary School Semi-Boarding Meal Management System

> Standardized software architecture documentation based on the [arc42](https://arc42.org) template (by Dr. Gernot Starke and Dr. Peter Hruschka) for the **Primary School Semi-Boarding Meal Management System**.

---

## 1. Documentation Index & Section Status

This architecture documentation is tailored to the **ESSENTIAL** detail level, balancing production-grade engineering rigor with operational maintainability under the **External Catering Vendor Operating Model** and **Dedicated Lunch-Only Scope**:

| Section | Title | Primary Focus | Status |
|:---:|:---|:---|:---:|
| **01** | [Introduction and Goals](01-introduction-and-goals.md) | System purpose, 8 business domains, catering operating model, Q42 quality goals, and 4-role stakeholder sign-offs | ✅ Complete |
| **02** | [Architecture Constraints](02-architecture-constraints.md) | Technical, operational, regulatory (Decision 1246/QĐ-BYT), and golden operational timelines (08:30, 08:45, 10:30, 11:00, 13:00) | ✅ Complete |
| **03** | [Context and Scope](03-context-and-scope.md) | Business and technical context, external integrations (SIS, Caterer Gateway, VietQR, Parent Notification Gateway) | ✅ Complete |
| **04** | [Solution Strategy](04-solution-strategy.md) | Modular Monolith architecture, 4 autonomous role portals in Vanilla SPA, and real-time WebSocket communication | ✅ Complete |
| **05** | [Building Block View](05-building-block-view.md) | Static structure: Level-1 Containers, Level-2 Domain Components (M1: Participation, M2: Demand & Orders, M3: Receiving & Reconcile) | ✅ Complete |
| **06** | [Runtime View](06-runtime-view.md) | Dynamic scenarios: 08:30 AM Cutoff Lock, 08:45 AM Order Dispatch, 10:30 AM Receiving Inspection, 13:00 PM 3-Way Reconciliation | ✅ Complete |
| **07** | [Deployment View](07-deployment-view.md) | Docker Compose infrastructure, Nginx reverse proxy, PostgreSQL 15, S3 compliance storage, and client portal profiles | ✅ Complete |
| **08** | [Crosscutting Concepts](08-crosscutting-concepts.md) | Unified Domain Model, Fixed 4-Role RBAC, Decision 1246/QĐ-BYT food safety ($\ge 65^\circ\text{C}$), allergy safeguards, and audit ledgers | ✅ Complete |
| **09** | [Architecture Decisions](09-architecture-decisions.md) | ADRs for Modular Monolith (ADR-001), 08:30 Cutoff & Buffer Engine (ADR-002), 4-Portal Vanilla SPA (ADR-003), VietQR (ADR-004) | ✅ Complete |
| **10** | [Quality Requirements](10-quality-requirements.md) | Detailed quality tree and evaluation scenarios mapped to Section 1.2 quality goals (`#reliable`, `#efficient`, `#safe`, `#usable`) | ✅ Complete |
| **11** | [Risks and Technical Debt](11-risks-and-technical-debt.md) | Operational risk register (Wi-Fi, buffer cost, delivery delay, temperature deficit) and technical debt remediation backlog | ✅ Complete |
| **12** | [Glossary](12-glossary.md) | Domain and architectural terminology (cutoffs, buffer margins, 3-step inspection, 3-way reconciliation, VietQR) | ✅ Complete |

---

## 2. Architecture Methodology & Upstream Links

This documentation forms the formal architecture synthesis of the repository's top-down engineering artifacts:

```
Business Requirements (docs/01-top-down, docs/02-core-features)
       ↓
Roles & System Use Cases (docs/03-roles-usecases)
       ↓
Information Architecture & Screen Hierarchy (docs/04-information-architecture)
       ↓
Software Architecture Models (c4/c4-context.md, c4-containers.md, c4-components-*.md)
       ↓
arc42 Architecture Documentation Suite (arc42/*.md)
       ↓
Relational DDL & Working Prototype (docs/06-database, frontend/)
```

### Key Repository References:
- **C4 Architecture Models:** [c4/README.md](../c4/README.md)
- **Top-Down Requirements Documentation:** [docs/README.md](../docs/README.md)
- **Information Architecture:** [docs/04-information-architecture/INFORMATION_ARCHITECTURE.md](../docs/04-information-architecture/INFORMATION_ARCHITECTURE.md)
- **Traceability Matrix:** [docs/traceability.md](../docs/traceability.md)
- **Relational Data Dictionary:** [docs/06-database/data-dictionary.md](../docs/06-database/data-dictionary.md)

---

## 3. Conventions & Standards

- **Detail Level:** `ESSENTIAL` (focused on production system viability, clear boundaries, and measurable quality scenarios).
- **Operating Model:** External Catering Vendor Model with Dedicated Lunch-Only Scope (Mon–Fri).
- **Access Control:** Fixed 4-Role RBAC Model (`MGR`, `ACC`, `PAR`, `ADM`).
- **Quality Model:** arc42 **Q42 Quality Properties** (`#reliable`, `#efficient`, `#safe`, `#usable`).
- **Diagrams:** C4 Context, Containers, and Components rendered via native Mermaid code blocks for immediate in-browser visualization.
