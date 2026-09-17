# 5. Building Block View

## Overview

The **Building Block View** shows the static decomposition of the Semi-Boarding Meal Management System into hierarchical structural units. It follows a multi-level white-box / black-box approach:
- **Level 1 (System Containers):** High-level deployable units and their communication interfaces.
- **Level 2 (Domain Components):** Internal components of the Backend API decomposed across the 3 core operational modules (`Participation`, `Demand & Vendor Orders`, `Receiving, Distribution & Reconciliation`).

---

## 5.1 Level 1 — System Containers (Whitebox)

The system is decomposed into five primary deployable containers: client-side Single-Page Application (SPA) structured into 4 autonomous role portals, an Express.js Backend API Service, an asynchronous Real-time Event Broker, a PostgreSQL 15 Relational Database, and an S3-compatible Compliance Media Store.

### Container Architecture Diagram

```mermaid
C4Container
    title Level 1 — Container Diagram: Semi-Boarding Meal Management System

    Person(mgr, "Semi-Boarding Coordinator", "Desktop/Tablet Web (/coordinator)")
    Person(acc, "School Accountant", "Desktop Web (/accountant)")
    Person(par, "Parent / Guardian", "Mobile Web (/parent)")
    Person(adm, "School Administrator", "Admin Web (/admin)")

    System_Ext(sis, "School Information System", "Student & Allergen Master")
    System_Ext(caterer, "Catering Vendor Gateway", "Purchase Orders & Delivery Tracking")
    System_Ext(payment, "Banking / Payment Gateway", "VietQR Payments & Webhooks")
    System_Ext(notifications, "Parent Notification Gateway", "SMS / Zalo / Web Push")

    Container_Boundary(SystemBoundary, "Semi-Boarding Meal Management System") {
        Container(SPA, "Role-Tailored SPA", "HTML5, ES6 Modules, Vanilla CSS", "Provides 4 autonomous role portals: Coordinator, Accountant, Parent, and Admin.")
        Container(API, "Backend API Service", "Node.js, Express.js", "Implements 8 business domains, 08:30 AM cutoff policy, buffer formulas, and billing batches.")
        Container(WS, "Real-time Event Broker", "Socket.io WSS", "Distributes live attendance locks, 08:30 AM countdown pulses, and dock delivery arrival alerts.")
        ContainerDb(DB, "Relational Database", "PostgreSQL 15", "Persists student rosters, attendance, catering orders, receiving inspections, reconciliations, invoices, and audit logs.")
        Container(Media, "Compliance Media Store", "S3-compatible Storage", "Retains dock thermometer probe readout photos, container seal photos, and 24-hour retention sample photos.")
    }

    Rel(mgr, SPA, "Uses [IF-USER]", "HTTPS")
    Rel(acc, SPA, "Uses [IF-USER]", "HTTPS")
    Rel(par, SPA, "Uses [IF-USER]", "HTTPS")
    Rel(adm, SPA, "Uses [IF-USER]", "HTTPS")

    Rel(SPA, API, "Invokes REST Endpoints", "JSON / HTTPS")
    Rel(SPA, WS, "Subscribes / Emits Events", "WSS")
    Rel(API, DB, "Reads / Writes Relational Data", "TCP / Port 5432")
    Rel(API, Media, "Stores Compliance Photos", "S3 API")
    Rel(API, WS, "Triggers Notification Broadcasts", "In-Process / IPC")

    Rel(API, sis, "Synchronizes Student & Class Data [IF-01]", "HTTPS / JSON")
    Rel(API, caterer, "Transmits Daily Catering Purchase Orders [IF-02]", "HTTPS / JSON / Webhook")
    Rel(API, payment, "Generates Dynamic VietQR & Receives Webhooks [IF-03]", "HTTPS / JSON / Webhook")
    Rel(API, notifications, "Dispatches Parent Notifications [IF-04]", "HTTPS / JSON")
```

### Level 1 Component Specifications

