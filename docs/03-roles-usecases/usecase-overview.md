# Use Case Overview

## System Context

This document outlines the complete Use Case catalog and architecture for the Primary School Semi-Boarding Meal Management System across the **three active core operational modules**.

Every Use Case is derived from a Core Feature in [Phase 02](../02-core-features/core-feature-breakdown.md) and maps directly to operational task flows, user interfaces, and database tables in [Phase 06](../06-database/README.md).

---

## System-Level UML Use Case Diagram

The diagram below defines the **System Boundary**, primary actors, functional modules, and standard UML relationships (`<<include>>` for mandatory sub-tasks, `<<extend>>` for conditional or exceptional flows).

```mermaid
flowchart LR
    %% Actors
    TCH(["👤 Homeroom Teacher\n(TCH)"])
    MGR(["👤 Meal Manager\n(MGR)"])
    KIT(["👤 Kitchen Staff\n(KIT)"])
    ADM(["👤 Administrator\n(ADM)"])

    subgraph SYS["System Boundary: Primary School Semi-Boarding Meal Management System"]
        subgraph MOD1["Module 1: Meal Participation Management"]
            UC_TCH_01(["UC-TCH-01\nRecord Daily Participation"])
            UC_TCH_02(["UC-TCH-02\nAmend Participation with Reason"])
            UC_TCH_03(["UC-TCH-03\nConfirm Class Roster"])
        end

        subgraph MOD2["Module 2: Meal Demand & Quantity Management"]
            UC_MGR_01(["UC-MGR-01\nAggregate & Determine Demand"])
            UC_MGR_02(["UC-MGR-02\nCalculate Dish Quantities"])
            UC_MGR_03(["UC-MGR-03\nReview Demand Changes"])
            UC_TCH_04(["UC-TCH-04\nSubmit Emergency Request"])
        end

        subgraph MOD3["Module 3: Meal Preparation"]
            UC_MGR_04(["UC-MGR-04\nCreate Prep Plan"])
            UC_KIT_01(["UC-KIT-01\nView Kitchen Prep Plan"])
            UC_KIT_02(["UC-KIT-02\nReceive Ingredient Allocation"])
            UC_KIT_03(["UC-KIT-03\nRecord Cooking Batches"])
            UC_KIT_04(["UC-KIT-04\nConfirm Prepared Quantity"])
            UC_MGR_05(["UC-MGR-05\nReview Discrepancies & Sign-off"])
        end

        subgraph REF["Master Reference Boundary"]
            UC_ADM_01(["UC-ADM-01\nManage Students & Eligibility"])
            UC_ADM_02(["UC-ADM-02\nConfigure Meal Schedules"])
            UC_ADM_03(["UC-ADM-03\nMaintain Dishes & Ingredients"])
            UC_ADM_04(["UC-ADM-04\nManage Users & Roles"])
        end
    end

    %% Actor Associations
    TCH --- UC_TCH_01
    TCH --- UC_TCH_03
    TCH --- UC_TCH_04

    MGR --- UC_MGR_01
    MGR --- UC_MGR_03
    MGR --- UC_MGR_04
    MGR --- UC_MGR_05

    KIT --- UC_KIT_01
    KIT --- UC_KIT_02
    KIT --- UC_KIT_03
    KIT --- UC_KIT_04

    ADM --- UC_ADM_01
    ADM --- UC_ADM_02
    ADM --- UC_ADM_03
    ADM --- UC_ADM_04

    %% Dependencies: &lt;&lt;include&gt;&gt; &amp; &lt;&lt;extend&gt;&gt;
    UC_TCH_02 -.->|"&lt;&lt;extend&gt;&gt;"| UC_TCH_01
    UC_TCH_04 -.->|"&lt;&lt;extend&gt;&gt;"| UC_TCH_03
    UC_MGR_01 -.->|"&lt;&lt;include&gt;&gt;"| UC_MGR_02
    UC_MGR_03 -.->|"&lt;&lt;extend&gt;&gt;"| UC_MGR_01
    UC_KIT_04 -.->|"&lt;&lt;include&gt;&gt;"| UC_KIT_03
    UC_MGR_05 -.->|"&lt;&lt;include&gt;&gt;"| UC_KIT_04
```

---

## Global Use Case Catalog

### Actor: Homeroom Teacher / Class Supervisor (TCH)

