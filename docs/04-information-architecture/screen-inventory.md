# Screen Inventory & Specification Matrix

## 1. Overview

The Screen Inventory catalogs all **17 distinct screens** across the 4 role portals of the Primary School Semi-Boarding Meal Management System. Every screen is cross-referenced with:
- **INVEST User Stories** ([Phase 02](../02-core-features/invest-requirements.md))
- **Actor Use Cases & RACI** ([Phase 03](../03-roles-usecases/README.md))
- **Relational Database Entities** ([Phase 06](../06-database/data-dictionary.md))
- **Frontend Prototype Elements** ([frontend/README.md](../../frontend/README.md))

---

## 2. Complete Screen Catalog (17 Operational Screens)

### 2.1. Teacher Portal (`SCR-TCH`) — Module 1

| Screen ID | Screen Name | Route Path | Target Actor | INVEST Story & Use Case | Primary Database Entities | Core UI Components & Actions |
|---|---|---|---|---|---|---|
| **SCR-TCH-01** | Classroom Attendance Roster | `/teacher/roster` | Homeroom Teacher (`TCH`) | **US-PAR-01**<br>`UC-TCH-01` | `meal_participations`<br>`students`<br>`classes`<br>`meal_schedules` | • Class switcher tabs (1A..5E)<br>• Metric header (Registered, Eating, Absent)<br>• Cutoff countdown timer (08:30 AM)<br>• Student roster rows with Eating/Absent toggle pills<br>• Allergy warning badges (Peanut, Seafood)<br>• "Quick Mark All Present" button<br>• "Confirm & Lock Roster" CTA |
| **SCR-TCH-02** | Attendance Amendment Modal | `/teacher/roster/amend` | Homeroom Teacher (`TCH`) | **US-PAR-02**<br>`UC-TCH-02` | `meal_participation_changes`<br>`meal_participations` | • Slide-up bottom sheet / modal<br>• Current status vs New status selector<br>• Reason dropdown (Sick, Early Pickup, Late, Custom)<br>• Free-text notes input<br>• "Save Amendment & Log Audit" CTA |
| **SCR-TCH-03** | Roster Confirmation & Lock View | `/teacher/roster/confirm` | Homeroom Teacher (`TCH`), Supervisor (`TCH_SUP`) | **US-PAR-03**<br>`UC-TCH-03` | `meal_participations` (`confirmed`) | • Summary verification sheet (Headcount breakdown)<br>• Unmarked student warning banner<br>• Checkbox acknowledgment: "I confirm roster accuracy"<br>• "Lock & Handover to Kitchen" primary CTA<br>• Transition to Read-Only roster state |
| **SCR-TCH-04** | Post-Cutoff Emergency Request Sheet | `/teacher/emergency-request` | Homeroom Teacher (`TCH`) | **US-DMD-03**<br>`UC-TCH-04` | `meal_demand_changes`<br>`meal_demands` | • Modal triggered on post-08:30 edits<br>• Change type toggle (+ Add Meals / - Remove Meals)<br>• Delta number input stepper<br>• Mandatory justification textarea<br>• "Submit Emergency Request" CTA |

---

### 2.2. Manager Portal (`SCR-MGR`) — Modules 2 & 3

| Screen ID | Screen Name | Route Path | Target Actor | INVEST Story & Use Case | Primary Database Entities | Core UI Components & Actions |
|---|---|---|---|---|---|---|
| **SCR-MGR-01** | Demand Determination Board | `/manager/demand` | Meal & Nutrition Manager (`MGR`) | **US-DMD-01**<br>`UC-MGR-01` | `meal_demands`<br>`meal_participations` | • 20-Classroom attendance rollup progress table<br>• Status badge: `Open for changes` vs `Locked`<br>• Calculation method radio: `participation_based`, `manual_forecast`, `historical_average`<br>• Safety buffer stepper control ($0\%\text{--}10\%$)<br>• Final headcount calculation display<br>• "Approve & Lock Daily Demand" CTA |
| **SCR-MGR-02** | Expected Dish Raw Quantities | `/manager/quantities` | Meal & Nutrition Manager (`MGR`), Chef (`KIT_CHEF`) | **US-DMD-02**<br>`UC-MGR-02` | `meal_demand_dish_quantities`<br>`dishes`<br>`ingredients` | • Menu breakdown table by dish<br>• Headcount multiplier $\times$ Standard portion<br>• Gross raw weight vs net cooked weight conversion<br>• Manual rounding override inputs (e.g. 62.4kg $\rightarrow$ 63kg)<br>• "Publish Quantities to Kitchen" CTA |
| **SCR-MGR-03** | Post-Lock Emergency Review Queue | `/manager/changes` | Meal & Nutrition Manager (`MGR`), Director (`DIR`) | **US-DMD-03**<br>`UC-MGR-03` | `meal_demand_changes`<br>`meal_demands` (`revised`) | • Real-time list of pending teacher emergency requests<br>• Request cards showing Class, Delta ($\pm N$), Reason, Timestamp<br>• One-click "Approve" and "Reject" actions<br>• Rejection reason modal<br>• Automatic demand delta recalculation badge |
| **SCR-MGR-04** | Kitchen Shift Plan Authoring | `/manager/prep-plans` | Meal & Nutrition Manager (`MGR`), Chef (`KIT_CHEF`) | **US-PRP-01**<br>`UC-MGR-04` | `meal_preparation_plans`<br>`meal_preparation_plan_dishes` | • Shift schedule header (Lunch 10:45 AM deadline)<br>• Station task assignment matrix (Rice, Sauté, Soup)<br>• Target quantity line items<br>• Shift lead assignment dropdown<br>• "Publish Shift Plan to Kiosk" CTA |
| **SCR-MGR-05** | Daily Yield Reconciliation & Audit | `/manager/reconciliation` | Meal & Nutrition Manager (`MGR`), Inspector (`INS`) | **US-PRP-04**<br>`UC-MGR-05` | `prepared_quantity_confirmations`<br>`meal_preparations` | • Real-time comparison table: Target vs Cooked yield<br>• Discrepancy indicator ($\pm \Delta\%$ variance)<br>• Tolerance threshold warning flags ($>\pm 3\%$)<br>• Reviewer digital signature / approval sign-off<br>• Export daily compliance summary PDF/CSV |

