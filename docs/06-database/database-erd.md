# Database ERD — Entity Relationship Diagrams

> [!TIP]
> **Interactive Visualization:** You can also explore and interact with the database diagram and relationships online at:  
> 🔗 **[dbdocs.io — PRIMARY SCHOOL SEMI-BOARDING MEAL MANAGEMENT SYSTEM](https://dbdocs.io/tqtolympia/PRIMARY-SCHOOL-SEMI-BOARDING-MEAL-MANAGEMENT-SYSTEM)**

This document contains the Entity Relationship Diagrams (ERD) supporting the three implemented core modules:
1. **Meal Participation Management**
2. **Meal Demand & Quantity Management**
3. **Meal Preparation**

---

## 1. High-Level Domain & Module Overview

The overview below illustrates how the operational flow links Student Participation to Demand Estimation, and finally into Kitchen Preparation and Verification.

```mermaid
erDiagram
    %% Core Cross-Module Linkages
    meal_schedules ||--o{ meal_participations : "participations recorded for"
    meal_schedules ||--|| meal_demands : "aggregated into"
    meal_demands ||--|| meal_preparation_plans : "triggers kitchen plan"
    meal_preparation_plans ||--|| meal_preparations : "executed by cooking"
    meal_preparations ||--o{ meal_preparation_dish_records : "yields dish batches"
    meal_preparation_dish_records ||--o{ prepared_quantity_confirmations : "quality/quantity verified"

    %% Audit logs
    meal_participations ||--o{ meal_participation_changes : "audit trail"
    meal_demands ||--o{ meal_demand_changes : "change logs"
```

---

## 2. Module 1: Meal Participation Management

Captures daily student attendance/meal consumption, handles changes (cancellation, status update, reschedule), and records supervisory confirmation.

```mermaid
erDiagram
    students {
        int id PK
        varchar full_name
        varchar class_name
        varchar eligibility_status
    }

    meal_schedules {
        int id PK
        date meal_date
        meal_type_enum meal_type
        int menu_id
    }

    meal_registrations {
        int id PK
        int student_id FK
        int meal_schedule_id FK
        varchar status
    }

    users {
        int id PK
        varchar full_name
        varchar role
    }

    meal_participations {
        int id PK
        int student_id FK
        int meal_schedule_id FK
        int meal_registration_id FK
        date meal_date
        meal_type_enum meal_type
        participation_status_enum status
        int recorded_by FK
        datetime recorded_at
        int confirmed_by FK
        datetime confirmed_at
        varchar notes
        datetime created_at
        datetime updated_at
    }

    meal_participation_changes {
        int id PK
        int meal_participation_id FK
        participation_change_type_enum change_type
        participation_status_enum old_status
        participation_status_enum new_status
        varchar reason
        int changed_by FK
        datetime changed_at
    }

    students ||--o{ meal_participations : "student_id"
    meal_schedules ||--o{ meal_participations : "meal_schedule_id"
    meal_registrations ||--o{ meal_participations : "meal_registration_id"
    users ||--o{ meal_participations : "recorded_by / confirmed_by"
    meal_participations ||--o{ meal_participation_changes : "meal_participation_id"
    users ||--o{ meal_participation_changes : "changed_by"
```

---

## 3. Module 2: Meal Demand & Quantity Management

Aggregates individual participations into consolidated headcount demand, calculates expected dish portions based on standard recipes, and logs quantity adjustments.

```mermaid
erDiagram
    meal_schedules {
        int id PK
        date meal_date
        meal_type_enum meal_type
        int menu_id
    }

    dishes {
        int id PK
        varchar name
        varchar status
    }

    users {
        int id PK
        varchar full_name
        varchar role
    }

    meal_demands {
        int id PK
        int meal_schedule_id FK "UK"
        date meal_date
        meal_type_enum meal_type
        int determined_quantity
        demand_determination_method_enum determination_method
        demand_status_enum status
        int determined_by FK
        datetime determined_at
        int confirmed_by FK
        datetime confirmed_at
        datetime created_at
        datetime updated_at
    }

    meal_demand_dish_quantities {
        int id PK
        int meal_demand_id FK
        int dish_id FK
        decimal expected_quantity
        varchar unit
        int calculated_by FK
        datetime calculated_at
    }

    meal_demand_changes {
        int id PK
        int meal_demand_id FK
        demand_change_type_enum change_type
        int old_quantity
        int new_quantity
        varchar reason
        int changed_by FK
        datetime changed_at
    }

    meal_schedules ||--|| meal_demands : "meal_schedule_id"
    users ||--o{ meal_demands : "determined_by / confirmed_by"
    meal_demands ||--o{ meal_demand_dish_quantities : "meal_demand_id"
    dishes ||--o{ meal_demand_dish_quantities : "dish_id"
    users ||--o{ meal_demand_dish_quantities : "calculated_by"
    meal_demands ||--o{ meal_demand_changes : "meal_demand_id"
    users ||--o{ meal_demand_changes : "changed_by"
```

---

## 4. Module 3: Meal Preparation

Transforms confirmed meal demands into executable kitchen preparation plans, allocates ingredients from pantry/inventory, tracks cooking output, and conducts quantity reconciliation.

```mermaid
erDiagram
    meal_demands {
        int id PK
        int meal_schedule_id FK
        int determined_quantity
        demand_status_enum status
    }

    meal_schedules {
        int id PK
        date meal_date
        meal_type_enum meal_type
    }

    dishes {
        int id PK
        varchar name
        varchar status
    }

    ingredients {
        int id PK
        varchar name
        varchar unit
    }

    users {
        int id PK
        varchar full_name
        varchar role
    }

    meal_preparation_plans {
        int id PK
        int meal_demand_id FK "UK"
        int meal_schedule_id FK
        date planned_date
        meal_type_enum meal_type
        prep_plan_status_enum status
        int planned_by FK
        datetime planned_at
    }

    meal_preparation_plan_dishes {
        int id PK
        int preparation_plan_id FK
        int dish_id FK
        decimal planned_quantity
        varchar unit
    }

    ingredient_allocations {
        int id PK
        int preparation_plan_id FK
        int ingredient_id FK
        decimal allocated_quantity
        varchar unit
        allocation_status_enum status
        int allocated_by FK
        datetime allocated_at
        varchar notes
    }

    meal_preparations {
        int id PK
        int preparation_plan_id FK "UK"
        int prepared_by FK
        prep_record_status_enum status
        datetime started_at
        datetime completed_at
        varchar notes
    }

    meal_preparation_dish_records {
        int id PK
        int meal_preparation_id FK
        int dish_id FK
        decimal prepared_quantity
        varchar unit
        datetime recorded_at
    }

    prepared_quantity_confirmations {
        int id PK
        int meal_preparation_dish_record_id FK
        decimal confirmed_quantity
        confirmation_status_enum confirmation_status
        varchar discrepancy_reason
        int confirmed_by FK
        datetime confirmed_at
    }

    meal_demands ||--|| meal_preparation_plans : "meal_demand_id"
    meal_schedules ||--o{ meal_preparation_plans : "meal_schedule_id"
    users ||--o{ meal_preparation_plans : "planned_by"
    meal_preparation_plans ||--o{ meal_preparation_plan_dishes : "preparation_plan_id"
    dishes ||--o{ meal_preparation_plan_dishes : "dish_id"
    meal_preparation_plans ||--o{ ingredient_allocations : "preparation_plan_id"
    ingredients ||--o{ ingredient_allocations : "ingredient_id"
    users ||--o{ ingredient_allocations : "allocated_by"
    meal_preparation_plans ||--|| meal_preparations : "preparation_plan_id"
    users ||--o{ meal_preparations : "prepared_by"
    meal_preparations ||--o{ meal_preparation_dish_records : "meal_preparation_id"
    dishes ||--o{ meal_preparation_dish_records : "dish_id"
    meal_preparation_dish_records ||--o{ prepared_quantity_confirmations : "meal_preparation_dish_record_id"
    users ||--o{ prepared_quantity_confirmations : "confirmed_by"
```
