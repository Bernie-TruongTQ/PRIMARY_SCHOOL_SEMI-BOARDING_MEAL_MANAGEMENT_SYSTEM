# Core Feature Breakdown

## Domain 1 — Student Meal Management

### Capability: Meal Eligibility

| Feature ID | Feature Name | Phase | Priority |
|-----------|--------------|-------|----------|
| **F-STU-01** | Manage Student Meal Eligibility | Phase 1 | P1 |
| F-STU-01b | Suspend / Cancel Enrollment | Phase 2 | P2 |

**F-STU-01 — Manage Student Meal Eligibility**
> Administrators can register a student as a semi-boarding meal program participant. Enrollment records which meal sessions the student is registered for (breakfast, lunch, afternoon snack) and the effective date range. This record becomes the baseline for daily demand calculation.

---

### Capability: Meal Registration

| Feature ID | Feature Name | Phase | Priority |
|-----------|--------------|-------|----------|
| **F-STU-02** | Register Student for Meal Session | Phase 1 | P1 |
| F-STU-02b | Manage Registration Periods | Phase 2 | P2 |

**F-STU-02 — Register Student for Meal Session**
> Links a specific student to a specific meal session (e.g., Lunch) for a date range. The `meal_registrations` table stores `effective_from` / `effective_to`. This drives the `base_registered_count` snapshot used in daily demand.

---

### Capability: Meal Participation

| Feature ID | Feature Name | Phase | Priority |
|-----------|--------------|-------|----------|
| **F-STU-03** | Record Daily Meal Participation | Phase 1 | P1 |

**F-STU-03 — Record Daily Meal Participation**
> Homeroom teachers record each student's daily participation status: Attend, Absent, or Extra Guest. Reasons are required for absences. Changes before the cutoff update demand counts in real-time. Changes after the cutoff create a Change Request (handled by F-MOP-02).

---

## Domain 2 — Meal Planning & Menu Management

### Capability: Menu Design

| Feature ID | Feature Name | Phase | Priority |
|-----------|--------------|-------|----------|
| **F-MPN-01** | Design Weekly Menu | Phase 1 | P1 |
| **F-MPN-02** | Assign Dishes & Standard Portions | Phase 1 | P1 |
| **F-MPN-03** | Approve & Publish Menu | Phase 1 | P1 |
| F-MPN-03b | Nutritional Compliance Check | Phase 2 | P2 |
| F-MPN-03c | Allergen Conflict Flagging | Phase 2 | P2 |

**F-MPN-01 — Design Weekly Menu**
> The Meal/Nutrition Manager creates a weekly menu by assigning a date and meal session to a `menus` record. The menu begins in `draft` status.

**F-MPN-02 — Assign Dishes & Standard Portions**
> The manager assigns specific dishes (from the `dishes` catalog) to the menu, specifying the standard portion size per student (e.g., 150g rice, 200ml soup). These values populate `menu_dishes` and become the unit for quantity calculation.

**F-MPN-03 — Approve & Publish Menu**
> The manager reviews and transitions the menu from `draft` → `approved` → `published`. Only published menus can be used in demand calculation.

---

### Capability: Demand Calculation

| Feature ID | Feature Name | Phase | Priority |
|-----------|--------------|-------|----------|
| **F-MPN-04** | Calculate Meal Demand Quantities | Phase 1 | P1 |

**F-MPN-04 — Calculate Meal Demand Quantities**
> Once demand is locked (F-MOP-01), the system (or Meal Manager) triggers the calculation:
>
> `Total Raw = Planned Headcount × Unit Portion Size × (1 + Buffer%)`
>
> Results are stored in `expected_meal_quantities`. Managers can override the buffer percentage per dish. The system logs whether the calculation was `auto` or `manual`.

---

## Domain 3 — Meal Operation

### Capability: Meal Demand Determination

| Feature ID | Feature Name | Phase | Priority |
|-----------|--------------|-------|----------|
| **F-MOP-01** | Determine Meal Demand (with Cutoff Lock) | Phase 1 | P1 |
| **F-MOP-02** | Manage Post-Cutoff Change Requests | Phase 1 | P1 |

**F-MOP-01 — Determine Meal Demand (with Cutoff Lock)**
> The system aggregates per-class attendance into a session-level `daily_meal_demands` record. Before the cutoff, teachers can freely update participation. At cutoff time, the demand is automatically locked (`determination_status = 'locked'`). Locked headcounts trigger quantity calculation (F-MPN-04).

**F-MOP-02 — Manage Post-Cutoff Change Requests**
> After the cutoff, changes are submitted as `meal_demand_change_requests` with a reason and quantity delta. Emergency requests (submitted more than 30 minutes post-cutoff) are flagged. The Meal/Nutrition Manager approves or rejects each request. All decisions are logged in `meal_demand_change_logs`.

---

### Capability: Meal Preparation

| Feature ID | Feature Name | Phase | Priority |
|-----------|--------------|-------|----------|
| **F-MOP-03** | Record Meal Preparation | Phase 1 | P1 |

**F-MOP-03 — Record Meal Preparation**
> Kitchen staff view the preparation plan (expected quantities per dish), record the actual quantity prepared, and confirm preparation is complete. Discrepancies between expected and actual trigger a flag for reconciliation.

---

### Capability: Meal Distribution

| Feature ID | Feature Name | Phase | Priority |
|-----------|--------------|-------|----------|
| **F-MOP-04** | Record Meal Distribution | Phase 1 | P1 |

**F-MOP-04 — Record Meal Distribution**
> Kitchen staff record the actual quantity distributed per class. Distribution is done against the confirmed demand headcount. Any under-distribution is flagged for immediate exception handling.

---

### Capability: Meal Handover & Reconciliation

| Feature ID | Feature Name | Phase | Priority |
|-----------|--------------|-------|----------|
| **F-MOP-05** | Confirm Meal Handover & Reconcile | Phase 1 | P1 |
| F-MOP-05b | Generate Handover Receipt | Phase 2 | P2 |

**F-MOP-05 — Confirm Meal Handover & Reconcile**
> Kitchen staff confirm that the meal batch has been handed over to the class supervisor. The system compares: Expected (from demand) vs. Prepared vs. Distributed vs. Handed over. Discrepancies are recorded and surfaced in the daily summary.

---

## Phase 2 Backlog Features

| Feature ID | Feature Name | Domain |
|-----------|--------------|--------|
| F-SAF-01 | Register Food Batch & Receiving Inspection | Food Safety & Traceability |
| F-SAF-02 | Trace Food Source (Batch → Ingredient → Dish → Meal) | Food Safety & Traceability |
| F-SAF-03 | Log and Escalate Food Safety Incident | Food Safety & Traceability |
| F-SUP-01 | Manage Suppliers | Food Supply & Inventory |
| F-SUP-02 | Generate & Track Purchase Orders | Food Supply & Inventory |
| F-INV-01 | Manage Ingredient Stock Levels | Food Supply & Inventory |
| F-FEE-01 | Configure Meal Fee Rates | Meal Fee & Cost Management |
| F-FEE-02 | Generate Monthly Invoices | Meal Fee & Cost Management |
| F-RPT-01 | Daily Operations Dashboard | Reporting & Transparency |
| F-RPT-02 | Parent Meal Transparency Portal | Reporting & Transparency |
