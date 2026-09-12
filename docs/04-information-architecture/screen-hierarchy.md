# Screen Hierarchy

The screen hierarchy shows the **parent → child relationship** between screens, the navigation pattern used to reach each screen, and its depth in the navigation stack.

---

## Admin Portal

```
Login
└── Admin Portal (Dashboard)
    ├── Student Management
    │   ├── Student List [SCR-ADM-01]                     ← section root
    │   │   └── Enroll Student Form [SCR-ADM-02]          ← modal / full-page form
    │   │       └── Register Meal Session [SCR-ADM-04]    ← next step after enroll
    │   └── Update Enrollment Status [SCR-ADM-03]         ← action from Student List row
    │
    ├── Meal Session Configuration [SCR-ADM-05]           ← settings page
    │
    ├── User & Role Management [SCR-ADM-06]               ← settings page
    │
    └── Dish Catalog [SCR-ADM-07]                         ← settings page
```

**Navigation pattern:** Sidebar or top nav → section pages → modal forms

---

## Manager Portal

```
Login
└── Manager Portal (Dashboard / Demand Board)
    ├── Daily Demand Status Board [SCR-MGR-05]            ← portal home / default view
    │   └── Reviewed automatically after cutoff → Quantities
    │
    ├── Quantity Calculation
    │   └── Review Calculated Quantities [SCR-MGR-06]     ← accessed from demand board
    │       └── (inline) Override Buffer % — no separate screen, inline action
    │
    ├── Menu Planning
    │   ├── Weekly Menu List [SCR-MGR-01]                 ← section root
    │   │   └── Create / Edit Menu [SCR-MGR-02]          ← drill-down
    │   │       └── Assign Dishes & Portions [SCR-MGR-03] ← sub-step within menu editor
    │   └── Approve & Publish Menu [SCR-MGR-04]          ← action from menu list row
    │
    └── Change Request Triage
        ├── Change Request List [SCR-MGR-07]              ← section root
        └── Change Request Detail [SCR-MGR-08]            ← drill-down from list
```

**Navigation pattern:** Bottom tab bar or sidebar → primary sections → detail drill-down

---

## Kitchen Portal

```
Login
└── Kitchen Portal (Today's Session Overview)
    ├── Preparation
    │   ├── Preparation Plan View [SCR-KIT-01]            ← section root, read-only
    │   ├── Record Prepared Quantity [SCR-KIT-02]         ← primary input screen
    │   └── Confirm Preparation Complete [SCR-KIT-03]     ← terminal action / confirmation screen
    │
    ├── Distribution
    │   ├── Distribution Plan View [SCR-KIT-04]           ← section root, read-only
    │   └── Record Distributed Quantity [SCR-KIT-05]      ← primary input screen
    │
    └── Handover
        └── Confirm Meal Handover [SCR-KIT-06]            ← terminal confirmation per class
```

**Navigation pattern:** Linear stepper (Prep → Distribution → Handover) with stage-gating (next stage unlocks when previous is confirmed)

---

## Teacher Portal

```
Login
└── Teacher Portal (Today's Class View)
    ├── Class Roster — Meal Attendance [SCR-TCH-01]       ← portal home / primary screen
    │   └── Submit Attendance / Lock [SCR-TCH-02]         ← action at bottom of roster
    │
    ├── Submit Change Request [SCR-TCH-03]                ← accessible before AND after cutoff
    │   (Post-cutoff: triggered from locked attendance screen)
    │   (Bottom sheet / modal — no separate navigation depth)
    │
    └── Acknowledge Meal Handover [SCR-TCH-04]            ← notification-triggered screen
        (Push notification → opens handover acknowledgement)
```

**Navigation pattern:** Single primary screen (roster) → actions → notification-driven secondary screens

---

## Navigation Decision Points

| Decision | Condition | Outcome |
|----------|-----------|---------|
| Show Attendance as editable | Current time < session cutoff | Fully interactive roll call |
| Show Attendance as locked | Current time ≥ session cutoff | Read-only summary + Change Request CTA |
| Gate Distribution screen | Preparation status ≠ `completed` | Distribution screen disabled / shows waiting state |
| Gate Handover screen | Distribution not yet recorded for class | Handover button disabled |
| Show emergency badge | Change request submitted > 30 min post-cutoff | ⚡ Emergency badge on request card |
| Show approval actions | Actor role = MGR | Approve / Reject buttons visible |
| Hide approval actions | Actor role = TCH or KIT | Buttons hidden; read-only view |
