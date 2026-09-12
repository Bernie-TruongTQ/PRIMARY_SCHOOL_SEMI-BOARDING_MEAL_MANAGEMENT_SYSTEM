# Screen Hierarchy & Navigation Depth

This document defines the **parent → child hierarchy**, navigation depth, and modal patterns across all screens for the three active core operational modules.

---

## 1. Teacher Portal (TCH) — Module 1

```
Login
└── Teacher Dashboard (Session Overview)
    └── [SCR-TCH-01] Class Roster Meal Participation (Root Screen, Depth 1)
        ├── [SCR-TCH-02] Participation Amendment Sheet (Modal / Slide-up, Depth 2)
        ├── [SCR-TCH-03] Class Roster Confirmation & Lock (Modal Dialog, Depth 2)
        └── [SCR-TCH-04] Post-Cutoff Emergency Request Form (Modal / Slide-up, Depth 2)
```

**Navigation Pattern:** Single-screen focus with modal overlays for low friction on mobile/tablet devices in the classroom.

---

## 2. Manager Portal (MGR) — Modules 2 & 3

```
Login
└── Manager Portal (Navigation Shell, Sidebar)
    ├── Demand & Quantity Section
    │   ├── [SCR-MGR-01] Demand Determination Dashboard (Root View, Depth 1)
    │   │   └── [SCR-MGR-02] Dish Quantity Calculation & Overrides (Drill-down / Tab, Depth 2)
    │   └── [SCR-MGR-03] Demand Changes Review Queue (Master-Detail View, Depth 1)
    │
    └── Kitchen Oversight Section
        ├── [SCR-MGR-04] Kitchen Shift Preparation Planning (Authoring View, Depth 1)
        └── [SCR-MGR-05] Daily Prep Summary & Discrepancy Sign-off (Audit View, Depth 1)
```

**Navigation Pattern:** Desktop sidebar layout with tabbed drill-downs for operational analysis, quantity calculations, and audit approvals.

---

## 3. Kitchen Portal (KIT) — Module 3

```
Login
└── Kitchen Kiosk Shell
    ├── [SCR-KIT-01] Kitchen Prep Shift Dashboard (Kiosk Wallboard, Depth 1)
    │   ├── [SCR-KIT-02] Ingredient Allocation Checklist (Full-screen Sheet, Depth 2)
    │   └── [SCR-KIT-03] Cooking Batch Execution & Yield Logging (Station Logger, Depth 2)
    │       └── [SCR-KIT-04] Prepared Quantity Verification Screen (Reconciliation View, Depth 3)
```

**Navigation Pattern:** High-contrast, large touch-target kiosk stepper navigation optimized for touch screens in kitchen environments.

---

## 4. Admin Portal (ADM) — Reference Master Data

```
Login
└── Administration Console
    ├── [SCR-ADM-01] Student & Class Directory (Data Table, Depth 1)
    ├── [SCR-ADM-02] Meal Calendar & Schedule Setup (Calendar / List, Depth 1)
    ├── [SCR-ADM-03] Dish & Ingredient Catalog Management (Catalog View, Depth 1)
    └── [SCR-ADM-04] User Account & Role Permissions (User Directory, Depth 1)
```

**Navigation Pattern:** Standard SaaS administration layout with filterable data tables and form drawers.
