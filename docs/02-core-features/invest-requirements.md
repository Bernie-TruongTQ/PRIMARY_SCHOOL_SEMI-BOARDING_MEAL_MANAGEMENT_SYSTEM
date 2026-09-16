# Core Features Specification — INVEST Criteria & Acceptance Criteria

This document formally specifies the software requirements for the **Primary School Semi-Boarding Meal Management System**, covering all **8 Business Domains** defined in the approved [MVP Baseline](../01-top-down/MVP.md) and the top-down decomposition ([PRIMARY SCHOOL SEMI-BOARDINGMEAL MANAGEMENT SYSTEM.png](../01-top-down/PRIMARY%20SCHOOL%20SEMI-BOARDINGMEAL%20MANAGEMENT%20SYSTEM.png)).

Every user story is structured under the **INVEST** framework (Independent, Negotiable, Valuable, Estimable, Small, Testable), augmented with Given-When-Then (Gherkin) BDD acceptance test scenarios, and cross-referenced with actor roles and data entities.

---

## 1. The INVEST Framework Applied to School Semi-Boarding Meal Management

| Criterion | Formal Agile Standard | Application in Primary School Semi-Boarding Meal Context | Verification Checklist |
|---|---|---|---|
| **I — Independent** | Stories can be designed, built, and tested with minimal runtime coupling to other in-flight stories. | Attendance recording by teachers does not depend on catering order status; fee billing runs independently against stored attendance snapshots. | Preconditions rely on persistent DB foreign keys or contract states rather than concurrent live transactions. |
| **N — Negotiable** | Stories capture the business "what" and "why" without hard-coding rigid UI implementations or inflexible constants. | Cutoff deadlines (e.g. 08:30 AM), safety buffer percentages (3–5%), and yield discrepancy thresholds ($\pm 3\%$) are configurable parameters. | Acceptance criteria verify business thresholds as configurable parameters. |
| **V — Valuable** | Delivers concrete operational or financial value to students, parents, school staff, or caterers. | Eliminates food waste, prevents allergen exposure, prevents billing disputes, and ensures contract compliance with catering vendors. | The business outcome is explicitly stated in the "So that" clause of each user story. |
| **E — Estimable** | Requirements are sufficiently understood for the engineering team to accurately gauge development complexity. | Entity boundaries, state lifecycles, and user interactions are fully documented, avoiding hidden technical debt. | Sized using standard Fibonacci scale (Story Points: 2, 3, 5, 8). |
| **S — Small** | Sized to fit comfortably within a single development sprint (1–2 weeks). | Complex capabilities are broken into manageable user stories that touch no more than 1–2 primary UI screens and 1 mutation. | Stories range from 2 to 5 Story Points. |
| **T — Testable** | Clear, binary pass/fail acceptance criteria that can be validated by automated or manual tests. | Each story contains Gherkin scenarios with deterministic Given-When-Then states, inputs, and database assertions. | Scenarios cover happy path, validation boundaries, and edge-case error recovery. |

---

## 2. Domain 1 — Student Meal Management (`F-PAR`)

### US-PAR-01: Define and Evaluate Student Meal Eligibility
- **Feature ID:** `F-PAR-01` | **Role:** School Admin (`ADM`) / Semi-Boarding Coordinator (`MGR`) | **Entities:** `students`, `meal_eligibility`
- **User Story:**
  > **As a** Semi-Boarding Coordinator,  
  > **I want to** define meal eligibility criteria and evaluate student enrollment records,  
  > **So that** only eligible enrolled students are permitted to participate in the subsidized school lunch program.
- **INVEST Evaluation:**
  - **I:** Reads baseline student directory; outputs eligibility flags.
  - **N:** Eligibility criteria (grade level, health check status, boarding registration) can be adjusted per school term.
  - **V:** Guarantees regulatory and institutional compliance for boarding intake.
  - **E:** **3 Story Points** (Eligibility rule evaluator + student status toggle).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Student meets boarding eligibility criteria
  Given a student is enrolled in Grade 1 and has a submitted health clearance record
  When the Coordinator runs eligibility verification
  Then the student's eligibility status is marked as 'eligible'
  And the student is made available for meal registration

Scenario: Student ineligible due to missing medical clearance
  Given a student record lacks required medical clearance documentation
  When the Coordinator reviews the enrollment profile
  Then the student's eligibility status is set to 'ineligible' with reason "Missing medical record"
  And meal registration is blocked until clearance is uploaded