| UC ID | Use Case Name | Core Feature | Primary DB Entity | Specification Doc |
|---|---|---|---|---|
| **UC-TCH-01** | Record Daily Student Meal Participation | `F-PAR-01` | `meal_participations` | [usecase-teacher.md](usecase-teacher.md#uc-tch-01) |
| **UC-TCH-02** | Amend Participation Status with Reason | `F-PAR-02` | `meal_participation_changes` | [usecase-teacher.md](usecase-teacher.md#uc-tch-02) |
| **UC-TCH-03** | Confirm Daily Class Participation Roster | `F-PAR-03` | `meal_participations` | [usecase-teacher.md](usecase-teacher.md#uc-tch-03) |
| **UC-TCH-04** | Submit Post-Cutoff Emergency Request | `F-DMD-03` | `meal_demand_changes` | [usecase-teacher.md](usecase-teacher.md#uc-tch-04) |

---

### Actor: Meal / Nutrition Manager (MGR)

| UC ID | Use Case Name | Core Feature | Primary DB Entity | Specification Doc |
|---|---|---|---|---|
| **UC-MGR-01** | Aggregate & Determine Daily Meal Demand | `F-DMD-01` | `meal_demands` | [usecase-manager.md](usecase-manager.md#uc-mgr-01) |
| **UC-MGR-02** | Calculate & Adjust Expected Dish Quantities | `F-DMD-02` | `meal_demand_dish_quantities` | [usecase-manager.md](usecase-manager.md#uc-mgr-02) |
| **UC-MGR-03** | Review & Approve Post-Lock Demand Adjustments | `F-DMD-03` | `meal_demand_changes` | [usecase-manager.md](usecase-manager.md#uc-mgr-03) |
| **UC-MGR-04** | Create & Schedule Kitchen Meal Preparation Plan | `F-PRP-01` | `meal_preparation_plans` | [usecase-manager.md](usecase-manager.md#uc-mgr-04) |
| **UC-MGR-05** | Review Discrepancies & Sign Off Preparation Summary | `F-PRP-04` | `prepared_quantity_confirmations` | [usecase-manager.md](usecase-manager.md#uc-mgr-05) |

---

### Actor: Kitchen Staff / Head Chef (KIT)

| UC ID | Use Case Name | Core Feature | Primary DB Entity | Specification Doc |
|---|---|---|---|---|
| **UC-KIT-01** | View Active Kitchen Preparation Plan | `F-PRP-01` | `meal_preparation_plans` | [usecase-kitchen.md](usecase-kitchen.md#uc-kit-01) |
| **UC-KIT-02** | Receive & Adjust Ingredient Allocation | `F-PRP-02` | `ingredient_allocations` | [usecase-kitchen.md](usecase-kitchen.md#uc-kit-02) |
| **UC-KIT-03** | Record Cooking Batch Execution | `F-PRP-03` | `meal_preparations`, `meal_preparation_dish_records` | [usecase-kitchen.md](usecase-kitchen.md#uc-kit-03) |
| **UC-KIT-04** | Confirm Prepared Quantity & Log Discrepancies | `F-PRP-04` | `prepared_quantity_confirmations` | [usecase-kitchen.md](usecase-kitchen.md#uc-kit-04) |

---

### Actor: School Administrator (ADM)

| UC ID | Use Case Name | Core Feature | Primary DB Entity | Specification Doc |
|---|---|---|---|---|
| **UC-ADM-01** | Manage Student Records & Eligibility | Master Data | `students` | [usecase-admin.md](usecase-admin.md#uc-adm-01) |
| **UC-ADM-02** | Configure Meal Calendar & Daily Schedules | Master Data | `meal_schedules` | [usecase-admin.md](usecase-admin.md#uc-adm-02) |
| **UC-ADM-03** | Maintain Dish & Ingredient Master Catalog | Master Data | `dishes`, `ingredients` | [usecase-admin.md](usecase-admin.md#uc-adm-03) |
| **UC-ADM-04** | Manage System Users & Role Permissions | Master Data | `users` | [usecase-admin.md](usecase-admin.md#uc-adm-04) |

---

## Operational Lifecycle Trace

```mermaid
flowchart TD
    subgraph M1["Module 1: Meal Participation"]
        T1["UC-TCH-01: Record Participation"] --> T2["UC-TCH-02: Amend Status"]
        T2 --> T3["UC-TCH-03: Confirm Roster"]
    end

    subgraph M2["Module 2: Demand & Quantity"]
        T3 ==> M1_Demand["UC-MGR-01: Determine Demand"]
        M1_Demand --> M2_Qty["UC-MGR-02: Calculate Dish Quantities"]
        M2_Qty --> M3_Change["UC-MGR-03: Review Post-Lock Changes"]
    end

    subgraph M3["Module 3: Meal Preparation"]
        M2_Qty ==> P1_Plan["UC-MGR-04: Create Prep Plan"]
        P1_Plan --> K1_View["UC-KIT-01: View Prep Plan"]
        K1_View --> K2_Alloc["UC-KIT-02: Allocate Ingredients"]
        K2_Alloc --> K3_Cook["UC-KIT-03: Record Cooking Batches"]
        K3_Cook --> K4_Verify["UC-KIT-04: Confirm Prepared Qty"]
        K4_Verify ==> M5_Sign["UC-MGR-05: Review Discrepancy & Sign-off"]
    end
```
