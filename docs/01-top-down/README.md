# Phase 01 — Top-Down Decomposition

## What is this?

This folder contains the results of the **top-down functional decomposition** of the Primary School Semi-Boarding Meal Management System.

Top-down decomposition starts from the business problem and systematically breaks it into business domains, sub-domains, capabilities, and functions — before any solution, role, screen, or database table is considered.

## Why did we decompose it?

Without decomposition, system design defaults to building screens around gut feelings or copying existing spreadsheets. Decomposition ensures:

1. **Nothing is missed** — every function the system must support is identified from business need, not from implementation assumption.
2. **Scope is justified** — we can explain why each function exists by tracing it back to a business domain.
3. **Core vs. supporting is defensible** — classification is based on whether a function is on the primary value chain, not on personal preference.

## Decomposition Levels

```
Level 0 — System
    └── Level 1 — Business Domain
            └── Level 2 — Sub-Domain / Capability
                    └── Level 3 — Function
```

## Resulting Business Domains & MVP Scope

From the functional decomposition mind map ([PRIMARY SCHOOL SEMI-BOARDINGMEAL MANAGEMENT SYSTEM.png](./PRIMARY%20SCHOOL%20SEMI-BOARDINGMEAL%20MANAGEMENT%20SYSTEM.png)), the system is organized into **8 business domains**, all of which have defined capabilities in the MVP baseline:

| # | Business Domain | Strategic Role | Primary Value Chain Position | MVP Scope Coverage |
|---|---|---|---|---|
| 1 | **Student Meal Management** | Core | Upstream demand origin (eligibility, enrollment, daily attendance) | Full MVP |
| 2 | **Meal Planning & Menu Management** | Core | Nutritional dish definitions, menu design, meal scheduling | Full MVP (1-level approval) |
| 3 | **Meal Operation** | Core | Operational demand calculation, vendor order dispatch, receiving, distribution & reconciliation | Full MVP (streamlined discrepancies) |
| 4 | **Nutrition & Health Management** | Supporting / Safety | Allergy records, restricted ingredient flags, conflict alerts | Simplified MVP (visual alerts) |
| 5 | **Meal Fee & Cost Management** | Supporting | Fee configuration, chargeable meal calculations, payment tracking, catering costs | Simplified MVP (basic status flow) |
| 6 | **Reporting & Transparency** | Supporting | Operational summaries, caterer reconciliation reports, published menus | Simplified MVP (essential reports) |
| 7 | **User & Access Management** | Generic / Foundation | User registration, fixed RBAC roles (Admin, Accountant, Coordinator, Parent) | Simplified MVP (fixed permissions) |
| 8 | **Master Data & System Configuration** | Generic / Foundation | Academic school year, grades, classes, student profiles, meal calendars | Full MVP |

## Artifacts in this folder

| File | Purpose |
| ---- | ------- |
| [PRIMARY SCHOOL SEMI-BOARDINGMEAL MANAGEMENT SYSTEM.png](./PRIMARY%20SCHOOL%20SEMI-BOARDINGMEAL%20MANAGEMENT%20SYSTEM.png) | Full system decomposition mind map (visual) |
| [MVP.md](MVP.md) | Baseline MVP scope definitions and functional requirements |
| [business-domains.md](business-domains.md) | All 8 business domains with their Level 2 capabilities & Level 3 functions |
| [core-supporting-classification.md](core-supporting-classification.md) | Value chain test, domain categorization (Core, Supporting, Foundation), and MVP scope matrix |

## Next Step

→ [Phase 02 — Core Feature Breakdown](../02-core-features/README.md)