```

---

### US-PAR-02: Register, Modify, and Cancel Meal Participation
- **Feature ID:** `F-PAR-02` | **Role:** Parent (`PAR`) / Semi-Boarding Coordinator (`MGR`) | **Entities:** `meal_registrations`, `students`
- **User Story:**
  > **As a** Parent or Coordinator,  
  > **I want to** register a student for semester meal plans, update choices, or cancel participation with dietary notes,  
  > **So that** the school has an accurate baseline commitment of students eating lunch each term.
- **INVEST Evaluation:**
  - **I:** Operates on semester/monthly schedule bindings.
  - **N:** Registration cutoffs and refund cancellation windows are parameterized.
  - **V:** Secures term-level financial forecasting and catering contract quotas.
  - **E:** **3 Story Points** (Registration portal + dietary notes capture).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Registering for a full semester meal program with dietary note
  Given an eligible student in Class 2A
  When the parent registers for Semester 1 Lunch program
  And enters dietary note "No beef due to religious preference"
  Then a `meal_registrations` record is created with status 'active'
  And the dietary note is recorded in the student's meal profile

Scenario: Cancelling meal registration before term start
  Given an active meal registration for Semester 1
  When the parent cancels registration 5 days prior to semester start
  Then the registration status transitions to 'cancelled'
  And the student is excluded from automated daily attendance rosters
```

---

### US-PAR-03: Record Daily Classroom Attendance and Absence Logging
- **Feature ID:** `F-PAR-03` | **Role:** Homeroom Teacher (`TCH`) | **Entities:** `meal_participations`, `meal_participation_changes`
- **User Story:**
  > **As a** Homeroom Teacher,  
  > **I want to** record meal attendance (`eating` or `absent`) for every registered student in my class before the daily 08:30 AM cutoff,  
  > **So that** kitchen and catering demand is grounded in verified classroom presence.
- **INVEST Evaluation:**
  - **I:** Reads class roster; writes isolated daily attendance records.
  - **N:** Supports bulk "Mark All Present" with quick-toggle exceptions.
  - **V:** Prevents catering overproduction and food waste.
  - **E:** **3 Story Points** (Class grid UI + bulk attendance mutation).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Recording morning classroom meal attendance
  Given Class 3B has 32 registered meal students
  And the current time is 08:15 AM (before the 08:30 AM cutoff)
  When the teacher marks 30 students as "Eating" and 2 students as "Absent"
  And submits the attendance sheet
  Then 32 records are saved in `meal_participations` with status 'recorded'
  And the confirmed classroom count of 30 is queued for session demand aggregation
```

---

### US-PAR-04: Monitor Real-Time Classroom Meal Attendance Status
- **Feature ID:** `F-PAR-04` | **Role:** Semi-Boarding Coordinator (`MGR`) | **Entities:** `meal_participations`, `classes`
- **User Story:**
  > **As a** Semi-Boarding Coordinator,  
  > **I want to** monitor which classes have completed morning attendance and review submission progress,  
  > **So that** I can chase late teachers and guarantee 100% headcount coverage before locking the caterer order.
- **INVEST Evaluation:**
  - **I:** Aggregates read-only participation states across classes.
  - **N:** Visual progress indicator (submitted vs pending classes).
  - **V:** Eliminates blind spots before order dispatch.
  - **E:** **2 Story Points** (Dashboard summary card + class checklist).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Coordinator monitors class attendance submission progress
  Given the school has 20 semi-boarding classrooms
  When 18 classrooms have submitted attendance by 08:20 AM
  Then the Coordinator dashboard displays "18/20 Classes Confirmed (90%)"
  And flags the 2 unsubmitted classrooms with yellow highlight for follow-up
```

---

## 3. Domain 2 — Meal Planning & Menu Management (`F-PLN`)

### US-PLN-01: Define Dishes and Maintain Dish Information
- **Feature ID:** `F-PLN-01` | **Role:** Semi-Boarding Coordinator (`MGR`) / Admin (`ADM`) | **Entities:** `dishes`, `ingredients`
- **User Story:**
  > **As a** Semi-Boarding Coordinator,  
  > **I want to** define dishes with nutritional attributes, standard portion sizes, and ingredient lists,  
  > **So that** school meals follow child nutrition standards and transparent recipe profiles.
- **INVEST Evaluation:**
  - **I:** Master catalog item; independent of operational dates.
  - **N:** Standard portion units (grams, bowls, pieces) configurable per dish.
  - **V:** Standardizes portion sizes and enables automated allergen checks.
  - **E:** **3 Story Points** (Dish form + ingredient association list).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Creating a new standard dish in catalog
  When the Coordinator creates dish "Braised Pork with Quail Eggs"
  And specifies standard portion size of "100g pork, 2 eggs" per student
  And associates ingredients "Pork Belly", "Quail Eggs", "Fish Sauce"
  Then the dish is saved in `dishes` with status 'active'
  And becomes selectable for weekly menus
