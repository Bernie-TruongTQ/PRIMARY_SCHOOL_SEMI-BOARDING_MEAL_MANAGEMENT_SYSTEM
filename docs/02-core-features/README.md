# Phase 02 — Core Feature Breakdown

## What is this?

This phase translates the top-down functional decomposition from [Phase 01 — Top-Down Decomposition](../01-top-down/README.md) into structured, engineering-ready feature specifications for all **8 Business Domains** defined in the approved [MVP Baseline](../01-top-down/MVP.md) and decomposition mind map ([PRIMARY SCHOOL SEMI-BOARDINGMEAL MANAGEMENT SYSTEM.png](../01-top-down/PRIMARY%20SCHOOL%20SEMI-BOARDINGMEAL%20MANAGEMENT%20SYSTEM.png)).

Every feature links upward to business capabilities and downward to actor use cases, user flows, UI screens, and database schemas.

---

## Core Feature Taxonomy

Features are structured using standardized domain-oriented IDs:

```
Decomposition Mind Map & 8 Business Domains (Phase 01)
     ↓
Baseline MVP Scope Definition (MVP.md)
     ↓
Standardized Feature IDs (Phase 02)
     ├── F-PAR-xx : Student Meal & Participation Management (Domain 1)
     ├── F-PLN-xx : Meal Planning & Menu Management (Domain 2)
     ├── F-OPS-xx : Meal Operations & Catering Coordination (Domain 3)
     ├── F-FEE-xx : Meal Fee & Cost Management (Domain 4)
     ├── F-REP-xx : Reporting & Transparency (Domain 5)
     ├── F-USR-xx : User & Access Management (Domain 6)
     ├── F-NUT-xx : Nutrition & Health Management (Domain 7)
     └── F-MST-xx : Master Data & System Configuration (Domain 8)
```

---

## MVP Feature Master Summary (All 8 Domains)

| Domain # | Domain Name | Feature ID | Feature Name | Priority / Scope | Primary Entities |
|---|---|---|---|---|---|
| **1** | **Student Meal Management** | **F-PAR-01** | Student Meal Eligibility Definition & Determination | P1 (MVP) | `students`, `meal_eligibility` |
| | | **F-PAR-02** | Student Meal Registration & Modifications | P1 (MVP) | `meal_registrations`, `students` |
| | | **F-PAR-03** | Daily Meal Attendance & Absence Logging | P1 (MVP) | `meal_participations`, `meal_participation_changes` |
| | | **F-PAR-04** | Classroom Meal Attendance Monitoring | P1 (MVP - Streamlined) | `meal_participations` |
| **2** | **Meal Planning & Menu Management** | **F-PLN-01** | Dish Definition & Catalog Management | P1 (MVP) | `dishes`, `ingredients` |
| | | **F-PLN-02** | Menu Creation & 1-Level Approval | P1 (MVP - Streamlined) | `menus`, `menu_dishes` |
| | | **F-PLN-03** | Meal Schedule Calendar Assignment | P1 (MVP) | `meal_schedules`, `menus` |
| **3** | **Meal Operation** | **F-OPS-01** | Demand Determination & Quantity Calculation | P1 (MVP) | `meal_demands`, `meal_demand_dish_quantities` |
| | | **F-OPS-02** | Catering Vendor Order Dispatch | P1 (MVP) | `catering_orders`, `meal_demands` |
| | | **F-OPS-03** | Meal Receiving, Quality & Temp Inspection | P1 (MVP) | `meal_deliveries`, `meal_inspections` |
| | | **F-OPS-04** | Classroom Meal Distribution Logging | P1 (MVP) | `meal_distributions` |
| | | **F-OPS-05** | Meal Reconciliation & Discrepancy Resolution | P1 (MVP - Streamlined) | `meal_reconciliations`, `meal_discrepancies` |
| **4** | **Meal Fee & Cost Management** | **F-FEE-01** | Meal Fee Rate & Effective Period Setup | P1 (MVP) | `meal_fee_configs` |
| | | **F-FEE-02** | Chargeable Meal Calculation & Invoicing | P1 (MVP) | `student_meal_bills`, `student_billing_items` |
| | | **F-FEE-03** | Meal Payment Recording & Status Tracking | P1 (MVP - Streamlined) | `meal_payments` |
| | | **F-FEE-04** | Caterer Cost Tracking & Payable Accrual | P1 (MVP - Streamlined) | `catering_costs`, `vendor_payables` |
| **5** | **Reporting & Transparency** | **F-REP-01** | Daily Meal Operation & Vendor Reports | P1 (MVP - Streamlined) | Reporting views / exports |
| | | **F-REP-02** | Fee, Payment & Caterer Cost Reports | P1 (MVP - Streamlined) | Accounting reporting views |
| | | **F-REP-03** | Parent Transparency Portal & Daily Menu View | P1 (MVP - Streamlined) | Parent transparency views |
| **6** | **User & Access Management** | **F-USR-01** | User Profile & Account Management | P1 (MVP) | `users` |
| | | **F-USR-02** | Fixed Role Permissions & RBAC Assignment | P1 (MVP - Streamlined) | `users`, `roles` |
| **7** | **Nutrition & Health Management** | **F-NUT-01** | Student Allergy & Dietary Restriction Tracking | P1 (MVP) | `student_allergies`, `students` |
| | | **F-NUT-02** | Menu Restricted Ingredient Conflict Alerts | P1 (MVP - Streamlined) | `dishes`, `menus`, `dietary_alerts` |
| **8** | **Master Data & System Config** | **F-MST-01** | School Year, Semester, Class & Student Setup | P1 (MVP) | `school_years`, `grades`, `classes`, `students` |
| | | **F-MST-02** | Serving Day & Holiday Calendar Configuration | P1 (MVP) | `meal_calendars`, `holidays` |

---

## Artifacts in this folder

| File | Purpose |
|------|---------|
| [core-feature-breakdown.md](core-feature-breakdown.md) | Comprehensive functional breakdown across all 8 domains with capability definitions and data bindings |
| [invest-requirements.md](invest-requirements.md) | Detailed User Stories structured under INVEST criteria, BDD/Gherkin acceptance tests, and estimation matrices |

---

## Next Step

→ [Phase 03 — Roles & Use Cases](../03-roles-usecases/README.md)
