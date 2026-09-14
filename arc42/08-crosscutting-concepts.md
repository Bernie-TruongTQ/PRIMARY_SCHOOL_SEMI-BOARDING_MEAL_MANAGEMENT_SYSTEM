# 8. Crosscutting Concepts

## Overview

Crosscutting concepts govern rules, mechanisms, and patterns applied uniformly across multiple building blocks. In the **Semi-Boarding Meal Management System**, these overarching concepts ensure data consistency, legal food safety compliance, tamper-evident auditability, and role-based operational ergonomics across all 3 active MVP modules.

---

## 8.1 Unified Domain Model

The system's core business entities span across classroom participation, kitchen preparation, and nutritional planning. All operations are anchored to a common daily schedule dimension (`meal_schedules`).

```mermaid
classDiagram
    direction TB
    
    class Student {
        +id: SERIAL
        +student_code: VARCHAR
        +full_name: VARCHAR
        +class_id: INTEGER
        +dietary_restrictions: VARCHAR
        +has_severe_allergy: BOOLEAN
    }

    class MealSchedule {
        +id: SERIAL
        +date: DATE
        +meal_type: ENUM
        +cutoff_time: TIME
        +status: ENUM
    }

    class MealParticipation {
        +id: SERIAL
        +student_id: INTEGER
        +meal_schedule_id: INTEGER
        +status: ENUM
        +is_locked: BOOLEAN
    }

    class MealParticipationChange {
        +id: SERIAL
        +participation_id: INTEGER
        +previous_status: ENUM
        +new_status: ENUM
        +reason: VARCHAR
        +changed_by: INTEGER
    }

    class MealDemand {
        +id: SERIAL
        +meal_schedule_id: INTEGER
        +total_headcount: INTEGER
        +buffer_rate: DECIMAL
        +status: ENUM
    }

    class MealDemandDish {
        +id: SERIAL
        +meal_demand_id: INTEGER
        +dish_id: INTEGER
        +portion_weight_grams: DECIMAL
        +calculated_weight_kg: DECIMAL
        +target_buffer_weight_kg: DECIMAL
    }

    class MealPreparation {
        +id: SERIAL
        +meal_demand_dish_id: INTEGER
        +station_name: VARCHAR
        +batch_number: INTEGER
        +core_temperature_celsius: DECIMAL
        +yield_actual_kg: DECIMAL
        +yield_variance_percent: DECIMAL
        +status: ENUM
    }

    Student "1" -- "0..*" MealParticipation : registers
    MealSchedule "1" -- "0..*" MealParticipation : schedules
    MealParticipation "1" -- "0..*" MealParticipationChange : audits
    MealSchedule "1" -- "1" MealDemand : drives
    MealDemand "1" -- "1..*" MealDemandDish : itemizes
    MealDemandDish "1" -- "1..*" MealPreparation : executes
```

---

## 8.2 Security & Role-Based Access Control (RBAC)

The system enforces strict boundary isolation based on user personas, adhering to the principle of least privilege:

```mermaid
graph LR
    subgraph Roles ["Authenticated User Roles"]
        TCH["Homeroom Teacher"]
        MGR["Meal / Nutrition Manager"]
        KIT["Kitchen Staff / Chef"]
        ADM["School Administrator"]
    end

    subgraph Boundaries ["Domain Boundary Scopes"]
        Scope1["Classroom Attendance Scope<br/>(Limited to assigned class)"]
        Scope2["Central Demand & Buffer Scope<br/>(School-wide read/write & approval)"]
        Scope3["Kitchen Execution & HACCP Scope<br/>(Station tasks, temp & scale readouts)"]
        Scope4["System Admin Scope<br/>(User credentials & recipe master data)"]
    end

    TCH -->|"Read / Write"| Scope1
    MGR -->|"Full Control"| Scope2
    MGR -->|"Read Only"| Scope1
    KIT -->|"Read / Write"| Scope3
    ADM -->|"Full Admin"| Scope4
```

