# Core Features Specification — INVEST Criteria & Acceptance Criteria

This document formally specifies the software requirements for all **10 Core Operational Features (P1 — MVP)** across the three active modules of the Primary School Semi-Boarding Meal Management System. Every feature is structured under the **INVEST** framework (Independent, Negotiable, Valuable, Estimable, Small, Testable), augmented with BDD/Gherkin acceptance criteria, and cross-referenced with the Relational Database Architecture ([Phase 06](../06-database/README.md)) and Actor Use Cases ([Phase 03](../03-roles-usecases/README.md)).

---

## 1. The INVEST Framework Applied to Semi-Boarding Meal Operations

| Criterion | Definition & Operational Context in School Meal Management |
|---|---|
| **I — Independent** | User stories are decoupled across module boundaries. Teachers can record attendance without waiting on kitchen prep schedules; chefs can record cooking batches without querying student enrollment records directly. |
| **N — Negotiable** | Operational parameters (e.g., daily cutoff times, safety buffer percentages, quantity discrepancy tolerances) remain configurable business parameters rather than hard-coded logic. |
| **V — Valuable** | Directly eliminates food waste, prevents allergen exposure incidents, provides transparent audit trails for monthly parent billing, and guarantees nutritional portion standards. |
| **E — Estimable** | Explicit data boundaries and state machines allow engineering teams to size complexity accurately using Story Points (Fibonacci scale). |
| **S — Small** | Sized to fit comfortably within a standard two-week development sprint (all core stories range between 2 to 5 Story Points). |
| **T — Testable** | Accompanied by unambiguous, binary pass/fail Acceptance Criteria written in Given-When-Then (Gherkin) syntax. |

---

## 2. Module 1 — Meal Participation Management (`F-PAR`)

### US-PAR-01: Record Daily Student Meal Attendance
- **Feature ID:** `F-PAR-01` | **Use Case:** `UC-TCH-01` | **Primary Entity:** `meal_participations`
- **User Story:**
  > **As a** Homeroom Teacher,  
  > **I want to** log the meal attendance status (`recorded` or `cancelled`) for each student in my classroom across scheduled meal sessions (Breakfast, Lunch, Snack),  
  > **So that** the school has an accurate, real-time headcount to guide kitchen preparation and student safety.

#### INVEST Evaluation:
- **I (Independent):** Consumes baseline roster data from `students` and `meal_schedules`. Does not depend on downstream demand aggregation or kitchen status.
- **N (Negotiable):** Supports "Quick Mark All Present" with single-click exceptions, or granular student-by-student toggles.
- **V (Valuable):** Establishes the authoritative primary source of truth for headcount and food allergy safeguards.
- **E (Estimable):** **3 Story Points** (Classroom grid UI + bulk toggle state + batch upsert mutation).
- **S (Small):** Deliverable within 1 sprint on both tablet and desktop viewports.
- **T (Testable):** Verified via Gherkin scenarios below.

```gherkin
Scenario: Successfully recording full classroom meal attendance
  Given the Homeroom Teacher is on the attendance screen for Class 1A lunch session
  And the current time is before the daily cutoff deadline (08:30 AM)
  When the teacher marks 30 students as "Eating" and 2 students as "Absent"
  And the teacher clicks "Save Attendance"
  Then the system persists 32 records in `meal_participations` with status `recorded`
  And a confirmation message "Class 1A attendance recorded successfully" is displayed

Scenario: Highlighting medical dietary alerts during attendance
  Given student "Alice Nguyen" has a recorded peanut allergy in `students.allergies_notes`
  When the teacher toggles "Alice Nguyen" to "Eating"
  Then an orange dietary warning badge appears beside the student's name
  And the allergy flag is propagated to the participation reference
```

---

