# Task Flows

All task flows are written in Mermaid flowchart syntax. Each flow is traceable to at least one Use Case Specification from [Phase 03](../03-roles-usecases/).

---

## TF-01 — Student Meal Attendance Flow

**Source:** UC-TCH-01, UC-TCH-02
**Actor:** Homeroom Teacher

```mermaid
flowchart TD
    A([Teacher Opens App]) --> B[Select Today's Date & Meal Session]
    B --> C[Load Class Roster]
    C --> D{Cutoff Passed?}

    D -->|No — Editable| E[Display Student List with Status: Attend / Absent / Guest]
    E --> F[Teacher Marks Each Student]
    F --> G{All Students Marked?}
    G -->|No| F
    G -->|Yes| H[Review Summary: Attend Count / Absent Count / Guest Count]
    H --> I[Tap Submit Attendance]
    I --> J{Current Time < Cutoff?}
    J -->|Yes| K[System locks class demand — status: confirmed]
    K --> L[Display Success — Cutoff Countdown Shown]
    J -->|No| M[System shows: Cutoff Passed — Redirect to Change Request]
    M --> TF_02([→ TF-02 Post-Cutoff Change Request])

    D -->|Yes — Locked| N[Display Read-only Attendance Summary]
    N --> O{Need to Change?}
    O -->|Yes| TF_02
    O -->|No| P([End])
```

---

## TF-02 — Post-Cutoff Change Request Flow

**Source:** UC-TCH-03, UC-MGR-07, UC-MGR-08
**Actors:** Homeroom Teacher (initiates), Meal/Nutrition Manager (approves/rejects)

```mermaid
flowchart TD
    A([Teacher — Post-Cutoff Change Needed]) --> B[Open Change Request Form]
    B --> C[Fill in: Target, Class, Student, Change Type, Quantity Delta, Reason]
    C --> D{Is > 30 min past cutoff?}
    D -->|Yes| E[System flags is_emergency = true]
    D -->|No| F[Standard request]
    E --> G[Submit Request]
    F --> G
    G --> H[System creates meal_demand_change_requests — status: pending]
    H --> I[Notify Meal/Nutrition Manager]

    I --> J([Manager Opens Triage Screen])
    J --> K[Review Request: Requester, Change Type, Delta, Reason, Emergency Flag]
    K --> L{Decision?}

    L -->|Approve| M[System updates approved_by, approved_at]
    M --> N[System updates daily_meal_demands confirmed count]
    N --> O[System logs in meal_demand_change_logs]
    O --> P[Notify Teacher — Approved]

    L -->|Reject| Q[Manager enters rejection reason]
    Q --> R[System updates approval_status = rejected]
    R --> S[System logs in meal_demand_change_logs]
    S --> T[Notify Teacher — Rejected + Reason]

    P --> END([End])
    T --> END
```

---

## TF-03 — Meal Planning & Menu Publishing Flow

**Source:** UC-MGR-01, UC-MGR-02, UC-MGR-03
**Actor:** Meal / Nutrition Manager

```mermaid
flowchart TD
    A([Manager opens Menu Planning]) --> B[Select Target Week]
    B --> C[Create Menu Record for each Date + Session]
    C --> D[Status: draft]
    D --> E[Assign Dishes from Dish Catalog]
    E --> F[Set Standard Portion Size per Dish]
    F --> G{All Sessions Planned?}
    G -->|No| E
    G -->|Yes| H[Review Complete Menu]
    H --> I{Approve?}
    I -->|No — needs revision| E
    I -->|Yes| J[Transition: draft → approved]
    J --> K[Confirm Publish?]
    K -->|Yes| L[Transition: approved → published]
    L --> M[Menu available for Demand Calculation]
    K -->|No — hold for now| N([Menu stays in approved state])
```

---

## TF-04 — Meal Demand Quantity Calculation Flow

**Source:** UC-MGR-04, UC-MGR-05
**Actor:** System (auto) + Meal / Nutrition Manager (review/override)

```mermaid
flowchart TD
    A([All Classes Submit Attendance]) --> B{All Classes Confirmed?}
    B -->|No| C[Cutoff Countdown Running...]
    C --> D{Cutoff Reached?}
    D -->|Yes| E[System force-locks remaining unconfirmed classes]
    D -->|No| C
    B -->|Yes| E
    E --> F[System aggregates session-level headcount: confirmed_attend + extra_count]
    F --> G[System runs: Total Raw = Headcount × Portion × 1 + Buffer%]
    G --> H[Save to expected_meal_quantities — calculation_method: auto]
    H --> I[Notify Manager: Quantities Ready for Review]

    I --> J([Manager Reviews Quantities])
    J --> K{Any dish needs buffer override?}
    K -->|Yes| L[Manager adjusts buffer % using stepper]
    L --> M[System recalculates Total Raw in real time]
    M --> N[Save — calculation_method: manual, calculated_by: MGR]
    N --> K
    K -->|No — all approved| O[Quantities finalized — Kitchen can proceed]
```