| Container | Technology Stack | Core Responsibilities | Directory Path |
|:---|:---|:---|:---|
| **Role-Tailored SPA** | HTML5, ES6 Modules, Vanilla CSS | Presents 4 autonomous role portals: Coordinator Portal (`/coordinator`), Accountant Portal (`/accountant`), Parent Portal (`/parent`), Admin Portal (`/admin`). | `frontend/` |
| **Backend API Service** | Node.js LTS, Express.js | Implements domain services, temporal cutoff policy guards (`AttendanceCutoffGuard`), safety buffer calculations, order dispatchers, and ACID database operations. | `backend/src/` |
| **Real-time Event Broker** | Socket.io over WSS | Manages active WebSocket client rooms (`coordinators`, `teachers`, `accountants`, `parents`), broadcasting real-time roster lock signals, delivery arrivals, and emergency alerts. | `backend/src/websocket/` |
| **Relational Database** | PostgreSQL 15 | Enforces relational integrity, check constraints, composite B-tree indexing, and append-only audit tables (`meal_participation_changes`, `meal_discrepancies`). | `docs/06-database/` |
| **Compliance Media Store** | Local Storage / S3 | Stores photo attachments of dock thermometer probe readouts, container seals, and 24-hour food retention sample jars for regulatory audits. | `storage/media/` |

---

## 5.2 Level 2 — Internal Domain Components (Decomposition of Backend API)

The Backend API is internally structured into 3 core operational modules matching the primary value chain, supported by fee, reporting, and master data modules:

### Module 1: Student Meal & Participation Management (`M1`)

Governs student intake eligibility, semester boarding registrations, daily classroom roll-call, and the strict 08:30 AM attendance cutoff lock.

```mermaid
graph TD
    subgraph Module1 ["Module 1: Student Meal & Participation Management"]
        Ctrl1["ParticipationController<br/>Express Router"]
        Guard1["AttendanceCutoffGuard<br/>Temporal 08:30 AM Interceptor"]
        Svc1["ParticipationService<br/>Domain Logic"]
        Elig1["EligibilityEvaluator<br/>Domain Service"]
        Reg1["RegistrationManager<br/>Domain Service"]
        Allergy1["AllergyAlertInterceptor<br/>Safety Interceptor"]
        Audit1["ParticipationAuditLogger<br/>Append-Only Logger"]
        Repo1["IParticipationRepository<br/>Data Access Interface"]
    end

    Ctrl1 --> Guard1
    Guard1 --> Svc1
    Ctrl1 --> Elig1
    Ctrl1 --> Reg1
    Svc1 --> Allergy1
    Svc1 --> Audit1
    Svc1 --> Repo1
    Repo1 --> DB1[("PostgreSQL: students, meal_participations, registrations")]
    Audit1 --> DB2[("PostgreSQL: meal_participation_changes")]
```

- **`ParticipationController`:** Exposes endpoints for daily classroom attendance (`POST /api/v1/classes/:classId/attendance/bulk`, `POST /api/v1/classes/:classId/attendance/lock`).
- **`AttendanceCutoffGuard`:** Express middleware enforcing the strict 08:30:00 AM daily cutoff. Direct updates after 08:30 AM are rejected with `409 Conflict`.
- **`EligibilityEvaluator`:** Evaluates boarding intake eligibility criteria based on enrollment status and health clearance.
- **`RegistrationManager`:** Manages semester-level meal program enrollments, modifications, and dietary notes.
- **`AllergyAlertInterceptor`:** Cross-checks student medical allergy profiles against daily scheduled menus to render persistent visual alert badges.
- **`ParticipationAuditLogger`:** Persists every attendance modification into `meal_participation_changes` with user ID, timestamp, and explicit reason.

---

### Module 2: Meal Demand & Vendor Order Management (`M2`)

Aggregates locked classroom headcounts, applies safety buffer margins ($0\%\text{--}10\%$), calculates expected dish quantities, and dispatches electronic purchase orders to the external catering vendor before 08:45 AM.

```mermaid
graph TD
    subgraph Module2 ["Module 2: Meal Demand & Catering Order Management"]
        Ctrl2["DemandController<br/>Express Router"]
        Agg2["AttendanceAggregationEngine<br/>Rollup Service"]
        Buf2["BufferCalculationEngine<br/>Safety Margin Rules"]
        DishCalc2["MenuDishQuantityCalculator<br/>Dish Portion Scaler"]
        OrderDisp2["CateringOrderDispatcher<br/>Vendor Integration Adapter"]
        MenuSvc2["MenuPlanningService<br/>Dish Catalog & Menus"]
        Repo2["IDemandRepository<br/>Data Access Interface"]
    end

    Ctrl2 --> MenuSvc2
    Ctrl2 --> Agg2
    Ctrl2 --> Buf2
    Ctrl2 --> DishCalc2
    Ctrl2 --> OrderDisp2
    Ctrl2 --> Repo2
    Repo2 --> DB3[("PostgreSQL: meal_demands, dishes, catering_orders")]
```

