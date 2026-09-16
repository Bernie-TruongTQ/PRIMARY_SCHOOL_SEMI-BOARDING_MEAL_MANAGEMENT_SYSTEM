# Phase 02 — Core Features & MVP Functional Breakdown

## 1. Overview & System Scope

Phase 02 translates the top-down decomposition defined in [Phase 01 — Top-Down Decomposition](../01-top-down/README.md) into concrete, engineering-ready feature specifications.

Based on the [Functional Decomposition Mind Map](../01-top-down/PRIMARY%20SCHOOL%20SEMI-BOARDINGMEAL%20MANAGEMENT%20SYSTEM.png) and the approved [MVP Scope Baseline](../01-top-down/MVP.md), the system operates across **8 Business Domains**. The baseline scope is organized into:
1. **The Primary Operational Value Chain (Active Core)**: 3 tightly integrated operational modules executing the daily meal cycle:
   - **Module 1: Student Meal & Participation Management** (from Domain 1)
   - **Module 2: Meal Demand & Vendor Order Management** (from Domains 2 & 3)
   - **Module 3: Meal Receiving, Distribution & Reconciliation** (from Domain 3)
2. **Supporting & Safety Governance Modules**:
   - **Module 4: Nutrition & Food Allergy Alerts** (from Domain 7)
   - **Module 5: Meal Fee & Caterer Cost Tracking** (from Domain 4)
   - **Module 6: Operational & Transparency Reporting** (from Domain 5)
3. **Generic & Foundation Modules**:
   - **Module 7: User Accounts & Fixed Role RBAC** (from Domain 6)
   - **Module 8: Academic Master Data & Calendar Configuration** (from Domain 8)

---

## 2. Feature Taxonomy & ID Architecture

Every feature in the system is assigned a deterministic identifier following the domain prefix structure:

```
Mind Map / 8 Business Domains (Phase 01)
     ↓
Operational Modules & Capabilities
     ↓
Standardized Feature IDs (Phase 02)
     ├── F-PAR-xx : Student Meal & Participation Management
     ├── F-PLN-xx : Meal Planning & Menu Management
     ├── F-OPS-xx : Meal Operations (Demand, Vendor Orders, Receiving, Distribution, Reconciliation)
     ├── F-NUT-xx : Nutrition & Health Safeguards (Allergies)
     ├── F-FEE-xx : Meal Fee & Cost Management
     ├── F-REP-xx : Reporting & Transparency
     ├── F-USR-xx : User & Access Management (Fixed Roles)
     └── F-MST-xx : Master Academic Data & System Configurations
```

---

## 3. Master Feature Breakdown across All 8 Domains

### Domain 1: Student Meal Management (`F-PAR`)

| Feature ID | Feature Name | Priority | Level 3 Functions Covered (from MVP.md) | Associated Entities |
|---|---|---|---|---|
| **F-PAR-01** | Student Meal Eligibility Definition & Evaluation | P1 (MVP) | Define Meal Eligibility Criteria, Determine Student Meal Eligibility | `students`, `meal_eligibility` |
| **F-PAR-02** | Student Meal Registration & Modifications | P1 (MVP) | Register for Meals, Modify Meal Registration, Cancel Meal Registration, Record Dietary Note at Registration | `meal_registrations`, `students` |
| **F-PAR-03** | Daily Meal Attendance & Absence Logging | P1 (MVP) | Record Meal Attendance | `meal_participations`, `meal_participation_changes` |
| **F-PAR-04** | Classroom Meal Attendance Monitoring | P1 (MVP - Streamlined) | Monitor Meal Attendance | `meal_participations` (Classroom summary views) |

### Domain 2: Meal Planning & Menu Management (`F-PLN`)

| Feature ID | Feature Name | Priority | Level 3 Functions Covered (from MVP.md) | Associated Entities |
|---|---|---|---|---|
| **F-PLN-01** | Dish Definition & Catalog Management | P1 (MVP) | Define Dish, Manage Dish Information | `dishes`, `ingredients` |
| **F-PLN-02** | Weekly Menu Creation & Single-Level Approval | P1 (MVP - Streamlined) | Create Menu, Assign Dishes to Menu, Approve Menu (1 level) | `menus`, `menu_dishes` |
| **F-PLN-03** | Meal Schedule Calendar Assignment | P1 (MVP) | Define Meal Schedule, Assign Menu to Schedule | `meal_schedules`, `menus` |

### Domain 3: Meal Operation (`F-OPS`)

| Feature ID | Feature Name | Priority | Level 3 Functions Covered (from MVP.md) | Associated Entities |
|---|---|---|---|---|
| **F-OPS-01** | Demand Determination & Expected Quantity Calculation | P1 (MVP) | Determine Meal Demand, Calculate Expected Meal Quantity | `meal_demands`, `meal_demand_dish_quantities` |
| **F-OPS-02** | Catering Vendor Order Dispatch | P1 (MVP) | Send Meal Order to Catering Vendor | `meal_demands`, `catering_orders` |
| **F-OPS-03** | Meal Receiving & Quality Inspection | P1 (MVP) | Record Delivered Quantity from Vendor, Inspect Delivered Meal Quality, Confirm Received Quantity | `meal_deliveries`, `meal_inspections` |
| **F-OPS-04** | Classroom Meal Distribution Logging | P1 (MVP) | Record Distributed Quantity | `meal_distributions` |
| **F-OPS-05** | Meal Reconciliation & Discrepancy Resolution | P1 (MVP - Streamlined) | Reconcile Ordered vs Delivered Quantity, Resolve Quantity Discrepancies | `meal_reconciliations`, `meal_discrepancies` |

