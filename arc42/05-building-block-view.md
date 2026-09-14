# 5. Building Block View

## Overview

The **Building Block View** shows the static decomposition of the Semi-Boarding Meal Management System into hierarchical structural units. It follows a multi-level white-box / black-box approach:
- **Level 1 (System Containers):** High-level deployable units and their communication interfaces.
- **Level 2 (Domain Components):** Internal components of the Backend API decomposed across the 3 core operational modules (`Participation`, `Demand`, `Preparation`).

---

## 5.1 Level 1 — System Containers (Whitebox)

The system is decomposed into five primary deployable containers: client-side Single-Page Application (SPA) portals, an Express.js Backend API Service, an asynchronous Real-time Event Broker, a PostgreSQL Relational Database, and an Asset Media Store.

### Container Architecture Diagram

![Container Diagram](../c4/images/ContainerDiagram.png)

```mermaid
C4Container
    title Level 1 — Container Diagram: Semi-Boarding Meal Management System

    Person(TCH, "Homeroom Teacher", "Mobile Web")
    Person(MGR, "Meal Manager", "Desktop Web")
    Person(KIT, "Kitchen Staff", "Touch Kiosk")
    Person(ADM, "School Admin", "Admin Web")

    System_Ext(SIS, "School Information System", "Student & Allergen Master")
    System_Ext(Inventory, "Pantry Inventory System", "Ingredient Stock")
    System_Ext(ParentGateway, "Parent Gateway", "Notifications")

    Container_Boundary(SystemBoundary, "Meal Management System") {
        Container(SPA, "Role-Tailored SPA", "HTML5, ES6, Vanilla CSS", "Provides mobile roll-call, analytical manager grids, and kitchen touch kiosks.")
        Container(API, "Backend API Service", "Node.js, Express.js", "Handles business logic, cutoff policy enforcement, and portion scaling algorithms.")
        Container(WS, "Real-time Event Broker", "Socket.io WSS", "Distributes live attendance locks and emergency change alerts.")
        ContainerDb(DB, "Relational Database", "PostgreSQL 15", "Persists attendance, demand records, recipes, and immutable audit logs.")
        Container(Media, "Compliance Media Store", "File System / Object Storage", "Retains 24-hour food retention sample photos and scale weight readouts.")
    }

    Rel(TCH, SPA, "Uses [IF-USER]", "HTTPS")
    Rel(MGR, SPA, "Uses [IF-USER]", "HTTPS")
    Rel(KIT, SPA, "Uses [IF-USER]", "HTTPS")
    Rel(ADM, SPA, "Uses [IF-USER]", "HTTPS")

    Rel(SPA, API, "Invokes REST Endpoints", "JSON / HTTPS")
    Rel(SPA, WS, "Subscribes / Emits Events", "WSS")
    Rel(API, DB, "Reads / Writes Relational Data", "TCP / Port 5432")
    Rel(API, Media, "Stores Compliance Photos", "File I/O")
    Rel(API, WS, "Triggers Notification Broadcasts", "In-Process / IPC")

    Rel(API, SIS, "Synchronizes Student & Class Data [IF-01]", "HTTPS / JSON")
    Rel(API, Inventory, "Dispatches Ingredient Allocation Slips [IF-02]", "HTTPS / JSON")
    Rel(API, ParentGateway, "Triggers Absence & Meal Notifications [IF-03]", "HTTPS / JSON")
```

### Level 1 Component Specifications

| Container | Technology Stack | Core Responsibilities | Directory Path |
|:---|:---|:---|:---|
| **Role-Tailored SPA** | HTML5, ES6 Modules, Vanilla CSS | Presents role-optimized viewports (390px mobile card roll-call for teachers, data-dense analytical grid for managers, 48px touch kiosks for chefs). | `frontend/` |
| **Backend API Service** | Node.js LTS, Express.js | Implements domain services, temporal cutoff policy guards (`CutoffPolicyGuard`), portion calculation engines, and ACID database operations. | `backend/src/` |
| **Real-time Event Broker** | Socket.io over WSS | Manages active WebSocket client rooms (`teachers`, `managers`, `kitchen`), broadcasting real-time roster lock signals and emergency alerts. | `backend/src/websocket/` |
| **Relational Database** | PostgreSQL 15 | Enforces relational integrity, check constraints, composite B-tree indexing, and append-only audit tables (`meal_participation_changes`, `meal_demand_changes`). | `docs/06-database/` |
| **Compliance Media Store** | Local Storage / S3 | Stores photo attachments of kitchen digital scale readouts and 24-hour food retention sample jars for regulatory audits. | `storage/media/` |

---

## 5.2 Level 2 — Internal Domain Components (Decomposition of Backend API)

The Backend API is internally structured into 3 decoupled domain modules matching the MVP business capabilities:

### Module 1: Meal Participation Management (`M1`)

Governs student attendance, daily meal inclusion, status modifications, and the 08:00 AM cutoff policy lock.

![Meal Participation Components](../c4/images/MealParticipationComponents.png)

