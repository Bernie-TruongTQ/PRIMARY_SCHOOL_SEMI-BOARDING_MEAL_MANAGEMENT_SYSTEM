# C4 Level 3 — Component Diagram: Meal Demand & Quantity Management (Module 2)

## 1. Overview

This document specifies the internal components within the `Backend API Service` container that implement **Module 2: Meal Demand & Quantity Management**. Serving as the mathematical engine of the system, this module aggregates classroom-level attendance into whole-school meal counts, computes exact dish cooking weights with safety buffer margins, and orchestrates post-cutoff emergency adjustments.

---

## 2. Component Diagram (C4Component)

```mermaid
C4Component
  title Component Diagram - Module 2: Meal Demand & Quantity Management

  Container(spaManager, "Manager Dashboard SPA", "HTML5/Vanilla JS", "Analytical dashboard for the Nutrition Manager to review headcounts, tune buffer margins, and approve dish quantities")
  ContainerDb(db, "PostgreSQL Database", "PostgreSQL 15", "Stores meal_demands, meal_demand_dish_quantities, meal_demand_changes, and dish master data")
  Container(realtime, "Event Broker", "WebSocket", "Dispatches real-time broadcast when meal demand is finalized for the kitchen")

  Container_Boundary(demandBoundary, "Backend API Service - Module 2 Boundary") {
    Component(demandController, "Demand Controller", "Express Router", "Provides REST endpoints for triggering headcount aggregation, computing dish weights, and managing emergency changes")
    
    Component(aggregationEngine, "Roster Aggregation Engine", "Analytics Engine", "Aggregates confirmed attendance records across all classrooms, separating standard portions from specialized dietary diets")
    
    Component(bufferManager, "Buffer Policy Manager", "Domain Rule Component", "Applies configurable institutional buffer percentages (default 3% - 5%) to protect against accidental spillage or late visitors")
    
    Component(portionCalculator, "Portion Calculation Engine", "Mathematical Engine", "Calculates required cooking quantities: Planned Weight = Headcount x Standard Portion x (1 + Buffer%)")
    
    Component(emergencyHandler, "Emergency Amendment Handler", "Workflow Service", "Evaluates post-cutoff change requests; logs approved adjustments into meal_demand_changes and recalculates yields")
    
    Component(demandRepo, "Demand Repository", "Data Access (pg)", "Performs transactional persistence for meal_demands, meal_demand_dish_quantities, and meal_demand_changes")
  }

  %% Relationships
  Rel(spaManager, demandController, "Triggers aggregation, adjusts buffer, confirms demand", "JSON/HTTPS")
  Rel(demandController, aggregationEngine, "Requests scan of confirmed rosters from Module 1", "Internal Call")
  Rel(aggregationEngine, demandRepo, "Queries confirmed attendance headcounts", "Internal Call")
  
  Rel(demandController, bufferManager, "Retrieves active buffer margin percentage", "Internal Call")
  Rel(demandController, portionCalculator, "Executes dish quantity calculation", "Internal Call")
  Rel(portionCalculator, bufferManager, "Queries buffer factor per dish category", "Internal Call")
  Rel(portionCalculator, demandRepo, "Reads standard portion baselines from dishes table", "Internal Call")
  
  Rel(demandController, emergencyHandler, "Forwards post-cutoff emergency requests", "Internal Call")
  Rel(emergencyHandler, demandRepo, "Inserts change records into meal_demand_changes", "Internal Call")
  Rel(portionCalculator, demandRepo, "Persists computed targets into meal_demand_dish_quantities", "Internal Call")
  
  Rel(demandRepo, db, "Executes atomic SQL transactions", "SQL / Connection Pool")
  Rel(demandController, realtime, "Publishes DEMAND_LOCKED_FOR_KITCHEN event", "Socket Event")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

## 3. Component Details & Operational Responsibilities

### 3.1. Demand Controller
- **Endpoint Definitions:**
  - `GET /api/v1/demands/today`: Retrieves active demand status (`draft`, `calculated`, `confirmed`, `revised`).
  - `POST /api/v1/demands/aggregate`: Scans all locked class attendance records to calculate total attendance (`F-DMD-01`).
  - `POST /api/v1/demands/calculate-dishes`: Derives planned cooking weights for every scheduled menu dish (`F-DMD-02`).
  - `POST /api/v1/demands/emergency-adjust`: Reviews, approves, or rejects post-cutoff classroom requests (`F-DMD-03`).

### 3.2. Roster Aggregation Engine
- Aggregates confirmed roll calls across all active school classes:
  - Total confirmed student diners.
  - Number of students requiring separate non-allergen or vegetarian meal preparation trays.
  - Tracking class submission progress (e.g., 29 out of 30 classes submitted by 08:05 AM).

### 3.3. Portion Calculation Engine & Buffer Policy Manager
- **Formula Specification:**
  $$\text{Planned Quantity} = \text{Final Headcount} \times \text{Standard Portion Size} \times (1 + \text{Buffer\%})$$
- *Demonstration Example:*
  - Dish: *Braised Pork with Quail Eggs*
  - Baseline standard portion: $75\text{ g}$ cooked meat per student.
  - Total confirmed diners: $850$ students.
  - Safety buffer margin: $4\%$.
  - Target production weight = $850 \times 75\text{ g} \times 1.04 = 66.3\text{ kg}$ finished yield.
- Detailed results are recorded in `meal_demand_dish_quantities` with appropriate metric units (`kg`, `liters`, `portions`).

### 3.4. Emergency Amendment Handler
- Manages exceptional change requests submitted after the morning cutoff:
  1. Compares requested change against current kitchen progress (whether cooking has started).
  2. If approved, inserts an audit entry into `meal_demand_changes`.
  3. Updates parent `meal_demands.status` to `revised` and broadcasts an immediate alert to the kitchen kiosk.

### 3.5. Demand Repository
- Employs database row-level locking (`SELECT ... FOR UPDATE`) during recalculations to prevent race conditions during high-volume morning updates.
- Maintains strict foreign key references connecting demands with corresponding `meal_schedules` and `dishes`.
