# Core & Supporting Classification

## Classification Method

Classification is determined by the **Primary Business Value Chain Test**:

> "Does removing this domain break the primary value chain from student need to meal delivery?"

### Primary Value Chain

```
Student Enrollment
       ↓
Meal Planning & Menu Design
       ↓
Demand Calculation (Headcount → Quantities)
       ↓
Meal Preparation
       ↓
Meal Distribution
       ↓
Meal Handover to Class
       ↓
Food Safety Verification & Traceability
```

A domain is **Core** if it contributes directly to at least one step in this chain and its absence causes the chain to break.
A domain is **Supporting** if it enables, reports on, or finances the chain, but the chain can temporarily function without it.

---

## Core Business Domains

### 1. Student Meal Management

**Why Core:** The value chain cannot start without knowing who is enrolled in the meal program. Student registration drives the baseline headcount used in demand calculation. Without this domain, neither demand nor quantities can be computed.

- Feeds: Demand Calculation, Meal Distribution, Fee Collection
- If removed: System has no student list → demand is unknown → entire chain collapses

### 2. Meal Planning & Menu Management

**Why Core:** Demand Calculation requires a menu (which dishes?) and standard portion sizes (how much per student?). Without this domain, the formula `Total Raw = Headcount × Portion × (1 + Buffer%)` cannot be executed.

- Feeds: Demand Calculation, Kitchen Preparation Plan, Food Safety Traceability
- If removed: Quantities cannot be calculated → preparation is guesswork

### 3. Meal Operation

**Why Core:** This is the operational execution layer. Demand determination, preparation, distribution, handover, and reconciliation are all here. This domain *is* the primary value chain in its operational form.

- Feeds: All downstream domains (Safety, Cost, Reporting)
- If removed: No meals are tracked, prepared, or distributed

### 4. Food Safety & Traceability

**Why Core:** In a school meal context, food safety is not optional. Regulatory and ethical requirements mandate that every ingredient batch be inspectable. Food safety incidents must be traceable back to specific students, meals, and suppliers within hours, not days.

- Feeds: Incident Management, Parent Transparency, Supplier Rating
- If removed: System cannot respond to contamination events → regulatory and reputational risk

---

## Supporting Domains

### 5. Food Supply & Inventory

**Why Supporting:** Inventory management enables efficient procurement and reduces waste, but the core value chain (demand → preparation → distribution) can function with manual purchasing. This domain optimizes the chain; it does not constitute the chain.

- Becomes Core in Phase 2 when automated procurement is introduced.

### 6. Meal Fee & Cost Management

**Why Supporting:** Fee collection is a financial operation that occurs monthly, after meals are delivered. Students are not denied meals due to unpaid invoices in a school context. Cost tracking enables financial oversight but does not affect daily meal delivery.

- Becomes Core in Phase 2 when real-time cost per meal is used to control daily spend.

### 7. Reporting & Transparency

**Why Supporting:** Dashboards and parent-facing reports are derived from the data produced by the Core domains. They are read-only consumers of the value chain, not contributors. Removing them does not affect meal delivery — only visibility.

- Becomes Core in Phase 2 when reports drive real-time operational decisions (e.g., auto-halt preparation on alert).

---

## Active Core Scope Selection (Mind Map → Focus Modules)

From the full 7-domain decomposition, a strategic scoping decision was made to focus the detailed specification, UI/UX, and database architecture on the **three most critical operational modules** on the daily school meal execution chain:

1. **Meal Participation Management** *(from Student Meal Management)*: Captures student attendance and daily meal participation, manages pre/post cutoff status updates, and handles supervisor confirmation.
2. **Meal Demand & Quantity Management** *(from Meal Planning & Operation)*: Aggregates class-level participation into daily meal session demands, computes expected dish quantities, and processes post-lock demand amendments.
3. **Meal Preparation** *(from Meal Operation & Kitchen Execution)*: Orchestrates kitchen preparation plans, tracks ingredient allocation from storage, logs cooking batches per dish, and verifies prepared quantities against expected demand with discrepancy tracking.

### Deferred Domains & Reference Boundaries

Other domains remain part of the long-term vision but are **Deferred to Future Phases**:
- **Food Safety & Traceability**: Critical regulatory domain; interfaces via reference batch/inspection IDs in future iterations.
- **Food Supply & Procurement**: Manages supplier contracts and procurement; interacts with Phase 1 via simplified `ingredients` reference.
- **Meal Fee & Cost Management**: Financial billing; interacts via recorded participation snapshots.
- **Full Menu Planning & Nutritional Compliance**: Represented in Phase 1 via simplified `meal_schedules` and `dishes` catalogs.

---

## Summary Table

| Domain / Module | Classification | Implementation Status | Core Artifacts |
|---|---|---|---|
| **Meal Participation Management** | **Active Core** | **Phase 1 (Active)** | `meal_participations`, `meal_participation_changes` |
| **Meal Demand & Quantity Management** | **Active Core** | **Phase 1 (Active)** | `meal_demands`, `meal_demand_dish_quantities`, `meal_demand_changes` |
| **Meal Preparation** | **Active Core** | **Phase 1 (Active)** | `meal_preparation_plans`, `ingredient_allocations`, `meal_preparations`, `meal_preparation_dish_records`, `prepared_quantity_confirmations` |
| Meal Planning & Catalog (Basic) | Reference Boundary | Phase 1 (Minimal) | `meal_schedules`, `dishes`, `meal_registrations` |
| Master Student & User Reference | Reference Boundary | Phase 1 (Minimal) | `students`, `users` |
| Food Safety & Traceability | Supporting / Regulatory | Deferred (Phase 2) | External reference |
| Food Supply & Inventory (Master) | Supporting | Deferred (Phase 2) | Simplified `ingredients` |
| Meal Fee & Cost Management | Supporting | Deferred (Phase 2) | External billing |
| Reporting & Transparency | Supporting | Deferred (Phase 2) | Operational views |