---

## TF-05 — Meal Preparation Flow

**Source:** UC-KIT-01, UC-KIT-02, UC-KIT-03
**Actor:** Kitchen Staff

```mermaid
flowchart TD
    A([Kitchen Staff Opens Preparation Screen]) --> B[Select Current Date & Session]
    B --> C[System loads Preparation Plan: dishes + expected quantities]
    C --> D[For each Dish:]
    D --> E[View: Dish Name, Category, Expected Quantity, Unit, Buffer %]
    E --> F[Enter Actual Prepared Quantity]
    F --> G{Quantity valid?}
    G -->|No — zero or negative| H[Show validation error]
    H --> F
    G -->|Within tolerance| I[Save — dish status: in_progress]
    G -->|Exceeds 150% of expected| J[Show: Quantity Higher Than Expected — Confirm?]
    J -->|Confirm| K[Save with discrepancy_flag = true]
    K --> I
    I --> L{All Dishes Recorded?}
    L -->|No| D
    L -->|Yes| M[Review Preparation Summary]
    M --> N{Confirm Complete?}
    N -->|Yes| O[System sets preparation status: completed]
    O --> P[Notify Manager — Preparation Done]
    N -->|No — some dishes missing| Q[Show Incomplete Dishes Warning]
    Q --> R{Proceed Anyway?}
    R -->|Yes| O
    R -->|No| D
```

---

## TF-06 — Meal Distribution Flow

**Source:** UC-KIT-04, UC-KIT-05
**Actor:** Kitchen Staff

```mermaid
flowchart TD
    A([Preparation Confirmed Complete]) --> B[Open Distribution Plan]
    B --> C[View Classes + Expected Portions per Class per Dish]
    C --> D[Select a Class]
    D --> E[Enter Actual Quantity Distributed]
    E --> F{Quantity = Expected?}
    F -->|Yes| G[Save — class status: distributed]
    F -->|Under-distributed| H[Record Reason for Shortfall]
    H --> I[Save with underdistributed flag]
    I --> G
    F -->|Over-distributed| J[Show Warning: Over expected — Confirm?]
    J --> G
    G --> K{All Classes Served?}
    K -->|No| D
    K -->|Yes| L[Distribution Complete — Proceed to Handover]
    L --> TF_07([→ TF-07 Meal Handover Flow])
```

---

## TF-07 — Meal Handover & Reconciliation Flow

**Source:** UC-KIT-06, UC-TCH-04
**Actors:** Kitchen Staff (initiates), Homeroom Teacher (acknowledges)

```mermaid
flowchart TD
    A([Distribution Recorded for Class]) --> B[Kitchen Staff selects class for Handover]
    B --> C[Review Handover Summary: Expected vs. Prepared vs. Distributed]
    C --> D[Confirm Handover with Timestamp]
    D --> E[System records Handover Event]
    E --> F[Notify Homeroom Teacher: Meal Delivered]

    F --> G([Teacher Opens Handover Notification])
    G --> H[Review: Expected vs. Delivered Quantity]
    H --> I{Quantities Match?}
    I -->|Yes| J[Teacher acknowledges — Handover complete]
    J --> K[System records Acknowledgement]
    K --> L[System runs Reconciliation: Planned vs. Prepared vs. Distributed vs. Handed Over]
    L --> M{Discrepancies Found?}
    M -->|No| N([Reconciliation OK — End])
    M -->|Yes| O[Discrepancy Record Created — Notified to Manager]
    O --> N

    I -->|No — Mismatch| P[Teacher flags discrepancy + note]
    P --> O
```

---

## TF-08 — Post-Cutoff Change Request (Emergency Shortcut)

> *Simplified view for the prototype's Screen 3 — Manage Demand Changes.*
> *Same flow as TF-02 but annotated for the prototype's UI interactions.*

```mermaid
flowchart TD
    A([Teacher or Staff: Emergency Change Needed]) --> B[Tap + New Request button]
    B --> C[Slide-up Bottom Sheet opens]
    C --> D[Fill in: Target, Class, Student, Change Type, Delta, Reason]
    D --> E[Submit]
    E --> F{Is post-cutoff > 30 min?}
    F -->|Yes| G[Badge: Emergency ⚡ — is_emergency = true]
    F -->|No| H[Standard pending request]
    G --> I[Appears at top of Change Request Triage]
    H --> I
    I --> J[Manager reviews — Approve / Reject]
    J --> K[Status chip updates in real-time]
    K --> L[Audit timeline entry created]
```
