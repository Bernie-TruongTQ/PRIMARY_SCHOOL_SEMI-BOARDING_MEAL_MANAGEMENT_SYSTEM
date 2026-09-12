# Traceability Chain

This document proves that **every artifact in this repository was derived top-down from the layer above it**. Nothing was built ad-hoc. Every database table has a screen. Every screen has a task flow. Every task flow has a use case. Every use case has an actor and core feature. Every core feature derives from an active operational module.

---

## How to Read This

Each row traces one complete path from the business module down to the database entity:

$$\text{Core Module} \longrightarrow \text{Capability} \longrightarrow \text{Core Feature} \longrightarrow \text{Actor} \longrightarrow \text{Use Case} \longrightarrow \text{Task Flow} \longrightarrow \text{Screen ID} \longrightarrow \text{DB Entity}$$

---

## Full Traceability Matrix

| Active Core Module | Capability | Feature ID | Actor | Use Case | Task Flow | Screen ID | Primary DB Entity |
|---|---|---|:---:|---|:---:|---|---|
| **Module 1: Meal Participation** | Daily Attendance | **F-PAR-01** | TCH | UC-TCH-01 Record Daily Student Participation | TF-01 | SCR-TCH-01 Class Roster Participation | `meal_participations` |
| **Module 1: Meal Participation** | Status Changes | **F-PAR-02** | TCH | UC-TCH-02 Amend Participation with Reason | TF-01 | SCR-TCH-02 Participation Amendment Modal | `meal_participation_changes` |
| **Module 1: Meal Participation** | Roster Lock | **F-PAR-03** | TCH | UC-TCH-03 Confirm Daily Class Roster | TF-01 | SCR-TCH-03 Class Roster Confirmation | `meal_participations` (status: `confirmed`) |
| **Module 2: Demand & Quantity** | Demand Determination | **F-DMD-01** | MGR | UC-MGR-01 Aggregate & Determine Meal Demand | TF-02 | SCR-MGR-01 Demand Determination Board | `meal_demands` |
| **Module 2: Demand & Quantity** | Dish Quantities | **F-DMD-02** | MGR | UC-MGR-02 Calculate & Adjust Dish Quantities | TF-02 | SCR-MGR-02 Dish Quantity Calculation View | `meal_demand_dish_quantities` |
| **Module 2: Demand & Quantity** | Post-Lock Change | **F-DMD-03** | TCH | UC-TCH-04 Submit Post-Cutoff Emergency Request | TF-03 | SCR-TCH-04 Post-Cutoff Emergency Form | `meal_demand_changes` |
| **Module 2: Demand & Quantity** | Change Triage | **F-DMD-03** | MGR | UC-MGR-03 Review & Approve Demand Changes | TF-03 | SCR-MGR-03 Demand Changes Review Queue | `meal_demand_changes`, `meal_demands` |
| **Module 3: Meal Preparation** | Shift Planning | **F-PRP-01** | MGR | UC-MGR-04 Create Kitchen Preparation Plan | TF-04 | SCR-MGR-04 Kitchen Preparation Planning | `meal_preparation_plans`, `meal_preparation_plan_dishes` |
| **Module 3: Meal Preparation** | Shift Board | **F-PRP-01** | KIT | UC-KIT-01 View Active Kitchen Prep Plan | TF-04 | SCR-KIT-01 Kitchen Prep Shift Board | `meal_preparation_plans` |
| **Module 3: Meal Preparation** | Ingredient Staging | **F-PRP-02** | KIT | UC-KIT-02 Receive & Adjust Ingredient Allocation | TF-04 | SCR-KIT-02 Ingredient Allocation Checklist | `ingredient_allocations` |
| **Module 3: Meal Preparation** | Cooking Batches | **F-PRP-03** | KIT | UC-KIT-03 Record Cooking Batch Execution | TF-05 | SCR-KIT-03 Cooking Batch Execution | `meal_preparations`, `meal_preparation_dish_records` |
| **Module 3: Meal Preparation** | Yield Verification | **F-PRP-04** | KIT | UC-KIT-04 Confirm Prepared Quantity & Discrepancy | TF-05 | SCR-KIT-04 Prepared Quantity Verification | `prepared_quantity_confirmations` |
| **Module 3: Meal Preparation** | Daily Sign-off | **F-PRP-04** | MGR | UC-MGR-05 Review Discrepancy & Sign-off | TF-05 | SCR-MGR-05 Daily Prep Summary & Audit | `prepared_quantity_confirmations` |
| **Master Reference Data** | Student Directory | Master | ADM | UC-ADM-01 Manage Student Records & Eligibility | — | SCR-ADM-01 Student & Class Directory | `students`, `meal_registrations` |
| **Master Reference Data** | Session Schedules | Master | ADM | UC-ADM-02 Configure Meal Schedules | — | SCR-ADM-02 Meal Calendar & Schedule Setup | `meal_schedules` |
| **Master Reference Data** | Recipe Master | Master | ADM | UC-ADM-03 Maintain Dish & Ingredient Catalog | — | SCR-ADM-03 Dish & Ingredient Catalog | `dishes`, `ingredients` |
| **Master Reference Data** | Identity & Access | Master | ADM | UC-ADM-04 Manage System Users & Roles | — | SCR-ADM-04 User Account & Permissions | `users` |