```

---

### US-PLN-02: Create Weekly Menu and Execute Single-Level Approval
- **Feature ID:** `F-PLN-02` | **Role:** Semi-Boarding Coordinator (`MGR`) / Principal (`ADM`) | **Entities:** `menus`, `menu_dishes`
- **User Story:**
  > **As a** Semi-Boarding Coordinator,  
  > **I want to** compose a weekly menu with main, side, soup, and dessert dishes and submit for single-level approval,  
  > **So that** school leadership verifies menu balance before meal schedules are published.
- **INVEST Evaluation:**
  - **I:** Standalone weekly menu entity; references dishes.
  - **N:** Simplified 1-level review (Draft → Approved) as approved in MVP.md.
  - **V:** Ensures balanced nutrition and administrative oversight.
  - **E:** **3 Story Points** (Weekly menu grid + approve button).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Submitting and approving a weekly menu
  Given a weekly menu for Week 42 has dishes assigned for Monday through Friday
  When the Coordinator submits the menu for approval
  And the School Principal reviews and clicks "Approve Menu"
  Then the menu status transitions to 'approved'
  And the menu is locked from unapproved dish modifications
```

---

### US-PLN-03: Assign Approved Menus to Serving Schedule Calendar
- **Feature ID:** `F-PLN-03` | **Role:** Semi-Boarding Coordinator (`MGR`) | **Entities:** `meal_schedules`, `menus`
- **User Story:**
  > **As a** Semi-Boarding Coordinator,  
  > **I want to** bind approved weekly menus to specific calendar dates and meal sessions (Lunch, Snack),  
  > **So that** daily operational routines know exactly which dishes are served on any given school day.
- **INVEST Evaluation:**
  - **I:** Associates approved menu IDs with calendar date records.
  - **N:** Bulk monthly apply or day-by-day assignment.
  - **V:** Provides the temporal schedule linking planning to daily execution.
  - **E:** **2 Story Points** (Calendar schedule picker + batch binder).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Binding approved menu to school week calendar
  Given an approved menu for "Week 42"
  When the Coordinator applies it to dates from "2026-10-12" to "2026-10-16"
  Then 5 daily records are updated in `meal_schedules` with the corresponding menu ID
  And the daily menus are marked as ready for morning attendance and demand calculation
```

---

## 4. Domain 3 — Meal Operation (`F-OPS`)

### US-OPS-01: Determine Session Demand and Calculate Expected Dish Quantities
- **Feature ID:** `F-OPS-01` | **Role:** Semi-Boarding Coordinator (`MGR`) | **Entities:** `meal_demands`, `meal_demand_dish_quantities`
- **User Story:**
  > **As a** Semi-Boarding Coordinator,  
  > **I want to** aggregate confirmed student attendance at the 08:30 AM cutoff, apply a safety buffer, and compute required dish quantities,  
  > **So that** the exact production quantity needed for lunch is determined mathematically.
- **INVEST Evaluation:**
  - **I:** Pulls confirmed attendance from `meal_participations` and recipe standards from `dishes`.
  - **N:** Buffer percentage (default 3–5%) is editable prior to confirmation.
  - **V:** Prevents food shortages while stopping uncontrolled over-ordering.
  - **E:** **5 Story Points** (Aggregation engine + buffer formula + expected dish calculator).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

$$\text{Final Demand} = \text{Total Attendance} \times (1 + \text{Buffer\%})$$

```gherkin
Scenario: Calculating session demand with 5% safety buffer
  Given confirmed classroom attendance across all classes totals 600 students
  And a safety buffer of 5% is configured
  When the Coordinator triggers demand calculation
  Then `meal_demands.total_headcount` is set to 600
  And `meal_demands.final_demand_count` is calculated as 630 meals
  And expected quantities for each menu dish are populated into `meal_demand_dish_quantities`
```

---

### US-OPS-02: Dispatch Formal Meal Order to Catering Vendor
- **Feature ID:** `F-OPS-02` | **Role:** Semi-Boarding Coordinator (`MGR`) | **Entities:** `catering_orders`, `meal_demands`
- **User Story:**
  > **As a** Semi-Boarding Coordinator,  
  > **I want to** generate and dispatch a formal electronic meal order to the catering vendor by 08:45 AM,  
  > **So that** the external catering kitchen begins packaging and delivery based on contracted counts.
- **INVEST Evaluation:**
  - **I:** Reads locked `meal_demands`; outputs a timestamped `catering_orders` record.
  - **N:** Delivery notification method (system dashboard, PDF export, email notification).
  - **V:** Legal and operational contract of daily meal commitment with the supplier.
  - **E:** **3 Story Points** (Order generation + dispatch status state machine).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Dispatching daily catering order
  Given an approved demand of 630 meals for today's lunch
  When the Coordinator clicks "Send Meal Order to Vendor" at 08:40 AM
  Then a `catering_orders` record is created with status 'dispatched'
  And an order snapshot with 630 meals and delivery deadline "10:30 AM" is timestamped
```