### Domain 4: Meal Fee & Cost Management (`F-FEE`)

| Feature ID | Feature Name | Priority | Level 3 Functions Covered (from MVP.md) | Associated Entities |
|---|---|---|---|---|
| **F-FEE-01** | Meal Fee Rate & Effective Period Configuration | P1 (MVP) | Define Meal Fee, Set Effective Period | `meal_fee_configs` |
| **F-FEE-02** | Chargeable Meal Calculation & Invoicing | P1 (MVP) | Determine Chargeable Meals, Calculate Meal Fees | `student_meal_bills`, `student_billing_items` |
| **F-FEE-03** | Meal Payment Recording & Basic Status Tracking | P1 (MVP - Streamlined) | Record Meal Payment, Track Payment Status (Unpaid/Partial/Paid) | `meal_payments` |
| **F-FEE-04** | Caterer Operational Cost & Payable Tracking | P1 (MVP - Streamlined) | Record Meal Costs, Calculate Meal Cost | `catering_costs`, `vendor_payables` |

### Domain 5: Reporting & Transparency (`F-REP`)

| Feature ID | Feature Name | Priority | Level 3 Functions Covered (from MVP.md) | Associated Entities |
|---|---|---|---|---|
| **F-REP-01** | Daily Operational & Vendor Reconciliation Reports | P1 (MVP - Streamlined) | Generate Daily Meal Operation Report, Generate Reconciliation Report | Materialized view / Reports |
| **F-REP-02** | Cost, Fee & Caterer Debt Summary Reports | P1 (MVP - Streamlined) | Generate Fee Report, Generate Payment Report, Generate Cost Report | Materialized view / Reports |
| **F-REP-03** | Parent Transparency Portal & Daily Menu Publishing | P1 (MVP - Streamlined) | Prepare Transparency Information, Publish Transparency Information | Public / Parent portal views |

### Domain 6: User & Access Management (`F-USR`)

| Feature ID | Feature Name | Priority | Level 3 Functions Covered (from MVP.md) | Associated Entities |
|---|---|---|---|---|
| **F-USR-01** | User Profile & Account Management | P1 (MVP) | Register User Account, Update User Information | `users` |
| **F-USR-02** | Fixed Role Permissions & RBAC Assignment | P1 (MVP - Streamlined) | Define Role, Assign Permission to Role, Assign Role to User (Fixed 4 Roles) | `users`, `roles` |

### Domain 7: Nutrition & Health Management (`F-NUT`)

| Feature ID | Feature Name | Priority | Level 3 Functions Covered (from MVP.md) | Associated Entities |
|---|---|---|---|---|
| **F-NUT-01** | Student Allergy & Dietary Restriction Tracking | P1 (MVP) | Record Student Allergy/Dietary Restriction | `student_allergies`, `students` |
| **F-NUT-02** | Restricted Ingredient Flagging & Menu Conflict Alerts | P1 (MVP - Streamlined) | Flag Restricted Ingredients in Menu, Alert on Menu-Restriction Conflict (Visual alerts) | `dishes`, `menus`, `dietary_alerts` |

### Domain 8: Master Data & System Configuration (`F-MST`)

| Feature ID | Feature Name | Priority | Level 3 Functions Covered (from MVP.md) | Associated Entities |
|---|---|---|---|---|
| **F-MST-01** | Academic Structure Management (Years, Classes, Students) | P1 (MVP) | Manage School Year/Semester, Manage Class & Grade Information, Manage Student Profile | `school_years`, `grades`, `classes`, `students` |
| **F-MST-02** | Serving Calendar & Holiday Configuration | P1 (MVP) | Configure Lunch Serving Day, Configure Holiday/Non-Meal Day Calendar | `meal_calendars`, `holidays` |

---

## 4. Operational Value Chain Integration

The core features above execute the continuous daily lifecycle of primary school semi-boarding meals:

```
[F-MST: School Year, Classes, Serving Calendar Setup]
                          ↓
[F-PAR: Eligibility & Term Registration]
                          ↓
[F-PLN: Dish Catalog & Approved Weekly Menu Schedule] ← [F-NUT: Allergy Conflict Alerts]
                          ↓
[F-PAR-03: Daily 08:30 AM Morning Class Attendance & Lock]
                          ↓
[F-OPS-01: Session Demand Aggregation & Dish Quantities (+Buffer)]
                          ↓
[F-OPS-02: Purchase Order Dispatched to Catering Vendor]
                          ↓
[F-OPS-03: 10:30 AM Meal Receiving, Temp/Quality Inspection & Sign-off]
                          ↓
[F-OPS-04: 11:00 AM Classroom Tray Distribution Logging]
                          ↓
[F-OPS-05: 13:00 PM Quantity Reconciliation (Ordered vs Delivered vs Consumed)]
                          ↓
[F-FEE: Chargeable Fee Assessment & Caterer Payable Accrual]
                          ↓
[F-REP: Daily Ops Report, Vendor Reconciliation Report & Parent Transparency View]
```

---

## 5. Artifacts in this folder

| File | Purpose |
|---|---|
| [core-feature-breakdown.md](core-feature-breakdown.md) | Comprehensive feature catalog across all 8 domains with capability definitions and entity linkages |
| [invest-requirements.md](invest-requirements.md) | Exhaustive INVEST requirements, user stories, and BDD/Gherkin acceptance criteria |
| [README.md](README.md) | Summary, taxonomy, and navigation guide for Phase 02 |