### US-PAR-02: Track Attendance Status Amendments & Audit Trail
- **Feature ID:** `F-PAR-02` | **Use Case:** `UC-TCH-02` | **Primary Entity:** `meal_participation_changes`
- **User Story:**
  > **As a** Homeroom Teacher,  
  > **I want to** record modifications to a student's participation status after initial entry along with a mandatory reason,  
  > **So that** the system maintains an immutable audit trail for month-end parent reconciliation and compliance.

#### INVEST Evaluation:
- **I (Independent):** Requires an existing `meal_participations` entry; appends an immutable record into `meal_participation_changes`.
- **N (Negotiable):** Reasons can be selected from standard presets (Sick, Early Pickup, Late Arrival) or entered as custom notes.
- **V (Valuable):** Eliminates parent billing disputes and identifies chronic absenteeism patterns.
- **E (Estimable):** **2 Story Points** (Modal dialog + mutation trigger appending audit log).
- **S (Small):** Deliverable within 1 sprint.
- **T (Testable):**

```gherkin
Scenario: Logging an attendance amendment before cutoff
  Given an attendance record exists for "Bob Tran" with status `recorded`
  And the current time is 08:15 AM (prior to 08:30 AM cutoff)
  When the teacher changes the status to `cancelled`
  And selects reason "Reported sudden fever at 08:10 AM"
  Then the system updates `meal_participations.participation_status = 'cancelled'`
  And inserts a record into `meal_participation_changes` with:
    | Field            | Value                       |
    | previous_status  | recorded                    |
    | new_status       | cancelled                   |
    | change_type      | status_update               |
    | change_reason    | Reported sudden fever...    |
    | created_by       | <teacher_user_id>           |
```

---

### US-PAR-03: Verify and Lock Classroom Participation Roster
- **Feature ID:** `F-PAR-03` | **Use Case:** `UC-TCH-03` | **Primary Entity:** `meal_participations` (`confirmed`)
- **User Story:**
  > **As a** Homeroom Teacher or Grade Supervisor,  
  > **I want to** formally confirm and freeze the classroom meal roster before the daily cutoff deadline (08:30 AM),  
  > **So that** the attendance headcount is officially handed over to the Nutrition Manager for demand aggregation.

#### INVEST Evaluation:
- **I (Independent):** Acts as the boundary gatekeeper between Classroom Management and Kitchen Demand Aggregation.
- **N (Negotiable):** System can support manual sign-off and scheduled auto-locking for classes whose teachers failed to click lock.
- **V (Valuable):** Enforces operational discipline, preventing uncoordinated headcount shifts while kitchen staff are prepping.
- **E (Estimable):** **3 Story Points** (Roster validation logic + state transition + scheduled auto-freeze job).
- **S (Small):** Deliverable within 1 sprint.
- **T (Testable):**

```gherkin
Scenario: Classroom roster locked on manual submission
  Given all 32 students in Class 2B have an assigned attendance status
  And the current time is 08:25 AM
  When the teacher clicks "Confirm & Lock Roster"
  Then all participation records for Class 2B transition to `participation_status = 'confirmed'`
  And the system records `confirmed_by` and `confirmed_at` timestamps
  And the classroom view becomes strictly Read-Only

Scenario: Direct edits rejected after cutoff deadline
  Given the cutoff deadline (08:30 AM) has passed
  When a teacher attempts to modify an attendance toggle directly
  Then the system displays an error dialog: "Roster locked. Submit an Emergency Demand Adjustment (F-DMD-03) for manager approval"
  And no changes are written to `meal_participations`
```

---

## 3. Module 2 — Meal Demand & Quantity Management (`F-DMD`)

### US-DMD-01: Aggregate Confirmed Headcount & Safety Buffer
- **Feature ID:** `F-DMD-01` | **Use Case:** `UC-MGR-01` | **Primary Entity:** `meal_demands`
- **User Story:**
  > **As a** Meal & Nutrition Manager,  
  > **I want to** automatically aggregate confirmed student attendance into a session-level demand and apply a configurable safety buffer,  
  > **So that** the school establishes an authorized target headcount that accounts for sudden guest teachers and overflow.