| Security Dimension | Architectural Mechanism | Technical Implementation |
|:---|:---|:---|
| **Authentication** | JWT Bearer tokens + HTTP-only Secure Cookies | Token payload contains `userId`, `role`, and assigned `classId`. Tokens expire after 8 hours (standard school shift). |
| **Authorization Guards** | Route-level middleware (`requireRole`, `requireClassroomOwnership`) | Teacher token cannot read or mutate rosters belonging to other classrooms. Kitchen staff tokens cannot access financial demand tables. |
| **Data Privacy (PII)** | Encrypted in-transit, restricted read access | Student medical notes and dietary flags are transmitted strictly over TLS 1.3 and masked in external notification payloads. |

---

## 8.3 Temporal Cutoff Enforcement & Transactional Consistency

The 08:00 AM cutoff policy is the central operational boundary separating classroom check-in from kitchen production.

```mermaid
stateDiagram-v2
    [*] --> PRE_CUTOFF: Prior to 08:00 AM
    
    state PRE_CUTOFF {
        [*] --> Editable
        Editable --> Editable: Teacher marks present/absent
        Editable --> Confirmed: Teacher locks classroom roster
    }

    PRE_CUTOFF --> POST_CUTOFF: Server Clock >= 08:00:00 AM
    
    state POST_CUTOFF {
        [*] --> Locked
        Locked --> Rejection: Direct Edit Attempted (409 Conflict)
        Locked --> EmergencyPending: Teacher Submits Emergency Request (SCR-TCH-04)
        EmergencyPending --> Approved: Manager Approves (+1 Dish Target)
        EmergencyPending --> Rejected: Manager Rejects
    }
```

- **NTP Server Clock Synchronization:** All container hosts synchronize time via Network Time Protocol (NTP). Client device clock timestamps are ignored; the server clock is the authoritative single source of truth.
- **ACID Transaction Isolation:** Roster locking and demand recalculation are wrapped in PostgreSQL `READ COMMITTED` transactions to prevent dirty reads during peak morning submission bursts.

---

## 8.4 Food Allergen Safety & HACCP Gatekeeping

Food safety is governed by automated software checks that prevent human oversight from causing allergic reactions or microbial contamination:

1. **Persistent Allergen Red Flags:**
   - Medical allergy indicators (`has_severe_allergy = TRUE`) retrieved from the SIS are persistently attached to student models.
   - Frontend components render prominent visual badges (red border, allergy alert icon, dietary restriction chip) that cannot be collapsed or dismissed by teachers or kitchen portioning servers.
2. **Two-Phase Cooking Temperature Gatekeeper:**
   - Decision 1246/QĐ-BYT mandates core temperatures $\ge 75^\circ\text{C}$ for cooked animal proteins.
   - The backend enforces a hard state transition barrier: the API endpoint `POST /api/v1/prep/batches/{id}/complete` explicitly validates `core_temperature_celsius >= 75.0`. Requests with lower readings are rejected with `422 UNPROCESSABLE ENTITY`.

---

## 8.5 Audit Logging & Immutability

To guarantee complete financial and operational accountability, data modifications post-roster-lock are handled via dedicated append-only audit ledgers:

| Ledger Table | Trigger Event | Captured Fields | Immutability Guarantee |
|:---|:---|:---|:---|
| **`meal_participation_changes`** | Pre-cutoff edits to confirmed student attendance | `participation_id`, `previous_status`, `new_status`, `reason`, `changed_by_user_id`, `created_at` | Database triggers prohibit `UPDATE` or `DELETE` operations on this table. |
| **`meal_demand_changes`** | Post-cutoff emergency additions or cancellations | `demand_id`, `student_id`, `change_type`, `reason`, `delta_count`, `approved_by_user_id`, `timestamps` | Append-only ledger; financial auditors can trace every meal charge variance back to the approving manager. |

---

## 8.6 Standardized Error Handling & Resilience

1. **Uniform API Error Envelope:** All REST endpoints return consistent JSON error structures:
   ```json
   {
     "error": {
       "code": "CUTOFF_LOCKED",
       "message": "Classroom roster locked at 08:00 AM cutoff. Direct updates are prohibited.",
       "action": "SUBMIT_EMERGENCY_REQUEST",
       "timestamp": "2026-09-14T08:04:12Z"
     }
   }
   ```
2. **Client-Side Optimistic UI with Network Rollback:** The Teacher mobile SPA updates UI attendance toggles instantaneously in browser memory. If the backend returns a network error or HTTP 409, the UI rolls back the toggle and alerts the teacher with a toast notification.