---

### 2.3. Kitchen Kiosk Portal (`SCR-KIT`) — Module 3

| Screen ID | Screen Name | Route Path | Target Actor | INVEST Story & Use Case | Primary Database Entities | Core UI Components & Actions |
|---|---|---|---|---|---|---|
| **SCR-KIT-01** | Active Prep Shift Board | `/kitchen/shift` | Head Chef (`KIT_CHEF`), Station Cook (`KIT_COOK`) | **US-PRP-01**<br>`UC-KIT-01` | `meal_preparation_plans`<br>`meal_preparation_plan_dishes` | • High-contrast dark/industrial layout<br>• Total target meal count banner (e.g., 630 Meals)<br>• Giant shift countdown clock to 10:45 AM<br>• Menu station cards (Staple, Main, Soup, Greens)<br>• Station status badges (`Pending`, `Cooking`, `Ready`)<br>• Direct jump buttons to station cooking timers |
| **SCR-KIT-02** | Storage Ingredient Receiving Checklist | `/kitchen/ingredients` | Pantry Handler (`KIT_PANTRY`), Chef (`KIT_CHEF`) | **US-PRP-02**<br>`UC-KIT-02` | `ingredient_allocations`<br>`ingredients` | • Raw ingredient receiving table (Pork, Rice, Eggs, Greens)<br>• Required target weight vs scale weight entry<br>• Quick status buttons: `Matched` (Green) / `Shortfall` (Amber)<br>• Shortfall reason picker (Trimming waste, supplier deficit)<br>• "Confirm Stock Intake" CTA |
| **SCR-KIT-03** | Station Cooking Timers & Batch Logger | `/kitchen/cooking` | Station Cook (`KIT_COOK`), Chef (`KIT_CHEF`) | **US-PRP-03**<br>`UC-KIT-03` | `meal_preparations`<br>`meal_preparation_dish_records` | • Touch-friendly batch cards per station<br>• Large "Start Batch" / "Pause" / "Complete" controls<br>• Live cooking progress timer<br>• On-screen oversized numeric keypad for scale weight entry<br>• Multi-batch support (Batch #1, Batch #2)<br>• Local IndexedDB offline queue indicator |
| **SCR-KIT-04** | Prepared Yield Verification Gate | `/kitchen/verification` | Head Chef (`KIT_CHEF`), Inspector (`INS`) | **US-PRP-04**<br>`UC-KIT-04` | `prepared_quantity_confirmations` | • Final distribution gatekeeper screen<br>• Cooked dish scale readout entry<br>• Automated tolerance comparison ($\pm 3\%$ window)<br>• Green "Portions Approved" pass chip<br>• Red "Tolerance Exceeded" alert requiring mandatory note<br>• "Sign-off & Release Trays" primary CTA |

---

### 2.4. Admin Portal (`SCR-ADM`) — Master Data

| Screen ID | Screen Name | Route Path | Target Actor | Role & Setup Scope | Primary Database Entities | Core UI Components & Actions |
|---|---|---|---|---|---|---|
| **SCR-ADM-01** | Student & Classroom Directory | `/admin/students` | System Administrator (`ADM`) | Term Student Ingestion & Class Rosters | `students`<br>`classes` | • Search & filterable student datagrid<br>• Student profile modal (Allergy notes, Parent contact)<br>• Bulk CSV import for start-of-year enrollment<br>• Class assignment editor |
| **SCR-ADM-02** | Meal Schedules & Cutoff Setup | `/admin/schedules` | System Administrator (`ADM`) | Operational Scheduling Parameters | `meal_schedules` | • Academic calendar view<br>• Daily session editor (Breakfast, Lunch, Snack)<br>• Session cutoff time configuration (e.g., 08:30 AM)<br>• Holiday / non-service date blackout toggle |
| **SCR-ADM-03** | Dish & Recipe Master Catalog | `/admin/catalog` | System Administrator (`ADM`), Nutritionist | Nutritional Portion Standards | `dishes`<br>`ingredients` | • Dish catalog with imagery and nutritional info<br>• Standard portion size setup (grams per student)<br>• Recipe ingredient breakdown and units<br>• Standard cooking thermal loss yield coefficient |
| **SCR-ADM-04** | User Roles & Access Control | `/admin/users` | System Administrator (`ADM`) | Security & Identity Governance | `users`<br>`roles` | • Staff user directory<br>• Role assignment (`teacher`, `manager`, `kitchen`, `admin`)<br>• Classroom assignment for homeroom teachers<br>• Password reset and session revocation |