- **`DemandController`:** Exposes endpoints for the Coordinator Demand screen (`GET /api/v1/demands/today`, `POST /api/v1/demands/calculate`, `POST /api/v1/demands/dispatch-order`).
- **`AttendanceAggregationEngine`:** Scans locked classroom attendance records immediately after 08:30 AM to calculate total confirmed student diners.
- **`BufferCalculationEngine`:** Applies safety buffer formulas:
  $$\text{Final Demand Count} = \text{round}\Big(\text{Total Confirmed Attendance} \times (1 + \text{Buffer\%})\Big)$$
- **`MenuDishQuantityCalculator`:** Scales portion sizes according to the approved daily menu.
- **`CateringOrderDispatcher`:** Formats the formal electronic purchase order and transmits the payload to the external Catering Vendor Gateway before 08:45 AM.

---

### Module 3: Meal Receiving, Distribution & Reconciliation (`M3`)

Enforces 10:30 AM dock receiving with 3-step food safety inspection, coordinates 11:00 AM classroom trolley distribution, and executes 13:00 PM post-lunch 3-way quantity reconciliation.

```mermaid
graph TD
    subgraph Module3 ["Module 3: Meal Receiving, Distribution & Reconciliation"]
        Ctrl3["OperationsController<br/>Express Router"]
        Inspect3["QualityInspectionValidator<br/>3-Step Safety Gatekeeper"]
        Distrib3["ClassroomDistributionCoordinator<br/>Trolley Allocation"]
        Reconcile3["MealReconciliationEngine<br/>3-Way Variance Engine"]
        Discrep3["DiscrepancyResolutionManager<br/>Payable Adjuster"]
        Repo3["IOperationsRepository<br/>Data Access Interface"]
    end

    Ctrl3 --> Inspect3
    Ctrl3 --> Distrib3
    Ctrl3 --> Reconcile3
    Ctrl3 --> Discrep3
    Ctrl3 --> Repo3
    Repo3 --> DB4[("PostgreSQL: deliveries, inspections, distributions, reconciliations, discrepancies")]
```

- **`OperationsController`:** Serves receiving, distribution, and reconciliation screens (`/coordinator/receiving`, `/coordinator/distribution`, `/coordinator/reconciliation`).
- **`QualityInspectionValidator`:** Enforces Decision 1246/QĐ-BYT: validates core probe temp $\ge 65^\circ\text{C}$, container seals, sensory checks, and 24-hour food retention sample photos before clearance.
- **`ClassroomDistributionCoordinator`:** Allocates accepted hot meal trays to classroom delivery trolleys according to confirmed attendance.
- **`MealReconciliationEngine`:** Calculates 3-way variance: Ordered vs. Delivered vs. Consumed, detecting shortfalls, surplus, and unserved portions at 13:00 PM.
- **`DiscrepancyResolutionManager`:** Enforces mandatory discrepancy reason logging and calculates adjusted accepted billing counts for the School Accountant.

---

## 5.3 Traceability to Code Layer & C4 Architecture Models

Each Level 2 component maps directly to the C4 specifications and database schemas:
- **Participation Components:** [c4/c4-components-participation.md](../c4/c4-components-participation.md)
- **Demand Components:** [c4/c4-components-demand.md](../c4/c4-components-demand.md)
- **Preparation & Operations Components:** [c4/c4-components-preparation.md](../c4/c4-components-preparation.md)
- **Fee & Cost Components:** [c4/c4-components-fee-cost.md](../c4/c4-components-fee-cost.md)
- **Reporting Components:** [c4/c4-components-reporting.md](../c4/c4-components-reporting.md)
- **Relational Schema & DDL:** [docs/06-database/database-ddl.sql](../docs/06-database/database-ddl.sql)