#### INVEST Evaluation:
- **I (Independent):** Reads confirmed records from `meal_participations` and computes a decoupled demand record.
- **N (Negotiable):** Calculation methods (`participation_based`, `manual_forecast`, `historical_average`) and buffer percentages (default 3–5%) are adjustable.
- **V (Valuable):** Eliminates manual error-prone tallying across dozens of classrooms; prevents both food shortages and food waste.
- **E (Estimable):** **5 Story Points** (Aggregation engine + buffer mathematical rules + state lifecycle: `draft` → `calculated` → `confirmed`).
- **S (Small):** Deliverable within 1 sprint.
- **T (Testable):**

```gherkin
Scenario: Automatic aggregation with a 5% safety buffer
  Given 20 out of 20 classrooms have confirmed their attendance for today's lunch
  And the sum of all confirmed student headcounts is exactly 600
  When the Nutrition Manager computes demand using `participation_based` with a 5% buffer
  Then the system calculates Base Headcount = 600
  And calculates Final Demand Count = round(600 * 1.05) = 630
  And creates a `meal_demands` record with `demand_status = 'calculated'`
```

---

### US-DMD-02: Calculate Expected Raw Dish Quantities
- **Feature ID:** `F-DMD-02` | **Use Case:** `UC-MGR-02` | **Primary Entity:** `meal_demand_dish_quantities`
- **User Story:**
  > **As a** Meal & Nutrition Manager,  
  > **I want to** convert the approved final headcount into specific ingredient and dish quantities using standard nutritional portion sizes,  
  > **So that** the Head Chef knows the precise production volumes required for cooking.

#### INVEST Evaluation:
- **I (Independent):** Consumes `final_demand_count` from `US-DMD-01` and standard recipes from `dishes`.
- **N (Negotiable):** Nutritionists can apply manual rounding overrides (e.g., rounding $62.4\text{ kg}$ of pork to $63.0\text{ kg}$).
- **V (Valuable):** Guarantees that caloric and nutritional standards per student age bracket are strictly maintained.
- **E (Estimable):** **3 Story Points** (Formula engine + unit conversions + manual override grid).
- **S (Small):** Deliverable within 1 sprint.
- **T (Testable):**

$$\text{Planned Quantity} = \text{Final Headcount} \times \text{Standard Portion Size} \times (1 + \text{Buffer\%})$$

```gherkin
Scenario: Calculating dish quantities for 630 meals
  Given an approved demand with `final_demand_count = 630`
  And the menu includes "Braised Pork with Eggs" (Standard portion: 100g pork, 1 egg per student)
  When the system calculates dish requirements
  Then `meal_demand_dish_quantities` stores:
    | Dish / Component | Expected Quantity | Unit  |
    | Pork Shoulder    | 63.0              | kg    |
    | Fresh Eggs       | 630               | piece |
```

---

### US-DMD-03: Process Post-Cutoff Emergency Demand Adjustments
- **Feature ID:** `F-DMD-03` | **Use Cases:** `UC-TCH-04`, `UC-MGR-03` | **Primary Entity:** `meal_demand_changes`
- **User Story:**
  > **As a** Homeroom Teacher or Nutrition Manager,  
  > **I want to** submit and review formal emergency change requests after the cutoff deadline,  
  > **So that** sudden changes (e.g., bus breakdown, visiting district inspection team) can be accommodated without compromising data integrity.

#### INVEST Evaluation:
- **I (Independent):** Isolated workflow; when approved, it triggers a delta update onto `meal_demands`.
- **N (Negotiable):** The manager can fully approve, partially approve, or reject requests with explanation notes.
- **V (Valuable):** Provides operational flexibility while preventing unauthorized, untracked kitchen overproduction.
- **E (Estimable):** **5 Story Points** (Request submission form + approval queue + delta re-aggregation).
- **S (Small):** Deliverable within 1 sprint.
- **T (Testable):**

