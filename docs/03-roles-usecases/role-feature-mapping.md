# Role-Feature Mapping Matrix

This matrix establishes the comprehensive responsibility mapping (**RACI**: Responsible, Accountable, Consulted, Informed) between the **4 Fixed Roles** (`ADM`, `ACC`, `MGR`, `PAR`) and all **24 MVP Features** across the **8 Business Domains** defined in [Phase 01 — MVP Baseline (MVP.md)](../01-top-down/MVP.md) and [Phase 02 — Core Features Breakdown](../02-core-features/core-feature-breakdown.md).

---

## Master RACI Matrix (24 MVP Features across 8 Domains)

| Domain # | Feature ID | Feature Name | MGR (Coordinator) | ACC (Accountant) | PAR (Parent) | ADM (Administrator) |
|---|---|---|:---:|:---:|:---:|:---:|
| **1. Student Meal** | **F-PAR-01** | Define & Evaluate Meal Eligibility | C | I | I | **R / A** |
| | **F-PAR-02** | Student Meal Registration & Changes | A | I | **R** | I |
| | **F-PAR-03** | Daily Meal Attendance & Absence Logging | **R / A** | I | C | I |
| | **F-PAR-04** | Classroom Meal Attendance Monitoring | **R / A** | I | I | I |
| **2. Meal Planning** | **F-PLN-01** | Dish Definition & Catalog Management | **R / A** | — | I | I |
| | **F-PLN-02** | Menu Creation & 1-Level Approval | **R** | — | I | **A** |
| | **F-PLN-03** | Meal Schedule Calendar Assignment | **R / A** | I | I | I |
| **3. Meal Operation** | **F-OPS-01** | Demand Determination & Dish Quantities (+Buffer) | **R / A** | I | — | I |
| | **F-OPS-02** | Catering Vendor Order Dispatch | **R / A** | I | — | I |
| | **F-OPS-03** | Meal Receiving & Quality/Temp Inspection | **R / A** | I | I | I |
| | **F-OPS-04** | Classroom Meal Distribution Logging | **R / A** | — | — | I |
| | **F-OPS-05** | Meal Reconciliation & Discrepancy Resolution | **R / A** | C / I | — | I |
| **4. Fee & Cost** | **F-FEE-01** | Meal Fee Rate & Effective Period Setup | C | **R / A** | I | A |
| | **F-FEE-02** | Chargeable Meal Calculation & Invoicing | C | **R / A** | I | I |
| | **F-FEE-03** | Meal Payment Recording & 3-State Tracking | — | **R / A** | R (Pay) / I | I |
| | **F-FEE-04** | Caterer Cost Tracking & Payable Accrual | C | **R / A** | — | I |
| **5. Reporting** | **F-REP-01** | Daily Meal Operation & Vendor Reports | **R / A** | I | — | I |
| | **F-REP-02** | Fee, Payment & Caterer Cost Reports | I | **R / A** | — | I |
| | **F-REP-03** | Parent Transparency Portal & Daily Menu View | **R** | — | **A (Audience)** | I |
| **6. User & Access** | **F-USR-01** | User Profile & Account Management | I | I | I | **R / A** |
| | **F-USR-02** | Fixed Role Permissions & RBAC Assignment | I | I | I | **R / A** |
| **7. Nutrition & Health** | **F-NUT-01** | Student Allergy & Dietary Restriction Tracking | C / I | — | **R** | A |
| | **F-NUT-02** | Menu Restricted Ingredient Conflict Alerts | **R / A** | — | I | I |
| **8. Master Data** | **F-MST-01** | School Year, Semester, Class & Student Setup | I | I | I | **R / A** |
| | **F-MST-02** | Serving Day & Holiday Calendar Configuration | C | I | I | **R / A** |

---

## RACI Legend

- **R (Responsible):** The role executing the activity, performing daily operational data entry, or submitting requests.
- **A (Accountable):** The role holding ultimate approval authority, verification sign-off, or administrative ownership.
- **C (Consulted):** The role providing operational inputs, absence rationale, or consulted during exception handling.
- **I (Informed):** The role receiving status notifications, read-only dashboards, audit reports, or transparency views.


