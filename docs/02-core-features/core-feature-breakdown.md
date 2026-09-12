# Core Feature Breakdown

This document defines the detailed feature breakdown for the **three active core operational modules** of the Primary School Semi-Boarding Meal Management System, derived directly from the Top-Down Mind Map and fully aligned with the Database Architecture ([Phase 06](../06-database/README.md)).

---

## Module 1 — Meal Participation Management

Captures daily student attendance, meal registration status, updates, and supervisor verification.

### Capabilities & Features

| Feature ID | Feature Name | Priority | Associated DB Entities |
|---|---|---|---|
| **F-PAR-01** | Record Daily Student Meal Participation | P1 (MVP) | `meal_participations`, `students`, `meal_schedules` |
| **F-PAR-02** | Track Participation Changes & Amendments | P1 (MVP) | `meal_participation_changes` |
| **F-PAR-03** | Verify & Confirm Participation Roster | P1 (MVP) | `meal_participations` (status: `confirmed`) |
| F-PAR-04 | Bulk Import & Recurring Absence Sync | P2 (Backlog) | `meal_participations` |

### Feature Descriptions

#### **F-PAR-01 — Record Daily Student Meal Participation**
> Homeroom teachers or class supervisors record each student's meal participation for scheduled meal sessions (Breakfast, Lunch, Snack, Dinner). 
> - Status values: `pending`, `recorded`, `confirmed`, `cancelled`.
> - Records student ID, meal schedule ID, initial status, and the user who logged the attendance.

#### **F-PAR-02 — Track Participation Changes & Amendments**
> When a student's participation status changes (e.g. sick leave reported, late arrival, extra guest), the system captures the modification with full audit trails.
> - Change types: `status_update`, `correction`, `reschedule`.
> - Logs `previous_status`, `new_status`, `change_reason`, timestamp, and the user who performed the change.

#### **F-PAR-03 — Verify & Confirm Participation Roster**
> Supervisors or lead teachers review and lock the class participation list prior to the operational cutoff time.
> - Updates participation status to `confirmed` with `confirmed_by` user reference.
> - Freezes normal edits and triggers demand aggregation for Module 2.

---

## Module 2 — Meal Demand & Quantity Management

Aggregates class-level participation into meal session headcounts, computes required dish quantities, and processes post-lock amendments.

### Capabilities & Features

| Feature ID | Feature Name | Priority | Associated DB Entities |
|---|---|---|---|
| **F-DMD-01** | Determine Aggregated Meal Demand | P1 (MVP) | `meal_demands`, `meal_schedules` |
| **F-DMD-02** | Calculate Expected Dish Quantities | P1 (MVP) | `meal_demand_dish_quantities`, `dishes` |
| **F-DMD-03** | Process Post-Lock Demand Adjustments | P1 (MVP) | `meal_demand_changes`, `meal_demands` |
| F-DMD-04 | Historical Demand Trend Forecasting | P2 (Backlog) | `meal_demands` (`historical_average`) |

### Feature Descriptions

#### **F-DMD-01 — Determine Aggregated Meal Demand**
> The Meal/Nutrition Manager aggregates confirmed student participation counts for a given meal schedule into total demand headcounts.
> - Determination methods: `participation_based`, `manual_forecast`, `historical_average`.
> - Lifecycle statuses: `draft` → `calculated` → `confirmed` → `revised`.
> - Tracks headcount figures (`total_headcount`, `buffer_percentage`, `final_demand_count`).

#### **F-DMD-02 — Calculate Expected Dish Quantities**
> Translates the final approved headcount into planned quantities for each dish on the scheduled menu.
> - Formula: $\text{Planned Quantity} = \text{Final Headcount} \times \text{Standard Portion Size} \times (1 + \text{Buffer\%})$
> - Stores `expected_quantity`, portion unit (e.g. grams, bowls, pieces), and any manual nutritionist adjustments in `meal_demand_dish_quantities`.

#### **F-DMD-03 — Process Post-Lock Demand Adjustments**
> After demand is locked/confirmed, any subsequent emergency changes (e.g., unexpected classroom absence, sudden school event) are submitted as formal change requests.
> - Change types: `quantity_increase`, `quantity_decrease`, `dish_adjustment`, `cancellation`.
> - Tracks `previous_quantity`, `new_quantity`, `reason`, `requested_by`, and `reviewed_by`. Approved changes transition demand status to `revised`.

---

## Module 3 — Meal Preparation

Translates meal demand into kitchen execution plans, tracks ingredient allocation, monitors cooking batches, and reconciles finished dishes against targets.

### Capabilities & Features

| Feature ID | Feature Name | Priority | Associated DB Entities |
|---|---|---|---|
| **F-PRP-01** | Create & Schedule Meal Preparation Plan | P1 (MVP) | `meal_preparation_plans`, `meal_preparation_plan_dishes` |
| **F-PRP-02** | Allocate Ingredients from Storage | P1 (MVP) | `ingredient_allocations`, `ingredients` |
| **F-PRP-03** | Record Kitchen Cooking Batches | P1 (MVP) | `meal_preparations`, `meal_preparation_dish_records` |
| **F-PRP-04** | Verify Prepared Quantities & Discrepancies | P1 (MVP) | `prepared_quantity_confirmations` |
| F-PRP-05 | Kitchen Temperature & Safety Sample Logging | P2 (Backlog) | `meal_preparations` (Food Safety link) |

### Feature Descriptions

#### **F-PRP-01 — Create & Schedule Meal Preparation Plan**
> Kitchen managers convert approved meal demands into a structured kitchen shift plan.
> - Plan status lifecycle: `planned` → `in_progress` → `completed` → `cancelled`.
> - Links to `meal_demands` and breaks down required cooking targets across each dish in `meal_preparation_plan_dishes`.

#### **F-PRP-02 — Allocate Ingredients from Storage**
> Reserves and issues necessary raw ingredients from the pantry/storage to kitchen stations for each preparation plan.
> - Tracks `ingredient_id`, `allocated_quantity`, and `allocation_status` (`allocated`, `adjusted`, `returned`).
> - Ensures the kitchen team has exact verified stock before cooking starts.

#### **F-PRP-03 — Record Kitchen Cooking Batches**
> Kitchen staff record cooking start and finish times, batch numbers, and actual yield produced per dish.
> - Tracks batch execution status: `in_progress` → `completed`.
> - Yields granular dish output in `meal_preparation_dish_records` (`actual_prepared_quantity`).

#### **F-PRP-04 — Verify Prepared Quantities & Discrepancies**
> Kitchen lead or meal inspector conducts quality and quantity checks on the cooked food against the planned demand.
> - Confirmation status: `matched` vs. `discrepancy`.
> - Mandatory `discrepancy_reason` if yield falls below or exceeds acceptable tolerance thresholds.
> - Formal sign-off stored in `prepared_quantity_confirmations` (`confirmed_quantity`, `confirmed_by`, `confirmed_at`).

---

## Reference & Deferred Capabilities Summary

| Boundary Domain | Handled By | Scope Status in Phase 1 |
|---|---|---|
| Student Master & Class Roster | `students` table | Reference only (read-only for daily ops) |
| Academic Calendar & Session Setup | `meal_schedules` table | Reference only |
| Dish & Recipe Catalog | `dishes` table | Reference only |
| Ingredient Master Catalog | `ingredients` table | Reference only |
| Food Safety Inspections | External / Future module | Phase 2 Backlog |
| Monthly Invoicing & Fee Collection | External / Future module | Phase 2 Backlog |
