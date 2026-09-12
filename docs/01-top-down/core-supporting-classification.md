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

## Scope Decision

**Detailed analysis (Phases 01–09) focuses exclusively on the 4 Core Business Domains.**

Supporting domains are:
- Identified in the business-domains.md decomposition
- Deferred to Phase 2 scope
- Their key entities (e.g., `suppliers`, `purchase_orders`, `invoices`) are noted but not included in the Phase 1 database schema or use case specifications

---

## Summary Table

| Domain | Classification | Phase |
|--------|---------------|-------|
| Student Meal Management | **Core** | Phase 1 |
| Meal Planning & Menu Management | **Core** | Phase 1 |
| Meal Operation | **Core** | Phase 1 |
| Food Safety & Traceability | **Core** | Phase 1 |
| Food Supply & Inventory | Supporting | Phase 2 |
| Meal Fee & Cost Management | Supporting | Phase 2 |
| Reporting & Transparency | Supporting | Phase 2 |
