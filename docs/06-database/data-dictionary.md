# Data Dictionary

## Overview

All tables and their columns are documented here with:
- **Data type** and constraints
- **Business meaning**
- **Core Feature traceability**

---

## `classes`

**Feature:** F-STU-01 — Manage Student Meal Eligibility

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | int | PK, auto-increment | Surrogate key |
| `class_name` | varchar | NOT NULL | Display name, e.g. "Class 1A" |
| `grade_level` | varchar | | Grade level, e.g. "Grade 1" |
| `school_year` | varchar | | School year, e.g. "2026–2027" |

---

## `students`

**Feature:** F-STU-01 — Manage Student Meal Eligibility

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | int | PK | Surrogate key |
| `student_code` | varchar | UNIQUE | School-assigned student ID |
| `full_name` | varchar | | Student full name |
| `class_id` | int | FK → classes | The class the student is assigned to |
| `status` | varchar | | `active` / `inactive` / `transferred` |

---

## `meal_sessions`

**Feature:** System configuration; drives cutoff logic for F-MOP-01

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | int | PK | Surrogate key |
| `code` | varchar | UNIQUE | Machine code: `breakfast`, `lunch`, `snack`, `dinner` |
| `name` | varchar | | Human display name |
| `start_time` | time | | When the meal is served |
| `end_time` | time | | When the meal service ends |
| `registration_cutoff_time` | time | | Deadline for attendance submission |
| `is_active` | boolean | DEFAULT true | Whether this session is in use |

---

## `meal_registrations`

**Feature:** F-STU-02 — Register Student for Meal Session

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | int | PK | Surrogate key |
| `student_id` | int | FK → students | The registered student |
| `meal_session_id` | int | FK → meal_sessions | Which meal session they participate in |
| `effective_from` | date | | Registration start date |
| `effective_to` | date | | Registration end date (null = ongoing) |
| `status` | varchar | | `active` / `suspended` / `cancelled` |

**Business Rule:** `base_registered_count` in `daily_meal_demands` is a snapshot count of active `meal_registrations` for the class + session at demand creation time.

---

## `dishes`

**Feature:** F-MPN-02 — Assign Dishes & Standard Portions (catalog input)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | int | PK | Surrogate key |
| `dish_name` | varchar | | e.g., "Steamed Rice", "Pork Soup" |
| `category` | varchar | | `Main` / `Staple` / `Soup` / `Vegetable` / `Dessert` |

---

## `menus`

**Feature:** F-MPN-01, F-MPN-03 — Design and Publish Menu

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | int | PK | Surrogate key |
| `menu_date` | date | | The date this menu applies to |
| `meal_session_id` | int | FK → meal_sessions | Which meal session |
| `status` | varchar | | `draft` → `approved` → `published` |

**State Machine:** `draft` (editable) → `approved` (reviewed) → `published` (locked for calculation). Only `published` menus are used in demand quantity calculation.

---

## `menu_dishes`

**Feature:** F-MPN-02, F-MPN-04 — Assign Dishes & Calculate Quantities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | int | PK | Surrogate key |
| `menu_id` | int | FK → menus | Parent menu |
| `dish_id` | int | FK → dishes | The dish |
| `standard_portion_size` | decimal | | Portion size per student (e.g., 150 for 150g) |
| `unit` | varchar | | Unit of measure: `g`, `ml`, `piece` |

---

## `daily_meal_demands`

**Feature:** F-MOP-01 — Determine Meal Demand (with Cutoff Lock)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | int | PK | Surrogate key |
| `demand_date` | date | | The date of the meal demand |
| `meal_session_id` | int | FK → meal_sessions | Which session |
| `class_id` | int | FK → classes | Which class |
| `base_registered_count` | int | | Snapshot of registered students at creation |
| `confirmed_attend_count` | int | | Live-updated: students marked Attend |
| `absence_count` | int | DEFAULT 0 | Students marked Absent |
| `extra_count` | int | DEFAULT 0 | Extra guests (staff, monitors) |
| `determination_status` | enum | | `draft` / `confirmed` / `locked` |
| `determined_by` | int | | user_id of the teacher who submitted |
| `determined_at` | datetime | | When the class submitted attendance |
| `locked_at` | datetime | | When the demand was locked (at or after cutoff) |

