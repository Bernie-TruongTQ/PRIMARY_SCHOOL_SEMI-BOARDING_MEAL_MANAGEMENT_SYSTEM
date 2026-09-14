# C4 Dynamic Diagram — Morning Operational Lifecycle (07:30 - 11:30)

## 1. Overview

The **Dynamic Diagram** captures the chronological, message-by-message interactions that occur during the critical morning operational window (07:30 AM to 11:30 AM). It illustrates how data flows seamlessly across the three core MVP modules: **Attendance & Participation (M1) $\rightarrow$ Demand & Portioning (M2) $\rightarrow$ Kitchen Cooking & Yield Reconciliation (M3)**.

---

## 2. Sequential Operational Flow (C4Dynamic)

```mermaid
C4Dynamic
  title Dynamic Diagram: Morning Operational Shift (07:30 - 11:30)

  Container(spaTeacher, "Teacher Portal (Mobile)", "SPA", "Classroom roll call interface")
  Container(spaManager, "Manager Dashboard (Desktop)", "SPA", "Analytical workstation for the Nutritionist")
  Container(spaKiosk, "Kitchen Kiosk (Touch)", "SPA", "Wall-mounted kiosk in kitchen prep area")
  
  Container(api, "Backend API Gateway", "Service", "Executes business domain logic & cutoff enforcement")
  Container(realtime, "Event Broker", "WebSocket", "Dispatches real-time state change events")
  ContainerDb(db, "PostgreSQL Database", "SQL Database", "Stores operational tables and audit trails")

  %% 1. Roll Call & Cutoff Locking
  Rel(spaTeacher, api, "1. Submits classroom roll call and locks roster before 08:00", "POST /participations/confirm-roster")
  Rel(api, db, "2. Updates meal_participations status to confirmed", "SQL Transaction")
  Rel(api, realtime, "3. Broadcasts CLASS_ROSTER_LOCKED event", "Pub-Sub")

  %% 2. Demand Aggregation & Dish Calculation
  Rel(realtime, spaManager, "4. Receives class confirmation notifications", "WSS Message")
  Rel(spaManager, api, "5. Triggers school-wide headcount aggregation", "POST /demands/calculate-dishes")
  Rel(api, db, "6. Calculates dish weights = Headcount x Baseline x (1 + Buffer%)", "SQL / Formulas")
  Rel(spaManager, api, "7. Manager approves & confirms daily demand targets", "PUT /demands/confirm")

  %% 3. Prep Plan Dispatch & Cooking Execution
  Rel(api, db, "8. Persists meal_preparation_plans and station batches", "SQL INSERT")
  Rel(api, realtime, "9. Dispatches prep plan to Kitchen Kiosk", "Pub-Sub Event")
  Rel(realtime, spaKiosk, "10. Displays dish cooking targets on Kitchen Kiosk", "WSS Message")
  
  %% 4. Batch Cooking & Yield Sign-off
  Rel(spaKiosk, api, "11. Chef initiates station timer and logs batch milestone", "POST /kitchen/batches/complete")
  Rel(spaKiosk, api, "12. Inputs measured finished dish weights from digital scale", "POST /kitchen/confirmations/verify")
  Rel(api, db, "13. Reconciles yield variance, records sign-off", "SQL INSERT / Update")
  Rel(api, spaManager, "14. Displays final yield reconciliation report", "JSON Response")

  UpdateRelStyle(spaTeacher, api, $textColor="blue", $lineColor="blue")
  UpdateRelStyle(api, realtime, $textColor="purple", $lineColor="purple")
  UpdateRelStyle(spaKiosk, api, $textColor="green", $lineColor="green")
```

---

## 3. Operational Timeline Walkthrough

```
Operational Timeline:
07:30 ────────► 08:00 ────────► 08:15 ────────► 08:30 ────────► 10:45 ────────► 11:15
[Class Roll Call] [Cutoff Lock]  [Portion Calc]  [Pantry & Cook]  [Yield Weighing] [Tray Assembly]
```

### Stage 1: Class Roll Call & Morning Cutoff Lock (07:30 - 08:00 AM)
- **Steps 1 - 3:** During the first 15 minutes of school, homeroom teachers take attendance on their smartphones via the **Teacher Mobile Portal**. They flag absent students with reasons (sick leave, family travel) and click **"Lock Class Roster"**.
- The API verifies the current timestamp. If before 08:00 AM, it commits a database transaction marking the classroom's `meal_participations` as `confirmed` and emits a `CLASS_ROSTER_LOCKED` event.

### Stage 2: Whole-School Aggregation & Recipe Scaling (08:00 - 08:15 AM)
- **Steps 4 - 7:** The Nutrition Manager monitors the live progress gauge on the **Manager Analytical Dashboard** (e.g., 30 of 30 classes confirmed, total 1,050 diners).
- The Manager reviews the safety buffer slider (configured at 4%) and triggers **"Calculate Dish Quantities"**. The system multiplies the confirmed diners by standard nutrition portion sizes and generates rows in `meal_demand_dish_quantities`.
- The Manager performs a visual check and clicks **"Approve & Dispatch to Kitchen"**.

### Stage 3: Pantry Issuance & Station Batch Cooking (08:15 - 10:45 AM)
- **Steps 8 - 10:** The approved plan automatically arrives at the **Kitchen Touch Kiosk** located in the kitchen.
- Kitchen staff verify incoming raw ingredients delivered from the pantry against the recipe bill-of-materials and start their cooking shift.
- **Step 11:** As each dish begins cooking, chefs tap the dish card on the kiosk to activate station countdown timers. Multi-batch cooking milestones stream live to the Manager's desk.

### Stage 4: Finished Yield Weighing & Final Sign-Off (10:45 - 11:15 AM)
- **Steps 12 - 14:** When cooking concludes, the Head Chef places the bulk hotel pans on a certified digital floor scale and enters the actual finished weight into the kiosk.
- The **Yield Reconciliation Engine** verifies the actual weight against the planned target:
  - If variance is within the allowable $\pm 3\%$ margin, the system awards a green `matched` badge.
  - If outside tolerance, the chef must record an explicit `discrepancy_reason` before completing verification.
- With mutual sign-off achieved, staff proceed to tray distribution for the student lunch period at 11:15 AM.
