# Data Dictionary

## Overview

This Data Dictionary defines the schema, types, constraints, and business lifecycle rules for the three implemented modules of the **Primary School Semi-Boarding Meal Management System**:
1. **Meal Participation Management**
2. **Meal Demand & Quantity Management**
3. **Meal Preparation**

---

## 1. Enumerations (Custom Types)

| Enum Name | Allowed Values | Business Meaning |
|---|---|---|
| `meal_type_enum` | `breakfast`, `lunch`, `dinner`, `snack` | Daily meal service categories |
| `participation_status_enum` | `pending`, `recorded`, `confirmed`, `cancelled` | Student meal consumption attendance lifecycle |
| `participation_change_type_enum` | `status_update`, `correction`, `reschedule` | Nature of attendance amendment in audit trail |
| `demand_determination_method_enum` | `participation_based`, `manual_forecast`, `historical_average` | Algorithm/source used to calculate headcount demand |
| `demand_status_enum` | `draft`, `calculated`, `confirmed`, `revised` | Operational stage of aggregated meal demand |
| `demand_change_type_enum` | `quantity_increase`, `quantity_decrease`, `dish_adjustment`, `cancellation` | Cause/type of post-confirmation demand alteration |
| `prep_plan_status_enum` | `planned`, `in_progress`, `completed`, `cancelled` | Execution lifecycle of the kitchen preparation plan |
| `allocation_status_enum` | `allocated`, `adjusted`, `returned` | State of warehouse ingredients reserved for cooking |
| `prep_record_status_enum` | `in_progress`, `completed` | Status of kitchen cooking batch execution |
| `confirmation_status_enum` | `matched`, `discrepancy` | Reconciliation result comparing planned vs prepared quantities |

---

## 2. Reference Tables (Simplified)

These tables act as external boundary references supporting foreign key relationships.

### `students`
*Represents student identity and semi-boarding eligibility.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Surrogate primary key |
| `full_name` | VARCHAR | | Student full legal name |
| `class_name` | VARCHAR | | Grade/Class descriptor (e.g., "1A") |
| `eligibility_status` | VARCHAR | | Semi-boarding entitlement status (e.g., "eligible", "suspended") |

### `users`
*System users, administrative personnel, homeroom teachers, kitchen leads, and supervisors.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | User identifier |
| `full_name` | VARCHAR | | Staff full name |
| `role` | VARCHAR | | Role classification (e.g., `teacher`, `chef`, `manager`, `supervisor`) |

### `meal_schedules`
*Master schedule defining meal sessions on specific dates.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Schedule identifier |
| `meal_date` | DATE | NOT NULL | Service calendar date |
| `meal_type` | `meal_type_enum` | NOT NULL | Meal session category (`breakfast`, `lunch`, `snack`, `dinner`) |
| `menu_id` | INTEGER | NULL | Reference to scheduled menu |

### `dishes`
*Master catalog of culinary recipes and menu items.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Dish identifier |
| `name` | VARCHAR | NOT NULL | Dish name (e.g., "Steamed Rice", "Braised Chicken") |
| `status` | VARCHAR | | Operational availability status (`active`, `archived`) |

### `ingredients`
*Pantry / inventory items consumed during meal preparation.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Ingredient identifier |
| `name` | VARCHAR | NOT NULL | Ingredient description (e.g., "White Jasmine Rice", "Chicken Thigh") |
| `unit` | VARCHAR | NOT NULL | Measurement unit (`kg`, `g`, `liter`, `can`) |

### `meal_registrations`
*Pre-registered student subscriptions to term/monthly meal sessions.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Registration record identifier |
| `student_id` | INTEGER | FK → `students(id)` | Registered student |
| `meal_schedule_id` | INTEGER | FK → `meal_schedules(id)` | Associated meal schedule |
| `status` | VARCHAR | | Subscription status (`active`, `on_leave`, `cancelled`) |

---

## 3. Module 1: Meal Participation Management

Captures daily student attendance, records consumption, maintains full change auditing, and logs supervisory sign-off.

