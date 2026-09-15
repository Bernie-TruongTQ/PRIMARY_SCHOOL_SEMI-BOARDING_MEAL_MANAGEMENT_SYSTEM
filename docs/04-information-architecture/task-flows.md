# Operational Task Flows & Decision Trees

## 1. Overview

This document formalizes the **5 Core Operational Task Flows** that span the daily lifecycle of semi-boarding meal operations. Each task flow illustrates the user steps, system decision gates, error handling, state transitions, and database mutations mapped directly to the **10 INVEST Core Features** in [invest-requirements.md](../02-core-features/invest-requirements.md).

```
[07:30 - 08:30 AM]   TF-01: Classroom Attendance & Roster Freeze (Module 1)
                               ↓
[08:30 - 08:45 AM]   TF-02: Demand Aggregation & Buffer Calculation (Module 2)
                               ↓
[08:45 - 10:30 AM]   TF-03: Post-Lock Emergency Change Triage (Module 2) [Asynchronous]
                               ↓
[08:45 - 10:30 AM]   TF-04: Kitchen Stock Intake & Batch Execution (Module 3)
                               ↓
[10:30 - 10:45 AM]   TF-05: Cooking Yield Reconciliation & Discrepancy Gate (Module 3)
```

---

## 2. Task Flow TF-01: Daily Classroom Attendance & Cutoff Lock

- **Covered Stories:** `US-PAR-01`, `US-PAR-02`, `US-PAR-03`
- **Primary Actor:** Homeroom Teacher (`TCH`)
- **Primary Screens:** `SCR-TCH-01`, `SCR-TCH-02`, `SCR-TCH-03`, `SCR-TCH-04`

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as 👩‍🏫 Homeroom Teacher
    participant UI as 📱 Teacher Portal (SCR-TCH-01)
    participant Modal as 📋 Amendment Sheet (SCR-TCH-02)
    participant System as ⚙️ System Backend
    participant DB as 🗄️ Database

    Teacher->>UI: Opens /teacher/roster (07:30 AM)
    UI->>DB: Fetch class roster & student dietary notes
    DB-->>UI: Return student records & allergy flags
    UI-->>Teacher: Displays student cards (Default: Eating)

    alt Initial Fast Attendance
        Teacher->>UI: Toggles absent students to "Absent"
        opt Student has allergy
            UI-->>Teacher: Displays orange dietary warning badge
        end
        Teacher->>UI: Clicks "Save Draft"
        UI->>DB: Upsert meal_participations (status = 'recorded')
    else Modifying Status After Initial Entry
        Teacher->>UI: Coggles previously saved student
        UI->>Modal: Open SCR-TCH-02 (Mandatory Reason)
        Teacher->>Modal: Selects reason (e.g., "Sudden Fever") + submits
        Modal->>DB: Update meal_participations + Insert meal_participation_changes
    end

    Teacher->>UI: Clicks "Confirm & Lock Roster" before 08:30 AM
    UI->>UI: Validate all students have defined status
    alt Validation Passes & Time < 08:30 AM
        UI->>DB: Update meal_participations (status = 'confirmed', confirmed_at = NOW())
        DB-->>UI: Confirmation success
        UI-->>Teacher: Displays "Roster Locked" (Read-Only Mode)
    else Submission received after 08:30 AM Cutoff
        UI-->>Teacher: Warning: "Cutoff passed. Auto-converted to Emergency Request"
        UI->>DB: Insert meal_demand_changes (status = 'pending')
    end
