# Phase 02 — Core Feature Breakdown

## What is this?

This folder narrows the 4 Core Business Domains into a specific set of **Selected Core Features** for Phase 1 MVP.

Not every function in a Core Domain belongs in Phase 1. The selection is driven by the **mission-critical test**:

> "Does this feature directly support the most urgent business pain point? Can Phase 1 deliver a usable system for daily meal operations without it?"

## Selection Hierarchy

```
Core Domain
     ↓
Core Capability (Sub-Domain)
     ↓
Selected Core Feature (Phase 1 MVP)
          ↓
Backlog Feature (Phase 2+)
```

## Phase 1 Selected Core Features

| Feature ID | Feature Name | Core Domain |
|-----------|--------------|-------------|
| F-STU-01 | Manage Student Meal Eligibility | Student Meal Management |
| F-STU-02 | Register Student for Meal Session | Student Meal Management |
| F-STU-03 | Record Daily Meal Participation | Student Meal Management |
| F-MPN-01 | Design Weekly Menu | Meal Planning & Menu Management |
| F-MPN-02 | Assign Dishes & Standard Portions | Meal Planning & Menu Management |
| F-MPN-03 | Approve & Publish Menu | Meal Planning & Menu Management |
| F-MPN-04 | Calculate Meal Demand Quantities | Meal Planning & Menu Management |
| F-MOP-01 | Determine Meal Demand (with Cutoff Lock) | Meal Operation |
| F-MOP-02 | Manage Post-Cutoff Change Requests | Meal Operation |
| F-MOP-03 | Record Meal Preparation | Meal Operation |
| F-MOP-04 | Record Meal Distribution | Meal Operation |
| F-MOP-05 | Confirm Meal Handover & Reconcile | Meal Operation |

> **Note:** Food Safety & Traceability core features (F-SAF-01 through F-SAF-04) are included in the domain decomposition but deferred to Phase 1.5 pending regulatory requirement confirmation. The database schema includes `food_batches` and `receiving_inspections` tables as placeholders.

## Artifacts in this folder

| File | Purpose |
|------|---------|
| [core-feature-breakdown.md](core-feature-breakdown.md) | Full feature tree with IDs, descriptions, and Phase assignment |

## Next Step

→ [Phase 03 — Roles & Use Cases](../03-roles-usecases/README.md)
