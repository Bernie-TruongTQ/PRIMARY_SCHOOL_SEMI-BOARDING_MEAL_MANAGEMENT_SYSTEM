# C4 Architecture Documentation — Primary School Semi-Boarding Meal Management System

This directory documents the software architecture of the **Primary School Semi-Boarding Meal Management System** using the complete 4-level **C4 Model** (Context, Containers, Components, Code) following standard architectural practices.

---

## 1. Documentation Index

The C4 documentation is organized into modular files tailored for specific stakeholder audiences (Executive Leadership, Nutrition Managers, Software Engineers, and Backend Developers):

| Level | Document | Target Audience | Primary Focus | Status |
|:---|:---|:---|:---|:---:|
| **Index** | [README.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/README.md) | All Stakeholders | Navigation map, methodology mapping, and C4 conventions | ✅ Complete |
| **Level 1** | [c4-context.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-context.md) | Everyone | System boundary, human actors (`TCH`, `MGR`, `KIT`, `ADM`), and external systems | ✅ Complete |
| **Level 2** | [c4-containers.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-containers.md) | Technical Architects, Engineers | Independently deployable units (SPA Portal, Backend API, PostgreSQL DB, WebSocket) | ✅ Complete |
| **Level 3** | [c4-components-participation.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-participation.md) | Developers (Module 1) | Internal components for Student Meal Participation & Attendance Management | ✅ Complete |
| **Level 3** | [c4-components-demand.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-demand.md) | Developers (Module 2) | Internal components for Meal Demand Aggregation & Dish Quantity Calculation | ✅ Complete |
| **Level 3** | [c4-components-preparation.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-preparation.md) | Developers (Module 3) | Internal components for Kitchen Cooking Execution, Batching & Yield Reconciliation | ✅ Complete |
| **Level 4** | [c4-code-participation.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-code-participation.md) | Developers (Module 1) | UML Class Diagram & Interfaces: `ParticipationController`, `CutoffPolicyGuard`, `MealParticipation` | ✅ Complete |
| **Level 4** | [c4-code-demand.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-code-demand.md) | Developers (Module 2) | UML Class Diagram & Interfaces: `DemandController`, `PortionCalculationEngine`, `MealDemand` | ✅ Complete |
| **Level 4** | [c4-code-preparation.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-code-preparation.md) | Developers (Module 3) | UML Class Diagram & Interfaces: `PreparationController`, `YieldReconciliationEngine`, `MealPrep` | ✅ Complete |

---

## 2. Top-Down Methodology to C4 Mapping

This repository enforces a strict **Top-Down Decomposition Methodology**. Every C4 architectural artifact is directly anchored to its upstream business requirement and downstream database entity:

```
Phase 01: Top-Down Mind Map & Domain Classification
   └─► C4 Level 1: System Context (System Boundary, Actors, External Systems)

Phase 02 & 03: Core Features, Actor Roles & Use Cases
   └─► C4 Level 2: Containers & Role Portals (Web SPA, Backend API, Database)

Phase 04 & 05: Information Architecture & UI/UX Portals
   └─► C4 Level 3: Components (UI Controllers, Business Domain Services, Guard Rules)

Phase 06: Relational Database Architecture (DDL & ERD) & Implementation
   └─► C4 Level 4: Code Diagrams (Entities, Interfaces, Repositories, Domain Services)
```

---

## 3. Core Operational Modules Overview (MVP Scope)

1. **Module 1 — Meal Participation Management:**
   - **Operational Objective:** Eliminate manual paper roster discrepancies and ensure accurate daily meal registration.
   - **Primary Actors:** Homeroom Teacher (`TCH`), Class Supervisor.
   - **Core Features:** Record daily student meal participation (`F-PAR-01`), track amendments with mandatory audit trails (`F-PAR-02`), and verify & lock the class roster before the morning cutoff (`F-PAR-03`).
   - **Key Entities & Classes:** `MealParticipation`, `MealParticipationChange`, `ParticipationService`, `CutoffPolicyGuard`, `IParticipationRepository`.

2. **Module 2 — Meal Demand & Quantity Management:**
   - **Operational Objective:** Dynamically scale confirmed student headcounts into exact dish recipe weights with configurable safety buffer margins.
   - **Primary Actors:** Meal / Nutrition Manager (`MGR`).
   - **Core Features:** Determine aggregated demand headcount (`F-DMD-01`), compute expected dish cooking quantities (`F-DMD-02`), and process post-lock emergency change requests (`F-DMD-03`).
   - **Key Entities & Classes:** `MealDemand`, `MealDemandDishQuantity`, `MealDemandChange`, `PortionCalculationEngine`, `BufferPolicyManager`.

3. **Module 3 — Meal Preparation:**
   - **Operational Objective:** Convert approved dish targets into kitchen station shift plans, monitor batch cooking, and reconcile yields.
   - **Primary Actors:** Kitchen Staff / Head Chef (`KIT`), Meal Manager (`MGR`).
   - **Core Features:** Create & schedule kitchen preparation plans (`F-PRP-01`), allocate pantry ingredients (`F-PRP-02`), record cooking batch executions and temperatures (`F-PRP-03`), and verify prepared yields with mandatory discrepancy logging (`F-PRP-04`).
   - **Key Entities & Classes:** `MealPreparationPlan`, `IngredientAllocation`, `MealPreparation`, `PreparedQuantityConfirmation`, `YieldReconciliationEngine`.

---

## 4. Modeling Conventions & Quality Standards

All diagrams in this directory adhere to official **C4 and UML standards**:
- **Levels 1 to 3:** System Context, Containers, and Components modeled using Mermaid C4 syntax and high-fidelity rendered visual artifacts.
- **Level 4 (Code):** UML Class Diagrams modeled using Mermaid `classDiagram` with TypeScript / DDD typing conventions (`UUID`, `Date`, strong types, clear interfaces, and explicit method signatures).
