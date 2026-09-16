# Actor Roles

## Role Derivation Source

All actor roles are derived directly from institutional operational requirements and the **Fixed 4-Role RBAC Model** defined in [Phase 01 — MVP Baseline (MVP.md)](../01-top-down/MVP.md) and [Phase 02 — Core Features Breakdown](../02-core-features/core-feature-breakdown.md) across all **8 Business Domains**:
1. **Student Meal Management** (`F-PAR`)
2. **Meal Planning & Menu Management** (`F-PLN`)
3. **Meal Operation** (`F-OPS`)
4. **Meal Fee & Cost Management** (`F-FEE`)
5. **Reporting & Transparency** (`F-REP`)
6. **User & Access Management** (`F-USR`)
7. **Nutrition & Health Management** (`F-NUT`)
8. **Master Data & System Configuration** (`F-MST`)

In strict accordance with the baseline MVP constraint (*"Fixed role permissions without runtime custom permission overrides"*), the system defines exactly **4 Fixed Roles**:
- **ADM** — School Administrator / Principal
- **ACC** — School Accountant
- **MGR** — Semi-Boarding Coordinator / Meal Manager
- **PAR** — Student Parent / Guardian

---

## 1. MGR — Semi-Boarding Coordinator / Meal Manager

**Derives from:** `F-PAR-03`, `F-PAR-04`, `F-PLN-01`, `F-PLN-02`, `F-PLN-03`, `F-OPS-01..05`, `F-NUT-02`, `F-REP-01`, `F-REP-03`.

**Description:**  
The Semi-Boarding Coordinator is the central operational coordinator for the daily school meal service. This role manages nutritional dishes, composes weekly menus, monitors classroom attendance progress, locks morning attendance before the 08:30 AM cutoff, calculates aggregate meal demand with safety buffers, dispatches purchase orders to the catering vendor, performs 3-step food receiving inspection, oversees classroom trolley distribution, reconciles quantity discrepancies, and publishes transparency records for parents.

**Key Responsibilities:**
- Maintain dish recipes, portion standards, and weekly menus for administrative approval (`F-PLN-01`, `F-PLN-02`).
- Bind approved weekly menus to school calendar schedules (`F-PLN-03`).
- Track classroom morning attendance submission and lock attendance rosters before the 08:30 AM cutoff (`F-PAR-03`, `F-PAR-04`).
- Supervise visual allergy conflict alerts between scheduled menu ingredients and student health records (`F-NUT-02`).
- Calculate session demand headcount, dish quantities, and configurable safety buffers (`F-OPS-01`).
- Dispatch formal daily meal purchase orders to the Catering Vendor before 08:45 AM (`F-OPS-02`).
- Execute 3-step food inspection (core temperature $\ge 65^\circ\text{C}$, container seals, sensory check) and sign off receiving at 10:30 AM (`F-OPS-03`).
- Oversee classroom meal tray trolley distribution logging at 11:00 AM (`F-OPS-04`).
- Perform post-service quantity reconciliation (Ordered vs. Delivered vs. Consumed) and document discrepancy reasons at 13:00 PM (`F-OPS-05`).
- Generate daily operational summaries and publish transparency meal data to the parent portal (`F-REP-01`, `F-REP-03`).

**System Permissions & Database Touchpoints:**
- Read/Write: `meal_participations`, `meal_demands`, `meal_demand_dish_quantities`, `catering_orders`, `meal_deliveries`, `meal_inspections`, `meal_distributions`, `meal_reconciliations`, `meal_discrepancies`, `menus`, `menu_dishes`, `meal_schedules`, `dietary_alerts`.
- Read: `students`, `student_allergies`, `dishes`, `ingredients`.

---

## 2. ACC — School Accountant

**Derives from:** `F-FEE-01`, `F-FEE-02`, `F-FEE-03`, `F-FEE-04`, `F-REP-02`.

**Description:**  
The School Accountant governs semi-boarding financial management. This role configures meal unit pricing schedules, calculates chargeable meals based on verified attendance records (deducting excused absences), issues monthly parent invoices, tracks fee collection progress across three streamlined states (`unpaid`, `partial`, `paid`), tracks catering vendor unit costs based on accepted delivery quantities, and produces financial and debt audit reports.

**Key Responsibilities:**
- Configure session fee rates and effective validity periods per academic term (`F-FEE-01`).
- Calculate monthly student chargeable meals from attendance logs and generate itemized billing invoices (`F-FEE-02`).
- Record parent fee payments and track collection status across 3 streamlined states (`unpaid`, `partial`, `paid`) (`F-FEE-03`).
- Record contractual catering unit costs and accrue vendor payables based on reconciled accepted deliveries (`F-FEE-04`).
- Generate periodic semi-boarding financial reports: Fee collection summaries, student debt aging, and vendor payable statements (`F-REP-02`).