```gherkin
Scenario: Approving an emergency increase of 5 meals
  Given the daily demand has been locked at 630 meals
  When a teacher submits an emergency request for +5 meals with reason "District evaluation team visiting"
  And the Nutrition Manager reviews kitchen capacity and clicks "Approve"
  Then the system updates `meal_demand_changes.status = 'approved'`
  And increments `meal_demands.final_demand_count` from 630 to 635
  And transitions `meal_demands.demand_status` to `'revised'`
  And broadcasts an urgent push notification to the kitchen kiosk
```

---

## 4. Module 3 — Meal Preparation Execution (`F-PRP`)

### US-PRP-01: Create and Schedule Kitchen Shift Preparation Plan
- **Feature ID:** `F-PRP-01` | **Use Cases:** `UC-MGR-04`, `UC-KIT-01` | **Primary Entity:** `meal_preparation_plans`
- **User Story:**
  > **As a** Head Chef / Kitchen Supervisor,  
  > **I want to** generate a structured kitchen preparation plan from the confirmed meal demand and assign tasks to kitchen stations (Prep, Sauté, Soup),  
  > **So that** the kitchen team executes cooking on schedule and dishes are ready before student service (10:45 AM).

#### INVEST Evaluation:
- **I (Independent):** Loosely coupled to `meal_demands` via `meal_demand_id`. Does not block earlier modules.
- **N (Negotiable):** Target completion times, assigned station lines, and shift leads can be adjusted dynamically.
- **V (Valuable):** Coordinates industrial kitchen safety and ensures food is served at optimal temperature.
- **E (Estimable):** **3 Story Points** (Shift planning dashboard + target distribution line items).
- **S (Small):** Deliverable within 1 sprint.
- **T (Testable):**

```gherkin
Scenario: Publishing a preparation plan for lunch shift
  Given a confirmed meal demand exists for today's lunch session
  When the Head Chef schedules completion deadline at 10:45 AM
  And clicks "Publish Preparation Plan"
  Then a record is inserted into `meal_preparation_plans` with `plan_status = 'planned'`
  And individual dish line items are populated into `meal_preparation_plan_dishes`
  And the plan appears on all kitchen touchscreens
```

---

### US-PRP-02: Allocate and Reconcile Storage Ingredients
- **Feature ID:** `F-PRP-02` | **Use Case:** `UC-KIT-02` | **Primary Entity:** `ingredient_allocations`
- **User Story:**
  > **As a** Kitchen Assistant / Pantry Handler,  
  > **I want to** verify physical raw ingredients issued from storage against calculated recipe allocations,  
  > **So that** shortages or spoiled goods are identified and resolved before culinary processing begins.

#### INVEST Evaluation:
- **I (Independent):** Interfaces strictly between the pantry inventory and the kitchen station.
- **N (Negotiable):** Supports logging discrepancy adjustments with operational notes (e.g., trimming waste, vendor shortfall).
- **V (Valuable):** Prevents inventory shrinkage, identifies vendor quality issues, and guarantees food safety.
- **E (Estimable):** **3 Story Points** (Pantry receiving checklist + status transitions: `allocated`, `adjusted`, `returned`).
- **S (Small):** Deliverable within 1 sprint.
- **T (Testable):**

```gherkin
Scenario: Flagging raw ingredient shortfall during pantry intake
  Given the plan mandates allocation of 63.0 kg of pork shoulder
  When the kitchen assistant weighs the received goods at only 60.0 kg (3.0 kg shortfall)
  And selects status `adjusted`, entering 60.0 kg and reason "Trimming and excess fat loss"
  Then the system updates `ingredient_allocations.allocated_quantity = 60.0`
  And sets `allocation_status = 'adjusted'`
  And triggers an alert to the Nutrition Manager to issue supplemental stock
```

---

### US-PRP-03: Record Live Cooking Batches via Kitchen Touchscreen
- **Feature ID:** `F-PRP-03` | **Use Case:** `UC-KIT-03` | **Primary Entities:** `meal_preparations`, `meal_preparation_dish_records`
- **User Story:**
  > **As a** Station Cook / Chef,  
  > **I want to** start cooking timers and log completed batch quantities using a touch-friendly kitchen kiosk,  
  > **So that** production progress is monitored in real-time without disrupting manual food preparation.

