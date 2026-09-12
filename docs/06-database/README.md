# Phase 06 — Database Architecture

## What is this?

This folder documents the database schema supporting the selected core modules from the Primary School Semi-Boarding Meal Management System mind map. The architecture is derived **top-down**:

```
Mind Map / Selected Core Modules
        ↓
Business Entities & Lifecycle Flows
        ↓
Entity-Relationship Diagrams (ERD)
        ↓
DBML (Source of Truth)
        ↓
PostgreSQL DDL (`PRIMARY_SCHOOL_SEMI-BOARDING_MEAL_MANAGEMENT_SYSTEM.sql`)
```

## Implemented Modules & Entity Mapping

The current implementation focuses on three high-impact operational modules:

| Module | Core Functional Scope | Primary & Audit Entities | Reference Entities |
|---|---|---|---|
| **Module 1: Meal Participation Management** | Record participation, track change history, confirm meal participation | `meal_participations`<br>`meal_participation_changes` | `students`<br>`meal_schedules`<br>`meal_registrations`<br>`users` |
| **Module 2: Meal Demand & Quantity Management** | Aggregate/determine meal demand, calculate dish expected quantities, manage demand adjustments | `meal_demands`<br>`meal_demand_dish_quantities`<br>`meal_demand_changes` | `meal_schedules`<br>`dishes`<br>`users` |
| **Module 3: Meal Preparation** | Create meal preparation plans, allocate ingredients, record actual cooking progress, confirm prepared quantities & discrepancies | `meal_preparation_plans`<br>`meal_preparation_plan_dishes`<br>`ingredient_allocations`<br>`meal_preparations`<br>`meal_preparation_dish_records`<br>`prepared_quantity_confirmations` | `meal_demands`<br>`meal_schedules`<br>`dishes`<br>`ingredients`<br>`users` |

## Interactive Documentation

> [!TIP]
> View and explore the live interactive schema diagram and relationship graph directly on dbdocs:
> 🔗 **[dbdocs.io — Primary School Semi-Boarding Meal Management System](https://dbdocs.io/tqtolympia/PRIMARY-SCHOOL-SEMI-BOARDING-MEAL-MANAGEMENT-SYSTEM)**

## Artifacts in this folder

| File / Link | Purpose |
|---|---|
| [dbdocs.io Interactive Schema](https://dbdocs.io/tqtolympia/PRIMARY-SCHOOL-SEMI-BOARDING-MEAL-MANAGEMENT-SYSTEM) | Live web-based interactive schema viewer, relationship explorer, and search |
| [schema.dbml](file:///d:/WORKSPACE/Top-Down-Approach/docs/06-database/schema.dbml) | DBML source of truth defining tables, enums, indexes, and relations |
| [PRIMARY_SCHOOL_SEMI-BOARDING_MEAL_MANAGEMENT_SYSTEM.sql](file:///d:/WORKSPACE/Top-Down-Approach/docs/06-database/PRIMARY_SCHOOL_SEMI-BOARDING_MEAL_MANAGEMENT_SYSTEM.sql) | Production-ready PostgreSQL DDL with types, constraints, and indexes |
| [database-erd.md](file:///d:/WORKSPACE/Top-Down-Approach/docs/06-database/database-erd.md) | Visual Mermaid Entity-Relationship Diagrams (Overview & Sub-module breakdowns) |
| [data-dictionary.md](file:///d:/WORKSPACE/Top-Down-Approach/docs/06-database/data-dictionary.md) | Comprehensive table, column, enum, constraint, and lifecycle documentation |
| [PRIMARY_SCHOOL_SEMI-BOARDING_MEAL_MANAGEMENT_SYSTEM.png](file:///d:/WORKSPACE/Top-Down-Approach/docs/06-database/PRIMARY_SCHOOL_SEMI-BOARDING_MEAL_MANAGEMENT_SYSTEM.png) | High-level architectural schema visual diagram |

