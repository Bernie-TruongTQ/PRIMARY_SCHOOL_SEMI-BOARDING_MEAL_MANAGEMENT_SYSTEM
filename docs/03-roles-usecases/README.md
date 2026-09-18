# Phase 03 — Roles & Use Cases

## What is this?

This phase defines the human actors who interact with the system and their detailed Use Case specifications across all **8 Business Domains** defined in [Phase 01 — Top-Down Decomposition](../01-top-down/README.md) and [Phase 02 — Core Features Breakdown](../02-core-features/README.md).

In strict accordance with the baseline MVP scope ([Phase 01 — MVP.md](../01-top-down/MVP.md)), the system implements a **Fixed 4-Role Model** without custom runtime permission overrides:

1. **ADM** — School Administrator / Principal
2. **ACC** — School Accountant
3. **MGR** — Semi-Boarding Coordinator / Manager
4. **PAR** — Student Parent / Guardian

Every Use Case is derived from a Core Feature in [Phase 02](../02-core-features/core-feature-breakdown.md) and directly maps to Information Architecture in [Phase 04](../04-information-architecture/README.md) and Database Architecture in [Phase 06](../06-database/README.md).

## System Actors

| Role Code     | Role Name                           | Primary Responsibilities                                                                                                                                                                                           | Main Business Domains |
| ------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| **MGR** | Semi-Boarding Coordinator (Manager) | Manage dishes & weekly menus, finalize attendance, calculate demand with safety buffer, place catering orders, inspect received deliveries, coordinate classroom distribution, and reconcile operational variances | Domains 1, 2, 3, 5, 7 |
| **ACC** | School Accountant                   | Configure meal unit prices, calculate billable meal counts, issue student invoices, record payments (3 statuses), account vendor payables, and generate financial audit reports                                    | Domains 4, 5          |
| **PAR** | Student Parent (Guardian)           | Register for boarding participation, declare food allergies, monitor transparent daily menus, look up monthly bills, and submit payments                                                                           | Domains 1, 4, 5, 7    |
| **ADM** | School Administrator (Principal)    | Configure academic years, grades, classes, student profiles, boarding eligibility rules, serving/holiday calendars, approve weekly menus (1-level review), manage staff accounts, and enforce fixed 4-role RBAC    | Domains 1, 2, 6, 8    |

## Artifacts in this Folder

| File                                          | Purpose                                                                                                  |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [roles.md](roles.md)                           | Comprehensive definitions of the 4 fixed roles, responsibilities, and system access boundaries           |
| [usecase-overview.md](usecase-overview.md)     | System-Level UML Use Case Diagram, global 27 use-case catalog, and operational lifecycle flow            |
| [usecase-manager.md](usecase-manager.md)       | Actor Use Case Diagram & detailed specifications for Semi-Boarding Coordinator (`UC-MGR-01` to `12`) |
| [usecase-accountant.md](usecase-accountant.md) | Actor Use Case Diagram & financial/billing use cases for School Accountant (`UC-ACC-01` to `05`)     |
| [usecase-parent.md](usecase-parent.md)         | Actor Use Case Diagram & portal use cases for Student Parents (`UC-PAR-01` to `04`)                  |
| [usecase-admin.md](usecase-admin.md)           | Actor Use Case Diagram & administrative configuration use cases (`UC-ADM-01` to `06`)                |

## Next Step

→ [Phase 04 — Information Architecture](../04-information-architecture/README.md)