#### INVEST Evaluation:
- **I (Independent):** Each cooking batch (`meal_preparations`) is atomic; cooks can complete soup while rice continues steaming.
- **N (Negotiable):** Multiple batches per dish are supported (e.g., 3 steaming cabinet runs for 70 kg of rice each).
- **V (Valuable):** Ensures timely food delivery, prevents meal cold-holding degradation, and tracks equipment utilization.
- **E (Estimable):** **5 Story Points** (High-contrast kiosk UI + oversized touch targets + timer state machine).
- **S (Small):** Deliverable within 1 sprint.
- **T (Testable):**

```gherkin
Scenario: Logging completion of rice steaming batch #1
  Given batch #1 for "Steamed Jasmine Rice" has been in state `in_progress` since 09:00 AM
  When the cook unloads the steamer at 09:45 AM and taps "Complete Batch"
  And enters the scale reading of 70.0 kg
  Then `meal_preparations.prep_status` transitions to `'completed'`
  And `meal_preparation_dish_records` stores `actual_prepared_quantity = 70.0`
```

---

### US-PRP-04: Verify Prepared Yield & Discrepancy Reconciliation
- **Feature ID:** `F-PRP-04` | **Use Cases:** `UC-KIT-04`, `UC-MGR-05` | **Primary Entity:** `prepared_quantity_confirmations`
- **User Story:**
  > **As a** Head Chef or School Meal Inspector,  
  > **I want to** reconcile aggregate cooked dish yield against planned targets and enforce mandatory explanation notes if discrepancies exceed tolerance thresholds,  
  > **So that** portion sizes are safeguarded before trays are distributed to student classrooms.

#### INVEST Evaluation:
- **I (Independent):** Serves as an independent Quality Gate at the end of the kitchen lifecycle prior to food distribution.
- **N (Negotiable):** Discrepancy tolerance percentages (default $\pm 3\%$) are centrally configurable.
- **V (Valuable):** Prevents portion skimping, detects culinary waste, and guarantees that every child receives full nutritional value.
- **E (Estimable):** **3 Story Points** (Tolerance comparison engine + mandatory sign-off workflow).
- **S (Small):** Deliverable within 1 sprint.
- **T (Testable):**

```gherkin
Scenario: Yield verified within acceptable tolerance
  Given target quantity is 63.0 kg of braised pork
  And actual batch sum yields 62.5 kg (a -0.8% variance, within the 3% tolerance window)
  When the Head Chef performs inspection sign-off
  Then the system sets `confirmation_status = 'matched'`
  And persists inspector credentials into `prepared_quantity_confirmations`

Scenario: Mandatory justification required when yield variance exceeds tolerance
  Given target quantity is 630 boiled eggs
  And actual yield is 590 eggs (40 missing, a -6.3% discrepancy exceeding the 3% threshold)
  When the Head Chef attempts to sign off
  Then the system sets `confirmation_status = 'discrepancy'`
  And disables the submit button until a mandatory justification note is entered
  And dispatches a high-priority notification to the School Operations Director
```

---

## 5. Sprint Estimation Matrix (Story Points)

