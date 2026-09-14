# C4 Level 4 — Code Diagram: Meal Demand & Quantity Management (Module 2)

## 1. Overview

The **Level 4 Code Diagram** for **Module 2: Meal Demand & Quantity Management** details the class and interface architecture implementing headcount aggregation, portion size calculations, safety buffer rules, and post-cutoff emergency amendments as documented in [c4-components-demand.md](c4-components-demand.md).

---

## 2. Class Diagram (UML classDiagram)

```mermaid
classDiagram
  direction TB

  class DemandStatus {
    <<enumeration>>
    DRAFT
    CALCULATED
    CONFIRMED
    REVISED
  }

  class AdjustmentType {
    <<enumeration>>
    QUANTITY_INCREASE
    QUANTITY_DECREASE
    DISH_ADJUSTMENT
    CANCELLATION
  }

  class ReviewStatus {
    <<enumeration>>
    PENDING
    APPROVED
    REJECTED
  }

  class MealDemand {
    <<entity>>
    +UUID id
    +UUID mealScheduleId
    +string determinationMethod
    +number totalHeadcount
    +number bufferPercentage
    +number finalDemandCount
    +DemandStatus status
    +UUID confirmedByUserId
    +Date confirmedAt
    +Date createdAt
    +Date updatedAt
    +applyAggregation(headcount: number, bufferPct: number): void
    +confirm(userId: UUID): void
    +markRevised(): void
  }

  class MealDemandDishQuantity {
    <<entity>>
    +UUID id
    +UUID mealDemandId
    +UUID dishId
    +number standardPortionGrams
    +number expectedQuantityKg
    +string portionUnit
    +string notes
    +calculateQuantity(headcount: number, bufferPct: number): void
  }

  class MealDemandChange {
    <<entity>>
    +UUID id
    +UUID mealDemandId
    +AdjustmentType changeType
    +number previousQuantity
    +number newQuantity
    +string reason
    +UUID requestedByUserId
    +UUID reviewedByUserId
    +ReviewStatus reviewStatus
    +Date reviewedAt
    +Date createdAt
    +approve(reviewerId: UUID): void
    +reject(reviewerId: UUID): void
  }

  class CalculateDishesDto {
    +UUID mealScheduleId
    +number bufferPercentage
  }

  class EmergencyAdjustmentDto {
    +UUID mealDemandId
    +AdjustmentType changeType
    +number quantityDelta
    +string reason
  }

  class IDemandRepository {
    <<interface>>
    +findActiveDemand(scheduleId: UUID): Promise~MealDemand~
    +saveDemand(demand: MealDemand): Promise~MealDemand~
    +saveDishQuantities(quantities: MealDemandDishQuantity[]): Promise~void~
    +findDishQuantities(demandId: UUID): Promise~MealDemandDishQuantity[]~
    +createDemandChange(change: MealDemandChange): Promise~MealDemandChange~
    +findConfirmedParticipationCount(scheduleId: UUID): Promise~number~
  }

  class PgDemandRepository {
    -Pool dbPool
    +findActiveDemand(scheduleId: UUID): Promise~MealDemand~
    +saveDemand(demand: MealDemand): Promise~MealDemand~
    +saveDishQuantities(quantities: MealDemandDishQuantity[]): Promise~void~
    +findDishQuantities(demandId: UUID): Promise~MealDemandDishQuantity[]~
    +createDemandChange(change: MealDemandChange): Promise~MealDemandChange~
    +findConfirmedParticipationCount(scheduleId: UUID): Promise~number~
  }

  class RosterAggregationEngine {
    <<service>>
    -IDemandRepository repo
    +aggregateScheduleRoster(scheduleId: UUID): Promise~AggregationResult~
    +getSpecialDietCount(scheduleId: UUID): Promise~DietaryCountSummary~
  }

  class BufferPolicyManager {
    <<service>>
    -number DEFAULT_BUFFER_PERCENT
    -number MAX_ALLOWABLE_BUFFER
    +validateBuffer(bufferPct: number): boolean
    +getEffectiveBuffer(customPct: number): number
  }

  class PortionCalculationEngine {
    <<service>>
    -BufferPolicyManager bufferPolicy
    +computeDishTargets(headcount: number, bufferPct: number, menuDishes: DishMaster[]): MealDemandDishQuantity[]
    +computeSingleDishWeight(headcount: number, portionGrams: number, bufferPct: number): number
  }

  class EmergencyAmendmentHandler {
    <<service>>
    -IDemandRepository repo
    +submitRequest(dto: EmergencyAdjustmentDto, userId: UUID): Promise~MealDemandChange~
    +reviewRequest(changeId: UUID, approve: boolean, reviewerId: UUID): Promise~void~
  }

  class DemandService {
    <<service>>
    -IDemandRepository repo
    -RosterAggregationEngine aggregationEngine
    -BufferPolicyManager bufferManager
    -PortionCalculationEngine portionCalculator
    -EmergencyAmendmentHandler emergencyHandler
    +aggregateAndCalculate(dto: CalculateDishesDto, userId: UUID): Promise~DemandCalculationResult~
    +confirmDemand(demandId: UUID, userId: UUID): Promise~MealDemand~
    +handleEmergencyRequest(dto: EmergencyAdjustmentDto, userId: UUID): Promise~MealDemandChange~
  }

  class DemandController {
    <<controller>>
    -DemandService service
    +getTodayDemand(req: Request, res: Response): Promise~void~
    +calculateDishes(req: Request, res: Response): Promise~void~
    +confirm(req: Request, res: Response): Promise~void~
    +emergencyAdjust(req: Request, res: Response): Promise~void~
  }

  %% Relationships
  PgDemandRepository ..|> IDemandRepository : implements
  DemandController --> DemandService : delegates to
  DemandService --> IDemandRepository : uses
  DemandService --> RosterAggregationEngine : triggers
  DemandService --> BufferPolicyManager : validates buffer
  DemandService --> PortionCalculationEngine : calculates targets
  DemandService --> EmergencyAmendmentHandler : routes adjustments
  PortionCalculationEngine --> BufferPolicyManager : queries policy
  RosterAggregationEngine --> IDemandRepository : queries counts
  EmergencyAmendmentHandler --> IDemandRepository : saves changes
  IDemandRepository ..> MealDemand : queries & saves
  IDemandRepository ..> MealDemandDishQuantity : queries & saves
  IDemandRepository ..> MealDemandChange : queries & saves
  MealDemand *-- DemandStatus : has status
  MealDemandChange *-- AdjustmentType : has type
  MealDemandChange *-- ReviewStatus : has review state
  DemandController ..> CalculateDishesDto : binds body
  DemandController ..> EmergencyAdjustmentDto : binds body
```

