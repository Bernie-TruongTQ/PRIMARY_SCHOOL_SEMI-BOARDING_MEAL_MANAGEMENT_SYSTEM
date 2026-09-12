# Prototype

## Overview

The Phase 1 MVP prototype covers the **Meal Demand & Quantity Management** core screens — the highest-friction, highest-value portion of the Meal Operation domain.

## Screens Implemented

| Screen | Source Use Case | Source Task Flow |
|--------|----------------|-----------------|
| Screen 1: Determine Demand | UC-TCH-01, UC-TCH-02, UC-MGR-06 | TF-01, TF-04 |
| Screen 2: Calculate Quantities | UC-MGR-04, UC-MGR-05 | TF-04 |
| Screen 3: Manage Changes | UC-TCH-03, UC-MGR-07, UC-MGR-08 | TF-02, TF-08 |

## Running the Prototype

```bash
# From the repository root
python -m http.server 8080 --directory ui
```

Navigate to: **`http://localhost:8080/demand.html`**

## Files

| File | Description |
|------|-------------|
| `ui/demand.html` | Main prototype: 3 connected core screens |
| `ui/index.html` | Reference prototype: 5-screen kitchen execution pipeline |
| `ui/css/style.css` | Design tokens (MD3), typography, viewport frame switcher |
| `ui/css/demand.css` | Demand screen styles, stepper, timeline |
| `ui/js/demandData.js` | Mock data mirroring DB schema |
| `ui/js/demandApp.js` | Interactive logic: roll call, formula steppers, modals |

## Phase 2 Prototype Scope

Phase 2 prototype will add:
- Kitchen Staff portal (SCR-KIT-01 through SCR-KIT-06)
- Manager Menu Planning screens (SCR-MGR-01 through SCR-MGR-04)
- Storekeeper Food Batch Registration (SCR-STO-01, SCR-STO-02)
