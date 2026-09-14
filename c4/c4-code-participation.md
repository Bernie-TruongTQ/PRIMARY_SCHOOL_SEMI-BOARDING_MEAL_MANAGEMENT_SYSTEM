# C4 Level 4 — Code Diagram: Meal Participation Management (Module 1)

## 1. Overview

The **Level 4 Code Diagram** provides the finest granularity of architectural detail in the C4 model for **Module 1: Meal Participation Management**. It zooms into the internal implementation structure of the components defined in [c4-components-participation.md](c4-components-participation.md), modeling the classes, interfaces, domain entities, value objects, and repository contracts following Domain-Driven Design (DDD) and TypeScript conventions.

---

## 2. Class Diagram (UML classDiagram)

```mermaid
classDiagram
  direction TB

  class ParticipationStatus {
    <<enumeration>>
    PENDING
    RECORDED
    CONFIRMED
    CANCELLED
  }

  class ChangeType {
    <<enumeration>>
    STATUS_UPDATE
    CORRECTION
    RESCHEDULE
  }

  class MealParticipation {
    <<entity>>
    +UUID id
    +UUID mealScheduleId
    +UUID studentId
    +ParticipationStatus status
    +UUID recordedByUserId
    +Date recordedAt
    +UUID confirmedByUserId
    +Date confirmedAt
    +Date createdAt
    +Date updatedAt
    +markRecorded(userId: UUID): void
    +confirm(userId: UUID): void
    +cancel(userId: UUID): void
  }

  class MealParticipationChange {
    <<entity>>
    +UUID id
    +UUID mealParticipationId
    +ParticipationStatus previousStatus
    +ParticipationStatus newStatus
    +ChangeType changeType
    +string changeReason
    +UUID changedByUserId
    +Date createdAt
  }

  class BulkRecordDto {
    +UUID mealScheduleId
    +UUID classId
    +RecordItem[] records
  }

  class AmendParticipationDto {
    +ParticipationStatus newStatus
    +ChangeType changeType
    +string reason
  }

  class ConfirmRosterDto {
    +UUID mealScheduleId
    +UUID classId
  }

  class IParticipationRepository {
    <<interface>>
    +findByScheduleAndClass(scheduleId: UUID, classId: UUID): Promise~MealParticipation[]~
    +findById(id: UUID): Promise~MealParticipation~
    +bulkSave(participations: MealParticipation[]): Promise~void~
    +save(participation: MealParticipation): Promise~MealParticipation~
    +createChangeLog(change: MealParticipationChange): Promise~void~
    +countConfirmedBySchedule(scheduleId: UUID): Promise~number~
  }

  class PgParticipationRepository {
    -Pool dbPool
    +findByScheduleAndClass(scheduleId: UUID, classId: UUID): Promise~MealParticipation[]~
    +findById(id: UUID): Promise~MealParticipation~
    +bulkSave(participations: MealParticipation[]): Promise~void~
    +save(participation: MealParticipation): Promise~MealParticipation~
    +createChangeLog(change: MealParticipationChange): Promise~void~
    +countConfirmedBySchedule(scheduleId: UUID): Promise~number~
  }

  class CutoffPolicyGuard {
    <<service>>
    -string CUTOFF_TIME_HHMM
    +isBeforeCutoff(scheduleDate: Date): boolean
    +assertBeforeCutoff(scheduleDate: Date): void
  }

  class AllergyAlertInterceptor {
    <<service>>
    +enrichWithAllergies(students: StudentProfile[]): EnrichedStudentRoster[]
    +hasCriticalAllergen(studentId: UUID): Promise~boolean~
  }

  class ParticipationAuditLogger {
    <<service>>
    -IParticipationRepository repo
    +logStatusChange(participationId: UUID, prev: ParticipationStatus, next: ParticipationStatus, reason: string, userId: UUID): Promise~void~
  }

  class ParticipationService {
    <<service>>
    -IParticipationRepository repo
    -CutoffPolicyGuard cutoffGuard
    -AllergyAlertInterceptor allergyInterceptor
    -ParticipationAuditLogger auditLogger
    +getClassRoster(scheduleId: UUID, classId: UUID): Promise~EnrichedStudentRoster~
    +recordClassParticipation(dto: BulkRecordDto, userId: UUID): Promise~void~
    +amendParticipation(id: UUID, dto: AmendParticipationDto, userId: UUID): Promise~MealParticipation~
    +confirmClassRoster(dto: ConfirmRosterDto, userId: UUID): Promise~RosterConfirmationSummary~
  }

  class ParticipationController {
    <<controller>>
    -ParticipationService service
    +getRoster(req: Request, res: Response): Promise~void~
    +bulkRecord(req: Request, res: Response): Promise~void~
    +amend(req: Request, res: Response): Promise~void~
    +confirmRoster(req: Request, res: Response): Promise~void~
  }

  %% Realizations and Associations
  PgParticipationRepository ..|> IParticipationRepository : implements
  ParticipationController --> ParticipationService : delegates to
  ParticipationService --> IParticipationRepository : uses
  ParticipationService --> CutoffPolicyGuard : verifies time
  ParticipationService --> AllergyAlertInterceptor : decorates roster
  ParticipationService --> ParticipationAuditLogger : logs audit
  ParticipationAuditLogger --> IParticipationRepository : persists log
  IParticipationRepository ..> MealParticipation : persists / queries
  IParticipationRepository ..> MealParticipationChange : persists
  MealParticipation *-- ParticipationStatus : has status
  MealParticipationChange *-- ChangeType : has type
  MealParticipationChange *-- ParticipationStatus : tracks status
  ParticipationController ..> BulkRecordDto : binds body
  ParticipationController ..> AmendParticipationDto : binds body
  ParticipationController ..> ConfirmRosterDto : binds body
```

