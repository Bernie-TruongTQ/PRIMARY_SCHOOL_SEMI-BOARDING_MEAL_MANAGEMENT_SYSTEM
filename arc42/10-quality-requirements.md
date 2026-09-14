# 10. Quality Requirements

## Overview

This section elaborates the four prioritized quality goals defined in [Section 1.2](01-introduction-and-goals.md#12-quality-goals) into concrete, testable quality scenarios grounded in the **Q42 Quality Model** ([quality.arc42.org](https://quality.arc42.org)). Each scenario specifies a stimulus, environment condition, system response, and a strict numerical threshold defining architectural success.

---

## 10.1 Quality Requirements Overview

The quality requirements cover four primary Q42 quality properties that directly shape the system's architecture, security boundaries, and user interface ergonomics:

| Q42 Property | Scenarios | Primary Architectural Counterpart |
|:---|:---:|:---|
| **`#reliable`** *(Data Consistency, Fault Tolerance)* | **QS-01, QS-02** | `CutoffPolicyGuard` middleware, ACID PostgreSQL transactions, append-only change ledgers. |
| **`#efficient`** *(Response Time, Concurrency)* | **QS-03, QS-04** | Non-blocking Node.js event loop, composite B-tree indexing, Socket.io real-time pub/sub. |
| **`#safe`** *(Food Hygiene, Allergen Protection)* | **QS-05, QS-06** | Persistent allergen UI decorators, HACCP two-phase state machine ($\ge 75^\circ\text{C}$ gate). |
| **`#usable`** *(Ergonomics, Task Speed)* | **QS-07, QS-08** | Mobile-first 390px card viewports, $\ge 48\text{px}$ touch targets on kitchen kiosks. |

---

## 10.2 Concrete Quality Scenarios

### Scenario QS-01: Strict Cutoff Lockdown & Write Rejection
- **Quality Property:** `#reliable` (Integrity, Temporal Boundary Guard)
- **Priority:** Critical (Priority 1)
- **Stimulus:** A homeroom teacher attempts to submit a direct roster update at **08:00:01 AM** (one second after the morning cutoff).
- **Environment:** Normal school morning operations.
- **System Response:** `CutoffPolicyGuard` evaluates server time, intercepts the HTTP request before reaching the domain service, and returns `409 CONFLICT: CUTOFF_LOCKED` with an instruction payload guiding the user to the emergency form.
- **Testable Metric / Success Threshold:** Exactly **100% of direct write attempts** occurring $\ge 08:00:00$ are blocked. Zero unverified modifications alter the baseline kitchen portion calculation.

### Scenario QS-02: Tamper-Evident Emergency Change Auditability
- **Quality Property:** `#reliable` (Auditability, Non-Repudiation)
- **Priority:** High
- **Stimulus:** A teacher submits a post-cutoff emergency modification for an arriving student via `SCR-TCH-04`.
- **Environment:** Active kitchen cooking shift window (08:00 AM – 11:30 AM).
- **System Response:** System inserts an immutable record into `meal_demand_changes` with `PENDING` state, capturing teacher ID, timestamp, and explanation, while simultaneously alerting the Meal Manager via WebSocket.
- **Testable Metric / Success Threshold:** Exactly **100% of post-lock changes** are captured in the audit table with complete metadata (zero nulls for user, reason, or timestamp). Real-time alert delivered to the Manager dashboard in **$< 1.0\text{ second}$**.

### Scenario QS-03: High-Concurrency Morning Roll-Call Throughput
- **Quality Property:** `#efficient` (Response Time Under Concurrency)
- **Priority:** High (Priority 2)
- **Stimulus:** 50 homeroom teachers simultaneously submit classroom rosters between 07:50 AM and 08:00 AM.
- **Environment:** Peak campus LAN congestion.
- **System Response:** API processes payloads, performs relational updates, and responds with confirmed roster status.
- **Testable Metric / Success Threshold:** **$p95 \text{ latency} < 300\text{ms}$** and **$p99 \text{ latency} < 500\text{ms}$** across all submissions. Server CPU utilization remains **$< 40\%$** on standard 2 vCPU appliance.

### Scenario QS-04: Sub-Second Demand Aggregation Rollup
- **Quality Property:** `#efficient` (Real-Time Propagation)
- **Priority:** High
- **Stimulus:** 15 classrooms lock their rosters within the same 10-second interval.
- **Environment:** Active Manager Analytical Dashboard session.
- **System Response:** Backend aggregates the new numbers and broadcasts `CLASS_ROSTER_LOCKED` WebSocket events.
- **Testable Metric / Success Threshold:** The Manager's total school-wide headcount display increments and recalculates required dish weights in **$< 1.0\text{ second}$** without requiring manual page reload.

### Scenario QS-05: Uncompromising Allergen Visibility
- **Quality Property:** `#safe` (Medical Protection, Preventative UI)
- **Priority:** Critical (Priority 3)
- **Stimulus:** Teacher opens classroom roll-call, or kitchen staff views dish portioning instructions for a class containing a student with diagnosed severe peanut allergy.
- **Environment:** Routine daily check-in and serving line operations.
- **System Response:** UI component renders an un-dismissible high-contrast red badge (`ALLERGY_ALERT: PEANUT`) directly adjacent to the student's name and portion ration ticket.
- **Testable Metric / Success Threshold:** **100% display persistence**. The allergen warning cannot be hidden, minimized, or scrolled out of view during interaction.

### Scenario QS-06: HACCP Cooking Temperature Barrier
- **Quality Property:** `#safe` (Food Hygiene Compliance, Decision 1246/QĐ-BYT)
- **Priority:** Critical
- **Stimulus:** Chef completes cooking Batch #3 of poultry protein and taps "Mark Ready for Serving" on the Kitchen Kiosk.
- **Environment:** Active kitchen cooking shift.
- **System Response:** System prompts for probe temperature reading. If chef inputs $< 75.0^\circ\text{C}$, the system blocks state transition with `422 UNPROCESSABLE ENTITY: HACCP_TEMP_DEFICIT`.
- **Testable Metric / Success Threshold:** Exactly **0% of animal protein batches** can enter `READY_FOR_SERVING` status without a validated temperature reading of **$\ge 75.0^\circ\text{C}$** and scale photo attachment.

### Scenario QS-07: Classroom Roll-Call Ergonomics
- **Quality Property:** `#usable` (Operability, Time-to-Task)
- **Priority:** Medium (Priority 4)
- **Stimulus:** Homeroom teacher arrives in class and conducts attendance verification for 40 students on a 6.1" smartphone.
- **Environment:** Noisy classroom, teacher holding phone in one hand.
- **System Response:** Roster defaults to all students "Present"; teacher toggles only 2 absent students with single-tap cards and hits confirm.
- **Testable Metric / Success Threshold:** Total time from screen unlock to locked submission is **$< 90\text{ seconds}$** for a standard class of 40 students.

### Scenario QS-08: Kitchen Kiosk Glove-Friendly Interaction
- **Quality Property:** `#usable` (Touch Ergonomics in Harsh Environments)
- **Priority:** Medium
- **Stimulus:** Chef wearing wet, food-grade vinyl gloves transitions batch status and enters scale weight.
- **Environment:** Humid kitchen prep station, grease on screen.
- **System Response:** Large $\ge 48\text{px}$ touch targets, high-contrast visual styling, and virtual numeric keypad with oversized numeric keys.
- **Testable Metric / Success Threshold:** Complete batch status advancement and weight input is achievable in **$\le 2\text{ taps}$** per operational action, with zero mis-taps recorded during usability trials.
