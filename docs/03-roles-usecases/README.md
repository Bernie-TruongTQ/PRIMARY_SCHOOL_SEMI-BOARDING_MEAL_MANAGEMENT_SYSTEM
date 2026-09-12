# Phase 03 — Roles & Use Cases

## What is this?

This folder contains the actor definitions, role-to-feature mapping, and use case diagrams for all Phase 1 actors.

Roles are **derived from the Selected Core Features**, not assumed upfront. The methodology is:

```
Selected Core Features
        ↓
Who performs this feature?
        ↓
Actor / Role Definition
        ↓
Use Case Diagrams (per actor)
        ↓
Use Case Specifications (per use case)
```

## Actor Overview

| Actor ID | Role | Core Domains |
|----------|------|-------------|
| ADM | School Administrator | All (configuration & user management) |
| MGR | Meal / Nutrition Manager | Meal Planning, Meal Operation |
| KIT | Kitchen Staff | Meal Operation |
| TCH | Homeroom Teacher | Student Meal Management, Meal Operation |
| STO | Storekeeper | Food Safety & Traceability *(Phase 1.5)* |

## Use Case Diagram Structure

```
UC-00   System Overview
UC-ADM  School Administrator
UC-MGR  Meal / Nutrition Manager
UC-KIT  Kitchen Staff
UC-TCH  Homeroom Teacher
UC-STO  Storekeeper
```

All diagrams are written in **Mermaid** and render natively on GitHub.

## Artifacts in this folder

| File | Purpose |
|------|---------|
| [roles.md](roles.md) | Actor definitions and responsibilities |
| [role-feature-mapping.md](role-feature-mapping.md) | Role × Feature × Use Case mapping table |
| [usecase-overview.md](usecase-overview.md) | UC-00 System-level overview diagram |
| [usecase-admin.md](usecase-admin.md) | UC-ADM School Administrator use cases |
| [usecase-manager.md](usecase-manager.md) | UC-MGR Meal/Nutrition Manager use cases |
| [usecase-kitchen.md](usecase-kitchen.md) | UC-KIT Kitchen Staff use cases |
| [usecase-teacher.md](usecase-teacher.md) | UC-TCH Homeroom Teacher use cases |
| [usecase-storekeeper.md](usecase-storekeeper.md) | UC-STO Storekeeper use cases |

## Next Step

→ [Phase 04 — Information Architecture](../04-information-architecture/README.md)