---

### US-OPS-03: Inspect Quality and Confirm Received Quantities from Vendor
- **Feature ID:** `F-OPS-03` | **Role:** Semi-Boarding Coordinator (`MGR`) / School Nurse (`STF`) | **Entities:** `meal_deliveries`, `meal_inspections`
- **User Story:**
  > **As a** Semi-Boarding Coordinator or School Inspector,  
  > **I want to** log delivered food containers from the caterer, record temperature and sensory inspection, and confirm received quantities,  
  > **So that** only safe, hot, and complete meal shipments are accepted into the school dining hall.
- **INVEST Evaluation:**
  - **I:** Dependent on delivered order; independent of classroom distribution.
  - **N:** Inspection criteria (core temperature $\ge 65^\circ\text{C}$, visual sensory check, seal integrity).
  - **V:** Critical health safeguard against spoiled or under-delivered food.
  - **E:** **3 Story Points** (Receiving form + temp log + pass/fail validation).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Successful receiving and food safety inspection
  Given catering vendor delivers 630 meal portions at 10:25 AM
  When the Inspector measures food temperature at 72°C (exceeding minimum 65°C)
  And records visual/sensory check as "Pass"
  And confirms delivered quantity equals 630 portions
  Then `meal_deliveries.status` is set to 'accepted'
  And food is cleared for classroom distribution
```

---

### US-OPS-04: Record Classroom Meal Tray Distribution
- **Feature ID:** `F-OPS-04` | **Role:** Semi-Boarding Staff / Classroom Server (`KIT`/`STF`) | **Entities:** `meal_distributions`
- **User Story:**
  > **As a** Semi-Boarding Staff Member,  
  > **I want to** record the actual quantity of meal trays distributed to each classroom trolley,  
  > **So that** every classroom receives its exact portion allocation on time.
- **INVEST Evaluation:**
  - **I:** References confirmed receiving records; outputs class distribution logs.
  - **N:** Mobile tablet checklist or physical check-off barcode scan.
  - **V:** Prevents classrooms from being shorted portions during distribution.
  - **E:** **2 Story Points** (Classroom distribution list + portion confirm toggle).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Logging classroom meal distribution
  Given Class 1A has 30 confirmed eating students
  When semi-boarding staff dispatch trolley #1 with 30 hot meal sets to Class 1A
  And confirm distribution in the app
  Then `meal_distributions` records 30 distributed portions for Class 1A at 10:55 AM
```

---

### US-OPS-05: Reconcile Ordered vs Delivered vs Consumed Quantities
- **Feature ID:** `F-OPS-05` | **Role:** Semi-Boarding Coordinator (`MGR`) / Accountant (`ACC`) | **Entities:** `meal_reconciliations`, `meal_discrepancies`
- **User Story:**
  > **As a** Semi-Boarding Coordinator,  
  > **I want to** reconcile ordered portions against delivered and distributed counts and record discrepancy reasons,  
  > **So that** quantity variations are documented for caterer invoicing and cost settlement.
- **INVEST Evaluation:**
  - **I:** Post-service reconciliation; does not block food consumption.
  - **N:** Streamlined discrepancy resolution: log reason and adjust payable quantities.
  - **V:** Stops the school from paying for un-delivered or rejected portions.
  - **E:** **3 Story Points** (Variance calculator + discrepancy reason logger).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Reconciling meal shortfall with catering vendor
  Given 630 meals were ordered
  And only 620 meals were delivered and accepted (shortfall of 10 meals)
  When the Coordinator completes daily reconciliation
  Then `meal_reconciliations` records a variance of -10 meals
  And flags discrepancy type "Vendor Shortfall"
  And automatically adjusts payable quantity to 620 for month-end accounting
```

---

## 5. Domain 4 — Meal Fee & Cost Management (`F-FEE`)

### US-FEE-01: Configure Meal Fee Rates and Effective Periods
- **Feature ID:** `F-FEE-01` | **Role:** School Accountant (`ACC`) / Admin (`ADM`) | **Entities:** `meal_fee_configs`
- **User Story:**
  > **As a** School Accountant,  
  > **I want to** configure unit fee rates per meal session and set effective semester periods,  
  > **So that** fee calculations automatically apply the authorized price schedules.
- **INVEST Evaluation:**
  - **I:** Master fee rate configuration; referenced by billing engine.
  - **N:** Daily meal rates (e.g. 35,000 VND / lunch) parameterized with start/end validity dates.
  - **V:** Ensures compliant, standardized tuition and board billing.
  - **E:** **2 Story Points** (Fee configuration form with date picker).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Setting new semester meal fee rate
  When the Accountant sets Lunch Fee to "35,000 VND" effective from "2026-09-01" to "2027-01-15"
  Then the fee configuration is stored with status 'active'
  And all subsequent meal fee assessments use 35,000 VND per chargeable meal
```