```mermaid
graph TD
    subgraph Module1 ["Module 1: Meal Participation Management"]
        Ctrl1["ParticipationController<br/>Express Router"]
        Guard1["CutoffPolicyGuard<br/>Temporal Middleware"]
        Svc1["ParticipationService<br/>Domain Logic"]
        Repo1["IParticipationRepository<br/>Data Access Interface"]
        Audit1["ParticipationAuditLogger<br/>Append-Only Logger"]
    end

    Ctrl1 --> Guard1
    Guard1 --> Svc1
    Svc1 --> Repo1
    Svc1 --> Audit1
    Repo1 --> DB1[("PostgreSQL: meal_participations")]
    Audit1 --> DB2[("PostgreSQL: meal_participation_changes")]
```

- **`ParticipationController`:** Handles HTTP requests from teacher mobile clients (`POST /api/v1/participations`, `GET /api/v1/roster`).
- **`CutoffPolicyGuard`:** Express middleware that verifies current system clock against the 08:00:00 AM cutoff parameter. Direct edits after 08:00 AM are rejected with `409 CONFLICT`.
- **`ParticipationService`:** Encapsulates business validation: enforces valid absence reasons and ensures student dietary alerts are retained.
- **`ParticipationAuditLogger`:** Persists every pre-cutoff change into `meal_participation_changes` with user ID and timestamp.

---

### Module 2: Meal Demand & Quantity Management (`M2`)

Aggregates locked classroom headcounts, executes dynamic recipe portion formulas, applies safety buffer margins (3%–5%), and orchestrates the emergency post-cutoff triage.

![Demand Management Components](../c4/images/DemandManagementComponents.png)

```mermaid
graph TD
    subgraph Module2 ["Module 2: Meal Demand and Quantity Management"]
        Ctrl2["DemandController<br/>Express Router"]
        Svc2["DemandService<br/>Domain Orchestrator"]
        Engine2["PortionCalculationEngine<br/>Recipe Scaling Engine"]
        Buf2["BufferPolicyManager<br/>Safety Margin Rules"]
        Emerg2["EmergencyChangeManager<br/>Post-Cutoff Triage"]
        Repo2["IDemandRepository<br/>Data Access Interface"]
    end

    Ctrl2 --> Svc2
    Svc2 --> Engine2
    Svc2 --> Buf2
    Ctrl2 --> Emerg2
    Svc2 --> Repo2
    Emerg2 --> Repo2
    Repo2 --> DB3[("PostgreSQL: meal_demands and dishes")]
```

- **`DemandController`:** Exposes endpoints for the Manager Analytical Dashboard (`GET /api/v1/demand/summary`, `POST /api/v1/demand/emergency-approval`).
- **`PortionCalculationEngine`:** Pure domain calculation service. Multiplies confirmed headcounts by standardized recipe ingredient weights (e.g. $100\text{g protein/student}$).
- **`BufferPolicyManager`:** Applies and bounds safety buffer percentages ($3\% \le \text{buffer} \le 10\%$), preventing under-portioning while capping catering budget overrun.
- **`EmergencyChangeManager`:** Manages the two-step triage workflow: receives late absence/arrival requests from teachers and queues them for manager approval.

---

### Module 3: Kitchen Meal Preparation (`M3`)

Transforms calculated dish demand into station shift schedules, provisions pantry ingredient requisitions, captures batch cooking temperatures, and reconciles finished yields.

![Meal Preparation Components](../c4/images/MealPreparationComponents.png)

```mermaid
graph TD
    subgraph Module3 ["Module 3: Kitchen Meal Preparation"]
        Ctrl3["PreparationController<br/>Kiosk Router"]
        Svc3["PreparationService<br/>Cooking Workflow"]
        Alloc3["IngredientAllocationEngine<br/>Store Requisition"]
        HACCP3["HACCPTemperatureValidator<br/>Safety Gatekeeper"]
        Yield3["YieldReconciliationEngine<br/>Variance Reconciler"]
        Repo3["IPreparationRepository<br/>Data Access Interface"]
    end

    Ctrl3 --> Svc3
    Svc3 --> Alloc3
    Svc3 --> HACCP3
    Svc3 --> Yield3
    Svc3 --> Repo3
    Repo3 --> DB4[("PostgreSQL: meal_preparations and yields")]
```

- **`PreparationController`:** Serves the Wall-Mounted Kitchen Kiosk interface (`GET /api/v1/prep/tasks`, `POST /api/v1/prep/temperature`).
- **`IngredientAllocationEngine`:** Derives storekeeper pantry pick-lists from recipe weights and validates ingredient availability before cooking shifts commence.
- **`HACCPTemperatureValidator`:** Enforces food safety rules: prevents transitioning cooking batches to `READY_FOR_SERVING` unless recorded temperature is $\ge 75^\circ\text{C}$.
- **`YieldReconciliationEngine`:** Compares gross finished weight (kg) against planned demand weight. Automatically flags discrepancies $> \pm 3\%$ and demands mandatory chef discrepancy notes.

---

## 5.3 Traceability to Code Layer (C4 Level 4)

Each Level 2 component maps directly to concrete domain classes, interfaces, and database entities documented in the C4 Level 4 specifications:
- **Module 1 Class Model:** [c4/c4-code-participation.md](../c4/c4-code-participation.md)
- **Module 2 Class Model:** [c4/c4-code-demand.md](../c4/c4-code-demand.md)
- **Module 3 Class Model:** [c4/c4-code-preparation.md](../c4/c4-code-preparation.md)
- **Relational Schema & DDL:** [docs/06-database/database-ddl.sql](../docs/06-database/database-ddl.sql)
