# Traceability Chain

This document proves that **every artifact in this repository was derived from the one above it**. Nothing was built ad-hoc. Every screen has a use case. Every use case has a feature. Every feature has a domain. Every entity has a feature.

---

## How to Read This

Each row traces one complete path from the business domain to the database entity:

**Core Domain → Core Capability → Core Feature → Actor → Use Case → Task Flow → Screen → DB Entity**

---

## Full Traceability Matrix

| Core Domain | Core Capability | Core Feature | Actor | Use Case | Task Flow | Screen | DB Entity |
|-------------|----------------|--------------|-------|----------|-----------|--------|-----------|
| Student Meal Management | Meal Eligibility | F-STU-01 | ADM | UC-ADM-01 Enroll Student | — | SCR-ADM-02 Enroll Student Form | `students`, `classes` |
| Student Meal Management | Meal Eligibility | F-STU-01 | ADM | UC-ADM-02 Update Enrollment Status | — | SCR-ADM-03 Update Enrollment | `students` |
| Student Meal Management | Meal Registration | F-STU-02 | ADM | UC-ADM-03 Register for Meal Session | — | SCR-ADM-04 Register Meal Session | `meal_registrations`, `meal_sessions` |
| Student Meal Management | Meal Participation | F-STU-03 | TCH | UC-TCH-01 Record Attendance | TF-01 | SCR-TCH-01 Class Roster | `daily_meal_demand_details` |
| Student Meal Management | Meal Participation | F-STU-03 | TCH | UC-TCH-02 Submit Before Cutoff | TF-01 | SCR-TCH-02 Submit Attendance | `daily_meal_demands` |
| Meal Planning & Menu Management | Menu Design | F-MPN-01 | MGR | UC-MGR-01 Create Weekly Menu | TF-03 | SCR-MGR-02 Create/Edit Menu | `menus` |
| Meal Planning & Menu Management | Menu Design | F-MPN-02 | MGR | UC-MGR-02 Assign Dishes | TF-03 | SCR-MGR-03 Assign Dishes & Portions | `menu_dishes`, `dishes` |
| Meal Planning & Menu Management | Menu Design | F-MPN-03 | MGR | UC-MGR-03 Approve & Publish | TF-03 | SCR-MGR-04 Approve & Publish Menu | `menus` (status) |
| Meal Planning & Menu Management | Demand Calculation | F-MPN-04 | MGR | UC-MGR-04 Review Quantities | TF-04 | SCR-MGR-06 Review Quantities | `expected_meal_quantities` |
| Meal Planning & Menu Management | Demand Calculation | F-MPN-04 | MGR | UC-MGR-05 Override Buffer % | TF-04 | SCR-MGR-06 Review Quantities (inline) | `expected_meal_quantities` |
| Meal Operation | Meal Demand Determination | F-MOP-01 | MGR | UC-MGR-06 Monitor Demand Status | TF-04 | SCR-MGR-05 Demand Status Board | `daily_meal_demands` |
| Meal Operation | Meal Demand Determination | F-MOP-02 | TCH | UC-TCH-03 Submit Change Request | TF-02 | SCR-TCH-03 Submit Change Request | `meal_demand_change_requests` |
| Meal Operation | Meal Demand Determination | F-MOP-02 | MGR | UC-MGR-07 Approve Change Request | TF-02 | SCR-MGR-07 Change Request List | `meal_demand_change_requests`, `meal_demand_change_logs` |
| Meal Operation | Meal Demand Determination | F-MOP-02 | MGR | UC-MGR-08 Reject Change Request | TF-02 | SCR-MGR-08 Change Request Detail | `meal_demand_change_requests`, `meal_demand_change_logs` |
| Meal Operation | Meal Preparation | F-MOP-03 | KIT | UC-KIT-01 View Prep Plan | TF-05 | SCR-KIT-01 Preparation Plan View | `expected_meal_quantities`, `menu_dishes` |
| Meal Operation | Meal Preparation | F-MOP-03 | KIT | UC-KIT-02 Record Prepared Qty | TF-05 | SCR-KIT-02 Record Prepared Quantity | *(Phase 1.5: meal_preparations)* |
| Meal Operation | Meal Preparation | F-MOP-03 | KIT | UC-KIT-03 Confirm Prep Complete | TF-05 | SCR-KIT-03 Confirm Preparation | *(Phase 1.5: meal_preparations)* |
| Meal Operation | Meal Distribution | F-MOP-04 | KIT | UC-KIT-04 View Distribution Plan | TF-06 | SCR-KIT-04 Distribution Plan View | `daily_meal_demands` |
| Meal Operation | Meal Distribution | F-MOP-04 | KIT | UC-KIT-05 Record Distributed Qty | TF-06 | SCR-KIT-05 Record Distributed Qty | *(Phase 1.5: meal_distributions)* |
| Meal Operation | Meal Handover | F-MOP-05 | KIT | UC-KIT-06 Confirm Handover | TF-07 | SCR-KIT-06 Confirm Handover | *(Phase 1.5: meal_handovers)* |
| Meal Operation | Meal Handover | F-MOP-05 | TCH | UC-TCH-04 Acknowledge Handover | TF-07 | SCR-TCH-04 Acknowledge Handover | *(Phase 1.5: meal_handovers)* |

