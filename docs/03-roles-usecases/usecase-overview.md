# Use Case Overview

## System Context

This document outlines the comprehensive Use Case catalog and system architecture for the Primary School Semi-Boarding Meal Management System across all **8 Business Domains** defined in [Phase 01 — MVP Baseline (MVP.md)](../01-top-down/MVP.md) and [Phase 02 — Core Features Breakdown](../02-core-features/core-feature-breakdown.md).

In strict alignment with institutional operational constraints, the system enforces a **Fixed 4-Role Model**:
1. **MGR — Semi-Boarding Coordinator / Meal Manager**
2. **ACC — School Accountant**
3. **PAR — Student Parent / Guardian**
4. **ADM — School Administrator / Principal**

Every Use Case derives directly from a Core Feature (`F-PAR`, `F-PLN`, `F-OPS`, `F-FEE`, `F-REP`, `F-USR`, `F-NUT`, `F-MST`) and maps directly to underlying database entities.

---

## System-Level UML Use Case Diagram

The diagram below defines the **System Boundary**, the 4 primary actors, functional domain groupings, and standard UML relationships (`include` for mandatory nested sub-tasks, `extend` for conditional or exceptional flows).

```mermaid
flowchart LR
    %% Actors
    MGR(["👤 Semi-Boarding Coordinator\n(MGR)"])
    ACC(["👤 School Accountant\n(ACC)"])
    PAR(["👤 Parent / Guardian\n(PAR)"])
    ADM(["👤 School Administrator\n(ADM)"])

    subgraph SYS["System Boundary: Primary School Semi-Boarding Meal Management System"]
        subgraph DOM1["1. Student Meal Management"]
            UC_PAR_01(["UC-PAR-01\nRegister & Cancel Meal Program"])
            UC_MGR_01(["UC-MGR-01\nRecord Daily Attendance & Lock Roster"])
            UC_MGR_02(["UC-MGR-02\nMonitor Classroom Attendance Progress"])
            UC_ADM_01(["UC-ADM-01\nDefine & Evaluate Meal Eligibility"])
        end

        subgraph DOM2["2. Meal Planning & Menu Management"]
            UC_MGR_03(["UC-MGR-03\nDefine Dishes & Recipe Catalog"])
            UC_MGR_04(["UC-MGR-04\nCreate Weekly Menu & Submit Approval"])
            UC_MGR_05(["UC-MGR-05\nAssign Menu to Serving Calendar"])
            UC_ADM_02(["UC-ADM-02\nApprove Weekly Menu (1-Level)"])
        end

        subgraph DOM3["3. Meal Operation (Catering Vendor Workflow)"]
            UC_MGR_06(["UC-MGR-06\nDetermine Session Demand & Buffer Qty"])
            UC_MGR_07(["UC-MGR-07\nDispatch Order to Catering Vendor"])
            UC_MGR_08(["UC-MGR-08\nInspect Delivery & Confirm Received Qty"])
            UC_MGR_09(["UC-MGR-09\nLog Classroom Meal Tray Distribution"])
            UC_MGR_10(["UC-MGR-10\nReconcile Quantities & Resolve Discrepancies"])
        end

        subgraph DOM4["4. Meal Fee & Cost Management"]
            UC_ACC_01(["UC-ACC-01\nConfigure Meal Fee Rates & Periods"])
            UC_ACC_02(["UC-ACC-02\nCalculate Monthly Chargeable Meals & Invoices"])
            UC_ACC_03(["UC-ACC-03\nRecord Payments & Track 3-State Status"])
            UC_ACC_04(["UC-ACC-04\nTrack Caterer Costs & Accrue Payables"])
            UC_PAR_02(["UC-PAR-02\nView Monthly Bill & Payment Status"])
        end

        subgraph DOM5["5. Reporting & Transparency"]
            UC_MGR_11(["UC-MGR-11\nGenerate Daily Ops & Vendor Reports"])
            UC_ACC_05(["UC-ACC-05\nGenerate Monthly Financial Reports"])
            UC_PAR_03(["UC-PAR-03\nView Parent Portal & Daily Published Menu"])
        end

        subgraph DOM6["6. User & Access Management"]
            UC_ADM_03(["UC-ADM-03\nManage User Accounts & Staff Profiles"])
            UC_ADM_04(["UC-ADM-04\nEnforce Fixed 4-Role RBAC"])
        end

        subgraph DOM7["7. Nutrition & Health Management"]
            UC_PAR_04(["UC-PAR-04\nRecord Student Allergy & Dietary Restrictions"])
            UC_MGR_12(["UC-MGR-12\nReview Menu Restricted Ingredient Alerts"])
        end

        subgraph DOM8["8. Master Data & System Configuration"]
            UC_ADM_05(["UC-ADM-05\nManage Academic Structure (Years, Classes, Students)"])
            UC_ADM_06(["UC-ADM-06\nConfigure Lunch Serving Days & Holiday Calendar"])
        end
    end

    %% Actor Associations
    MGR --- UC_MGR_01
    MGR --- UC_MGR_02
    MGR --- UC_MGR_03
    MGR --- UC_MGR_04
    MGR --- UC_MGR_05
    MGR --- UC_MGR_06
    MGR --- UC_MGR_07
    MGR --- UC_MGR_08
    MGR --- UC_MGR_09
    MGR --- UC_MGR_10
    MGR --- UC_MGR_11
    MGR --- UC_MGR_12

    ACC --- UC_ACC_01
    ACC --- UC_ACC_02
    ACC --- UC_ACC_03
    ACC --- UC_ACC_04
    ACC --- UC_ACC_05

    PAR --- UC_PAR_01
    PAR --- UC_PAR_02
    PAR --- UC_PAR_03
    PAR --- UC_PAR_04

    ADM --- UC_ADM_01
    ADM --- UC_ADM_02
    ADM --- UC_ADM_03
    ADM --- UC_ADM_04
    ADM --- UC_ADM_05
    ADM --- UC_ADM_06

    %% UML Relationships (Explicit include & extend)
    UC_MGR_06 -.->|include| UC_MGR_01
    UC_MGR_07 -.->|include| UC_MGR_06
    UC_MGR_08 -.->|include| UC_MGR_07
    UC_MGR_10 -.->|extend| UC_MGR_08
    UC_MGR_04 -.->|include| UC_MGR_03
    UC_ADM_02 -.->|include| UC_MGR_04
    UC_ACC_02 -.->|include| UC_MGR_01
    UC_ACC_04 -.->|include| UC_MGR_10
    UC_MGR_12 -.->|extend| UC_MGR_04
```

