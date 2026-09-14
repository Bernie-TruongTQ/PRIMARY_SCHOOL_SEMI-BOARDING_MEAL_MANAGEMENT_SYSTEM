# C4 Level 3 — Component Diagram: Meal Participation Management (Module 1)

## 1. Overview

This document specifies the internal software components within the `Backend API Service` container that implement **Module 1: Meal Participation Management**. This module governs classroom student attendance capture, dietary and allergen notice tracking, morning cutoff rule enforcement, and audit ledger tracking.

---

## 2. Component Diagram (C4Component)

```mermaid
C4Component
  title Component Diagram - Module 1: Meal Participation Management

  Container(spaTeacher, "Teacher Portal SPA", "HTML5/Vanilla JS", "Mobile web interface used by homeroom teachers to record attendance and lock rosters")
  ContainerDb(db, "PostgreSQL Database", "PostgreSQL 15", "Stores meal_participations, meal_participation_changes, and student master records")
  Container(realtime, "Event Broker", "WebSocket", "Dispatches real-time broadcast when a class completes roster locking")

  Container_Boundary(apiBoundary, "Backend API Service - Module 1 Boundary") {
    Component(partController, "Participation Controller", "Express Router", "Exposes REST endpoints to query classroom rosters, submit bulk attendance, and lock rosters")
    
    Component(cutoffGuard, "Cutoff Policy Guard", "Middleware / Rule Enforcer", "Enforces the daily 08:00 cutoff deadline; blocks direct roster modifications after the limit")
    
    Component(allergyGuard, "Allergy Alert Interceptor", "Domain Component", "Cross-references student medical records to attach prominent allergen warning flags")
    
    Component(partService, "Participation Service", "Domain Logic Service", "Executes attendance business logic: transitions status (pending -> recorded -> confirmed) and counts headcounts")
    
    Component(auditLogger, "Participation Audit Logger", "Audit Interceptor", "Captures status changes and appends before/after values with mandatory reasons to meal_participation_changes")
    
    Component(partRepo, "Participation Repository", "Data Access (pg)", "Executes transactional queries against meal_participations and meal_participation_changes tables")
  }

  %% Relationships
  Rel(spaTeacher, partController, "Submits attendance data & lock requests", "JSON/HTTPS")
  Rel(partController, cutoffGuard, "Validates submission timestamp against cutoff", "Direct Call")
  Rel(cutoffGuard, partService, "Forwards validated request", "Internal Call")
  
  Rel(partService, allergyGuard, "Evaluates allergy and dietary flags", "Internal Call")
  Rel(partService, auditLogger, "Logs modification events", "Internal Call")
  Rel(partService, partRepo, "Persists updated participation records", "Internal Call")
  Rel(auditLogger, partRepo, "Inserts audit ledger records", "Internal Call")
  
  Rel(partRepo, db, "Executes SQL statements in single transaction", "SQL / Connection Pool")
  Rel(partService, realtime, "Publishes CLASS_ROSTER_LOCKED event", "Socket Event")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

## 3. Component Details & Operational Responsibilities

### 3.1. Participation Controller
- **Endpoint Definitions:**
  - `GET /api/v1/classes/{classId}/participations`: Retrieves the daily roll call list for a specified meal schedule.
  - `POST /api/v1/participations/bulk-record`: Batch updates initial attendance records (`F-PAR-01`).
  - `PUT /api/v1/participations/{id}/amend`: Adjusts an individual student's status with a mandatory justification (`F-PAR-02`).
  - `POST /api/v1/classes/{classId}/confirm-roster`: Formally locks the classroom attendance roster (`F-PAR-03`).

### 3.2. Cutoff Policy Guard
- **Operational Rules:**
  - **Before 08:00 AM:** Homeroom teachers have full editing privileges (`present`, `absent`, `dietary_exception`).
  - **At / After 08:00 AM:** Direct edits to `meal_participations` are strictly locked. Any subsequent alterations must be routed through `Emergency Request` workflows targeting Module 2.

### 3.3. Allergy Alert Interceptor
- Inspects student medical profiles from `students.medical_dietary_notes`.
- Automatically injects high-priority visual flags (e.g., `ALLERGY_CRITICAL: PEANUTS`) to ensure both teachers and kitchen staff recognize children requiring dedicated, separate food trays.

### 3.4. Participation Audit Logger
- Enforces institutional transparency:
  - Whenever an existing participation record is modified, this component automatically creates a row in `meal_participation_changes`.
  - Captures: `meal_participation_id`, `previous_status`, `new_status`, `change_type` (`status_update`, `correction`, `reschedule`), `change_reason`, `changed_by_user_id`, and `created_at`.

### 3.5. Participation Repository
- Ensures relational atomicity:
  - Wraps class-wide lock operations inside a PostgreSQL `BEGIN ... COMMIT` block, preventing partial class confirmations.
  - Enforces unique index constraints on `(meal_schedule_id, student_id)` to prevent duplicate daily entries.