```

---

## 3. Task Flow TF-02: Demand Aggregation & Recipe Buffer Calculation

- **Covered Stories:** `US-DMD-01`, `US-DMD-02`
- **Primary Actor:** Meal & Nutrition Manager (`MGR`)
- **Primary Screens:** `SCR-MGR-01`, `SCR-MGR-02`, `SCR-MGR-04`

```mermaid
flowchart TD
    START(["Manager opens /manager/demand (08:30 AM)"]) --> CHECK_CUTOFF{"Is Cutoff (08:30 AM) Reached?"}

    CHECK_CUTOFF -- No --> WAIT["Monitor classroom submission progress (e.g. 18/20 classes locked)"]
    WAIT --> START

    CHECK_CUTOFF -- Yes --> AGGREGATE["Trigger Auto-Rollup Aggregation"]
    AGGREGATE --> SUM_HEADCOUNT["Compute Base Headcount = Σ confirmed students"]

    SUM_HEADCOUNT --> CHOOSE_METHOD{"Select Demand Method"}
    CHOOSE_METHOD -- "participation_based (Default)" --> APPLY_BUFFER["Select Safety Buffer % (Default: 5%)"]
    CHOOSE_METHOD -- "historical_average" --> HIST_CALC["Compute rolling 30-day average"]
    CHOOSE_METHOD -- "manual_forecast" --> MANUAL_INPUT["Enter authorized headcount override"]

    APPLY_BUFFER --> CALC_FINAL["Calculate Final Headcount = round(Base Headcount * (1 + Buffer%))"]
    HIST_CALC --> CALC_FINAL
    MANUAL_INPUT --> CALC_FINAL

    CALC_FINAL --> PERSIST_DEMAND["Insert into meal_demands (demand_status = 'calculated')"]

    PERSIST_DEMAND --> NAV_QUANTITIES["Navigate to SCR-MGR-02 (Dish Quantities)"]
    NAV_QUANTITIES --> RECIPE_LOOP["For each dish in today's menu: Expected Raw Qty = Final Headcount * Portion Size"]

    RECIPE_LOOP --> ROUND_CHECK{"Discrete item (Eggs, Fruit) or Bulk (Meat, Rice)?"}
    ROUND_CHECK -- "Discrete Item" --> CEIL_ROUND["Round UP to whole piece (ceil)"]
    ROUND_CHECK -- "Bulk Weight" --> DEC_ROUND["Round to nearest 0.5 kg"]

    CEIL_ROUND --> SAVE_QUANTITIES["Persist to meal_demand_dish_quantities"]
    DEC_ROUND --> SAVE_QUANTITIES

    SAVE_QUANTITIES --> LOCK_DEMAND["Manager clicks 'Approve & Lock Demand'"]
    LOCK_DEMAND --> UPDATE_STATUS["Update meal_demands (demand_status = 'confirmed')"]
    UPDATE_STATUS --> BROADCAST["Publish Prep Plan (SCR-MGR-04) & Broadcast to Kitchen Kiosk"]
    BROADCAST --> END(["Demand Finalized"])

    classDef action fill:#E05318,stroke:#9A3412,color:#FFFFFF;
    classDef gate fill:#FFFBEB,stroke:#D97706,color:#78350F;
    classDef finish fill:#16A34A,stroke:#14532D,color:#FFFFFF;
    class AGGREGATE,CALC_FINAL,PERSIST_DEMAND,SAVE_QUANTITIES,LOCK_DEMAND,BROADCAST action;
    class CHECK_CUTOFF,CHOOSE_METHOD,ROUND_CHECK gate;
    class END finish;
```

---

## 4. Task Flow TF-03: Post-Lock Emergency Change Triage

- **Covered Stories:** `US-DMD-03`
- **Primary Actors:** Homeroom Teacher (`TCH`), Meal & Nutrition Manager (`MGR`), Head Chef (`KIT_CHEF`)
- **Primary Screens:** `SCR-TCH-04`, `SCR-MGR-03`, `SCR-KIT-01`

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as 👩‍🏫 Homeroom Teacher
    participant T_UI as 📱 Teacher Portal (SCR-TCH-04)
    participant M_UI as 💻 Manager Portal (SCR-MGR-03)
    actor Manager as 🧑‍💼 Nutrition Manager
    participant K_UI as 🍳 Kitchen Kiosk (SCR-KIT-01)
    participant DB as 🗄️ Database

    Note over Teacher,T_UI: 09:15 AM - Sudden event (Bus breakdown / clinic visit)
    Teacher->>T_UI: Opens Emergency Request Sheet
    Teacher->>T_UI: Enters delta (+5 meals) & reason ("District Inspection team visiting")
    Teacher->>T_UI: Clicks "Submit Emergency Request"
    T_UI->>DB: Insert meal_demand_changes (status = 'pending', delta_quantity = 5)
    DB-->>M_UI: Real-time WebSocket event: New pending emergency request

    M_UI-->>Manager: Urgent push banner + badge on SCR-MGR-03
    Manager->>M_UI: Reviews kitchen capacity & active batch state

    alt Manager Approves Request
        Manager->>M_UI: Clicks "Approve Request"
        M_UI->>DB: Update meal_demand_changes (status = 'approved', approved_at = NOW())
        M_UI->>DB: Increment meal_demands.final_demand_count (+5)
        M_UI->>DB: Update meal_demands.demand_status = 'revised'
        DB-->>K_UI: High-priority kitchen kiosk alert: "+5 Meals Approved for Today's Lunch"
        K_UI-->>Teacher: Push notification: "Request Approved"
    else Manager Rejects Request
        Manager->>M_UI: Clicks "Reject Request" + enters explanation note
        M_UI->>DB: Update meal_demand_changes (status = 'rejected', review_notes = "Kitchen at max capacity")
        DB-->>T_UI: Push notification: "Request Rejected: Kitchen at max capacity"
    end
```

---

## 5. Task Flow TF-04: Kitchen Stock Intake & Batch Execution

- **Covered Stories:** `US-PRP-01`, `US-PRP-02`, `US-PRP-03`
- **Primary Actors:** Pantry Handler (`KIT_PANTRY`), Station Cook (`KIT_COOK`)
- **Primary Screens:** `SCR-KIT-01`, `SCR-KIT-02`, `SCR-KIT-03`

