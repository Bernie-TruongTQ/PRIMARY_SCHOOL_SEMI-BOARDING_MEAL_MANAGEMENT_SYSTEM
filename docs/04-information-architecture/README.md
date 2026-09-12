# Phase 04 — Information Architecture

## What is this?

This phase bridges the Use Case Specifications ([Phase 03](../03-roles-usecases/README.md)) to the UI/UX screens ([Phase 05](../05-ui-ux/README.md)) and Database Architecture ([Phase 06](../06-database/README.md)).

Information Architecture (IA) establishes:
- **What screens exist?** (Screen Inventory)
- **How are screens organized?** (Sitemap & Role Portals)
- **How do users navigate?** (Screen Hierarchy & Navigation Depth)
- **What operational decisions happen at each step?** (Task Flows)

## IA Components & Coverage

```
Use Case Specifications (Phase 03)
            ↓
Information Architecture (Phase 04)
   ├── Sitemap            → Role-based portals (TCH, MGR, KIT, ADM)
   ├── Screen Hierarchy   → Parent/child relationships & modal depths
   ├── Screen Inventory   → 17 active screens mapped to DBML entities
   └── Task Flows         → 5 end-to-end Mermaid flows (TF-01 to TF-05)
            ↓
Database Entities & Lifecycles (Phase 06)
```

## Artifacts in this folder

| File | Purpose |
|---|---|
| [sitemap.md](sitemap.md) | High-level system navigation map across the 4 role portals |
| [screen-hierarchy.md](screen-hierarchy.md) | Navigation depth, parent-child views, and modal structure |
| [screen-inventory.md](screen-inventory.md) | Complete catalog of 17 screens with ID, Actor, Use Case, and DB Entity links |
| [task-flows.md](task-flows.md) | Visual Mermaid decision flows tracing student attendance, demand locking, change triage, prep planning, and cooking verification |

## Next Step

→ [Phase 05 — UI/UX Wireframes & Mockups](../05-ui-ux/README.md)