---

### US-FEE-02: Determine Chargeable Meals and Calculate Student Fees
- **Feature ID:** `F-FEE-02` | **Role:** School Accountant (`ACC`) | **Entities:** `student_meal_bills`, `student_billing_items`
- **User Story:**
  > **As a** School Accountant,  
  > **I want to** calculate monthly chargeable meal counts per student based on recorded attendance and fee rules,  
  > **So that** families are billed accurately without paying for valid excused absences.
- **INVEST Evaluation:**
  - **I:** Batch job running against historical `meal_participations`.
  - **N:** Configurable absence deduction rules (excused absence prior to cutoff is credited; unexcused is charged).
  - **V:** Builds trust with parents and prevents overbilling complaints.
  - **E:** **5 Story Points** (Batch billing calculation engine + invoice item generator).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Calculating monthly bill with excused absence credit
  Given student "Nam Le" attended 20 meals in October
  And had 2 excused absences submitted before cutoff (credited)
  When the Accountant runs October fee assessment at 35,000 VND/meal
  Then the system calculates 20 chargeable meals
  And generates an invoice for 700,000 VND (20 * 35,000 VND)
```

---

### US-FEE-03: Record Meal Payments and Track Basic Payment Status
- **Feature ID:** `F-FEE-03` | **Role:** School Accountant (`ACC`) | **Entities:** `meal_payments`
- **User Story:**
  > **As a** School Accountant,  
  > **I want to** record parent fee payments and track bill status across 3 simple states (`unpaid`, `partial`, `paid`),  
  > **So that** fee collection progress is clearly tracked without complex accounting overhead.
- **INVEST Evaluation:**
  - **I:** Operates on generated `student_meal_bills`.
  - **N:** Simplified 3-state tracking (`unpaid`, `partial`, `paid`) as specified in MVP.md.
  - **V:** Provides clean visibility of outstanding boarding fees.
  - **E:** **3 Story Points** (Payment recording dialog + 3-state badge indicator).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Recording full payment of monthly meal bill
  Given an unpaid meal bill of 700,000 VND for student "Nam Le"
  When the Accountant logs bank transfer payment of 700,000 VND
  Then the bill status transitions from 'unpaid' to 'paid'
  And receipt number and timestamp are saved in `meal_payments`
```

---

### US-FEE-04: Record Catering Vendor Meal Costs and Calculate Payables
- **Feature ID:** `F-FEE-04` | **Role:** School Accountant (`ACC`) | **Entities:** `catering_costs`, `vendor_payables`
- **User Story:**
  > **As a** School Accountant,  
  > **I want to** record contracted catering unit costs and calculate total vendor debt based on reconciled delivered meals,  
  > **So that** vendor payables are audited and disbursed accurately according to service contracts.
- **INVEST Evaluation:**
  - **I:** Pulls accepted quantities from `meal_reconciliations`.
  - **N:** Cost per meal rate parameterized by contract agreement.
  - **V:** Prevents financial leakages and maintains clean vendor relations.
  - **E:** **3 Story Points** (Vendor payable accumulator + contract rate multiplier).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Calculating monthly payable to catering vendor
  Given the catering contract rate is 28,000 VND per accepted meal
  And the vendor delivered 12,000 verified and reconciled meals in October
  When the Accountant generates the October Vendor Payable statement
  Then the total payable is calculated as 336,000,000 VND (12,000 * 28,000 VND)
```

---

## 6. Domain 5 — Reporting & Transparency (`F-REP`)

### US-REP-01: Generate Daily Meal Operation & Vendor Reconciliation Reports
- **Feature ID:** `F-REP-01` | **Role:** Coordinator (`MGR`) / Principal (`ADM`) | **Entities:** Materialized Views / Reports
- **User Story:**
  > **As a** Semi-Boarding Coordinator or School Principal,  
  > **I want to** generate daily operation reports comparing ordered, delivered, and distributed quantities,  
  > **So that** management audits daily execution efficiency and vendor delivery compliance.
- **INVEST Evaluation:**
  - **I:** Read-only report derived from daily transaction logs.
  - **N:** Exportable formats (screen view, PDF, CSV).
  - **V:** Daily audit trail for institutional compliance.
  - **E:** **3 Story Points** (Daily aggregation query + printable layout).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Generating daily operation summary report
  Given daily operations for 2026-10-15 are complete
  When the Coordinator generates the Daily Operation Report
  Then the report displays:
    | Metric                | Count |
    | Confirmed Attendance  | 600   |
    | Final Ordered Demand  | 630   |
    | Vendor Delivered      | 630   |
    | Inspected & Accepted  | 630   |
    | Distributed to Class  | 600   |
    | Leftover / Reserve    | 30    |
```