### `meal_participations`
*Records that a student actually took part in or was marked absent for a specific scheduled meal.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Participation record surrogate key |
| `student_id` | INTEGER | NOT NULL, FK → `students(id)` | Student participating |
| `meal_schedule_id` | INTEGER | NOT NULL, FK → `meal_schedules(id)` | Scheduled meal session |
| `meal_registration_id` | INTEGER | NULL, FK → `meal_registrations(id)` | Subscription baseline link (if registered) |
| `meal_date` | DATE | NOT NULL | Operational date of the meal |
| `meal_type` | `meal_type_enum` | NOT NULL | Session type |
| `status` | `participation_status_enum` | NOT NULL, DEFAULT `'pending'` | Current participation state |
| `recorded_by` | INTEGER | NULL, FK → `users(id)` | Staff/Teacher who recorded attendance |
| `recorded_at` | TIMESTAMP | NULL | Attendance recording timestamp |
| `confirmed_by` | INTEGER | NULL, FK → `users(id)` | Supervisor/Lead confirming attendance |
| `confirmed_at` | TIMESTAMP | NULL | Verification timestamp |
| `notes` | VARCHAR | NULL | Special dietary notes, sudden absence reasons, or allergies |
| `created_at` | TIMESTAMP | DEFAULT `now()` | Record creation timestamp |
| `updated_at` | TIMESTAMP | NULL | Record last modification timestamp |

- **Indexes & Unique Constraints:**
  - `uq_student_meal_schedule`: `UNIQUE(student_id, meal_schedule_id)` ensures a student has at most one participation entry per scheduled meal session.
  - `INDEX(meal_date, meal_type)` optimizes daily aggregation queries for demand calculation.

### `meal_participation_changes`
*Immutable audit log capturing any amendment, cancellation, or correction to student meal participation.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Audit log entry ID |
| `meal_participation_id` | INTEGER | NOT NULL, FK → `meal_participations(id)` | Target participation record |
| `change_type` | `participation_change_type_enum` | NOT NULL | Action category (`status_update`, `correction`, `reschedule`) |
| `old_status` | `participation_status_enum` | NULL | Pre-change status |
| `new_status` | `participation_status_enum` | NULL | Post-change status |
| `reason` | VARCHAR | NULL | Justification for modification |
| `changed_by` | INTEGER | NOT NULL, FK → `users(id)` | User who executed the change |
| `changed_at` | TIMESTAMP | DEFAULT `now()` | Event timestamp |

---

## 4. Module 2: Meal Demand & Quantity Management

Determines consolidated headcount demand from confirmed participations, computes raw dish quantities using standard portion recipes, and logs quantity adjustments.

### `meal_demands`
*Aggregated daily demand headcount for a given scheduled meal session.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Demand record identifier |
| `meal_schedule_id` | INTEGER | NOT NULL, UNIQUE, FK → `meal_schedules(id)` | Target scheduled meal (1-to-1 relationship) |
| `meal_date` | DATE | NOT NULL | Calendar date |
| `meal_type` | `meal_type_enum` | NOT NULL | Session meal type |
| `determined_quantity` | INTEGER | NOT NULL | Total headcount / meal portions required |
| `determination_method` | `demand_determination_method_enum` | NOT NULL, DEFAULT `'participation_based'` | Derivation logic used |
| `status` | `demand_status_enum` | NOT NULL, DEFAULT `'draft'` | Lifecycle state (`draft`, `calculated`, `confirmed`, `revised`) |
| `determined_by` | INTEGER | NULL, FK → `users(id)` | User who ran or triggered calculation |
| `determined_at` | TIMESTAMP | NULL | Calculation completion timestamp |
| `confirmed_by` | INTEGER | NULL, FK → `users(id)` | Meal manager confirming final count |
| `confirmed_at` | TIMESTAMP | NULL | Final sign-off timestamp |
| `created_at` | TIMESTAMP | DEFAULT `now()` | Creation timestamp |
| `updated_at` | TIMESTAMP | NULL | Last update timestamp |

- **Indexes & Unique Constraints:**
  - `UNIQUE(meal_schedule_id)` guarantees a single authoritative demand figure per scheduled meal session.

