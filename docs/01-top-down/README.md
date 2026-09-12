# Phase 01 — Top-Down Decomposition

## What is this?

This folder contains the results of the **top-down functional decomposition** of the Primary School Semi-Boarding Meal Management System.

Top-down decomposition starts from the business problem and systematically breaks it into business domains, sub-domains, capabilities, and functions — before any solution, role, screen, or database table is considered.

## Why did we decompose it?

Without decomposition, system design defaults to building screens around gut feelings or copying existing spreadsheets. Decomposition ensures:

1. **Nothing is missed** — every function the system must support is identified from business need, not from implementation assumption.
2. **Scope is justified** — we can explain why each function exists by tracing it back to a business domain.
3. **Core vs. supporting is defensible** — classification is based on whether a function is on the primary value chain, not on personal preference.

## Decomposition Levels

```
Level 0 — System
    └── Level 1 — Business Domain
            └── Level 2 — Sub-Domain / Capability
                    └── Level 3 — Function
```

## Resulting Business Domains

| # | Domain                          | Type           |
| - | ------------------------------- | -------------- |
| 1 | Student Meal Management         | **Core** |
| 2 | Meal Planning & Menu Management | **Core** |
| 3 | Meal Operation                  | **Core** |
| 4 | Food Safety & Traceability      | **Core** |
| 5 | Food Supply & Inventory         | Supporting     |
| 6 | Meal Fee & Cost Management      | Supporting     |
| 7 | Reporting & Transparency        | Supporting     |

## Artifacts in this folder

| File                                                                             | Purpose                                              |
| -------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [top-down-mindmap.png](./PRIMARY_SCHOOL_SEMI-BOARDING_MEAL_MANAGEMENT_SYSTEM.png) | Full system mind map (visual)                        |
| [business-domains.md](business-domains.md)                                        | All 7 domains with their Level 2 & Level 3 functions |
| [core-supporting-classification.md](core-supporting-classification.md)            | Classification rationale and business flow test      |

## Next Step

→ [Phase 02 — Core Feature Breakdown](../02-core-features/README.md)