---

## Global Use Case Catalog

### 1. Semi-Boarding Coordinator / Meal Manager (MGR)

| UC ID | Use Case Name | Feature ID | Primary DB Entity | Specification Doc |
|---|---|---|---|---|
| **UC-MGR-01** | Record Daily Attendance, Absence Notes & Lock Roster | `F-PAR-03` | `meal_participations` | [usecase-manager.md](usecase-manager.md#uc-mgr-01) |
| **UC-MGR-02** | Monitor Classroom Attendance Progress & Chase Deadlines | `F-PAR-04` | `meal_participations` | [usecase-manager.md](usecase-manager.md#uc-mgr-02) |
| **UC-MGR-03** | Define Nutritional Dishes & Recipe Information | `F-PLN-01` | `dishes`, `ingredients` | [usecase-manager.md](usecase-manager.md#uc-mgr-03) |
| **UC-MGR-04** | Create Weekly Menu & Submit for Approval | `F-PLN-02` | `menus`, `menu_dishes` | [usecase-manager.md](usecase-manager.md#uc-mgr-04) |
| **UC-MGR-05** | Assign Approved Menu to Serving Calendar | `F-PLN-03` | `meal_schedules`, `menus` | [usecase-manager.md](usecase-manager.md#uc-mgr-05) |
| **UC-MGR-06** | Determine Session Demand & Calculate Expected Dish Quantities | `F-OPS-01` | `meal_demands`, `meal_demand_dish_quantities` | [usecase-manager.md](usecase-manager.md#uc-mgr-06) |
| **UC-MGR-07** | Dispatch Formal Purchase Order to Catering Vendor | `F-OPS-02` | `catering_orders`, `meal_demands` | [usecase-manager.md](usecase-manager.md#uc-mgr-07) |
| **UC-MGR-08** | Inspect Food Temperature/Quality & Confirm Receiving | `F-OPS-03` | `meal_deliveries`, `meal_inspections` | [usecase-manager.md](usecase-manager.md#uc-mgr-08) |
| **UC-MGR-09** | Log Classroom Meal Tray Distribution | `F-OPS-04` | `meal_distributions` | [usecase-manager.md](usecase-manager.md#uc-mgr-09) |
| **UC-MGR-10** | Reconcile Ordered vs Delivered Quantities & Discrepancies | `F-OPS-05` | `meal_reconciliations`, `meal_discrepancies` | [usecase-manager.md](usecase-manager.md#uc-mgr-10) |
| **UC-MGR-11** | Generate Daily Operations Report & Vendor Summary | `F-REP-01` | Materialized Views / Reports | [usecase-manager.md](usecase-manager.md#uc-mgr-11) |
| **UC-MGR-12** | Review Menu Restricted Ingredient Alerts | `F-NUT-02` | `dietary_alerts`, `menus` | [usecase-manager.md](usecase-manager.md#uc-mgr-12) |

---

### 2. School Accountant (ACC)

| UC ID | Use Case Name | Feature ID | Primary DB Entity | Specification Doc |
|---|---|---|---|---|
| **UC-ACC-01** | Configure Meal Fee Rates & Effective Periods | `F-FEE-01` | `meal_fee_configs` | [usecase-accountant.md](usecase-accountant.md#uc-acc-01) |
| **UC-ACC-02** | Calculate Chargeable Meals & Generate Invoices | `F-FEE-02` | `student_meal_bills`, `student_billing_items` | [usecase-accountant.md](usecase-accountant.md#uc-acc-02) |
| **UC-ACC-03** | Record Fee Payments & Update 3-State Status | `F-FEE-03` | `meal_payments`, `student_meal_bills` | [usecase-accountant.md](usecase-accountant.md#uc-acc-03) |
| **UC-ACC-04** | Record Catering Unit Costs & Accrue Vendor Payables | `F-FEE-04` | `catering_costs`, `vendor_payables` | [usecase-accountant.md](usecase-accountant.md#uc-acc-04) |
| **UC-ACC-05** | Generate Monthly Fee, Payment & Debt Reports | `F-REP-02` | Financial Views / Reports | [usecase-accountant.md](usecase-accountant.md#uc-acc-05) |

---

### 3. Student Parent / Guardian (PAR)

| UC ID | Use Case Name | Feature ID | Primary DB Entity | Specification Doc |
|---|---|---|---|---|
| **UC-PAR-01** | Register Student for Meal Program & Cancel | `F-PAR-02` | `meal_registrations`, `students` | [usecase-parent.md](usecase-parent.md#uc-par-01) |
| **UC-PAR-02** | View Monthly Meal Bill & Payment Tracking | `F-FEE-03` | `student_meal_bills`, `meal_payments` | [usecase-parent.md](usecase-parent.md#uc-par-02) |
| **UC-PAR-03** | View Parent Portal & Daily Published Menus | `F-REP-03` | `menus`, `meal_deliveries` | [usecase-parent.md](usecase-parent.md#uc-par-03) |
| **UC-PAR-04** | Record Student Allergy & Dietary Restrictions | `F-NUT-01` | `student_allergies`, `students` | [usecase-parent.md](usecase-parent.md#uc-par-04) |

---

### 4. School Administrator / Principal (ADM)

| UC ID | Use Case Name | Feature ID | Primary DB Entity | Specification Doc |
|---|---|---|---|---|
| **UC-ADM-01** | Define & Evaluate Student Meal Eligibility | `F-PAR-01` | `meal_eligibility`, `students` | [usecase-admin.md](usecase-admin.md#uc-adm-01) |
| **UC-ADM-02** | Approve Weekly Menu (1-Level Review) | `F-PLN-02` | `menus` | [usecase-admin.md](usecase-admin.md#uc-adm-02) |
| **UC-ADM-03** | Manage Staff Accounts & User Profiles | `F-USR-01` | `users` | [usecase-admin.md](usecase-admin.md#uc-adm-03) |
| **UC-ADM-04** | Enforce Fixed 4-Role RBAC Permissions | `F-USR-02` | `users`, `roles` | [usecase-admin.md](usecase-admin.md#uc-adm-04) |
| **UC-ADM-05** | Manage Academic Structure (Years, Classes, Students) | `F-MST-01` | `school_years`, `grades`, `classes`, `students` | [usecase-admin.md](usecase-admin.md#uc-adm-05) |
| **UC-ADM-06** | Configure Serving Days & Holiday Calendar | `F-MST-02` | `meal_calendars`, `holidays` | [usecase-admin.md](usecase-admin.md#uc-adm-06) |

---

## Operational Lifecycle Trace

```mermaid
flowchart TD
    subgraph PRE["Pre-Service / Academic Setup Cycle"]
        A1["UC-ADM-05: Configure School Year & Classes"] --> A2["UC-ADM-06: Setup Serving Calendar & Holidays"]
        A1 --> A3["UC-ADM-01: Evaluate Meal Eligibility"]
        A3 --> P1["UC-PAR-01: Parent Registers for Meal Program"]
        P1 --> P4["UC-PAR-04: Parent Records Food Allergies"]
        M3["UC-MGR-03: Define Dish & Recipe Catalog"] --> M4["UC-MGR-04: Compose Weekly Menu"]
        M4 --> A2_Approve["UC-ADM-02: Principal Approves Menu"]
        A2_Approve --> M5["UC-MGR-05: Assign Menu to Calendar"]
    end

    subgraph DAILY["Daily Operational Service Cycle"]
        M5 ==> M1["08:30: UC-MGR-01 Lock Classroom Attendance"]
        M1 --> M6["08:35: UC-MGR-06 Compute Demand + Buffer Qty"]
        M6 --> M7["08:45: UC-MGR-07 Dispatch Order to Catering Vendor"]
        M7 ==> M8["10:30: UC-MGR-08 Inspect Delivery & Temp Acceptance"]
        M8 --> M9["11:00: UC-MGR-09 Dispatch Trolleys to Classrooms"]
        M9 --> M10["13:00: UC-MGR-10 Reconcile Quantities & Discrepancies"]
        M10 --> M11["UC-MGR-11: Generate Daily Operations Summary"]
        M8 -.-> P3["UC-PAR-03: Parent Views Real-time Delivery Verification"]
    end

    subgraph MONTHLY["Periodic Financial & Settlement Cycle"]
        M1 ==> C2["UC-ACC-02: Compute Chargeable Meals & Issue Bills"]
        C1["UC-ACC-01: Configure Meal Unit Rates"] --> C2
        C2 --> P2["UC-PAR-02: Parent Views Bill & Payment Status"]
        C2 --> C3["UC-ACC-03: Record Payments & Update 3-State Status"]
        M10 ==> C4["UC-ACC-04: Accrue Catering Vendor Payables"]
        C3 & C4 --> C5["UC-ACC-05: Generate Financial & Debt Reports"]
    end
```

