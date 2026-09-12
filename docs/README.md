# Top-Down Engineering Documentation Hub

Welcome to the comprehensive engineering documentation repository for the **Primary School Semi-Boarding Meal Management System**. 

This system is engineered using a **strict Top-Down Decomposition Methodology**, ensuring that every database table, API endpoint, UI screen, and user action is rigorously derived from institutional strategic goals and operational requirements.

---

## Methodology Overview

The engineering lifecycle cascades through six discrete, verifiable phases. Each phase takes the approved outputs of its predecessor as immutable constraints and generates formal specifications for the phase that follows:

```
[Phase 01: Top-Down Mind Map]
       ↓ System decomposition, strategic vision, core vs. supporting domains
[Phase 02: Core Feature Breakdown]
       ↓ Scope isolation to the 3 active MVP operational modules
[Phase 03: Roles & Use Cases]
       ↓ Actor definition, responsibilities, permissions & UML use case specs
[Phase 04: Information Architecture]
       ↓ Screen inventory, sitemap, hierarchy & user task flows
[Phase 05: UI/UX Wireframes & Design System]
       ↓ Design tokens, layout principles, and high-fidelity screen mockups
[Phase 06: Relational Database Architecture]
       ↓ 3NF relational ERD, DBML schema, and data dictionary
```

---

## Phase Directory Guide

| Phase | Directory | Focus & Key Deliverables | Artifacts | Status |
|:---:|---|---|---|:---:|
| **01** | [**01-top-down/**](01-top-down/README.md) | **System Scope & Business Domains**<br>Institutional vision, problem space decomposition, core vs. supporting classification. | • Mind Map (`.png`)<br>• `business-domains.md`<br>• `core-supporting-classification.md` | ✅ Complete |
| **02** | [**02-core-features/**](02-core-features/README.md) | **Core Feature Breakdown**<br>Detailed specification of the 3 active MVP modules: Participation, Demand, and Preparation. | • `core-feature-breakdown.md`<br>• Capability matrices | ✅ Complete |
| **03** | [**03-roles-usecases/**](03-roles-usecases/README.md) | **Actors & Use Cases**<br>Role profiles, responsibility boundaries, role-feature mappings, and formal UML use cases. | • `roles.md`<br>• `role-feature-mapping.md`<br>• `usecase-*.md` | ✅ Complete |
| **04** | [**04-information-architecture/**](04-information-architecture/README.md) | **Information Architecture**<br>Screen inventory (SCR-*), sitemap hierarchy, and end-to-end operational task flows. | • `screen-inventory.md`<br>• `sitemap.md`<br>• `task-flows.md` | ✅ Complete |
| **05** | [**05-ui-ux/**](05-ui-ux/README.md) | **UI/UX & Design Tokens**<br>Design system specifications, color palettes, responsive typography, and screen layouts. | • `design-system.md`<br>• Wireframes & Mockups | 🔄 In Progress |
| **06** | [**06-database/**](06-database/README.md) | **Database Architecture**<br>Third normal form (3NF) relational schema, DBML data model, entity dictionary, and DDL scripts. | • ERD Diagram (`.png`)<br>• `schema.dbml`<br>• `data-dictionary.md`<br>• `.sql` scripts | ✅ Complete |

---

## End-to-End Traceability Chain

The hallmark of this repository is complete, bidirectional traceability. No engineering element exists in isolation. 

Refer to [**traceability.md**](traceability.md) for the exhaustive mapping across all architectural tiers:

$$\text{Core Business Domain} \longrightarrow \text{Core Capability} \longrightarrow \text{Feature ID} \longrightarrow \text{Actor Role} \longrightarrow \text{Use Case ID} \longrightarrow \text{Task Flow} \longrightarrow \text{Screen ID} \longrightarrow \text{DB Entity}$$

### Sample Traceability Slice

```
Domain: Meal Operations
  └── Capability: Demand Forecasting
        └── Feature: F-DMD-01 (Daily Demand Aggregation)
              └── Actor: MGR (Meal & Nutrition Manager)
                    └── Use Case: UC-MGR-01 (Determine Daily Meal Demand)
                          └── Task Flow: TF-MGR-01 (Morning Demand Calculation)
                                └── Screen: SCR-MGR-01 (Demand Determination Dashboard)
                                      └── DB Entities: meal_demands, meal_schedules, meal_participations
```

---

## Core Operational Modules (MVP Scope)

While the full institutional mind map encompasses long-term supporting services (billing, supplier procurement, parent mobile portals), the engineering focus of this phase is concentrated on the **Three Core Operational Value Chains**:

1. **Module 1: Meal Participation Management (`F-PAR`)**
   - Frontline classroom attendance and meal headcount recording by Homeroom Teachers.
   - Medical allergy flagging and time-stamped status change logging.
   - Strict daily cutoff deadline locking.

2. **Module 2: Meal Demand & Quantity Management (`F-DMD`)**
   - Automated aggregation of classroom submissions into session-level demand.
   - Scaled portion calculations applying standard recipes and safety buffers (`Buffer %`).
   - Triage and approval workflow for emergency post-cutoff headcount amendments.

3. **Module 3: Meal Preparation Execution (`F-PRP`)**
   - Digital shift planning and assignment to industrial kitchen stations.
   - Pantry ingredient issuance and receiving checklists.
   - Real-time batch cooking timer monitoring and physical yield reconciliation against target quantities.
