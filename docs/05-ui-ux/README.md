# Phase 05 — UI/UX Wireframes & Mockups

## What is this?

Every screen in this phase is derived directly from the Screen Inventory in [Phase 04](../04-information-architecture/screen-inventory.md). No screen is designed without a corresponding Use Case, Task Flow, and Database Entity mapping.

Screen derivation path:
```
Use Case (Phase 03)
      ↓
Task Flow (Phase 04)
      ↓
Screen Inventory Entry (Phase 04)
      ↓
Interactive Prototype / Mockup (Phase 05)
      ↓
Database Schema Persistence (Phase 06)
```

## Prototype Coverage

The interactive prototype at [`ui/demand.html`](../../ui/demand.html) covers the critical path for Modules 1 & 2:

| Screen ID | Screen Name | Active Module | Prototype Implementation |
|---|---|---|---|
| **SCR-TCH-01** | Class Roster Meal Participation | Module 1: Participation | `ui/demand.html` → Screen 1 (Roster list & quick toggles) |
| **SCR-TCH-03** | Class Roster Confirmation & Lock | Module 1: Participation | `ui/demand.html` → Screen 1 (Roster lock & countdown modal) |
| **SCR-MGR-01** | Demand Determination Dashboard | Module 2: Demand & Quantity | `ui/demand.html` → Screen 2 (Aggregation header & buffer input) |
| **SCR-MGR-02** | Dish Quantity Calculation & Overrides | Module 2: Demand & Quantity | `ui/demand.html` → Screen 2 (Portion calculation table & overrides) |
| **SCR-TCH-04** | Post-Cutoff Emergency Request Form | Module 2: Demand & Quantity | `ui/demand.html` → Screen 3 (Slide-up emergency modal) |
| **SCR-MGR-03** | Demand Changes Review Queue | Module 2: Demand & Quantity | `ui/demand.html` → Screen 3 (Change triage list with Approve/Reject) |

## Kitchen Portal Prototype Roadmap (Module 3)

The kitchen touch kiosk interface covers:
- **SCR-KIT-01**: Active preparation shift wallboard
- **SCR-KIT-02**: Raw ingredient checklist
- **SCR-KIT-03**: Cooking batch logger
- **SCR-KIT-04**: Quantity reconciliation & discrepancy sign-off

## Design System

See [design-system.md](design-system.md) for:
- Color palette (Education & F&B SaaS — Material Design 3 tokens)
- Typography (Inter / Roboto)
- Touch-friendly components (chips, badges, steppers, bottom sheets)

## Next Step

→ [Phase 06 — Database Architecture](../06-database/README.md)
