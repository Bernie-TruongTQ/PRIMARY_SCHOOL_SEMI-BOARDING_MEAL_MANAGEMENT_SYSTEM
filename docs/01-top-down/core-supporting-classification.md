# Core & Supporting Classification

## Classification Method

Classification is determined by the **Primary Business Value Chain Test**:

> "Does removing this domain break the primary value chain from student registration to meal delivery, receiving, and reconciliation?"

### Primary Operational Value Chain

```
[Student Meal Registration & Attendance]
                    ↓
[Meal Planning & Menu Assignment]
                    ↓
[Meal Demand & Quantity Calculation]
                    ↓
[Catering Vendor Order Dispatch]
                    ↓
[Meal Receiving & Quality Inspection]
                    ↓
[Classroom Meal Distribution]
                    ↓
[Meal Reconciliation (Ordered vs Delivered vs Consumed)]
```

A domain is classified as:
- **Core Domain**: Directly provides essential capabilities along the primary operational chain. Without it, meals cannot be registered, ordered, received, verified, or distributed.
- **Supporting Domain**: Enables operational feasibility, financial sustainability, safety governance, and administrative oversight, but does not execute the immediate physical meal delivery flow.
- **Generic / Foundation Domain**: Standard cross-cutting capabilities (user management, master academic data, configurations) required by all enterprise systems.

---

## Domain Classifications & Strategic Value

### 1. Student Meal Management — **[Core Domain]**

- **Why Core:** The entire meal chain starts with knowing who is eligible, who registered, and who is present today. Without student registration and attendance records, demand numbers cannot be computed and meals cannot be accounted for.
- **MVP Scope:** Eligibility criteria & evaluation, meal registration & modification, attendance recording, and basic attendance monitoring.

### 2. Meal Planning & Menu Management — **[Core Domain]**

- **Why Core:** Supplies the catalog of dishes, standard portion parameters, and scheduled daily menus that determine what is ordered and served.
- **MVP Scope:** Dish definition and catalog maintenance, menu creation, dish-to-menu assignment, simplified 1-level menu approval, and meal schedule calendar assignment.

### 3. Meal Operation — **[Core Domain]**

- **Why Core:** Represents the central execution hub: calculating total demand from student attendance, sending purchase orders to catering vendors, receiving and inspecting delivered hot meals, distributing them to classrooms, and reconciling discrepancies.
- **MVP Scope:** Demand aggregation, expected quantity calculation, order dispatch to caterer, delivered quantity logging, quality inspection, received quantity confirmation, distribution logging, and simplified reconciliation/discrepancy resolution.

---

## Supporting & Governance Domains

### 4. Nutrition & Health Management — **[Supporting / Safety Governance]**

- **Why Supporting:** Provides safety oversight by recording student allergies and dietary restrictions, checking them against menu ingredients, and warning coordinators before meals are ordered or served.
- **MVP Scope:** Record student dietary restrictions/allergens, flag restricted ingredients in menus, and trigger non-blocking conflict warnings.

### 5. Meal Fee & Cost Management — **[Supporting Domain]**

- **Why Supporting:** Manages student meal billing and tracks caterer meal costs. In a primary school semi-boarding environment, billing and reconciliation are financial settlement cycles that run periodically (monthly/termly); they do not block same-day child feeding.
- **MVP Scope:** Fee rate definition, chargeable meal calculation, simplified payment status tracking (unpaid/partial/paid), and catering vendor cost logging.

### 6. Reporting & Transparency — **[Supporting Domain]**

- **Why Supporting:** Consumes operational and financial event streams to provide visibility for school principals, accountants, catering partners, and parents.
- **MVP Scope:** Daily operation reports, vendor reconciliation reports, fee/payment reports, catering payable reports, and published daily menus for parents.

---

## Generic / Foundation Domains

### 7. User & Access Management — **[Generic / Foundation Domain]**

- **Why Foundation:** Provides authentication and role-based access control (RBAC) across administrative roles (System Admin, School Accountant, Semi-Boarding Coordinator, Parent).
- **MVP Scope:** User account registration/updates, fixed role assignments, and pre-defined permission sets.

### 8. Master Data & System Configuration — **[Generic / Foundation Domain]**

- **Why Foundation:** Stores fundamental institutional structures (school years, semesters, grades, classes, student profiles) and system rules (meal-serving days and holiday calendars).
- **MVP Scope:** Academic structure management (school year, class, grade, student profile), lunch serving schedule configuration, and holiday calendar maintenance.

---

## Classification & MVP Scope Matrix

| # | Business Domain | Strategic Classification | Role in System | MVP Implementation Status |
|---|---|---|---|---|
| **1** | **Student Meal Management** | **Core** | Eligibility, registration, attendance | **In MVP** |
| **2** | **Meal Planning & Menu Management** | **Core** | Dishes, menus, single-stage approval, schedules | **In MVP** |
| **3** | **Meal Operation** | **Core** | Demand forecast, vendor orders, receiving, distribution, reconciliation | **In MVP** |
| **4** | **Nutrition & Health Management** | **Supporting / Safety** | Allergy tracking, ingredient alerts | **In MVP (Simplified alerts)** |
| **5** | **Meal Fee & Cost Management** | **Supporting** | Fee setup, billing, payment status, caterer cost | **In MVP (Simplified payment)** |
| **6** | **Reporting & Transparency** | **Supporting** | Operations, vendor reconciliation, parent updates | **In MVP (Essential reports)** |
| **7** | **User & Access Management** | **Generic / Foundation** | Accounts, fixed roles, RBAC | **In MVP (Fixed roles)** |
| **8** | **Master Data & System Configuration** | **Generic / Foundation** | School years, classes, students, calendars | **In MVP** |


