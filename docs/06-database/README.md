# Phase 06 — Database Architecture

## What is this?

This folder documents the database schema that supports the Phase 1 Selected Core Features. The schema was designed by working **top-down**:

```
Selected Core Features
        ↓
Business Entities derived from each feature
        ↓
Relationships between entities
        ↓
ERD
        ↓
DBML (source of truth)
        ↓
PostgreSQL DDL (in /database/ folder)
```

## Feature → Entity Mapping

| Core Feature | Primary Entities |
|-------------|-----------------|
| F-STU-01 Manage Eligibility | `students`, `classes` |
| F-STU-02 Register Meal Session | `meal_registrations`, `meal_sessions` |
| F-STU-03 Record Daily Participation | `daily_meal_demand_details` |
| F-MPN-01/02/03 Menu Planning | `menus`, `dishes`, `menu_dishes` |
| F-MPN-04 Quantity Calculation | `expected_meal_quantities` |
| F-MOP-01 Demand Determination | `daily_meal_demands` |
| F-MOP-02 Change Requests | `meal_demand_change_requests`, `meal_demand_change_logs` |
| F-MOP-03/04/05 Prep, Dist, Handover | *(Phase 1.5 tables — placeholders)* |

## Artifacts in this folder

| File | Purpose |
|------|---------|
| [database-erd.md](database-erd.md) | Mermaid `erDiagram` — entity relationship diagram |
| [schema.dbml](schema.dbml) | DBML source of truth (human-readable schema) |
| [data-dictionary.md](data-dictionary.md) | Table and column documentation with feature traceability |

## Source DDL

The PostgreSQL DDL is maintained at:
`/database/PRIMARY SCHOOL SEMI-BOARDING MEAL MANAGEMENT SYSTEM.sql`

## Next Step

→ [Prototype](../../prototype/README.md)