---

### US-REP-02: Generate Monthly Fee, Payment, and Caterer Cost Reports
- **Feature ID:** `F-REP-02` | **Role:** School Accountant (`ACC`) / Principal (`ADM`) | **Entities:** Financial Views / Reports
- **User Story:**
  > **As a** School Accountant,  
  > **I want to** generate monthly financial reports detailing billed fees, collected payments, and catering debts,  
  > **So that** school administration maintains complete transparency over semi-boarding program finances.
- **INVEST Evaluation:**
  - **I:** Reads aggregated financial tables.
  - **N:** Filterable by class, grade, or entire school.
  - **V:** Guarantees fiscal integrity and identifies unpaid debt ratios.
  - **E:** **3 Story Points** (Financial balance grid + summary KPIs).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Viewing monthly boarding finance balance
  When the Accountant generates October Financial Summary
  Then the dashboard displays total billed amount, total collections, outstanding balance, and total catering payable
```

---

### US-REP-03: Publish Transparency Information and Menus for Parents
- **Feature ID:** `F-REP-03` | **Role:** Semi-Boarding Coordinator (`MGR`) / Parent (`PAR`) | **Entities:** Transparency Portal Views
- **User Story:**
  > **As a** Parent,  
  > **I want to** view published weekly menus, dish ingredients, and daily delivery verification summaries on the school portal,  
  > **So that** I have complete transparency and confidence in the food served to my child.
- **INVEST Evaluation:**
  - **I:** Read-only consumer view of approved menus and delivery confirmations.
  - **N:** Web portal or mobile-responsive view.
  - **V:** Delivers transparency, boosting parent satisfaction and trust.
  - **E:** **2 Story Points** (Parent public portal view).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Parent views daily lunch menu and safety status
  Given an approved menu and accepted food delivery for today
  When the Parent opens the Mobile Parent Portal
  Then the parent sees today's dishes, photos, allergen notes, and "Food Inspected & Delivered at 10:25 AM" badge
```

---

## 7. Domain 6 — User & Access Management (`F-USR`)

### US-USR-01: Manage User Profiles and Staff Accounts
- **Feature ID:** `F-USR-01` | **Role:** School Admin (`ADM`) | **Entities:** `users`
- **User Story:**
  > **As a** School Administrator,  
  > **I want to** create, update, and manage staff user accounts,  
  > **So that** institutional personnel have verified credentials to access system features.
- **INVEST Evaluation:**
  - **I:** Standard user directory CRUD.
  - **N:** Manual creation or bulk CSV import.
  - **V:** Foundational system security and user accountability.
  - **E:** **2 Story Points** (User form + password reset).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Creating a new teacher user account
  When the Admin creates a new user with email "teacher.hoa@school.edu.vn"
  And assigns role 'Homeroom Teacher'
  Then the user record is created in `users` with status 'active'
```

---

### US-USR-02: Enforce Fixed Role-Based Access Control (RBAC)
- **Feature ID:** `F-USR-02` | **Role:** School Admin (`ADM`) | **Entities:** `users`, `roles`
- **User Story:**
  > **As a** System Administrator,  
  > **I want to** enforce fixed role permissions across 4 pre-defined roles (`Admin`, `Accountant`, `Semi-Boarding Coordinator`, `Parent`),  
  > **So that** users are restricted to their authorized capabilities without risky ad-hoc permission overrides.
- **INVEST Evaluation:**
  - **I:** Cross-cutting security middleware.
  - **N:** Streamlined fixed role mappings as dictated in MVP.md (no custom permission editor).
  - **V:** Simplifies administration and hardens operational boundaries.
  - **E:** **3 Story Points** (RBAC route guard middleware + UI privilege filters).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Enforcing role-based route guard
  Given a user logged in with role 'Parent'
  When the user attempts to access the catering order dispatch endpoint `/api/caterer/orders`
  Then the system returns HTTP 403 Forbidden
  And logs an unauthorized access attempt
```

---

## 8. Domain 7 — Nutrition & Health Management (`F-NUT`)

### US-NUT-01: Record Student Food Allergies and Dietary Restrictions
- **Feature ID:** `F-NUT-01` | **Role:** Parent (`PAR`) / School Nurse / Teacher (`TCH`) | **Entities:** `student_allergies`, `students`
- **User Story:**
  > **As a** Parent or Teacher,  
  > **I want to** record specific food allergies (e.g. Peanuts, Seafood, Dairy, Eggs) and dietary notes in a student's profile,  
  > **So that** medical dietary alerts are permanently associated with the child.
