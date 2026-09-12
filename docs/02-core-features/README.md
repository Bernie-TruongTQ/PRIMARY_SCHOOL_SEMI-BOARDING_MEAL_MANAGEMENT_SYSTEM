# Phase 02 — Core Feature Breakdown

## What is this?

This phase narrows the top-down decomposition into the specific **Selected Core Features** for the three operational modules:
1. **Meal Participation Management**
2. **Meal Demand & Quantity Management**
3. **Meal Preparation**

Each core feature maps directly upward to business capabilities and downward to actor use cases, task flows, screen designs, and database tables in [Phase 06](../06-database/README.md).

## Core Feature Taxonomy

```
Mind Map / Top-Down Domains
     ↓
Selected Core Modules (Phase 01)
     ↓
Module Capabilities
     ↓
Standardized Feature IDs (Phase 02)
     ├── F-PAR-xx : Meal Participation Management
     ├── F-DMD-xx : Meal Demand & Quantity Management
     └── F-PRP-xx : Meal Preparation
```

## Phase 1 Selected Core Features Summary

| Module | Feature ID | Feature Name | Primary DB Entity |
|---|---|---|---|
| **Module 1: Meal Participation** | **F-PAR-01** | Record Daily Student Meal Participation | `meal_participations` |
| | **F-PAR-02** | Track Participation Changes & Amendments | `meal_participation_changes` |
| | **F-PAR-03** | Verify & Confirm Participation Roster | `meal_participations` |
| **Module 2: Demand & Quantity** | **F-DMD-01** | Determine Aggregated Meal Demand | `meal_demands` |
| | **F-DMD-02** | Calculate Expected Dish Quantities | `meal_demand_dish_quantities` |
| | **F-DMD-03** | Process Post-Lock Demand Adjustments | `meal_demand_changes` |
| **Module 3: Meal Preparation** | **F-PRP-01** | Create & Schedule Meal Preparation Plan | `meal_preparation_plans` |
| | **F-PRP-02** | Allocate Ingredients from Storage | `ingredient_allocations` |
| | **F-PRP-03** | Record Kitchen Cooking Batches | `meal_preparations`, `meal_preparation_dish_records` |
| | **F-PRP-04** | Verify Prepared Quantities & Discrepancies | `prepared_quantity_confirmations` |

## Artifacts in this folder

| File | Purpose |
|------|---------|
| [core-feature-breakdown.md](core-feature-breakdown.md) | Comprehensive feature breakdown with priorities, DB entity linkages, and descriptions |

## Next Step

→ [Phase 03 — Roles & Use Cases](../03-roles-usecases/README.md)
