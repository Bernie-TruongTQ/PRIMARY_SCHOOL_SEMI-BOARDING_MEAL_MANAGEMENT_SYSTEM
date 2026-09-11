# Meal Demand & Quantity Management System
### Primary School Semi-Boarding Meal Operation

A web application designed for primary school semi-boarding meal management, empowering **Homeroom Teachers**, **Boarding Supervisors**, and **Kitchen Managers** to determine daily meal attendance, calculate required raw food quantities, and coordinate last-minute emergency adjustments.

---

## 🌟 Overview

The application adopts a modern **Education & F&B SaaS aesthetic**, adhering to **Material Design 3 (MD3)** principles. Built with a warm, appetite-friendly color palette (sunlit terracotta `#E05318`, fresh herb green `#16A34A`, set against clean warm neutrals `#F8FAFC`), it features 12px rounded cards, soft shadows, clear iconography, and responsive layouts that default to a spacious **Desktop / Tablet Dashboard** with an instant toggle for an authentic **Mobile (390px)** frame.

The module solves three high-friction challenges in school meal management:
1. **Attendance Discrepancy:** Eliminating manual paper rosters with real-time class attendance roll calls and dietary/allergen alerts.
2. **Food Over/Under-Production:** Scaling standardized recipes dynamically from confirmed student counts with customizable safety buffers.
3. **Emergency Disruption:** Handling post-cutoff late additions and absences via structured approval workflows and automated audit trails.

*(Note: The repository also includes `ui/index.html` as a complementary prototype showcasing the broader 5-stage kitchen execution pipeline from prep Kanban to reconciliation).*

---

## 📱 The 3 Connected Core Screens

```
[ Screen 1: Determine Demand ] ──► [ Screen 2: Calculate Quantities ] ──► [ Screen 3: Manage Changes ]
  • Live Class Roll Call            • Scaled Ingredients Matrix           • Emergency Request Triage
  • Cutoff Countdown & Lock         • Dynamic Buffer Steppers (+/-)       • Slide-up Bottom Sheet
  • Allergen & Dietary Badges       • Transparency Formula Row            • Visual Audit Timeline
```

---

### 1. Determine Meal Demand (`#screen-determine`)

Enables homeroom teachers and boarding supervisors to record student attendance per classroom before the morning cutoff deadline.

* **Top Metric Overview:**
  * **Base Registered (420):** Baseline enrolled semi-boarding students.
  * **Confirmed Attend (408):** Live confirmed student headcount.
  * **Absent (16):** Excused absences with reasons (*Fever/Flu, Dental, Family trip*).
  * **Extra Guests (4):** Supervising staff and meal monitors.
* **Real-Time Cutoff Countdown:** Persistent countdown badge (e.g., `08:30 AM Cutoff • 42 min remaining`) displaying `Open for changes` (green) or `Locked` (gray).
* **Interactive Class Accordions:** Collapsible cards for Grades 1 through 5. Expanding a class reveals the full student roster.
* **Per-Student Attendance Controls:** Granular radio buttons per student (**Attend** / **Absent** / **Guest**). Toggling status reactively updates class attendance tallies and top-level summary metrics.
* **Dietary & Allergen Warning Badges:** Color-coded tags attached directly to student rows (*⚠️ Peanut allergy, Lactose sensitive, Vegetarian*).
* **"Lock Demand" Action:** A supervisor confirmation action that locks attendance changes, changes badge state to `Locked`, and hands off finalized headcounts to the kitchen.
* **Floating Action Button (FAB):** Quick-launch button to submit attendance changes directly from Screen 1.

#### Database Schema Alignment:
| UI Component / Field | SQL Database Table | Relevant Columns |
|---|---|---|
| Headcount summaries & lock status | `daily_meal_demands` | `demand_date`, `meal_session_id`, `class_id`, `base_registered_count`, `confirmed_attend_count`, `absence_count`, `extra_count`, `determination_status`, `locked_at` |
| Per-student attendance & reasons | `daily_meal_demand_details` | `student_id`, `intention` (`attend`, `absent`, `extra_guest`), `reason`, `is_within_cutoff` |
| Session selection & cutoff time | `meal_sessions` | `code`, `registration_cutoff_time`, `is_active` |

---

### 2. Calculate Meal Quantities (`#screen-quantities`)

Empowers kitchen managers to scale dish ingredients automatically from finalized headcounts, customize safety shrinkage buffers, and prevent food shortages or waste.

* **Planned Headcount Summary Banner:** Highlights active meal session, total planned headcount (412 portions), and calculation status (`Auto-calculated`).
* **Scaled Recipe & Raw Material Table:**
  * Displays dishes categorized into *Main Dish*, *Staple Rice*, *Soup / Broth*, *Vegetable / Fiber*, and *Dessert / Dairy*.
  * Standard unit portion sizing ($g$ or $ml$ per student).
  * Net cooked requirement and gross raw material required.
* **Inline Buffer Stepper Controls:** Direct `[-]` and `[+]` interactive stepper buttons in each table row to adjust safety buffers (0% to 20%) with instant raw weight recalculation.
* **Transparency Scaling Formula Row:** Explains the calculation logic clearly:
  $$\text{Total Raw} = \text{Headcount} \times \text{Portion} \times (1 + \text{Buffer}\% + \text{Waste}\%)$$
