# Task Flows

All task flows are modeled using Mermaid flowchart syntax. Each flow traces directly from Use Case Specifications ([Phase 03](../03-roles-usecases/)) through user interactions down to database state transitions in [Phase 06](../06-database/README.md).

---

## TF-01 — Student Meal Participation & Amendment Flow

- **Use Cases:** `UC-TCH-01`, `UC-TCH-02`, `UC-TCH-03`
- **Actor:** Homeroom Teacher (`TCH`)
- **Database Entities:** `meal_participations`, `meal_participation_changes`

```mermaid
flowchart TD
    Start([Teacher Opens SCR-TCH-01]) --> SelectSession[Select Scheduled Meal Session]
    SelectSession --> LoadRoster[Load Student Roster]
    LoadRoster --> CheckCutoff{Cutoff Passed?}

    CheckCutoff -->|No — Editable| ReviewStudents[Review Classroom Students]
    ReviewStudents --> SetStatus[Set Status: recorded / cancelled]
    SetStatus --> HasChangeReason{Status Changed from Baseline?}
    
    HasChangeReason -->|Yes| OpenAmendModal[SCR-TCH-02: Select Change Type & Reason]
    OpenAmendModal --> SaveChangeLog[Insert into meal_participation_changes]
    SaveChangeLog --> UpdatePart[Update meal_participations]
    HasChangeReason -->|No| UpdatePart
    
    UpdatePart --> CheckComplete{All Students Marked?}
    CheckComplete -->|No| ReviewStudents
    CheckComplete -->|Yes| OpenConfirm[SCR-TCH-03: Review Total Headcount]
    OpenConfirm --> LockRoster[Submit & Confirm Roster]
    LockRoster --> PersistConfirmed[Set meal_participations.participation_status = confirmed]
    PersistConfirmed --> EndTF1([End: Roster Locked for Demand Aggregation])

    CheckCutoff -->|Yes — Locked| ReadOnlyView[Display Read-Only Roster]
    ReadOnlyView --> NeedsChange{Emergency Change Needed?}
    NeedsChange -->|Yes| RouteTF3([→ TF-03: Post-Lock Demand Adjustment])
    NeedsChange -->|No| EndTF1
```

---

## TF-02 — Meal Demand Determination & Dish Quantity Calculation Flow

- **Use Cases:** `UC-MGR-01`, `UC-MGR-02`
- **Actor:** Meal / Nutrition Manager (`MGR`)
- **Database Entities:** `meal_demands`, `meal_demand_dish_quantities`

```mermaid
flowchart TD
    Start([Manager Opens SCR-MGR-01]) --> MonitorProgress[View Classroom Submission Progress]
    MonitorProgress --> SelectMethod[Select Method: participation_based / manual_forecast / historical_average]
    SelectMethod --> CalcHeadcount[Calculate Base Headcount]
    CalcHeadcount --> SetBuffer[Adjust Buffer Percentage e.g. 5%]
    SetBuffer --> CalcFinalDemand["Compute Final Demand = Headcount × (1 + Buffer%)"]
    CalcFinalDemand --> SaveDemand["Save meal_demands (status: draft → calculated)"]
    SaveDemand --> ConfirmDemand[Manager Clicks Confirm Demand]
    ConfirmDemand --> LockDemand["meal_demands.demand_status = confirmed"]
    
    LockDemand --> OpenQuantities[SCR-MGR-02: Open Dish Quantity Calculation]
    OpenQuantities --> CalcDishes["Compute per Dish: Final Demand × Standard Portion"]
    CalcDishes --> ReviewDishQty[Review Expected Raw Quantities]
    ReviewDishQty --> HasOverride{Manual Rounding / Adjustment?}
    HasOverride -->|Yes| ApplyOverride[Input Overridden Quantity & Note]
    ApplyOverride --> SaveDishQty[Persist meal_demand_dish_quantities]
    HasOverride -->|No| SaveDishQty
    SaveDishQty --> ReadyForPrep([Ready for Kitchen Preparation Shift])
```

---

## TF-03 — Post-Lock Demand Adjustment Flow

- **Use Cases:** `UC-TCH-04`, `UC-MGR-03`
- **Actors:** Homeroom Teacher (`TCH`), Meal / Nutrition Manager (`MGR`)
- **Database Entities:** `meal_demand_changes`, `meal_demands`, `meal_demand_dish_quantities`

