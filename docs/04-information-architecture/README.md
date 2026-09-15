# Phase 04 — Information Architecture

## Overview

Information Architecture (IA) establishes the structural backbone of the **Primary School Semi-Boarding Meal Management System**. It bridges the high-level business specifications and INVEST requirements ([Phase 02](../02-core-features/invest-requirements.md)) and actor use cases ([Phase 03](../03-roles-usecases/README.md)) to the visual UI/UX wireframes ([Phase 05](../05-ui-ux/README.md)) and the underlying relational database architecture ([Phase 06](../06-database/README.md)).

```
INVEST User Stories (Phase 02) & Role Use Cases (Phase 03)
                           ↓
        Information Architecture (Phase 04)
 ├── INFORMATION_ARCHITECTURE.md  → Master canonical specification
 ├── sitemap.md                   → Role-based navigation maps (Mermaid C4)
 ├── screen-hierarchy.md          → View nesting & modal depth limits
 ├── screen-inventory.md          → 17 active screens mapped to DB entities
 └── task-flows.md                → 5 end-to-end Mermaid decision task flows
                           ↓
        UI/UX Design & Frontend Prototype (Phase 05 / frontend)
                           ↓
        Relational Database Schema & Entities (Phase 06)
```

---

## Architecture Objectives

1. **Role Separation & Autonomy**: Decouple operational workflows into 4 dedicated portals:
   - **Teacher Portal (`/teacher`)**: Optimized for mobile devices (390px viewport), fast morning student attendance toggles, allergy warnings, and cutoff roster locking.
   - **Manager Portal (`/manager`)**: Analytical dashboard for demand aggregation, buffer calculation, raw dish quantities, and post-lock emergency request triage.
   - **Kitchen Kiosk Portal (`/kitchen`)**: High-contrast, wall-mounted kiosk interface with large touch targets, live station countdown timers, and offline-resilient batch logging.
   - **Admin Portal (`/admin`)**: Master catalog management for students, classrooms, meal calendars, recipes, and user permissions.
2. **Strict Navigation Depth (Max 2 Levels)**: Ensure users never navigate deeper than `/portal/screen`. Complex secondary interactions (e.g., amendment reasons, emergency request forms, discrepancy justifications) are presented via non-destructive contextual slide-up sheets or modal dialogs.
3. **Operational State Synchronization**: Enable real-time state handoffs across operational boundaries:
   - Classroom Attendance Confirmed (`08:30 AM`) $\rightarrow$ Demand Aggregated & Locked $\rightarrow$ Kitchen Prep Plan Published $\rightarrow$ Cooking Executed $\rightarrow$ Yield Verified (`10:45 AM`).
4. **Resiliency Against Edge Cases**: Native handling of the 5 core operational friction points defined in `invest-requirements.md`:
   - Concurrency race conditions at daily cutoff.
   - Discrete unit vs continuous weight buffer rounding.
   - Post-lock emergency delta reconciliation.
   - Thermal yield cooking loss (Gross Raw vs Net Cooked).
   - Kitchen offline-first network resiliency.

---

## Documentation Suite in this Directory

| Document | Description | Key Stakeholders |
|---|---|---|
| [**INFORMATION_ARCHITECTURE.md**](INFORMATION_ARCHITECTURE.md) | **Canonical Master IA Document** covering sitemap, navigation model, content hierarchy, naming conventions, component reuse map, content growth plan, and URL strategy. | System Architects, Lead Engineers, Product Managers |
| [**sitemap.md**](sitemap.md) | Hierarchical sitemap of all 4 role portals, route definitions, access control policies, and visual Mermaid navigation tree. | Frontend Engineers, UI/UX Designers |
| [**screen-hierarchy.md**](screen-hierarchy.md) | Structural layout hierarchy, parent-child view relationships, modal bottom-sheet layers, and navigation depth constraints. | UI/UX Designers, Mobile Developers |
| [**screen-inventory.md**](screen-inventory.md) | Exhaustive catalog of all 17 operational screens (`SCR-TCH-01..04`, `SCR-MGR-01..05`, `SCR-KIT-01..04`, `SCR-ADM-01..04`), mapped to INVEST User Stories and DB entities. | QA Engineers, Backend Developers |
| [**task-flows.md**](task-flows.md) | 5 end-to-end Mermaid decision task flows tracing the entire operational lifecycle from morning attendance to kitchen yield sign-off. | Business Analysts, QA Engineers |

---

## Upstream & Downstream Traceability

- **Upstream Requirements**: [docs/02-core-features/invest-requirements.md](../02-core-features/invest-requirements.md)
- **Role & RACI Definitions**: [docs/03-roles-usecases/role-feature-mapping.md](../03-roles-usecases/role-feature-mapping.md)
- **Design System & UI Specs**: [docs/05-ui-ux/design-system.md](../05-ui-ux/design-system.md)
- **Interactive Reference Implementation**: [frontend/README.md](../../frontend/README.md)
- **Database Architecture & ERD**: [docs/06-database/data-dictionary.md](../06-database/data-dictionary.md)