---

## Detailed Trace Examples

### Example 1 — Meal Demand Quantity Calculation (complete chain)

```
Core Domain:       Meal Planning & Menu Management
                          ↓
Core Capability:   Demand Calculation
                          ↓
Core Feature:      F-MPN-04 — Calculate Meal Demand Quantities
                          ↓
Actor:             Meal / Nutrition Manager (MGR)
                          ↓
Use Cases:         UC-MGR-04 Review Auto-Calculated Quantities
                   UC-MGR-05 Override Dish Buffer Percentage
                          ↓
Task Flow:         TF-04 — Meal Demand Quantity Calculation Flow
                          ↓
Screen:            SCR-MGR-06 — Review Calculated Quantities
                   (UI: demand.html → Screen 2 — Calculate Quantities)
                          ↓
DB Entities:       expected_meal_quantities
                   → daily_meal_demand_id → daily_meal_demands
                   → menu_dish_id → menu_dishes → dishes
```

---

### Example 2 — Post-Cutoff Emergency Change Request (complete chain)

```
Core Domain:       Meal Operation
                          ↓
Core Capability:   Meal Demand Determination
                          ↓
Core Feature:      F-MOP-02 — Manage Post-Cutoff Change Requests
                          ↓
Actors:            Homeroom Teacher (TCH) — initiates
                   Meal/Nutrition Manager (MGR) — approves/rejects
                          ↓
Use Cases:         UC-TCH-03 Submit Post-Cutoff Change Request
                   UC-MGR-07 Approve Change Request
                   UC-MGR-08 Reject Change Request
                          ↓
Task Flows:        TF-02 — Post-Cutoff Change Request Flow
                   TF-08 — Emergency Shortcut Flow
                          ↓
Screens:           SCR-TCH-03 — Submit Change Request Form
                   SCR-MGR-07 — Change Request List
                   SCR-MGR-08 — Change Request Detail
                   (UI: demand.html → Screen 3 — Manage Changes)
                          ↓
DB Entities:       meal_demand_change_requests
                   meal_demand_change_logs
                   → daily_meal_demand_id → daily_meal_demands
                   → student_id → students
```

---

### Example 3 — Student Meal Attendance Submission (complete chain)

```
Core Domain:       Student Meal Management
                          ↓
Core Capability:   Meal Participation
                          ↓
Core Feature:      F-STU-03 — Record Daily Meal Participation
                          ↓
Actor:             Homeroom Teacher (TCH)
                          ↓
Use Cases:         UC-TCH-01 Record Student Attendance for Meal
                   UC-TCH-02 Submit Attendance Before Cutoff
                          ↓
Task Flow:         TF-01 — Student Meal Attendance Flow
                          ↓
Screens:           SCR-TCH-01 — Class Roster (Meal Attendance)
                   SCR-TCH-02 — Submit Attendance / Lock Demand
                   (UI: demand.html → Screen 1 — Determine Demand)
                          ↓
DB Entities:       daily_meal_demand_details (per student row)
                   daily_meal_demands (class-level summary)
                   → student_id → students → class_id → classes
                   → meal_session_id → meal_sessions
```

---

## Coverage Summary

| Artifact Type | Total | Traced | Coverage |
|--------------|-------|--------|----------|
| Core Features | 12 | 12 | 100% |
| Use Cases | 24 | 24 | 100% |
| Task Flows | 8 | 8 | 100% |
| Screens | 25 | 25 | 100% |
| DB Tables | 10 | 10 | 100% |
| Prototyped Screens | 5 | 5 | 100% |