- **INVEST Evaluation:**
  - **I:** References student profile; stores structured allergy taxonomy.
  - **N:** Predefined allergen checkboxes + free text description.
  - **V:** Critical child health and safety safeguard.
  - **E:** **2 Story Points** (Allergy checklist component).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Logging a student peanut allergy
  When the parent selects allergen "Peanut" and severity "Severe" for student "Alice Nguyen"
  Then `student_allergies` saves the restriction
  And a permanent dietary warning indicator is attached to Alice Nguyen's profile
```

---

### US-NUT-02: Flag Restricted Ingredients and Trigger Menu Conflict Alerts
- **Feature ID:** `F-NUT-02` | **Role:** Semi-Boarding Coordinator (`MGR`) / Teacher (`TCH`) | **Entities:** `dishes`, `menus`, `dietary_alerts`
- **User Story:**
  > **As a** Semi-Boarding Coordinator or Teacher,  
  > **I want to** see visual alert indicators when a scheduled menu dish contains ingredients restricted for an attending student,  
  > **So that** kitchen and classroom staff isolate alternative portions and prevent allergic reactions.
- **INVEST Evaluation:**
  - **I:** Cross-references menu ingredients with daily attending students.
  - **N:** Streamlined visual warning banner (non-blocking notification) as specified in MVP.md.
  - **V:** Prevents life-threatening medical emergencies.
  - **E:** **3 Story Points** (Ingredient cross-matching query + visual warning chip).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Visual conflict alert for student with peanut allergy
  Given Alice Nguyen in Class 1A has a confirmed "Peanut" allergy
  And the scheduled dessert contains "Crushed Peanuts"
  When the teacher views the Class 1A meal attendance roster
  Then an orange warning badge appears next to Alice Nguyen stating: "Menu Conflict: Dessert contains Peanuts"
  And prompts staff to verify replacement allergen-safe portion
```

---

## 9. Domain 8 — Master Data & System Configuration (`F-MST`)

### US-MST-01: Manage Academic Structure (School Years, Classes, Students)
- **Feature ID:** `F-MST-01` | **Role:** School Admin (`ADM`) | **Entities:** `school_years`, `grades`, `classes`, `students`
- **User Story:**
  > **As a** School Administrator,  
  > **I want to** maintain school years, semesters, grades, classes, and student enrollments,  
  > **So that** the entire operational system reflects the accurate school organizational hierarchy.
- **INVEST Evaluation:**
  - **I:** Foundational organizational master data.
  - **N:** Manual entry or bulk student roster import.
  - **V:** Enables all class-based filtering, attendance, and reporting.
  - **E:** **3 Story Points** (Academic hierarchy management screens).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Setting up a new school year and classes
  When the Admin creates school year "2026-2027" with Semester 1 and Semester 2
  And creates classes 1A, 1B, 2A, 2B
  Then the organizational tree is established and ready for student assignment
```

---

### US-MST-02: Configure Lunch Serving Days and Holiday Calendar
- **Feature ID:** `F-MST-02` | **Role:** School Admin (`ADM`) | **Entities:** `meal_calendars`, `holidays`
- **User Story:**
  > **As a** School Administrator,  
  > **I want to** define default meal-serving days (Monday–Friday) and configure school holidays and non-meal dates,  
  > **So that** the system automatically skips non-meal dates when scheduling menus and generating bills.
- **INVEST Evaluation:**
  - **I:** Temporal master data; independent of transactions.
  - **N:** Calendar UI with click-to-toggle holiday status.
  - **V:** Prevents phantom demand calculation and incorrect billing on holidays.
  - **E:** **2 Story Points** (Interactive calendar configuration view).
  - **S:** Fits in 1 sprint.
  - **T:** Verified via Gherkin.

```gherkin
Scenario: Marking a national holiday on the meal calendar
  When the Admin marks "2026-11-20" as "Teacher's Day Holiday (Non-Meal Day)"
  Then the system flags the date as non-serving
  And automatically hides morning attendance and suppresses catering demand for that date
