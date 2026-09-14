# C4 Level 2 — Container Diagram

## 1. Overview

The **Container Diagram** unpacks the Semi-Boarding Meal Management System into its high-level technical building blocks and independently deployable software units. It establishes how client interfaces, backend application services, asynchronous real-time brokers, and persistent databases communicate across network boundaries.

---

## 2. Container Diagram (C4Container)

```mermaid
C4Container
  title Container Diagram - Primary School Semi-Boarding Meal Management System

  Person(teacher, "Homeroom Teacher", "Performs roll call and locks class roster via mobile device")
  Person(manager, "Meal / Nutrition Manager", "Supervises demand calculations and signs off on kitchen yields")
  Person(kitchen, "Kitchen Staff / Head Chef", "Tracks station batches and enters completed yields via touch kiosk")
  Person(admin, "School Administrator", "Manages user access, meal schedules, and master recipes")

  System_Boundary(mealSystem, "Semi-Boarding Meal Management System") {
    Container(spa, "Single-Page Application (SPA)", "HTML5, ES6 Vanilla JS, CSS3 Tokens", "Unified client-side web application incorporating 3 role portals: Teacher Mobile Portal, Manager Analytical Dashboard, and Kitchen Touch Kiosk")
    
    Container(api, "Backend API Service", "Node.js / Express, REST, JWT", "Executes business domain logic, enforces morning cutoff locks, computes portion formulas, and governs multi-tier audit trails")
    
    Container(realtime, "Real-time Event Broker", "WebSocket / Socket.io Engine", "Broadcasts asynchronous live push notifications (class roster locks, post-cutoff emergency alerts, batch completion timers)")
    
    ContainerDb(db, "Relational Database", "PostgreSQL 15", "Authoritative persistence layer storing operational entities, audit change ledgers, recipe multipliers, and RBAC credentials")
    
    ContainerDb(fileStorage, "Asset & Certificate Storage", "Object Storage / Local FS", "Stores 24-hour food retention sample photographs, scale printout captures, and signed inspection receipts")
  }

  System_Ext(sis, "School Information System (SIS)", "REST/JSON", "Student roster and medical allergy profile sync")
  System_Ext(inventory, "Pantry & Supplier System", "REST/JSON", "Stock checks and automated raw ingredient dispatch")

  %% Client interactions
  Rel(teacher, spa, "Enters attendance and notes", "HTTPS")
  Rel(manager, spa, "Monitors dashboard, approves buffer & recipes", "HTTPS")
  Rel(kitchen, spa, "Interacts with station timers & yields", "HTTPS")
  Rel(admin, spa, "Configures master catalogs & permissions", "HTTPS")

  %% Client to Backend
  Rel(spa, api, "Issues authenticated business commands (CRUD, Confirm, Scale)", "JSON/HTTPS")
  Rel(spa, realtime, "Subscribes to live operational event streams", "WSS")

  %% Backend Internal
  Rel(api, realtime, "Publishes state change events to connected clients", "TCP / IPC")
  Rel(api, db, "Executes transactional read/write operations", "SQL / Connection Pool")
  Rel(api, fileStorage, "Persists and retrieves food safety photo evidence", "HTTPS / S3 API")

  %% External Integrations
  Rel(api, sis, "Synchronizes student eligibility & medical allergies", "HTTPS/REST")
  Rel(api, inventory, "Submits raw ingredient requisition requests", "HTTPS/REST")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

## 3. Container Technical Responsibilities & Stack

### 3.1. Single-Page Application (SPA)
- **Technology Stack:** Semantic HTML5, Vanilla ES6 JavaScript Modules, Modular Vanilla CSS Design Tokens (zero heavy framework overhead, instant cold start, high reliability).
- **Embedded Portals:**
  1. *Teacher Portal:* Mobile-first viewport (390px responsive container), card-based roster, single-tap toggle buttons (`Present`, `Absent`, `Dietary Exception`), and cutoff countdown badge.
  2. *Manager Dashboard:* Dense analytical table grid with sticky headers, dynamic headcount summary chips, buffer slider (0% - 10%), and post-cutoff adjustment approval dialogs.
  3. *Kitchen Kiosk:* Wall-mount layout with high contrast, large 48px+ touch targets, station countdown timers, and integrated keypad for entering measured kilograms.

### 3.2. Backend API Service
- **Technology Stack:** Node.js runtime with Express.js REST routing and JSON schema validation.
- **Architectural Responsibilities:**
  - **RBAC & Token Verification:** Enforces role-based guards across 4 user personas (`TCH`, `MGR`, `KIT`, `ADM`).
  - **Temporal Cutoff Enforcement:** Rejects direct updates to `meal_participations` submitted after 08:00 AM, automatically requiring downstream emergency change requests.
  - **Recipe Scaling & Buffer Calculation Engine:** Applies nutritional formulas translating confirmed student numbers into raw ingredient grams and final finished dish kilograms.
  - **Immutable Audit Engine:** Automatically intercepts changes to confirmed records and generates immutable change history records (`meal_participation_changes`, `meal_demand_changes`).

### 3.3. Real-time Event Broker (WebSocket Service)
- **Technology Stack:** WebSocket Server (Socket.io protocol over WSS).
- **Core Event Channels:**
  - `CLASS_ROSTER_LOCKED`: Alerts the Manager Dashboard when a homeroom teacher confirms their room.
  - `EMERGENCY_AMENDMENT_PENDING`: Raises an urgent visual badge and sound alert on the Manager workstation when a post-cutoff absence is logged.
  - `STATION_BATCH_COMPLETED`: Signals that a cooking station has finished its scheduled batch, alerting the kitchen lead to perform yield weighing.

### 3.4. Relational Database (PostgreSQL 15)
- **Storage Model:** Normalized relational schema enforcing referential integrity, check constraints, foreign keys, and unique indexes.
- **Audit Compliance:** Explicit `meal_participation_changes` and `meal_demand_changes` tables track `previous_status`, `new_status`, `reason`, `changed_by_user_id`, and exact timestamps.
- **Query Performance:** Optimized B-Tree composite indexes on `(meal_schedule_id, status)` and `(student_id, date)` supporting sub-10ms response times under peak morning load.

### 3.5. Asset & Certificate Storage
- Serves as the repository for compliance media required under school health regulations:
  - 24-hour retention food sample photos (sealed container, labeled with date, meal session, and handler).
  - High-resolution photographs of digital scale readouts for kitchen yield verification.
