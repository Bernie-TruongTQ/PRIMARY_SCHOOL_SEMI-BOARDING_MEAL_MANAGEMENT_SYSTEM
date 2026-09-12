# Screen Inventory

This document lists all system screens required to support the **three active core operational modules**, indexed by Screen ID and mapped to their originating Use Cases, Core Features, Actors, and Primary Database Entities.

---

## Complete Screen Catalog

| Screen ID | Screen Name | Actor | Primary UC | Core Feature | Primary DB Entity | Status |
|---|---|:---:|---|---|---|:---:|
| **SCR-TCH-01** | Class Roster Meal Participation | TCH | UC-TCH-01 | `F-PAR-01` | `meal_participations` | Active MVP |
| **SCR-TCH-02** | Participation Amendment Modal | TCH | UC-TCH-02 | `F-PAR-02` | `meal_participation_changes` | Active MVP |
| **SCR-TCH-03** | Class Roster Confirmation & Lock | TCH | UC-TCH-03 | `F-PAR-03` | `meal_participations` | Active MVP |
| **SCR-TCH-04** | Post-Cutoff Emergency Request Form | TCH | UC-TCH-02 | `F-DMD-03` | `meal_demand_changes` | Active MVP |
| **SCR-MGR-01** | Demand Determination Dashboard | MGR | UC-MGR-01 | `F-DMD-01` | `meal_demands` | Active MVP |
| **SCR-MGR-02** | Dish Quantity Calculation & Overrides | MGR | UC-MGR-02 | `F-DMD-02` | `meal_demand_dish_quantities` | Active MVP |
| **SCR-MGR-03** | Demand Changes Review Queue | MGR | UC-MGR-03 | `F-DMD-03` | `meal_demand_changes` | Active MVP |
| **SCR-MGR-04** | Kitchen Shift Preparation Planning | MGR | UC-MGR-04 | `F-PRP-01` | `meal_preparation_plans` | Active MVP |
| **SCR-MGR-05** | Daily Prep Summary & Discrepancy Sign-off | MGR | UC-MGR-05 | `F-PRP-04` | `prepared_quantity_confirmations` | Active MVP |
| **SCR-KIT-01** | Kitchen Prep Shift Dashboard (Kiosk) | KIT | UC-KIT-01 | `F-PRP-01` | `meal_preparation_plans` | Active MVP |
| **SCR-KIT-02** | Ingredient Allocation Checklist | KIT | UC-KIT-02 | `F-PRP-02` | `ingredient_allocations` | Active MVP |
| **SCR-KIT-03** | Cooking Batch Execution & Yield Logging | KIT | UC-KIT-03 | `F-PRP-03` | `meal_preparations`, `meal_preparation_dish_records` | Active MVP |
| **SCR-KIT-04** | Prepared Quantity Verification Screen | KIT | UC-KIT-04 | `F-PRP-04` | `prepared_quantity_confirmations` | Active MVP |
| **SCR-ADM-01** | Student & Class Directory | ADM | UC-ADM-01 | Master Data | `students` | Active MVP |
| **SCR-ADM-02** | Meal Calendar & Schedule Setup | ADM | UC-ADM-02 | Master Data | `meal_schedules` | Active MVP |
| **SCR-ADM-03** | Dish & Ingredient Catalog Management | ADM | UC-ADM-03 | Master Data | `dishes`, `ingredients` | Active MVP |
| **SCR-ADM-04** | User Account & Role Permissions | ADM | UC-ADM-04 | Master Data | `users` | Active MVP |

---

## Screen Details & Functionality

### SCR-TCH-01 — Class Roster Meal Participation
- **Layout:** Mobile-first vertical list with quick-tap status chips (Present / Absent / Guest).
- **Controls:** Date & meal type selector, search by student name, batch "Mark All Attended" button.
- **Interactions:** Tap student card to toggle participation status or trigger SCR-TCH-02.

### SCR-TCH-02 — Participation Amendment Modal
- **Layout:** Slide-up bottom sheet modal.
- **Fields:** Target status radio group, change category dropdown (`status_update`, `correction`, `reschedule`), mandatory reason text input.

### SCR-TCH-03 — Class Roster Confirmation & Lock
- **Layout:** Summary modal with total headcount chips and countdown timer to cutoff.
- **Action:** Confirm button locks class roster and transitions state to `confirmed`.

### SCR-MGR-01 — Demand Determination Dashboard
- **Layout:** High-density desktop dashboard showing class submission progress bar, calculation method radio selector (`participation_based`, `manual_forecast`, `historical_average`), editable buffer % input, and final calculated headcount.

### SCR-MGR-02 — Dish Quantity Calculation & Overrides
- **Layout:** Table listing scheduled dishes, portion standard weights, headcount multiplier, calculated expected quantity, manual override field, and final planned quantity.

### SCR-MGR-03 — Demand Changes Review Queue
- **Layout:** Two-column triage view (queue on left, request detail & kitchen status preview on right) with one-click **Approve** and **Reject** buttons.

### SCR-KIT-01 — Kitchen Prep Shift Dashboard (Kiosk)
- **Layout:** High-contrast tablet kiosk view for kitchen wall mount. Large progress cards for each scheduled dish with deadline badges and target portion counters.

### SCR-KIT-02 — Ingredient Allocation Checklist
- **Layout:** Checkbox list of raw ingredients from storage with unit of measurement, allocated weight, and "Confirm Received" / "Report Shortage" actions.

### SCR-KIT-03 — Cooking Batch Execution & Yield Logging
- **Layout:** Station-based timer and logging view. Start/Stop cooking timers, batch number input, and numeric keypad for entering actual finished weight in kg/liters.

### SCR-KIT-04 — Prepared Quantity Verification Screen
- **Layout:** Comparison view (Target Planned vs Actual Yield). Variance percentage indicator (green if within tolerance, red if out-of-bounds). Mandatory discrepancy input field before final submit.