```mermaid
flowchart TD
    START(["Kitchen Crew loads Kiosk /kitchen/shift (08:45 AM)"]) --> RECEIVE["Pantry Handler opens SCR-KIT-02 (Ingredient Checklist)"]

    RECEIVE --> WEIGH_INTAKE["Weigh incoming raw ingredients from central cold storage"]
    WEIGH_INTAKE --> CHECK_MATCH{"Physical weight == Target allocated weight?"}

    CHECK_MATCH -- Yes --> STATUS_OK["Mark allocation_status = 'allocated'"]
    CHECK_MATCH -- No (Shortfall/Trimming) --> LOG_SHORTFALL["Enter actual weight & select discrepancy reason (e.g. Trimming loss)"]
    LOG_SHORTFALL --> STATUS_ADJ["Mark allocation_status = 'adjusted' & notify Manager"]

    STATUS_OK --> START_COOKING["Cooks navigate to SCR-KIT-03 (Cooking Timers)"]
    STATUS_ADJ --> START_COOKING

    START_COOKING --> SELECT_STATION["Select station (e.g. Steamer #1 - Jasmine Rice)"]
    SELECT_STATION --> START_BATCH["Cook taps 'Start Batch #1'"]
    START_BATCH --> DB_START["Insert meal_preparations (prep_status = 'in_progress', start_time = NOW())"]

    DB_START --> TIMER_RUN["On-screen countdown timer runs; visual pulsing indicator"]
    TIMER_RUN --> COOK_COMPLETE["Cooking finishes. Cook taps 'Complete Batch'"]
    COOK_COMPLETE --> WEIGH_BATCH["Cook weighs finished dish tray on connected scale"]
    WEIGH_BATCH --> NUMPAD["Enter scale reading (e.g. 70.0 kg) via oversized touch numpad"]

    NUMPAD --> SAVE_BATCH["Update meal_preparations (prep_status = 'completed', end_time = NOW())"]
    SAVE_BATCH --> SAVE_DISH_REC["Insert meal_preparation_dish_records (actual_prepared_quantity = 70.0)"]

    SAVE_DISH_REC --> MORE_BATCHES{"Additional batches required for this dish?"}
    MORE_BATCHES -- Yes --> START_BATCH
    MORE_BATCHES -- No --> STATION_DONE["Mark Station Ready (Green Badge)"]
    STATION_DONE --> END(["Ready for Final Yield Verification Gate"])

    classDef action fill:#E05318,stroke:#9A3412,color:#FFFFFF;
    classDef gate fill:#FFFBEB,stroke:#D97706,color:#78350F;
    classDef finish fill:#16A34A,stroke:#14532D,color:#FFFFFF;
    class RECEIVE,WEIGH_INTAKE,START_BATCH,NUMPAD,SAVE_BATCH,SAVE_DISH_REC action;
    class CHECK_MATCH,MORE_BATCHES gate;
    class END finish;
```

---

## 6. Task Flow TF-05: Cooking Yield Reconciliation & Discrepancy Gate

- **Covered Stories:** `US-PRP-04`
- **Primary Actors:** Head Chef (`KIT_CHEF`), School Meal Inspector (`INS`)
- **Primary Screens:** `SCR-KIT-04`, `SCR-MGR-05`

```mermaid
sequenceDiagram
    autonumber
    actor Chef as 👨‍🍳 Head Chef
    actor Inspector as 🕵️‍♂️ Meal Inspector
    participant Kiosk as 🍳 Kitchen Verification Gate (SCR-KIT-04)
    participant ManagerUI as 💻 Manager Reconciliation (SCR-MGR-05)
    participant DB as 🗄️ Database

    Note over Chef,Kiosk: 10:45 AM - Cooking complete, trays staged for distribution
    Chef->>Kiosk: Opens /kitchen/verification
    Kiosk->>DB: Fetch sum of actual_prepared_quantity vs planned target quantity
    DB-->>Kiosk: Target: 63.0 kg | Prepared: 59.0 kg (Variance: -6.3%)

    Kiosk->>Kiosk: Compare variance against tolerance threshold (±3.0%)

    alt Variance within ±3.0%
        Kiosk-->>Chef: Displays green "Matched" badge
        Chef->>Kiosk: Taps "Sign-off & Release Trays"
        Kiosk->>DB: Insert prepared_quantity_confirmations (status = 'matched')
        Kiosk-->>Chef: Green banner: "Trays Released to Classrooms"
    else Variance Exceeds ±3.0% (Deficit or Surplus)
        Kiosk-->>Chef: Flashes RED alert: "Variance Exceeded: -6.3% Shortfall"
        Kiosk->>Kiosk: Disable primary "Release Trays" CTA
        Chef->>Kiosk: Taps "Explain Discrepancy"
        Chef->>Kiosk: Enters mandatory explanation: "Over-boiling moisture loss + spillage"
        Inspector->>Kiosk: Enters Inspector PIN / Digital Sign-off
        Chef->>Kiosk: Taps "Submit Justification & Release"
        Kiosk->>DB: Insert prepared_quantity_confirmations (status = 'discrepancy', justification = '...')
        DB-->>ManagerUI: Dispatches High-Priority Incident Notification to School Director
        Kiosk-->>Chef: Yellow banner: "Released with Logged Incident Audit"
    end
```