### `meal_demand_dish_quantities`
*Disaggregates headcount demand into expected volume or weight per menu dish.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Dish calculation ID |
| `meal_demand_id` | INTEGER | NOT NULL, FK → `meal_demands(id)` | Parent demand record |
| `dish_id` | INTEGER | NOT NULL, FK → `dishes(id)` | Menu dish being quantified |
| `expected_quantity` | DECIMAL | NOT NULL | Calculated amount (`determined_quantity × portion_size`) |
| `unit` | VARCHAR | NOT NULL | Measurement unit (`servings`, `kg`, `liters`) |
| `calculated_by` | INTEGER | NULL, FK → `users(id)` | Staff member calculating portion requirements |
| `calculated_at` | TIMESTAMP | DEFAULT `now()` | Calculation timestamp |

- **Indexes & Unique Constraints:**
  - `uq_demand_dish`: `UNIQUE(meal_demand_id, dish_id)` prevents redundant dish calculations for the same demand record.

### `meal_demand_changes`
*Audit trail tracking modifications made to determined meal demand.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Change entry ID |
| `meal_demand_id` | INTEGER | NOT NULL, FK → `meal_demands(id)` | Target demand record |
| `change_type` | `demand_change_type_enum` | NOT NULL | Categorization (`quantity_increase`, `quantity_decrease`, `dish_adjustment`, `cancellation`) |
| `old_quantity` | INTEGER | NULL | Previous demand headcount |
| `new_quantity` | INTEGER | NULL | Revised demand headcount |
| `reason` | VARCHAR | NULL | Operational justification (e.g., unexpected school activity, class field trip) |
| `changed_by` | INTEGER | NOT NULL, FK → `users(id)` | Authorized manager initiating change |
| `changed_at` | TIMESTAMP | DEFAULT `now()` | Modification timestamp |

---

## 5. Module 3: Meal Preparation

Manages the operational lifecycle in the kitchen: planning, pantry ingredient allocation, cooking execution, and portion verification.

### `meal_preparation_plans`
*Kitchen preparation plan seeded from a confirmed meal demand.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Prep plan ID |
| `meal_demand_id` | INTEGER | NOT NULL, UNIQUE, FK → `meal_demands(id)` | Source confirmed meal demand |
| `meal_schedule_id` | INTEGER | NOT NULL, FK → `meal_schedules(id)` | Associated scheduled meal |
| `planned_date` | DATE | NOT NULL | Target cooking date |
| `meal_type` | `meal_type_enum` | NOT NULL | Meal session |
| `status` | `prep_plan_status_enum` | NOT NULL, DEFAULT `'planned'` | Execution status (`planned`, `in_progress`, `completed`, `cancelled`) |
| `planned_by` | INTEGER | NULL, FK → `users(id)` | Kitchen manager / head chef planner |
| `planned_at` | TIMESTAMP | DEFAULT `now()` | Plan generation timestamp |

- **Indexes & Unique Constraints:**
  - `UNIQUE(meal_demand_id)` enforces that one confirmed demand corresponds to exactly one preparation plan.

### `meal_preparation_plan_dishes`
*Dish-level breakdown of quantities required by the preparation plan.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Prep plan dish item ID |
| `preparation_plan_id` | INTEGER | NOT NULL, FK → `meal_preparation_plans(id)` | Parent preparation plan |
| `dish_id` | INTEGER | NOT NULL, FK → `dishes(id)` | Target dish |
| `planned_quantity` | DECIMAL | NOT NULL | Planned production quantity |
| `unit` | VARCHAR | NOT NULL | Portion or weight metric (`servings`, `kg`, `trays`) |

- **Indexes & Unique Constraints:**
  - `uq_plan_dish`: `UNIQUE(preparation_plan_id, dish_id)` ensures unique dish entries per plan.

### `ingredient_allocations`
*Inventory reservation recording raw ingredients allocated for the prep plan.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Allocation record ID |
| `preparation_plan_id` | INTEGER | NOT NULL, FK → `meal_preparation_plans(id)` | Associated preparation plan |
| `ingredient_id` | INTEGER | NOT NULL, FK → `ingredients(id)` | Ingredient drawn from inventory |
| `allocated_quantity` | DECIMAL | NOT NULL | Weight / volume reserved |
| `unit` | VARCHAR | NOT NULL | Ingredient storage unit (`kg`, `liters`, `pieces`) |
| `status` | `allocation_status_enum` | NOT NULL, DEFAULT `'allocated'` | Allocation state (`allocated`, `adjusted`, `returned`) |
| `allocated_by` | INTEGER | NULL, FK → `users(id)` | Warehouse keeper / inventory clerk |
| `allocated_at` | TIMESTAMP | DEFAULT `now()` | Allocation timestamp |
| `notes` | VARCHAR | NULL | Storage lot number, expiry date, or return reasons |