* **"Recalculate All" Action:** Re-runs calculations from the latest confirmed attendance data and resets adjusted buffers.
* **Sticky Total Bar:** Fixed summary bar displaying aggregate raw ingredient weight (kg) and portion counts across all menu items.

#### Database Schema Alignment:
| UI Component / Field | SQL Database Table | Relevant Columns |
|---|---|---|
| Scaled recipe items & quantities | `expected_meal_quantities` | `daily_meal_demand_id`, `menu_dish_id`, `planned_headcount`, `unit_portion_size`, `unit`, `buffer_percentage`, `total_quantity`, `calculation_method` |
| Dish specifications & portion standards | `menu_dishes`, `dishes` | `dish_name`, `category`, `standard_portion_size`, `unit` |
| Daily scheduled menu | `menus` | `menu_date`, `meal_session_id`, `status` |

---

### 3. Manage Demand Changes (`#screen-changes`)

Handles late arrivals, emergency medical pickups, and guest portion adjustments occurring after the official cutoff deadline.

* **Emergency Request Highlighting:** Requests submitted post-cutoff are distinguished by a bold red accent border and an `⚡ Emergency` badge.
* **Role-Authorized Approval Actions:** Kitchen managers and supervisors can execute one-click `Approve` or `Reject` actions, updating status chips and synchronizing demand counts.
* **Category Filter Chips:** Rapidly filter requests by *All*, *Pending*, *Approved*, or *Rejected*.
* **New Change Request Modal (Slide-up Bottom Sheet):**
  * Accessible via the top action bar or bottom Floating Action Button (FAB).
  * Validated input fields: Target Type (*Student* / *Staff Guest*), Classroom, Student selection, Change Type (*Late Addition*, *Early Departure*, *Dietary Change*), Quantity Delta, and Justification Reason.
* **Audit Trail & History Timeline:**
  * Vertical chronological timeline with connected nodes and timestamps.
  * Tracks old $\rightarrow$ new field value transitions, who submitted the request, and who authorized it.

#### Database Schema Alignment:
| UI Component / Field | SQL Database Table | Relevant Columns |
|---|---|---|
| Change requests & approval triage | `meal_demand_change_requests` | `daily_meal_demand_id`, `student_id`, `change_type`, `requested_quantity_delta`, `reason`, `is_emergency`, `approval_status`, `approved_by`, `approved_at` |
| Audit trail & field modifications | `meal_demand_change_logs` | `change_request_id`, `field_changed`, `old_value`, `new_value`, `changed_by`, `changed_at`, `note` |

---

## 📁 Repository Structure

```
Top-Down-Approach/
├── database/
│   ├── PRIMARY SCHOOL SEMI-BOARDING MEAL MANAGEMENT SYSTEM.sql   # PostgreSQL DDL schema & constraints
│   ├── PRIMARY SCHOOL SEMI-BOARDING MEAL MANAGEMENT SYSTEM.png   # Entity Relationship Diagram (ERD)
│   └── DBDOCS.md                                                 # Comprehensive schema documentation
├── ui/
│   ├── demand.html         # Main application: Meal Demand & Quantity Management suite
│   ├── index.html          # Reference prototype: 5-screen general meal operation workflow
│   ├── css/
│   │   ├── style.css       # Design tokens (MD3), typography, reset, & viewport frame switcher
│   │   ├── demand.css      # Dedicated styles for Demand screens, inline steppers, & timeline
│   │   └── screens.css     # Styles for general operation screens (Kanban, distribution)
│   └── js/
│       ├── demandData.js   # Mock dataset mirroring daily_meal_demands & change_requests schema
│       ├── demandApp.js    # Interactive logic: reactive roll call, formula steppers, & modals
│       ├── mockData.js     # Reference dataset for general operation module
│       └── app.js          # Reference script for general operation module
├── taste-SKILL.md          # UI/UX design guidelines and standards
└── README.md
```

---

## 🚀 Getting Started & Testing

Start a lightweight HTTP server in the repository root:

```bash
python -m http.server 8080 --directory ui
```

Open your browser and navigate directly to the application:
👉 **`http://localhost:8080/demand.html`**

### Interactive User Experience Features:
1. **Screen Navigation:** Use the top tab bar to switch between **Determine Demand**, **Calculate Quantities**, and **Manage Changes**.
2. **Attendance Roll Call:** Expand class accordions (e.g. *Class 1A*, *Class 2A*) and toggle student attendance status (**Attend** / **Absent** / **Guest**) to see class counts and top cards update reactively.
3. **Safety Buffer Adjustment:** In Screen 2, click `[-]` and `[+]` on any dish row to adjust buffer percentages and observe immediate raw quantity updates.
4. **Submit & Triage Changes:** In Screen 3, click the `+ New Request` button to test the slide-up modal, then click `Approve` on emergency items to watch the status update and the audit log expand.
5. **Responsive Viewport Toggle:** Use the toolbar switch at the very top of the window to toggle between the default **Desktop / Tablet Dashboard** and the compact **Mobile (390px)** frame.
6. **Role Perspective Switcher:** Switch between **Kitchen Staff**, **Homeroom Teacher**, and **Boarding Supervisor** in the top bar to inspect contextual permission states.