| Story ID | Core Feature Name | I | N | V | E | S | T | Story Points | Priority |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **US-PAR-01** | Record Daily Student Meal Attendance | ✅ | ✅ | ✅ | 3 SP | ✅ | ✅ | **3** | P1 (MVP) |
| **US-PAR-02** | Track Attendance Status Amendments | ✅ | ✅ | ✅ | 2 SP | ✅ | ✅ | **2** | P1 (MVP) |
| **US-PAR-03** | Verify and Lock Classroom Roster | ✅ | ✅ | ✅ | 3 SP | ✅ | ✅ | **3** | P1 (MVP) |
| **US-DMD-01** | Aggregate Confirmed Headcount & Buffer | ✅ | ✅ | ✅ | 5 SP | ✅ | ✅ | **5** | P1 (MVP) |
| **US-DMD-02** | Calculate Expected Raw Dish Quantities | ✅ | ✅ | ✅ | 3 SP | ✅ | ✅ | **3** | P1 (MVP) |
| **US-DMD-03** | Process Emergency Demand Adjustments | ✅ | ✅ | ✅ | 5 SP | ✅ | ✅ | **5** | P1 (MVP) |
| **US-PRP-01** | Create Kitchen Shift Preparation Plan | ✅ | ✅ | ✅ | 3 SP | ✅ | ✅ | **3** | P1 (MVP) |
| **US-PRP-02** | Allocate & Reconcile Storage Ingredients | ✅ | ✅ | ✅ | 3 SP | ✅ | ✅ | **3** | P1 (MVP) |
| **US-PRP-03** | Record Live Cooking Batches via Kiosk | ✅ | ✅ | ✅ | 5 SP | ✅ | ✅ | **5** | P1 (MVP) |
| **US-PRP-04** | Verify Prepared Yield & Discrepancies | ✅ | ✅ | ✅ | 3 SP | ✅ | ✅ | **3** | P1 (MVP) |
| **TOTAL** | **10 Core MVP User Stories** | | | | | | | **35 SP** | **2–3 Sprints** |

---

## 6. Grill The Design: 5 Architectural Stress Tests & Edge Cases

To pressure-test these requirements in accordance with **Grill with Docs**, consider these five operational friction points:

1. **Cutoff Concurrency Race Condition (08:30 AM):**  
   *Scenario:* A teacher opens the attendance form at 08:29 AM and clicks submit at 08:31 AM. Concurrently, at 08:30:01 AM, an automated scheduler locks all rosters and the Nutrition Manager triggers demand aggregation.  
   *Architecture Challenge:* Should the system reject the stale submission using Optimistic Concurrency Control (HTTP 409), or convert the delta into a pending post-lock adjustment (`meal_demand_changes`) automatically?

2. **Discrete Unit vs. Continuous Weight Buffer Rounding:**  
   *Scenario:* For bulk-weight items (rice, meat), a $+5\%$ buffer yields fractional amounts ($63.2\text{ kg}$). For discrete unit items (apples, carton milk, eggs), rounding per classroom causes compounding excess ($+8\text{--}10\%$ school-wide buffer).  
   *Architecture Challenge:* Must the formula enforce class-level or school-level rounding rules, and which entity owns the rounding ceiling definition?

3. **Post-Lock Quantity Reduction When Food is Already in the Pan:**  
   *Scenario:* At 09:45 AM, an entire class (30 students) departs unexpectedly for a clinic. The teacher submits a $-30$ meal reduction, and the manager approves it. However, the kitchen already dropped the raw pork into the boiling kettles at 09:15 AM.  
   *Architecture Challenge:* How does the system decouple **Billing Headcount** (student refund) from **Kitchen Production Cost** (raw ingredients already expended and non-recoverable)?

4. **Thermal Yield Cooking Loss (Gross Raw vs. Net Cooked):**  
   *Scenario:* $1.0\text{ kg}$ of raw pork yields approximately $0.7\text{ kg}$ of cooked braised pork due to moisture reduction.  
   *Architecture Challenge:* Does `F-DMD-02` compute raw warehouse withdrawal weight (Gross) or plate-ready weight (Net)? At `F-PRP-04`, what conversion factor governs the discrepancy tolerance check?

5. **Kitchen Offline-First Resiliency:**  
   *Scenario:* Heavy kitchen steamers and concrete walls frequently degrade Wi-Fi connectivity. If a cook completes a batch while offline, the kiosk must not freeze or block subsequent batches.  
   *Architecture Challenge:* How will the client-side kiosk handle local queueing (IndexedDB) and conflict resolution when syncing batch timestamps back to the central server?