### `meal_preparations`
*Actual cooking session tracking the batch execution in the kitchen.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Preparation execution record ID |
| `preparation_plan_id` | INTEGER | NOT NULL, UNIQUE, FK → `meal_preparation_plans(id)` | Associated preparation plan |
| `prepared_by` | INTEGER | NULL, FK → `users(id)` | Head cook / shift leader |
| `status` | `prep_record_status_enum` | NOT NULL, DEFAULT `'in_progress'` | Cooking execution status (`in_progress`, `completed`) |
| `started_at` | TIMESTAMP | NULL | Cooking start timestamp |
| `completed_at` | TIMESTAMP | NULL | Cooking completion timestamp |
| `notes` | VARCHAR | NULL | Culinary notes, temperature checks, or cooking observations |

- **Indexes & Unique Constraints:**
  - `UNIQUE(preparation_plan_id)` links one preparation run to one plan.

### `meal_preparation_dish_records`
*Actual yield recorded for each dish upon completing kitchen production.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Produced dish yield ID |
| `meal_preparation_id` | INTEGER | NOT NULL, FK → `meal_preparations(id)` | Cooking execution record |
| `dish_id` | INTEGER | NOT NULL, FK → `dishes(id)` | Cooked dish |
| `prepared_quantity` | DECIMAL | NOT NULL | Actual measured yield output |
| `unit` | VARCHAR | NOT NULL | Unit of output (`servings`, `kg`, `trays`) |
| `recorded_at` | TIMESTAMP | DEFAULT `now()` | Yield measurement timestamp |

- **Indexes & Unique Constraints:**
  - `uq_prep_dish`: `UNIQUE(meal_preparation_id, dish_id)` prevents duplicate records for the same dish within a prep session.

### `prepared_quantity_confirmations`
*Supervisory verification and discrepancy resolution comparing planned vs produced output.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto-increment | Confirmation record ID |
| `meal_preparation_dish_record_id` | INTEGER | NOT NULL, FK → `meal_preparation_dish_records(id)` | Inspected dish yield record |
| `confirmed_quantity` | DECIMAL | NOT NULL | Verified and accepted quantity |
| `confirmation_status` | `confirmation_status_enum` | NOT NULL | Matching result (`matched`, `discrepancy`) |
| `discrepancy_reason` | VARCHAR | NULL | Explanation if discrepancy arises (e.g., cooking spillage, kitchen shrinkage) |
| `confirmed_by` | INTEGER | NOT NULL, FK → `users(id)` | Quality controller / semi-boarding supervisor |
| `confirmed_at` | TIMESTAMP | DEFAULT `now()` | Sign-off timestamp |

---

## 6. Business Lifecycle & State Transitions

### 6.1 Meal Participation Lifecycle
```
[Pending]
   │
   ▼ (Homeroom Teacher takes attendance)
[Recorded]
   │
   ▼ (Supervisor / Head Teacher verifies)
[Confirmed]
   │
   └──► [Cancelled] (Emergency absence / student excused)
```
- Every update to `status` must append an audit record to `meal_participation_changes`.

### 6.2 Meal Demand Lifecycle
```
[Draft]
   │
   ▼ (System aggregates confirmed meal_participations)
[Calculated]
   │
   ▼ (Meal Manager reviews and accepts headcount)
[Confirmed]
   │
   └──► [Revised] (Approved change requests logged in meal_demand_changes)
```

### 6.3 Kitchen Preparation Lifecycle
```
Meal Demand [Confirmed]
   │
   ▼
Preparation Plan [Planned] ──► Ingredient Allocation [Allocated]
   │
   ▼ (Shift begins cooking)
Meal Preparation [In Progress]
   │
   ▼ (Dishes cooked and plated)
Meal Preparation [Completed] ──► Record Yield (`meal_preparation_dish_records`)
   │
   ▼
Quantity Confirmation (`prepared_quantity_confirmations`) [Matched / Discrepancy]
```
