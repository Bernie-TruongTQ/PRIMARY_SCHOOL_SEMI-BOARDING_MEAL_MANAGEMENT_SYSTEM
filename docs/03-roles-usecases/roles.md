# Actor Roles

## Role Derivation Source

All roles are derived directly from the Selected Core Features in [Phase 02](../02-core-features/core-feature-breakdown.md). A role exists because one or more core features require a specific human actor.

---

## ADM — School Administrator

**Derives from:** Cross-cutting configuration and user management needs across all core domains.

**Description:**
The School Administrator is the system owner at the school level. They configure master data (class lists, student enrollment, meal sessions, dish catalog), manage user accounts and role assignments, and handle school-year transitions.

**Responsibilities:**
- Configure school master data (classes, grade levels, school year)
- Enroll students into the meal program (F-STU-01)
- Manage system users and role assignments
- Configure meal session parameters (cutoff times, session codes)
- Manage the dish and ingredient catalog

**Interaction Style:** Infrequent, high-consequence actions. Mostly configuration at the start of school year or semester.

---

## MGR — Meal / Nutrition Manager

**Derives from:** F-MPN-01, F-MPN-02, F-MPN-03, F-MPN-04, F-MOP-01 (lock approval), F-MOP-02 (change request approval).

**Description:**
The Meal/Nutrition Manager is the central operational role. They design and publish weekly menus, oversee quantity calculation, approve post-cutoff change requests, and monitor daily preparation status.

**Responsibilities:**
- Design, approve, and publish weekly menus (F-MPN-01, F-MPN-02, F-MPN-03)
- Trigger and review meal demand quantity calculations (F-MPN-04)
- Monitor daily demand determination across all classes
- Review and approve/reject post-cutoff emergency change requests (F-MOP-02)
- Oversee preparation, distribution, and handover completion
- Generate and review daily reconciliation

**Interaction Style:** Daily operational role with both planning (weekly) and reactive (daily) interactions.

---

## KIT — Kitchen Staff

**Derives from:** F-MOP-03 (Meal Preparation), F-MOP-04 (Meal Distribution), F-MOP-05 (Meal Handover & Reconciliation).

**Description:**
Kitchen Staff execute the physical meal preparation and distribution. They view their preparation plan (quantities per dish), record actual quantities prepared, distribute meals per class, and confirm handover.

**Responsibilities:**
- View daily meal preparation plan
- Record actual quantities prepared per dish (F-MOP-03)
- View distribution plan per class
- Record actual quantities distributed per class (F-MOP-04)
- Confirm meal handover to class supervisor (F-MOP-05)
- Report discrepancies between planned and actual

**Interaction Style:** High-frequency daily interactions during meal preparation and distribution windows. Needs mobile-friendly, fast-input UI.

---

## TCH — Homeroom Teacher

**Derives from:** F-STU-03 (Record Daily Meal Participation), F-MOP-01 (participant in demand determination), F-MOP-05 (receives meal handover).

**Description:**
The Homeroom Teacher is responsible for their class's attendance record before the cutoff. They record which students will attend, mark absences, and confirm the meal handover from kitchen staff.

**Responsibilities:**
- Record daily student meal participation for their class (F-STU-03)
- Submit attendance data before the cutoff deadline (contributes to F-MOP-01)
- Submit post-cutoff change requests if needed (triggers F-MOP-02)
- Acknowledge meal handover receipt for their class (F-MOP-05)

**Interaction Style:** Single daily interaction window (before cutoff) plus an occasional second interaction (handover confirmation). Must be fast and mobile-friendly.

---

## STO — Storekeeper

**Derives from:** F-SAF-01 (Food Batch Registration), F-SAF-02 (Receiving Inspection). *Scoped to Phase 1.5.*

**Description:**
The Storekeeper manages the physical receipt of food deliveries. They inspect incoming ingredient batches, record batch metadata (supplier, quantity, expiry), and flag batches that fail inspection.

**Responsibilities:**
- Register incoming food batches (F-SAF-01)
- Record receiving inspection results per batch (F-SAF-01)
- Pass/fail batches and note rejection reasons
- Link batches to ingredients and meal plans

**Interaction Style:** Triggered by physical deliveries; 2–3 interactions per day during receiving windows.

> **Phase 1 Note:** The Storekeeper role is defined here for completeness but their use cases (UC-STO) are implemented in Phase 1.5. The database schema includes placeholders for `food_batches` and `receiving_inspections`.
