# Screen Hierarchy & View Structure

## 1. Structural Navigation Principles

The UI architecture adheres strictly to **Flat Information Hierarchy**:
1. **Maximum Navigation Depth $\le 2$ Levels**: Users reach their core daily view in 1 click from portal entry. No deep nested menu labyrinths.
2. **Contextual Overlays for Secondary Actions**: Actions requiring user attention or data input (e.g., amendment reasons, discrepancy justifications, emergency adjustment submissions) are displayed using **Slide-Up Bottom Sheets (Mobile)** or **Modal Dialogs (Desktop)**. This prevents context switching and state loss.
3. **Persistent Global Utility Shell**: A lightweight application bar provides instant portal switching, live countdown clocks to critical cutoffs, and data reset shortcuts.

---

## 2. Navigation Depth Hierarchy

```
Level 0: Global App Shell (/)
│
├── Level 1: Portal Dashboard (Direct Entry)
│   ├── Teacher Workboard (/teacher/roster)
│   ├── Manager Demand Hub (/manager/demand)
│   ├── Kitchen Shift Board (/kitchen/shift)
│   └── Admin Master Catalog (/admin/students)
│
└── Level 2: Sub-Process & Dedicated Task Screens
    ├── Manager: Raw Dish Quantities (/manager/quantities)
    ├── Manager: Post-Lock Emergency Queue (/manager/changes)
    ├── Manager: Kitchen Shift Planner (/manager/prep-plans)
    ├── Manager: Daily Yield Reconciliation (/manager/reconciliation)
    ├── Kitchen: Storage Ingredient Intake (/kitchen/ingredients)
    ├── Kitchen: Station Cooking Timers (/kitchen/cooking)
    └── Kitchen: Yield Discrepancy Gate (/kitchen/verification)
    │
    └── Layer 2.5: Contextual Non-Destructive Modals (Zero URL Navigation)
        ├── [Modal] Student Attendance Amendment Dialog (SCR-TCH-02)
        ├── [Modal] Roster Freeze Confirmation Prompt (SCR-TCH-03)
        ├── [Modal] Emergency Demand Request Submission Sheet (SCR-TCH-04)
        ├── [Modal] Demand Delta Review & Approval Dialog (SCR-MGR-03)
        ├── [Modal] Raw Shortfall & Waste Adjustment Modal (SCR-KIT-02)
        └── [Modal] Yield Discrepancy Justification Dialog (SCR-KIT-04)
```

---

## 3. Detailed Screen Breakdown by Portal

### 3.1. Teacher Portal Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ Level 0: App Header (Role Selector, Session Date, Cutoff)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Level 1: Classroom Attendance Roster (SCR-TCH-01)          │
│ • Metric ribbon (Registered, Eating, Absent)                │
│ • Class switcher tab-bar (Class 1A, 1B, 2A...)              │
│ • Student card list with present/absent pills               │
│ • Primary CTA: "Confirm & Lock Roster"                      │
└─────────────────────────────────────────────────────────────┘
            │                                  │
            ▼ (Trigger on status change)       ▼ (Trigger on post-cutoff tap)
┌───────────────────────────────┐  ┌───────────────────────────────┐
│ Layer 2.5: Amendment Modal    │  │ Layer 2.5: Emergency Sheet   │
│ (SCR-TCH-02)                  │  │ (SCR-TCH-04)                  │
│ • Select preset reason        │  │ • Requested delta (+/- N)     │
│ • Custom notes input          │  │ • Mandatory emergency reason  │
│ • "Save Amendment" CTA        │  │ • "Submit Request" CTA        │
└───────────────────────────────┘  └───────────────────────────────┘
```

---

### 3.2. Manager Portal Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ Level 0: App Header (Role Selector, Date Filter, Status)    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Level 1: Demand Determination Board (SCR-MGR-01)            │
│ • School-wide attendance rollup (Classes 1A – 5E)           │
│ • Calculation method selector (Participation / Historical)  │
│ • Safety buffer stepper control (+0% .. +10%)               │
│ • Aggregated Final Headcount display                        │
│ • Primary CTA: "Lock Demand & Generate Plan"                │
└─────────────────────────────────────────────────────────────┘
         │                           │                     │
         ▼                           ▼                     ▼
┌─────────────────────┐    ┌─────────────────────┐   ┌─────────────────────┐
│ Level 2: Dish Raw   │    │ Level 2: Emergency  │   │ Level 2: Yield      │
│ Quantities          │    │ Queue (SCR-MGR-03)  │   │ Reconciliation      │
│ (SCR-MGR-02)        │    │ • Pending deltas    │   │ (SCR-MGR-05)        │
│ • Ingredient table  │    │ • Approve / Reject  │   │ • Cooked vs Target  │
│ • Portion standard  │    │ • Live push trigger │   │ • Variance alerts   │
└─────────────────────┘    └─────────────────────┘   └─────────────────────┘
```

---

### 3.3. Kitchen Kiosk Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ Level 0: Kiosk Persistent Bar (Shift Status, Countdown)     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Level 1: Active Prep Shift Board (SCR-KIT-01)               │
│ • Target meal headcount & deadline (10:45 AM)               │
│ • Menu station cards (Rice, Soup, Sauté, Vegetable)         │
│ • Shift progress bar (Ingredients -> Cooking -> Verified)   │
└─────────────────────────────────────────────────────────────┘
         │                           │                     │
         ▼                           ▼                     ▼
┌─────────────────────┐    ┌─────────────────────┐   ┌─────────────────────┐
│ Level 2: Ingredient │    │ Level 2: Cooking    │   │ Level 2: Yield Gate │
│ Checklist           │    │ Batches (SCR-KIT-03)│   │ (SCR-KIT-04)        │
│ (SCR-KIT-02)        │    │ • Station timers    │   │ • Total scale check │
│ • Storage weigh-in  │    │ • Batch start/stop  │   │ • Variance % check  │
│ • Shortfall notes   │    │ • Weighed yield     │   │ • Discrepancy modal │
└─────────────────────┘    └─────────────────────┘   └─────────────────────┘
```

---

## 4. Modal & Dialog Hierarchy Rules

1. **Stacking Ban**: Modals can never be spawned from another modal. If an interaction requires confirmation, the active modal transitions inline or uses a confirmation banner.
2. **Non-Dismissible Dirty State**: If a user enters text into an amendment or discrepancy modal, tapping outside the backdrop does not discard the form. An explicit "Discard Changes?" prompt is required.
3. **Esc Key & Backdrop Behavior**:
   - Desktop: Pressing `ESC` closes clean modals.
   - Mobile: Slide-up bottom sheets support swipe-down gestures to dismiss.
4. **Keyboard Accessibility & Focus Trap**: Focus is locked within the open modal and automatically returns to the triggering element upon closure.