```

---

## 10. Master Sprint Estimation Matrix (Story Points)

| Domain # | Domain Name | Story ID | Feature Name | Story Points | Priority |
|---|---|---|---|:---:|:---:|
| **1** | Student Meal Management | **US-PAR-01** | Define & Evaluate Eligibility | 3 SP | P1 (MVP) |
| | | **US-PAR-02** | Register & Modify Meal Plans | 3 SP | P1 (MVP) |
| | | **US-PAR-03** | Record Classroom Attendance | 3 SP | P1 (MVP) |
| | | **US-PAR-04** | Monitor Classroom Attendance | 2 SP | P1 (MVP - Streamlined) |
| **2** | Meal Planning & Menu | **US-PLN-01** | Define Dishes & Portions | 3 SP | P1 (MVP) |
| | | **US-PLN-02** | Weekly Menu & 1-Level Approval | 3 SP | P1 (MVP - Streamlined) |
| | | **US-PLN-03** | Assign Menu to Schedule | 2 SP | P1 (MVP) |
| **3** | Meal Operation | **US-OPS-01** | Demand & Dish Quantities (+Buffer) | 5 SP | P1 (MVP) |
| | | **US-OPS-02** | Catering Order Dispatch | 3 SP | P1 (MVP) |
| | | **US-OPS-03** | Receiving, Quality & Temp Check | 3 SP | P1 (MVP) |
| | | **US-OPS-04** | Classroom Distribution Logging | 2 SP | P1 (MVP) |
| | | **US-OPS-05** | Reconcile & Resolve Discrepancy | 3 SP | P1 (MVP - Streamlined) |
| **4** | Meal Fee & Cost | **US-FEE-01** | Meal Fee Rate Configuration | 2 SP | P1 (MVP) |
| | | **US-FEE-02** | Chargeable Calculation & Bills | 5 SP | P1 (MVP) |
| | | **US-FEE-03** | Payment Logging & 3-State Track | 3 SP | P1 (MVP - Streamlined) |
| | | **US-FEE-04** | Caterer Cost & Payables Accrual | 3 SP | P1 (MVP - Streamlined) |
| **5** | Reporting & Transparency | **US-REP-01** | Daily Ops & Vendor Reports | 3 SP | P1 (MVP - Streamlined) |
| | | **US-REP-02** | Monthly Financial Summary | 3 SP | P1 (MVP - Streamlined) |
| | | **US-REP-03** | Parent Transparency Portal | 2 SP | P1 (MVP - Streamlined) |
| **6** | User & Access Management | **US-USR-01** | User Profile & Staff Accounts | 2 SP | P1 (MVP) |
| | | **US-USR-02** | Enforce Fixed 4-Role RBAC | 3 SP | P1 (MVP - Streamlined) |
| **7** | Nutrition & Health | **US-NUT-01** | Record Student Allergies | 2 SP | P1 (MVP) |
| | | **US-NUT-02** | Visual Menu Conflict Alerts | 3 SP | P1 (MVP - Streamlined) |
| **8** | Master Data & Config | **US-MST-01** | Academic Hierarchy Setup | 3 SP | P1 (MVP) |
| | | **US-MST-02** | Serving Calendar & Holidays | 2 SP | P1 (MVP) |
| **TOTAL** | **8 Business Domains** | **24 Stories** | **Full System MVP Baseline** | **70 SP** | **4–5 Sprints** |

---

## 11. Architectural Stress Tests & Operational Edge Cases

In accordance with **Grill with Docs**, the following 5 critical operational friction points must be addressed by the implementation team:

1. **Morning Cutoff & Vendor Dispatch Race Condition (08:30 AM – 08:45 AM):**  
   *Problem:* The catering contract requires orders by 08:45 AM. If teachers in 3 classes submit attendance at 08:44 AM while the Coordinator has already opened the calculation screen, stale counts may be sent.  
   *Architecture Guard:* Use optimistic locking on `meal_demands`. If attendance changes occur after demand calculation begins, the system flags the delta and prompts for a 1-click re-aggregation before dispatch.

2. **Catering Delivery Quality Rejection Procedure:**  
   *Problem:* If incoming food at 10:30 AM fails temperature check (< 65°C) or smells sour, rejecting the entire batch leaves 600 students without lunch.  
   *Architecture Guard:* The inspection screen (`US-OPS-03`) supports "Partial Acceptance with Emergency Vendor Replacement Protocol" and triggers high-priority SMS/push alerts to the school principal.

3. **Absence Credit vs. Catering Commitment:**  
   *Problem:* When a parent reports sick leave before cutoff, the student receives a fee credit (no charge). However, the caterer minimum batch quota might still bill the school for the baseline portion.  
   *Architecture Guard:* The financial engine decouples **Student Billing Items** (`student_billing_items`) from **Vendor Payables** (`vendor_payables`), accurately booking the difference as school administrative overhead.

4. **Allergy Alert Without Disruption (Non-Blocking):**  
   *Problem:* If a student has an egg allergy, blocking the entire class or menu from proceeding halts operations.  
   *Architecture Guard:* Follow MVP.md's streamlined rule: present prominent visual warning chips to teachers and servers without blocking the system flow, enabling manual allocation of dedicated alternate meals.

5. **Fixed Role Security and Delegation:**  
   *Problem:* If a homeroom teacher is absent, a substitute teacher or coordinator must take classroom attendance without granting full administrative privileges.  
   *Architecture Guard:* The fixed RBAC allows the `Semi-Boarding Coordinator` role to act as a universal proxy for attendance logging across any classroom.