```mermaid
flowchart TD
    Start([Teacher Opens SCR-TCH-04]) --> EnterDelta[Specify Quantity Delta & Change Type]
    EnterDelta --> EnterReason[Enter Mandatory Urgent Reason]
    EnterReason --> SubmitReq[Submit Request]
    SubmitReq --> LogPending["Insert meal_demand_changes (status: pending)"]
    LogPending --> NotifyMGR[Notify Meal Manager]
    
    NotifyMGR --> OpenQueue([Manager Opens SCR-MGR-03])
    OpenQueue --> ReviewImpact[Review Kitchen Capacity & Cooking Status]
    ReviewImpact --> Decision{Manager Decision?}
    
    Decision -->|Approve| UpdateDemand["Adjust meal_demands.final_demand_count"]
    UpdateDemand --> RecalcDishes[Recalculate meal_demand_dish_quantities]
    RecalcDishes --> SetRevised["meal_demands.demand_status = revised"]
    SetRevised --> CloseApprove["meal_demand_changes.reviewed_by = user, reviewed_at = now()"]
    CloseApprove --> AlertKitchen[Alert Kitchen of Revised Cooking Target]
    
    Decision -->|Reject| CloseReject["Record Rejection Reason in meal_demand_changes"]
    CloseReject --> NotifyTeacher[Notify Teacher of Rejection]
    AlertKitchen --> EndTF3([End])
    NotifyTeacher --> EndTF3
```

---

## TF-04 — Kitchen Preparation Planning & Ingredient Allocation Flow

- **Use Cases:** `UC-MGR-04`, `UC-KIT-01`, `UC-KIT-02`
- **Actors:** Meal Manager (`MGR`), Kitchen Staff (`KIT`)
- **Database Entities:** `meal_preparation_plans`, `meal_preparation_plan_dishes`, `ingredient_allocations`

```mermaid
flowchart TD
    Start([Manager Opens SCR-MGR-04]) --> LoadDemand[Fetch Confirmed Meal Demand & Dish Quantities]
    LoadDemand --> SetShiftDetails[Set Preparation Shift Date, Station & Deadlines]
    SetShiftDetails --> PublishPlan["Publish meal_preparation_plans (plan_status: planned)"]
    PublishPlan --> CreatePlanDishes[Insert line items into meal_preparation_plan_dishes]
    
    CreatePlanDishes --> KitOpensBoard([Kitchen Staff Opens SCR-KIT-01 Kiosk])
    KitOpensBoard --> StartShift["Tap Start Shift (plan_status: in_progress)"]
    StartShift --> OpenAlloc[SCR-KIT-02: Open Ingredient Checklist]
    OpenAlloc --> InspectItems[Physically Inspect Ingredients Received from Pantry]
    InspectItems --> ConfirmAlloc["Update ingredient_allocations (status: allocated)"]
    ConfirmAlloc --> DiscrepancyCheck{Ingredient Shortage or Spoilage?}
    DiscrepancyCheck -->|Yes| LogAdjust["Set status: adjusted / returned with note"]
    DiscrepancyCheck -->|No| ReadyToCook([Ingredients Staged at Cooking Stations])
    LogAdjust --> ReadyToCook
```

---

## TF-05 — Cooking Batch Execution & Quantity Confirmation Flow

- **Use Cases:** `UC-KIT-03`, `UC-KIT-04`, `UC-MGR-05`
- **Actors:** Kitchen Staff / Chef (`KIT`), Meal Manager (`MGR`)
- **Database Entities:** `meal_preparations`, `meal_preparation_dish_records`, `prepared_quantity_confirmations`

```mermaid
flowchart TD
    Start([Chef Opens SCR-KIT-03]) --> SelectDish[Select Scheduled Dish to Cook]
    SelectDish --> StartBatch["Tap Start Batch (meal_preparations.prep_status = in_progress)"]
    StartBatch --> CookFood[Physical Cooking & Food Processing]
    CookFood --> CompleteBatch[Weigh / Count Finished Cooked Output]
    CompleteBatch --> LogDishRecord["Insert meal_preparation_dish_records (actual_prepared_quantity)"]
    LogDishRecord --> AllDishesDone{All Shift Dishes Cooked?}
    AllDishesDone -->|No| SelectDish
    AllDishesDone -->|Yes| FinishPrep["Update meal_preparations.prep_status = completed"]
    
    FinishPrep --> OpenVerify([Open SCR-KIT-04: Prepared Quantity Verification])
    OpenVerify --> CompareTarget["Compare Planned Quantity vs Actual Prepared Quantity"]
    CompareTarget --> CheckTolerance{Within Tolerance Range?}
    
    CheckTolerance -->|Yes| MarkMatched["Set confirmation_status = matched"]
    CheckTolerance -->|No| MarkDiscrepancy["Set confirmation_status = discrepancy"]
    MarkDiscrepancy --> InputReason[Enter Mandatory Discrepancy Reason]
    InputReason --> SaveConfirmation[Insert into prepared_quantity_confirmations]
    MarkMatched --> SaveConfirmation
    
    SaveConfirmation --> MgrSummary([Manager Reviews SCR-MGR-05])
    MgrSummary --> SignOff["Manager Signs Off & Archives Plan (plan_status = completed)"]
    SignOff --> EndTF5([End: Daily Cooking Verified])
```
