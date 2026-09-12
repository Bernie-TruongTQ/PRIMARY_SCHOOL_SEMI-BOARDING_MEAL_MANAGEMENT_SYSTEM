# Phase 03 — Roles & Use Cases

## What is this?

This phase defines the human actors who interact with the system and their detailed Use Case specifications across the **three active core operational modules**:
1. **Meal Participation Management**
2. **Meal Demand & Quantity Management**
3. **Meal Preparation**

Every Use Case is derived from a Core Feature in [Phase 02](../02-core-features/core-feature-breakdown.md) and drives the Information Architecture in [Phase 04](../04-information-architecture/README.md) and Database entities in [Phase 06](../06-database/README.md).

## System Actors

| Role Code | Role Name | Primary Responsibilities | Main Modules |
|---|---|---|---|
| **TCH** | Homeroom Teacher / Supervisor | Record daily participation, submit absence notes & pre-cutoff adjustments | Module 1 |
| **MGR** | Meal / Nutrition Manager | Determine aggregated demand, calculate dish quantities, approve changes, plan prep shifts | Modules 2 & 3 |
| **KIT** | Kitchen Staff / Head Chef | Receive ingredient allocations, execute cooking batches, verify prepared quantities | Module 3 |
| **ADM** | School Administrator | Maintain students, classrooms, meal calendars, dishes, and staff accounts | Reference Master Data |

## Artifacts in this folder

| File | Purpose |
|---|---|
| [roles.md](roles.md) | Comprehensive role definitions, responsibilities, and system access |
| [role-feature-mapping.md](role-feature-mapping.md) | RACI matrix mapping 4 roles against all core features |
| [usecase-overview.md](usecase-overview.md) | System-Level UML Use Case Diagram, global use case catalog, and operational lifecycle diagram |
| [usecase-teacher.md](usecase-teacher.md) | Actor Use Case Diagram & detailed specifications for Homeroom Teachers (`UC-TCH-01` to `04`) |
| [usecase-manager.md](usecase-manager.md) | Actor Use Case Diagram & detailed specifications for Meal/Nutrition Managers (`UC-MGR-01` to `05`) |
| [usecase-kitchen.md](usecase-kitchen.md) | Actor Use Case Diagram & detailed specifications for Kitchen Staff (`UC-KIT-01` to `04`) |
| [usecase-admin.md](usecase-admin.md) | Actor Use Case Diagram & administrative configuration use cases (`UC-ADM-01` to `04`) |

## Next Step

→ [Phase 04 — Information Architecture](../04-information-architecture/README.md)
