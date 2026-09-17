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

The database schema is comprehensively structured around the **8 Business Domains** and the daily **Lunch-Only** lifecycle under the **External Catering Vendor Operating Model**:

| Domain / Value Chain Stage | Core Functional Scope | Primary & Audit Entities | Reference Entities |
|---|---|---|---|
| **Domain 8: Master Data & Academic Setup** (`F-MST`) | School structure, terms, grades, classrooms, academic calendars, holidays | `school_years`, `semesters`, `grades`, `classes`, `students`, `meal_calendars`, `holidays` | — |
| **Domain 6: User & Access Management** (`F-USR`) | Fixed 4-Role RBAC accounts (`ADM`, `MGR`, `ACC`, `PAR`), parent-child bindings | `roles`, `users`, `parent_student_associations` | `students` |
| **Domain 7: Nutrition & Food Allergies** (`F-NUT`) | Medical food allergies, recipe-allergen detection, non-blocking warning flags | `student_allergies`, `ingredients`, `dish_ingredients` | `students`, `dishes` |
| **Domain 2: Meal Planning & Menu** (`F-PLN`) | Dish catalog, weekly menus, single-level approval, calendar schedule bindings | `dishes`, `menus`, `menu_dishes`, `meal_schedules` | `school_years`, `users` |
| **Domain 1: Student Meal & Attendance** (`F-PAR`) | Intake eligibility, registrations, 08:30 AM locked roll-call, change audit trail | `meal_eligibility_criteria`, `student_meal_eligibilities`, `meal_registrations`, `meal_participations`, `meal_participation_changes` | `students`, `meal_schedules`, `classes`, `users` |
| **Domain 3: Meal Operations (Catering Workflow)** (`F-OPS`) | 08:30 AM demand rollup (+buffer), 08:45 AM PO dispatch, 10:30 AM receiving inspection (QĐ 1246), 11:00 AM distribution, 13:00 PM 3-way reconciliation | `meal_demands`, `meal_demand_dish_quantities`, `meal_demand_changes`, `catering_orders`, `meal_deliveries`, `meal_inspections`, `meal_distributions`, `meal_reconciliations`, `meal_discrepancies` | `meal_schedules`, `dishes`, `classes`, `users` |
| **Domain 4: Meal Fee & Cost Management** (`F-FEE`) | Meal fee rate schedules, monthly student billing with excused absence credit, VietQR collections, caterer payables | `meal_fee_configs`, `student_meal_bills`, `student_billing_items`, `meal_payments`, `vendor_payables` | `school_years`, `students`, `meal_schedules`, `catering_orders`, `users` |

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

