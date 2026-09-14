# 6. Runtime View

## Overview

The **Runtime View** captures the dynamic behavioral interactions between building blocks, data stores, and human actors during critical operational milestones. The four scenarios documented below represent the essential operational backbone of the school day:
1. **Morning Attendance Roll-Call & Roster Lock** (Happy Path — High throughput check-in).
2. **Post-08:00 Cutoff Enforcement & Emergency Change Triage** (Exception & Boundary Guard — Reliability).
3. **Dynamic Portion Scaling & Kitchen Shift Scheduling** (Domain Calculation — Algorithmic Scaling).
4. **HACCP Cooking Temperature Verification & Yield Reconciliation** (Safety Gatekeeper — Food Safety).

---

## 6.1 Scenario 1: Morning Attendance Roll-Call & Roster Lock

**Purpose:** Demonstrates high-concurrency morning check-in and sub-second demand rollup to the central manager workstation.  
**Trigger:** Homeroom Teacher (`TCH`) initiates classroom roll-call between 07:30 AM and 08:00 AM.  
**Participants:** `Teacher SPA`, `ParticipationController`, `CutoffPolicyGuard`, `ParticipationService`, `PostgreSQL`, `WebSocket Broker`, `Manager SPA`.  
**Quality Goals Illustrated:** `#efficient` (Sub-300ms p95 latency, < 1s aggregation), `#usable` (< 90s roll-call).

```mermaid
sequenceDiagram
    autonumber
    actor TCH as Homeroom Teacher
    participant SPA as Teacher Mobile SPA
    participant Guard as CutoffPolicyGuard
    participant Ctrl as ParticipationController
    participant Svc as ParticipationService
    participant DB as PostgreSQL
    participant WS as WebSocket Broker
    actor MGR as Meal Manager

    TCH->>SPA: Open Classroom Roster (Class 3A)
    SPA->>Ctrl: GET /api/v1/roster/3A
    Ctrl->>DB: Fetch 40 students with allergy flags
    DB-->>Ctrl: Student records + diet alert tags
    Ctrl-->>SPA: JSON Roster Payload (pre-rendered)
    
    TCH->>SPA: Toggles 2 absent students & adds notes
    TCH->>SPA: Taps "Confirm Class Roster"
    SPA->>Guard: POST /api/v1/participations/lock
    Guard->>Guard: Verify Server Time < 08:00:00 AM
    Guard->>Ctrl: Forward Valid Request
    Ctrl->>Svc: lockClassRoster(classId="3A", userId="TCH-102")
    Svc->>DB: UPDATE meal_participations SET status='LOCKED'
    DB-->>Svc: Success (38 Present, 2 Absent)
    Svc->>WS: Emit Event CLASS_ROSTER_LOCKED(classId="3A", count=38)
    WS-->>MGR: Real-time update on Manager Dashboard (< 1s)
    Svc-->>Ctrl: Roster Locked Confirmation
    Ctrl-->>SPA: 200 OK (Roster Read-Only Badge)
    SPA-->>TCH: Displays green success checkmark
```

### Execution Steps:
1. Teacher loads classroom view; mobile UI loads pre-cached student list and allergy flags.
2. Teacher marks 2 absent students with reasons (*Sick leave*, *Family matter*).
3. Teacher taps **Confirm Class Roster** at 07:52 AM.
4. `CutoffPolicyGuard` verifies current server time is prior to 08:00:00 AM.
5. `ParticipationService` executes an atomic SQL transaction updating student statuses and locking class 3A.
6. Service triggers WebSocket event `CLASS_ROSTER_LOCKED`.
7. Manager analytical dashboard recalculates and increments confirmed headcount live without page refresh.

---

## 6.2 Scenario 2: Post-08:00 Cutoff Rejection & Emergency Change Triage

**Purpose:** Illustrates the temporal protection mechanism preventing unauthorized direct database modifications after kitchen prep has begun.  
**Trigger:** Teacher attempts to mark a late-arriving student after 08:00:00 AM.  
**Participants:** `Teacher SPA`, `CutoffPolicyGuard`, `EmergencyChangeManager`, `PostgreSQL`, `WebSocket Broker`, `Manager SPA`.  
**Quality Goals Illustrated:** `#reliable` (Strict cutoff lockdown, 100% auditable amendments).

```mermaid
sequenceDiagram
    autonumber
    actor TCH as Homeroom Teacher
    participant SPA as Teacher Mobile SPA
    participant Guard as CutoffPolicyGuard
    participant Emerg as EmergencyChangeManager
    participant DB as PostgreSQL
    participant WS as WebSocket Broker
    actor MGR as Meal Manager

    TCH->>SPA: Attempts to change Student #14 to "Present" at 08:07 AM
    SPA->>Guard: POST /api/v1/participations/update
    Guard->>Guard: Evaluate Server Time (08:07:15 >= 08:00:00)
    Guard-->>SPA: 409 Conflict: CUTOFF_LOCKED
    
    SPA-->>TCH: Prompts "Cutoff Passed — Submit Emergency Request?"
    TCH->>SPA: Enters reason ("Bus breakdown, student arrived late") & submits
    SPA->>Emerg: POST /api/v1/demand/emergency-requests
    Emerg->>DB: INSERT INTO meal_demand_changes (status='PENDING')
    DB-->>Emerg: Created change record #9021
    Emerg->>WS: Emit EMERGENCY_AMENDMENT_PENDING(id=9021, class="3A")
    WS-->>MGR: Audio chime & red badge on Manager Workstation
    
    MGR->>Emerg: POST /api/v1/demand/emergency-requests/9021/approve
    Emerg->>DB: BEGIN TX: Update demand count (+1) & set change status='APPROVED'
    DB-->>Emerg: TX Committed
    Emerg->>WS: Emit DEMAND_ADJUSTED(delta=+1)
    WS-->>SPA: Notification to Teacher: "Approved by Manager"
```

