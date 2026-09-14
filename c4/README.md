# C4 Architecture Documentation — Primary School Semi-Boarding Meal Management System

This directory documents the software architecture of the **Primary School Semi-Boarding Meal Management System** using the **C4 Model** (Context, Containers, Components, Code) supplemented by **Dynamic** (operational flow) and **Deployment** diagrams in standard Mermaid C4 syntax.

---

## 1. Documentation Index

The C4 documentation is organized into modular files tailored for specific stakeholder audiences (Executive Leadership, Nutrition Managers, Software Engineers, and DevOps / Infrastructure Teams):

| Level | Document | Target Audience | Primary Focus | Status |
|:---|:---|:---|:---|:---:|
| **Index** | [README.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/README.md) | All Stakeholders | Navigation map, methodology mapping, and C4 conventions | ✅ Complete |
| **Level 1** | [c4-context.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-context.md) | Everyone | System boundary, human actors (`TCH`, `MGR`, `KIT`, `ADM`), and external systems | ✅ Complete |
| **Level 2** | [c4-containers.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-containers.md) | Technical Architects, Engineers | Independently deployable units (SPA Portal, Backend API, PostgreSQL DB, WebSocket) | ✅ Complete |
| **Level 3** | [c4-components-participation.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-participation.md) | Developers (Module 1) | Internal components for Student Meal Participation & Attendance Management | ✅ Complete |
| **Level 3** | [c4-components-demand.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-demand.md) | Developers (Module 2) | Internal components for Meal Demand Aggregation & Dish Quantity Calculation | ✅ Complete |
| **Level 3** | [c4-components-preparation.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-preparation.md) | Developers (Module 3) | Internal components for Kitchen Cooking Execution, Batching & Yield Reconciliation | ✅ Complete |
| **Dynamic** | [c4-dynamic-operational-flow.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-dynamic-operational-flow.md) | Product Managers, Engineers | Chronological sequence flow during the active morning operational shift (07:30 - 11:30) | ✅ Complete |
| **Level 4** | [c4-deployment.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-deployment.md) | DevOps & Infrastructure | Physical/cloud topology, ingress routing, containerization, and client devices | ✅ Complete |

---

## 2. Top-Down Methodology to C4 Mapping

This repository enforces a strict **Top-Down Decomposition Methodology**. Every C4 architectural artifact is directly anchored to its upstream business requirement and downstream database entity:

```
Phase 01: Top-Down Mind Map & Domain Classification
   └─► C4 Level 1: System Context (System Boundary, Actors, External Systems)

Phase 02 & 03: Core Features, Actor Roles & Use Cases
   └─► C4 Level 2 & Dynamic: Containers, Role Portals, and Operational Workflows

Phase 04 & 05: Information Architecture & UI/UX Portals
   └─► C4 Level 3: Components (UI Controllers, Business Domain Services, Guard Rules)

Phase 06: Relational Database Architecture (DDL & ERD)
   └─► C4 Level 2 & 3: ContainerDb & Persistence Repositories
```

---

## 3. Core Operational Modules Overview (MVP Scope)

1. **Module 1 — Meal Participation Management:**
   - **Operational Objective:** Eliminate manual paper roster discrepancies and ensure accurate daily meal registration.
   - **Primary Actors:** Homeroom Teacher (`TCH`), Class Supervisor.
   - **Core Features:** Record daily student meal participation (`F-PAR-01`), track amendments with mandatory audit trails (`F-PAR-02`), and verify & lock the class roster before the morning cutoff (`F-PAR-03`).
   - **Key Entities:** `meal_participations`, `meal_participation_changes`, `students`, `meal_schedules`.

2. **Module 2 — Meal Demand & Quantity Management:**
   - **Operational Objective:** Dynamically scale confirmed student headcounts into exact dish recipe weights with configurable safety buffer margins.
   - **Primary Actors:** Meal / Nutrition Manager (`MGR`).
   - **Core Features:** Determine aggregated demand headcount (`F-DMD-01`), compute expected dish cooking quantities (`F-DMD-02`), and process post-lock emergency change requests (`F-DMD-03`).
   - **Key Entities:** `meal_demands`, `meal_demand_dish_quantities`, `meal_demand_changes`, `dishes`.

3. **Module 3 — Meal Preparation:**
   - **Operational Objective:** Convert approved dish targets into kitchen station shift plans, monitor batch cooking, and reconcile yields.
   - **Primary Actors:** Kitchen Staff / Head Chef (`KIT`), Meal Manager (`MGR`).
   - **Core Features:** Create & schedule kitchen preparation plans (`F-PRP-01`), allocate pantry ingredients (`F-PRP-02`), record cooking batch executions and temperatures (`F-PRP-03`), and verify prepared yields with mandatory discrepancy logging (`F-PRP-04`).
   - **Key Entities:** `meal_preparation_plans`, `meal_preparation_plan_dishes`, `ingredient_allocations`, `meal_preparations`, `meal_preparation_dish_records`, `prepared_quantity_confirmations`.

---

## 4. Modeling Conventions & Quality Standards

All diagrams in this directory strictly adhere to official **Mermaid C4 syntax**:
- **Explicit Parameters:** Every element specifies Alias, Label, Technology (where applicable), and Description.
- **Unidirectional Relationships:** Arrows are unidirectional (`Rel`), labeled with specific action verbs and protocols (`HTTPS`, `JSON`, `WSS`, `SQL`).
- **Cognitive Load:** Diagram complexity is capped at $\le 15$ elements per view to maintain high clarity and scannability.
- **Zero Placeholders:** Populated with authentic educational domain data and concrete implementation technologies (HTML5, ES6 Vanilla JS, Node.js/Express, PostgreSQL 15).