---

## 3. Class & Method Specifications

### 3.1. Domain Entities & Value Objects

- **`MealDemand`:** Aggregate root representing school-wide demand for a single meal session.
  - `applyAggregation(headcount, bufferPct)`: Multiplies headcount by $(1 + \text{bufferPct}/100)$ to set `finalDemandCount` and transitions status to `CALCULATED`.
  - `confirm(userId)`: Transitions status from `CALCULATED` to `CONFIRMED`, locking targets for the kitchen.
  - `markRevised()`: Transitions status to `REVISED` following an approved emergency adjustment.

- **`MealDemandDishQuantity`:** Detailed planned target weight for an individual dish on the scheduled menu.
  - `calculateQuantity(headcount, bufferPct)`: Executes formula:
    $$\text{Expected Quantity (kg)} = \frac{\text{Headcount} \times \text{Standard Portion (g)} \times (1 + \frac{\text{Buffer}}{100})}{1000}$$

- **`MealDemandChange`:** Captures post-cutoff increase/decrease requests submitted by teachers after 08:00 AM.
  - Required fields: `previousQuantity`, `newQuantity`, `reason`, `requestedByUserId`, `reviewedByUserId`, `reviewStatus`.

### 3.2. Calculation & Policy Services

- **`BufferPolicyManager`:**
  - Enforces institutional guidelines: bounds `bufferPercentage` between $0\%$ and $10\%$ (nominal: $3\% - 5\%$).
  - Prevents food wastage by rejecting excessive buffer inputs.

- **`PortionCalculationEngine`:**
  - Mathematical engine converting aggregated headcounts into production batch targets for each menu dish item.

- **`EmergencyAmendmentHandler`:**
  - Processes post-cutoff requests; conditionally adjusts active kitchen demands and dispatches real-time broadcast alerts.

---

## 4. Method Invocation Workflow (Demand Calculation & Approval)

```
[Client: Manager Dashboard SPA]
       │
       ▼ (HTTP POST /calculate-dishes)
[DemandController.calculateDishes]
       │
       ▼ (aggregateAndCalculate(dto, userId))
[DemandService]
       │
       ├──► [RosterAggregationEngine.aggregateScheduleRoster(scheduleId)]
       │         └── Queries confirmed roll call counts across all classrooms
       │
       ├──► [BufferPolicyManager.validateBuffer(bufferPct)]
       │
       ├──► [PortionCalculationEngine.computeDishTargets(headcount, bufferPct, dishes)]
       │         └── Calculates kilogram targets for each menu dish
       │
       └──► [IDemandRepository.saveDemand & saveDishQuantities]
                 └── Persists meal_demands and meal_demand_dish_quantities
```