### Execution Steps:
1. Teacher attempts a late change at 08:07 AM; `CutoffPolicyGuard` intercepts and blocks the write with `409 Conflict`.
2. Mobile UI displays the Emergency Amendment form modal (`SCR-TCH-04`).
3. Teacher submits the late arrival note; request is written to `meal_demand_changes` in `PENDING` state.
4. WebSocket broker immediately pushes an emergency alert to the Meal Manager's active session.
5. Meal Manager reviews current kitchen capacity and clicks **Approve**.
6. System atomically updates the aggregated demand count and sends notification receipts to both teacher and kitchen kiosk.

---

## 6.3 Scenario 3: Dynamic Portion Scaling & Kitchen Shift Scheduling

**Purpose:** Demonstrates how confirmed student headcounts dynamically scale into exact raw ingredient weights with safety buffers.  
**Trigger:** Central cutoff time reached (08:00:00 AM) or Manager clicks "Generate Kitchen Shift Plans".  
**Participants:** `DemandController`, `PortionCalculationEngine`, `BufferPolicyManager`, `IngredientAllocationEngine`, `PostgreSQL`.  
**Quality Goals Illustrated:** `#efficient`, Cost Transparency.

```mermaid
sequenceDiagram
    autonumber
    actor MGR as Meal Manager
    participant Ctrl as DemandController
    participant Engine as PortionCalculationEngine
    participant Buffer as BufferPolicyManager
    participant Alloc as IngredientAllocationEngine
    participant DB as PostgreSQL
    actor KIT as Kitchen Staff

    MGR->>Ctrl: POST /api/v1/demand/generate-daily-plans (Date: Today)
    Ctrl->>DB: Query confirmed headcounts (e.g. 742 Standard + 18 Special)
    DB-->>Ctrl: Aggregated student count = 760
    
    Ctrl->>Engine: calculateRawWeights(headcount=760, recipeId="REC-LUNCH-01")
    Engine->>DB: Fetch base recipe ratios (e.g. 110g Pork/student, 150g Rice/student)
    DB-->>Engine: Standard nutrient baselines
    Engine-->>Ctrl: Net Base Weight = 83.6 kg Pork, 114.0 kg Rice
    
    Ctrl->>Buffer: applySafetyBuffer(netWeight=83.6kg, bufferRate=0.05)
    Buffer-->>Ctrl: Target Gross Cooking Weight = 87.78 kg Pork (Rounded to 88.0 kg)
    
    Ctrl->>Alloc: generatePantryRequisitions(finalWeights)
    Alloc->>DB: INSERT INTO ingredient_allocations & meal_preparation_plans
    DB-->>Alloc: Plan Created (#MPP-401)
    Alloc-->>KIT: Shift tasks appear on Kitchen Kiosk displays
    Ctrl-->>MGR: 200 OK (Summary of total kg and pantry pull slips)
```

---

## 6.4 Scenario 4: HACCP Temperature Verification & Yield Reconciliation

**Purpose:** Demonstrates food safety compliance gatekeeping and variance audit logging before meals leave the kitchen.  
**Trigger:** Chef completes cooking Batch #2 of Braised Pork at 10:45 AM.  
**Participants:** `Kitchen Kiosk`, `PreparationController`, `HACCPTemperatureValidator`, `YieldReconciliationEngine`, `PostgreSQL`, `Media Store`.  
**Quality Goals Illustrated:** `#safe` (Mandatory $\ge 75^\circ\text{C}$ check), Regulatory Compliance.

```mermaid
sequenceDiagram
    autonumber
    actor Chef as Kitchen Head Chef
    participant Kiosk as Kitchen Touch Kiosk
    participant Ctrl as PreparationController
    participant HACCP as HACCPTemperatureValidator
    participant Yield as YieldReconciliationEngine
    participant Media as Media Store
    participant DB as PostgreSQL

    Chef->>Kiosk: Taps "Mark Batch Complete" on Station 2
    Kiosk-->>Chef: Prompts mandatory Probe Temperature (°C) & Weight (kg)
    
    Chef->>Kiosk: Enters Temp: 78.5°C, Weight: 87.2 kg, uploads scale photo
    Kiosk->>Ctrl: POST /api/v1/prep/batches/B-202/complete
    Ctrl->>Media: Save scale display snapshot (B-202-scale.jpg)
    Media-->>Ctrl: Media URI saved
    
    Ctrl->>HACCP: validateCookingTemperature(temp=78.5, itemType="POULTRY_MEAT")
    HACCP->>HACCP: Verify 78.5°C >= 75.0°C (PASS)
    HACCP-->>Ctrl: Validation Passed
    
    Ctrl->>Yield: reconcileYield(planned=88.0kg, actual=87.2kg)
    Yield->>Yield: Variance = -0.91% (Within acceptable ±3.0% threshold)
    Yield-->>Ctrl: Yield Approved
    
    Ctrl->>DB: UPDATE meal_preparations SET status='READY_FOR_SERVING', core_temp=78.5, yield_kg=87.2
    DB-->>Ctrl: Success
    Ctrl-->>Kiosk: 200 OK — Green "Ready for Serving" status
    Kiosk-->>Chef: Displays serving release badge with stamp
```

### Failure / Guard Path:
- If temperature entered is $< 75.0^\circ\text{C}$, `HACCPTemperatureValidator` **rejects** state transition (`422 Unprocessable Entity: HACCP_TEMPERATURE_VIOLATION`), forcing the chef to continue cooking until temperature threshold is met.
- If yield variance exceeds $\pm 3\%$, the kiosk blocks sign-off until a mandatory discrepancy root-cause note is provided.