**Unique Constraint:** `(demand_date, meal_session_id, class_id)` — one record per class per session per day.

---

## `daily_meal_demand_details`

**Feature:** F-STU-03 — Record Daily Meal Participation, F-MOP-01

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | int | PK | Surrogate key |
| `daily_meal_demand_id` | int | FK → daily_meal_demands | Parent demand record |
| `student_id` | int | FK → students | The student |
| `intention` | enum | | `attend` / `absent` / `extra_guest` |
| `reason` | varchar | | Required when intention = `absent` |
| `reported_by` | int | | user_id of the reporter (teacher / parent) |
| `reported_at` | datetime | | Submission timestamp |
| `is_within_cutoff` | boolean | | `true` if submitted before `registration_cutoff_time` |

**Unique Constraint:** `(daily_meal_demand_id, student_id)` — one row per student per demand.

---

## `expected_meal_quantities`

**Feature:** F-MPN-04 — Calculate Meal Demand Quantities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | int | PK | Surrogate key |
| `daily_meal_demand_id` | int | FK → daily_meal_demands | Source demand |
| `menu_dish_id` | int | FK → menu_dishes | The dish |
| `planned_headcount` | int | | `confirmed_attend_count + extra_count` at calculation time |
| `unit_portion_size` | decimal | | Copied from `menu_dishes.standard_portion_size` |
| `unit` | varchar | | `g`, `ml`, `piece` |
| `buffer_percentage` | decimal | DEFAULT 0 | Shrinkage/surplus buffer (0–20%) |
| `total_quantity` | decimal | | `planned_headcount × unit_portion_size × (1 + buffer_percentage)` |
| `calculation_method` | enum | | `auto` (system-triggered) / `manual` (MGR override) |
| `calculated_by` | int | | user_id; null if auto |
| `calculated_at` | datetime | | Calculation timestamp |

**Unique Constraint:** `(daily_meal_demand_id, menu_dish_id)` — one row per dish per demand.

---

## `meal_demand_change_requests`

**Feature:** F-MOP-02 — Manage Post-Cutoff Change Requests

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | int | PK | Surrogate key |
| `daily_meal_demand_id` | int | FK → daily_meal_demands | Demand being modified |
| `student_id` | int | FK → students, nullable | Specific student (null for class-level changes) |
| `change_type` | enum | | `add` / `cancel` / `modify_quantity` / `absence` / `extra_guest` |
| `requested_quantity_delta` | int | | Signed: `+1` (add), `-1` (remove) |
| `reason` | varchar | | Justification required |
| `requested_by` | int | | user_id of the requester (TCH) |
| `requested_at` | datetime | | Submission timestamp |
| `is_emergency` | boolean | DEFAULT false | `true` if submitted > 30 min after cutoff |
| `approval_status` | enum | DEFAULT 'pending' | `pending` / `approved` / `rejected` |
| `approved_by` | int | | user_id of the approver (MGR) |
| `approved_at` | datetime | | Approval/rejection timestamp |

---

## `meal_demand_change_logs`

**Feature:** F-MOP-02 — Audit Trail

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | int | PK | Surrogate key |
| `change_request_id` | int | FK → meal_demand_change_requests | Source change request |
| `daily_meal_demand_id` | int | FK → daily_meal_demands | Demand affected |
| `field_changed` | varchar | | e.g., `confirmed_attend_count`, `total_quantity` |
| `old_value` | varchar | | Value before change |
| `new_value` | varchar | | Value after change |
| `changed_by` | int | | user_id who made the change |
| `changed_at` | datetime | | When the change occurred |
| `note` | varchar | | Optional explanation |

**Immutability Rule:** This table is append-only. No `UPDATE` or `DELETE` operations are permitted. Application-layer constraint.
