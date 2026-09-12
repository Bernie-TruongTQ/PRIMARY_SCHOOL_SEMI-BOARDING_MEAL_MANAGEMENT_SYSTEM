# Actor Roles

## Role Derivation Source

All roles are derived directly from the human operations required by the **three active core modules** ([Phase 02](../02-core-features/core-feature-breakdown.md)):
1. **Meal Participation Management**
2. **Meal Demand & Quantity Management**
3. **Meal Preparation**

---

## 1. TCH — Homeroom Teacher / Class Supervisor

**Derives from:** `F-PAR-01`, `F-PAR-02`, `F-PAR-03` (Module 1).

**Description:**
The Homeroom Teacher is at the student frontline. They observe daily classroom attendance, receive absence notices from parents, and record each student's meal participation in the classroom.

**Key Responsibilities:**
- Record daily student attendance and meal participation per meal session (`F-PAR-01`).
- Update participation status (e.g. absent, late arrival) with explicit reasons before the cutoff time (`F-PAR-02`).
- Confirm and lock the class-level participation roster (`F-PAR-03`).
- Submit urgent post-lock participation change requests if emergencies occur.

**System Permissions & Database Touchpoints:**
- Insert/Update `meal_participations` (as `recorded_by`, `confirmed_by`).
- Insert `meal_participation_changes` (as `changed_by`).

---

## 2. MGR — Meal / Nutrition Manager

**Derives from:** `F-DMD-01`, `F-DMD-02`, `F-DMD-03`, `F-PRP-01`, `F-PRP-04` (Modules 2 & 3).

**Description:**
The Meal/Nutrition Manager oversees nutritional compliance, demand planning, and operational coordination between school classrooms and the central kitchen.

**Key Responsibilities:**
- Aggregate confirmed class attendance into session-level demand (`F-DMD-01`).
- Compute dish portion quantities and apply safety buffers (`F-DMD-02`).
- Review, approve, or reject post-lock demand modification requests (`F-DMD-03`).
- Create and schedule the kitchen meal preparation plan (`F-PRP-01`).
- Supervise discrepancies between planned demand and actual cooked yields (`F-PRP-04`).

**System Permissions & Database Touchpoints:**
- Insert/Update `meal_demands` (as `determined_by`, `confirmed_by`).
- Insert/Update `meal_demand_dish_quantities`.
- Review `meal_demand_changes` (as `reviewed_by`).
- Create `meal_preparation_plans` (as `planned_by`).

---

## 3. KIT — Kitchen Staff / Head Chef

**Derives from:** `F-PRP-01`, `F-PRP-02`, `F-PRP-03`, `F-PRP-04` (Module 3).

**Description:**
Kitchen Staff and the Head Chef execute physical meal preparation. They consume raw ingredients, run cooking batches, and report completed dishes.

**Key Responsibilities:**
- View the active daily meal preparation plan and target dishes (`F-PRP-01`).
- Accept and manage ingredient allocations from pantry storage (`F-PRP-02`).
- Start and complete cooking batches, logging actual produced quantities per dish (`F-PRP-03`).
- Perform physical quantity verification and record reasons for any cooking discrepancies (`F-PRP-04`).

**System Permissions & Database Touchpoints:**
- Update `ingredient_allocations` (allocation status: `allocated`, `adjusted`, `returned`).
- Insert/Update `meal_preparations` (as `prepared_by`) and `meal_preparation_dish_records`.
- Sign off `prepared_quantity_confirmations` (as `confirmed_by`).

---

## 4. ADM — School Administrator

**Derives from:** System configuration and reference master data governance.

**Description:**
The School Administrator maintains foundational master data and user accounts across the institution.

**Key Responsibilities:**
- Maintain student records, classroom assignments, and meal eligibility (`students`).
- Configure academic calendars and daily meal session schedules (`meal_schedules`).
- Manage user authentication, roles, and access rights (`users`).
- Maintain baseline dish catalogs and standard recipes (`dishes`, `ingredients`).

---

## Summary Matrix: Roles vs. Modules

| Role | Module 1: Participation | Module 2: Demand & Quantity | Module 3: Preparation | Master Data |
|---|---|---|---|---|
| **TCH (Teacher)** | **Primary Actor** (Log & Change) | Consumer / Change Requester | — | Read Class List |
| **MGR (Manager)** | Supervisor (Review Roster) | **Primary Actor** (Calculate & Approve) | Planner & Approver | Configures Buffers |
| **KIT (Kitchen)** | — | Consumer (Receives Targets) | **Primary Actor** (Cook & Verify) | Read Recipes/Stock |
| **ADM (Admin)** | Master Data Setup | Parameter Setup | Station Setup | **Primary Owner** |