---

## 3. Class & Method Specifications

### 3.1. Domain Entities & Value Objects

- **`MealParticipation`:** Aggregate root representing a single student's meal participation intent for a scheduled meal.
  - `status`: Transitions through `PENDING` $\rightarrow$ `RECORDED` $\rightarrow$ `CONFIRMED` $\rightarrow$ `CANCELLED`.
  - `markRecorded(userId)`: Transitions status from `PENDING` to `RECORDED`, stamping `recordedAt`.
  - `confirm(userId)`: Locks status to `CONFIRMED`, stamping `confirmedAt` and `confirmedByUserId`.

- **`MealParticipationChange`:** Immutable audit entity recording any modification after initial creation.
  - Required fields: `previousStatus`, `newStatus`, `changeReason`, `changedByUserId`.
  - Maps to database table `meal_participation_changes`.

### 3.2. Service & Guard Classes

- **`CutoffPolicyGuard`:**
  - Evaluates system timestamp against configured schedule cutoff (default: 08:00 AM).
  - Throws `CutoffExceededException` if a teacher attempts direct roster modifications after cutoff.

- **`AllergyAlertInterceptor`:**
  - Inspects medical records; decorates student roster entries with allergen flags (`isAllergic: true`, `allergyTags: string[]`).

- **`ParticipationAuditLogger`:**
  - Decoupled logging mechanism guaranteeing an audit record is generated synchronously within the transactional boundary.

- **`ParticipationService`:**
  - Main application orchestrator for Module 1.
  - Wraps `confirmClassRoster` in a database transaction, updates all classroom student rows to `CONFIRMED`, and publishes the event `CLASS_ROSTER_LOCKED`.

---

## 4. Method Invocation Workflow (Roster Confirmation)

```
[Client: Teacher Mobile SPA]
       │
       ▼ (HTTP POST /confirm-roster)
[ParticipationController.confirmRoster]
       │
       ▼ (confirmClassRoster(dto, userId))
[ParticipationService] ──► [CutoffPolicyGuard.assertBeforeCutoff(today)]  (Pass if < 08:00)
       │
       ├──► [IParticipationRepository.findByScheduleAndClass]
       │         └── Returns all MealParticipation entities for class
       │
       ├──► Loop: entity.confirm(userId)
       │
       ├──► [IParticipationRepository.bulkSave(entities)] (Transactional COMMIT)
       │
       └──► [EventPublisher.publish("CLASS_ROSTER_LOCKED")]
```
