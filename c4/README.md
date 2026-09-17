# C4 Architecture Documentation — Primary School Semi-Boarding Meal Management System

This directory documents the comprehensive software architecture of the **Primary School Semi-Boarding Meal Management System** using the **C4 Model** (Context, Containers, Components) across all **8 Business Domains** defined in the top-down decomposition.

---

## 1. Complete Documentation Index

| Level | Document | Domain & Module Focus | Primary Operational Scope | Diagram / Image Asset | Status |
|:---|:---|:---|:---|:---|:---:|
| **Index** | [README.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/README.md) | All Domains | Navigation map, domain-to-module mapping, and C4 conventions | — | ✅ Complete |
| **Level 1** | [c4-context.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-context.md) | System Context | System boundary, 4 fixed human actors (`MGR`, `ACC`, `PAR`, `ADM`), and 4 external system gateways | `images/SystemContext.png` | ✅ Complete |
| **Level 2** | [c4-containers.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-containers.md) | System Containers | 5 independently deployable units: Web SPA (4 role portals), Backend API, WebSocket Broker, PostgreSQL DB, S3 Storage | `images/ContainerView.png` | ✅ Complete |
| **Level 3** | [c4-components-participation.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-participation.md) | **Domain 1**: Student Meal Management<br>*(Module 1: Participation & Attendance)* | Eligibility, term registration, roll calls, 08:30 AM cutoff guard, and audit change logs (`F-PAR`) | `images/Module1Components.png` | ✅ Complete |
| **Level 3** | [c4-components-planning.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-planning.md) | **Domain 2**: Meal Planning & Menu Management | Standard dish catalog, weekly menu composer, 1-level menu approval, calendar binding (`F-PLN`) | `images/Domain2Components.png` | ✅ Complete |
| **Level 3** | [c4-components-demand.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-demand.md) | **Domain 3A**: Meal Operation — Demand & Order<br>*(Module 2: Demand & Order Dispatch)* | Attendance aggregation, safety buffer engine ($0\%\text{--}10\%$), dish math, 08:45 AM caterer order dispatch (`F-OPS-01/02`) | `images/Module2Components.png` | ✅ Complete |
| **Level 3** | [c4-components-preparation.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-preparation.md) | **Domain 3B**: Meal Operation — Execution<br>*(Module 3: Receiving, Distribution & Reconciliation)* | 10:30 AM 3-step inspection ($\ge 65^\circ\text{C}$), 11:00 AM trolley distribution, 13:00 PM 3-way reconciliation & payables (`F-OPS-03/04/05`) | `images/Module3Components.png` | ✅ Complete |
| **Level 3** | [c4-components-fee-cost.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-fee-cost.md) | **Domain 4**: Meal Fee & Cost Management | Fee rate setup, monthly billing batch, excused absence credits, 3-state payments (VietQR), caterer cost accruals (`F-FEE`) | `images/Module4Components.png` | ✅ Complete |
| **Level 3** | [c4-components-reporting.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-reporting.md) | **Domain 5**: Reporting & Transparency | Daily operational summaries, vendor reconciliation reports, financial/debt aging reports, parent transparency portal (`F-REP`) | `images/Module5Components.png` | ✅ Complete |
| **Level 3** | [c4-components-users-rbac.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-users-rbac.md) | **Domain 6**: User & Access Management | User profile management, authentication service, fixed 4-role RBAC enforcement (`ADM`, `ACC`, `MGR`, `PAR`) (`F-USR`) | `images/Module6Components.png` | ✅ Complete |
| **Level 3** | [c4-components-nutrition.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-nutrition.md) | **Domain 7**: Nutrition & Health Management | Medical allergy declarations, restricted ingredient scanning, non-blocking visual conflict alerts (`F-NUT`) | `images/Module7Components.png` | ✅ Complete |
| **Level 3** | [c4-components-master-data.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-master-data.md) | **Domain 8**: Master Data & System Configuration | School years, semesters, grades, classes, student directory, lunch serving days, and holiday calendar (`F-MST`) | `images/Module8Components.png` | ✅ Complete |

---

## 2. Business Domain to C4 Component Architecture Mapping

The architecture maps directly to the **8 Business Domains** defined in [Phase 01 — Top-Down Decomposition](file:///d:/WORKSPACE/Top-Down-Approach/docs/01-top-down) and [Phase 02 — Core Features Breakdown](file:///d:/WORKSPACE/Top-Down-Approach/docs/02-core-features):

```
├── Domain 1: Student Meal Management               ──► c4-components-participation.md (Module 1)
├── Domain 2: Meal Planning & Menu Management       ──► c4-components-planning.md
├── Domain 3: Meal Operation                        ──┬► c4-components-demand.md (Domain 3A / Module 2)
│                                                     └──► c4-components-preparation.md (Domain 3B / Module 3)
├── Domain 4: Meal Fee & Cost Management            ──► c4-components-fee-cost.md
├── Domain 5: Reporting & Transparency              ──► c4-components-reporting.md
├── Domain 6: User & Access Management              ──► c4-components-users-rbac.md
├── Domain 7: Nutrition & Health Management         ──► c4-components-nutrition.md
└── Domain 8: Master Data & System Configuration    ──► c4-components-master-data.md
```

---

## 3. Operational Standards & Modeling Conventions

- **Dedicated Lunch-Only Scope**: Standard school days (Mon–Fri). Breakfast, afternoon snacks, and dinner are out of scope.
- **External Catering Operating Model**: Hot meal deliveries, 3-step quality inspection ($\ge 65^\circ\text{C}$), classroom trolley distribution, and 3-way quantity reconciliation.
- **Fixed 4-Role RBAC**: `ADM` (Admin), `ACC` (Accountant), `MGR` (Coordinator), `PAR` (Parent).
- **Mermaid C4 Standard**: Modeled using native `C4Context`, `C4Container`, and `C4Component` blocks.
- **Language**: Standardized in technical English across all documents.