---

## Detailed Trace Examples

### Example 1 — Meal Participation & Attendance Audit Trail (Complete Chain)

```
Core Module:       Module 1: Meal Participation Management
                         ↓
Capability:        Daily Attendance & Amendment
                         ↓
Core Features:     F-PAR-01 (Record Attendance) & F-PAR-02 (Audit Changes)
                         ↓
Actor:             Homeroom Teacher (TCH)
                         ↓
Use Cases:         UC-TCH-01 Record Daily Student Meal Participation
                   UC-TCH-02 Amend Participation Status with Reason
                         ↓
Task Flow:         TF-01 — Student Meal Participation & Amendment Flow
                         ↓
Screens:           SCR-TCH-01 — Class Roster Meal Participation
                   SCR-TCH-02 — Participation Amendment Modal
                   (Implemented in prototype: ui/demand.html → Screen 1)
                         ↓
DB Entities:       meal_participations (attendance state)
                   meal_participation_changes (audit log)
                   → student_id → students
                   → meal_schedule_id → meal_schedules
```

---

### Example 2 — Meal Demand Aggregation & Dish Scaling (Complete Chain)

```
Core Module:       Module 2: Meal Demand & Quantity Management
                         ↓
Capability:        Demand Determination & Quantity Calculation
                         ↓
Core Features:     F-DMD-01 (Aggregated Demand) & F-DMD-02 (Dish Quantities)
                         ↓
Actor:             Meal / Nutrition Manager (MGR)
                         ↓
Use Cases:         UC-MGR-01 Aggregate & Determine Daily Meal Demand
                   UC-MGR-02 Calculate & Adjust Expected Dish Quantities
                         ↓
Task Flow:         TF-02 — Meal Demand Determination & Dish Quantity Calculation Flow
                         ↓
Screens:           SCR-MGR-01 — Demand Determination Dashboard
                   SCR-MGR-02 — Dish Quantity Calculation & Overrides
                   (Implemented in prototype: ui/demand.html → Screen 2)
                         ↓
DB Entities:       meal_demands (total headcount, method, buffer %, confirmed status)
                   meal_demand_dish_quantities (dish expected quantities)
                   → meal_schedule_id → meal_schedules
                   → dish_id → dishes
```

---

### Example 3 — Kitchen Preparation, Cooking Batches & Yield Reconciliation (Complete Chain)

```
Core Module:       Module 3: Meal Preparation
                         ↓
Capability:        Shift Planning, Cooking Batches & Quantity Confirmation
                         ↓
Core Features:     F-PRP-01 (Prep Plan), F-PRP-02 (Allocations), F-PRP-03 (Batches), F-PRP-04 (Verification)
                         ↓
Actors:            Meal / Nutrition Manager (MGR) & Kitchen Staff (KIT)
                         ↓
Use Cases:         UC-MGR-04 Create & Schedule Kitchen Meal Preparation Plan
                   UC-KIT-01 View Active Kitchen Preparation Plan
                   UC-KIT-02 Receive & Adjust Ingredient Allocation
                   UC-KIT-03 Record Cooking Batch Execution
                   UC-KIT-04 Confirm Prepared Quantity & Log Discrepancies
                   UC-MGR-05 Review Discrepancies & Sign Off Preparation Summary
                         ↓
Task Flows:        TF-04 — Kitchen Preparation Planning & Ingredient Allocation Flow
                   TF-05 — Cooking Batch Execution & Quantity Confirmation Flow
                         ↓
Screens:           SCR-MGR-04 — Kitchen Shift Preparation Planning
                   SCR-KIT-01 — Kitchen Prep Shift Dashboard (Kiosk)
                   SCR-KIT-02 — Ingredient Allocation Checklist
                   SCR-KIT-03 — Cooking Batch Execution & Yield Logging
                   SCR-KIT-04 — Prepared Quantity Verification Screen
                   SCR-MGR-05 — Daily Prep Summary & Discrepancy Sign-off
                         ↓
DB Entities:       meal_preparation_plans (shift schedule)
                   meal_preparation_plan_dishes (dish targets)
                   ingredient_allocations (storage reservations)
                   meal_preparations (cooking sessions)
                   meal_preparation_dish_records (finished yields)
                   prepared_quantity_confirmations (reconciliation & discrepancy audit)
```

