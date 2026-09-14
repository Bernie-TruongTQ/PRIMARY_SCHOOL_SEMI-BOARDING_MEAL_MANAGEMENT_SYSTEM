# C4 Level 3 — Component Diagram: Meal Preparation & Kitchen Operations (Module 3)

## 1. Overview

This document specifies the internal components within the `Backend API Service` container that implement **Module 3: Meal Preparation**. This module coordinates operational kitchen cooking shifts, manages raw ingredient allocations from the pantry, tracks batch executions and station cooking timers via the kitchen touchscreen kiosk, and performs final finished dish yield reconciliation.

---

## 2. Component Diagram (C4Component)

```mermaid
C4Component
  title Component Diagram - Module 3: Meal Preparation & Kitchen Operations

  Container(spaKiosk, "Kitchen Kiosk Touch SPA", "HTML5/Vanilla JS", "Wall-mounted touchscreen kiosk interface in the cooking area for recipe view, station timers, and yield logging")
  ContainerDb(db, "PostgreSQL Database", "PostgreSQL 15", "Stores meal_preparation_plans, ingredient_allocations, meal_preparations, and prepared_quantity_confirmations")
  Container(realtime, "Event Broker", "WebSocket", "Streams cooking progress updates back to the Manager Dashboard")
  System_Ext(inventory, "Pantry Inventory System", "External Warehouse API", "Issues raw ingredient lots based on daily kitchen preparation plans")

  Container_Boundary(prepBoundary, "Backend API Service - Module 3 Boundary") {
    Component(prepController, "Preparation Controller", "Express Router", "Exposes REST endpoints for querying daily kitchen plans, recording batch progress, and submitting yield confirmations")
    
    Component(planCoordinator, "Kitchen Plan Coordinator", "Domain Service", "Translates approved dish demand into kitchen station shift plans (rice steaming, braising, soup, cold prep)")
    
    Component(allocationManager, "Ingredient Allocation Manager", "Resource Component", "Calculates required raw ingredient quantities and tracks pantry requisition status (allocated, adjusted, returned)")
    
    Component(batchTracker, "Cooking Batch Tracker", "Execution Component", "Tracks cooking batch lifecycles: starts station countdown timers, monitors internal temperatures, and records yields")
    
    Component(yieldReconciliation, "Yield Reconciliation Engine", "Verification Engine", "Compares actual prepared dish weights against planned targets; enforces mandatory justification on variances")
    
    Component(prepRepo, "Preparation Repository", "Data Access (pg)", "Performs transactional persistence for meal_preparation_plans, ingredient_allocations, batch records, and sign-offs")
  }

  %% Relationships
  Rel(spaKiosk, prepController, "Sends batch progress and finished dish measurements", "JSON/HTTPS")
  Rel(prepController, planCoordinator, "Generates and retrieves shift prep plans", "Internal Call")
  Rel(planCoordinator, allocationManager, "Requests ingredient issuance based on recipe specs", "Internal Call")
  Rel(allocationManager, inventory, "Submits raw ingredient dispatch requisition", "REST/JSON")
  
  Rel(prepController, batchTracker, "Logs cooking start/stop and batch milestones", "Internal Call")
  Rel(batchTracker, realtime, "Publishes COOKING_PROGRESS_UPDATED event", "Socket Event")
  
  Rel(prepController, yieldReconciliation, "Submits finished dish weights for verification", "Internal Call")
  Rel(yieldReconciliation, prepRepo, "Persists sign-off to prepared_quantity_confirmations", "Internal Call")
  Rel(planCoordinator, prepRepo, "Saves meal_preparation_plans", "Internal Call")
  Rel(allocationManager, prepRepo, "Saves ingredient_allocations", "Internal Call")
  Rel(batchTracker, prepRepo, "Saves meal_preparation_dish_records", "Internal Call")
  
  Rel(prepRepo, db, "Executes transactional SQL operations", "SQL / Connection Pool")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

## 3. Component Details & Operational Responsibilities

### 3.1. Preparation Controller
- **Endpoint Definitions:**
  - `GET /api/v1/kitchen/plans/today`: Retrieves active cooking shift plans categorized by station (`F-PRP-01`).
  - `POST /api/v1/kitchen/ingredients/receive`: Acknowledges receipt of raw materials delivered from the pantry (`F-PRP-02`).
  - `POST /api/v1/kitchen/batches/start` & `/complete`: Tracks station cooking timers and yields (`F-PRP-03`).
  - `POST /api/v1/kitchen/confirmations/signoff`: Submits measured finished yields for automated reconciliation (`F-PRP-04`).

### 3.2. Kitchen Plan Coordinator
- Links directly to Module 2's approved `meal_demands`.
- Automatically schedules cooking workloads across dedicated kitchen preparation stations:
  - *Station 1 (Staples):* Industrial steam cabinets for rice and porridge.
  - *Station 2 (Main Entrees):* Tilting braising pans, stewing cauldrons, and fryers.
  - *Station 3 (Soups & Vegetables):* Steam-jacketed soup kettles and vegetable steamers.
  - *Station 4 (Cold Prep & Fruits):* Washed raw fruits, yogurt, and milk trays.

### 3.3. Ingredient Allocation Manager
- Multiplies target dish quantities by standard ingredient bill-of-materials (`recipe_items`):
  - Life cycle states: `allocated` $\rightarrow$ `adjusted` $\rightarrow$ `returned`.
  - Transmits automated pick-lists to the pantry system before 08:30 AM to ensure zero prep bottlenecks.

### 3.4. Cooking Batch Tracker
- Designed specifically for touch kiosk ergonomics in humid, high-temperature kitchen environments:
  - Big visual buttons initiate countdown timers for specific recipe cooking times.
  - Supports multi-batch runs (`batch_number = 1, 2, 3...`) for dishes requiring staggered frying/steaming.
  - Captures critical control point temperatures (target $\ge 75^\circ\text{C}$ core temp for poultry/meat dishes).

### 3.5. Yield Reconciliation Engine
- **Anti-Waste & Verification Guardrails:**
  - Compares `actual_prepared_quantity` against the planned `expected_quantity`.
  - Evaluates variances against the allowed tolerance band ($\pm 3\%$):
    - *Within tolerance:* Automatically marked as `matched`.
    - *Outside tolerance:* Marked as `discrepancy`. **Mandatory input** is required for `discrepancy_reason` before the supervisor can sign off.
  - Final authenticated signatures are permanently stored in `prepared_quantity_confirmations`.