**System Permissions & Database Touchpoints:**
- Read/Write: `meal_fee_configs`, `student_meal_bills`, `student_billing_items`, `meal_payments`, `catering_costs`, `vendor_payables`.
- Read: `meal_participations`, `meal_reconciliations`, `students`, `classes`.

---

## 3. PAR — Student Parent / Guardian

**Derives from:** `F-PAR-02`, `F-NUT-01`, `F-REP-03`, `F-FEE-03`.

**Description:**  
Parents and legal guardians are service beneficiaries and transparency monitors. Through the dedicated Parent Portal, they register or amend term-level semi-boarding enrollment, record medical allergy profiles and dietary restrictions, view daily published menus and food inspection verification badges, inspect itemized monthly meal invoices, and track payment receipts.

**Key Responsibilities:**
- Register student meal enrollment, modify preferences, or cancel meal participation for the term (`F-PAR-02`).
- Declare student medical food allergies (peanuts, seafood, dairy, eggs, etc.) and dietary restrictions (`F-NUT-01`).
- Review daily menus, dish ingredients, nutritional values, and verified food receiving timestamps (`F-REP-03`).
- View monthly itemized meal bills, excused absence credits, payment details, and electronic receipts (`F-FEE-03`).

**System Permissions & Database Touchpoints:**
- Write: `meal_registrations` (for associated children), `student_allergies` (for associated children).
- Read: `menus`, `meal_schedules`, `dishes`, `student_meal_bills` (child only), `meal_payments` (child only), Parent Transparency Portal (`F-REP-03`).

---

## 4. ADM — School Administrator / Principal

**Derives from:** `F-MST-01`, `F-MST-02`, `F-PAR-01`, `F-PLN-02`, `F-USR-01`, `F-USR-02`.

**Description:**  
The School Administrator (Principal or designated administrative director) maintains foundational enterprise master data, academic hierarchy structures, meal program eligibility policies, meal serving calendars and holidays, performs single-level menu approval, and enforces user account authentication and fixed role assignments.

**Key Responsibilities:**
- Maintain academic structures: School years, semesters, grades, classes, and student enrollments (`F-MST-01`).
- Define meal program eligibility rules and evaluate student intake qualifications (`F-PAR-01`).
- Configure lunch-serving calendar days and institutional holiday/non-meal schedules (`F-MST-02`).
- Review and approve weekly menus submitted by the coordinator (streamlined 1-level review) (`F-PLN-02`).
- Manage staff and parent user accounts and assign fixed role permissions (`F-USR-01`, `F-USR-02`).

**System Permissions & Database Touchpoints:**
- Read/Write: `school_years`, `grades`, `classes`, `students`, `meal_eligibility`, `meal_calendars`, `holidays`, `users`, `roles`.
- Approve: `menus` (transition from `draft` / `submitted` $\rightarrow$ `approved`).

---

## Summary Matrix: Roles vs. 8 Business Domains

| Business Domain | ADM (Administrator) | MGR (Coordinator) | ACC (Accountant) | PAR (Parent) |
|---|:---:|:---:|:---:|:---:|
| **1. Student Meal Management** | Eligibility Rules (`F-PAR-01`) | Roster Lock (`F-PAR-03..04`) | Read Attendance Data | Registration (`F-PAR-02`) |
| **2. Meal Planning & Menu** | 1-Level Approval (`F-PLN-02`) | Dish & Calendar (`F-PLN-01..03`) | — | View Published Menu (`F-REP-03`) |
| **3. Meal Operation** | — | **Primary Lead (`F-OPS-01..05`)** | Read Reconciled Counts | View Delivery Verification |
| **4. Meal Fee & Cost** | — | — | **Primary Lead (`F-FEE-01..04`)** | View & Pay Bills |
| **5. Reporting & Transparency** | View All Reports | Ops Reports (`F-REP-01`) | Financial Reports (`F-REP-02`) | Parent Portal (`F-REP-03`) |
| **6. User & Access Management** | **Primary Lead (`F-USR-01..02`)** | User Profile | User Profile | User Profile |
| **7. Nutrition & Health** | — | Conflict Alerts (`F-NUT-02`) | — | Declare Allergies (`F-NUT-01`) |
| **8. Master Data & Config** | **Primary Lead (`F-MST-01..02`)** | Read Calendar | Read Student Directory | Read School Info |