---

## Database Table Coverage Verification

| Category | DB Table Name | Mapped Feature | Mapped Use Case | Mapped Screen | Status |
|---|---|---|---|---|:---:|
| **Module 1** | `meal_participations` | `F-PAR-01`, `F-PAR-03` | `UC-TCH-01`, `UC-TCH-03` | `SCR-TCH-01`, `SCR-TCH-03` | 100% Covered |
| **Module 1** | `meal_participation_changes` | `F-PAR-02` | `UC-TCH-02` | `SCR-TCH-02` | 100% Covered |
| **Module 2** | `meal_demands` | `F-DMD-01`, `F-DMD-03` | `UC-MGR-01`, `UC-MGR-03` | `SCR-MGR-01`, `SCR-MGR-03` | 100% Covered |
| **Module 2** | `meal_demand_dish_quantities`| `F-DMD-02` | `UC-MGR-02` | `SCR-MGR-02` | 100% Covered |
| **Module 2** | `meal_demand_changes` | `F-DMD-03` | `UC-MGR-03`, `UC-TCH-04` | `SCR-MGR-03`, `SCR-TCH-04` | 100% Covered |
| **Module 3** | `meal_preparation_plans` | `F-PRP-01` | `UC-MGR-04`, `UC-KIT-01` | `SCR-MGR-04`, `SCR-KIT-01` | 100% Covered |
| **Module 3** | `meal_preparation_plan_dishes`| `F-PRP-01` | `UC-MGR-04`, `UC-KIT-01` | `SCR-MGR-04`, `SCR-KIT-01` | 100% Covered |
| **Module 3** | `ingredient_allocations` | `F-PRP-02` | `UC-KIT-02` | `SCR-KIT-02` | 100% Covered |
| **Module 3** | `meal_preparations` | `F-PRP-03` | `UC-KIT-03` | `SCR-KIT-03` | 100% Covered |
| **Module 3** | `meal_preparation_dish_records`| `F-PRP-03` | `UC-KIT-03` | `SCR-KIT-03` | 100% Covered |
| **Module 3** | `prepared_quantity_confirmations`| `F-PRP-04`| `UC-KIT-04`, `UC-MGR-05` | `SCR-KIT-04`, `SCR-MGR-05` | 100% Covered |
| **Reference**| `students` | Master Data | `UC-ADM-01` | `SCR-ADM-01` | 100% Covered |
| **Reference**| `meal_registrations` | Master Data | `UC-ADM-01` | `SCR-ADM-01` | 100% Covered |
| **Reference**| `meal_schedules` | Master Data | `UC-ADM-02` | `SCR-ADM-02` | 100% Covered |
| **Reference**| `dishes` | Master Data | `UC-ADM-03` | `SCR-ADM-03` | 100% Covered |
| **Reference**| `ingredients` | Master Data | `UC-ADM-03` | `SCR-ADM-03` | 100% Covered |
| **Reference**| `users` | Master Data | `UC-ADM-04` | `SCR-ADM-04` | 100% Covered |

---

## Metric Summary

- **Total Operational Modules Covered:** 3 Active Core Modules + 1 Reference Master Domain
- **Total Core Features:** 10 Core Features (`F-PAR-01..03`, `F-DMD-01..03`, `F-PRP-01..04`)
- **Total Use Cases:** 16 Use Cases across 4 Roles
- **Total Task Flows:** 5 End-to-End Decision Flows
- **Total Screens:** 17 Standardized Screens
- **Total DBML Tables Traced:** 17 Tables (11 Operational + 6 Reference)
- **End-to-End Traceability Coverage:** **100.0%**
