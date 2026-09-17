# 10. Quality Requirements

## Overview

This section elaborates the four prioritized quality goals defined in [Section 1.2](01-introduction-and-goals.md#12-quality-goals) into concrete, testable quality scenarios grounded in the **Q42 Quality Model** ([quality.arc42.org](https://quality.arc42.org)). Each scenario specifies a stimulus, environment condition, system response, and a strict numerical threshold defining architectural success under the External Catering Vendor Operating Model.

---

## 10.1 Quality Requirements Overview

The quality requirements cover four primary Q42 quality properties that directly shape the system's architecture, security boundaries, and user interface ergonomics:

| Q42 Property | Scenarios | Primary Architectural Counterpart |
|:---|:---:|:---|
| **`#reliable`** *(Data Consistency, Fault Tolerance)* | **QS-01, QS-02** | `AttendanceCutoffGuard` middleware, ACID PostgreSQL transactions, append-only change ledgers. |
| **`#efficient`** *(Response Time, Concurrency)* | **QS-03, QS-04** | Non-blocking Node.js event loop, composite B-tree indexing, Socket.io real-time pub/sub. |
| **`#safe`** *(Food Hygiene, Allergen Protection)* | **QS-05, QS-06** | Persistent allergen UI decorators, statutory 3-step inspection ($\ge 65^\circ\text{C}$ gate). |
| **`#usable`** *(Ergonomics, Task Speed)* | **QS-07, QS-08** | Mobile-first 390px card viewports, streamlined dock inspection checklists. |

---

## 10.2 Concrete Quality Scenarios

### Scenario QS-01: Strict Cutoff Lockdown & Write Rejection
- **Quality Property:** `#reliable` (Integrity, Temporal Boundary Guard)
- **Priority:** Critical (Priority 1)
- **Stimulus:** A homeroom teacher attempts to submit a direct roster update at **08:30:01 AM** (one second after the morning cutoff).
- **Environment:** Normal school morning operations.
- **System Response:** `AttendanceCutoffGuard` evaluates server time, intercepts the HTTP request before reaching the domain service, and returns `409 CONFLICT: CUTOFF_LOCKED` with an instruction payload guiding the user to the amendment workflow.
- **Testable Metric / Success Threshold:** Exactly **100% of direct write attempts** occurring $\ge 08:30:00$ are blocked. Zero unverified modifications alter the baseline catering order calculation.

### Scenario QS-02: Tamper-Evident Post-Cutoff Attendance Auditability
- **Quality Property:** `#reliable` (Auditability, Non-Repudiation)
- **Priority:** High
- **Stimulus:** An authorized teacher logs an excused absence adjustment post-cutoff.
- **Environment:** Active morning operational shift window (08:30 AM – 11:30 AM).
- **System Response:** System inserts an immutable record into `meal_participation_changes`, capturing user ID, previous status, new status, timestamp, and explanation reason, while updating the Accountant's billable meal credit ledger.
- **Testable Metric / Success Threshold:** Exactly **100% of post-lock modifications** are captured in the audit table with complete metadata (zero nulls for user, reason, or timestamp). Real-time alert delivered to the Coordinator dashboard in **$< 1.0\text{ second}$**.

### Scenario QS-03: High-Concurrency Morning Roll-Call Throughput
- **Quality Property:** `#efficient` (Response Time Under Concurrency)
- **Priority:** High (Priority 2)
- **Stimulus:** 50 homeroom teachers simultaneously submit classroom rosters between 08:15 AM and 08:30 AM.
- **Environment:** Peak campus LAN congestion.
- **System Response:** API processes payloads, performs relational updates, and responds with confirmed roster status.
- **Testable Metric / Success Threshold:** **$p95 \text{ latency} < 300\text{ms}$** and **$p99 \text{ latency} < 500\text{ms}$** across all submissions. Server CPU utilization remains **$< 40\%$** on standard 2 vCPU appliance.

### Scenario QS-04: Sub-Second Demand Aggregation Rollup
- **Quality Property:** `#efficient` (Real-Time Propagation)
- **Priority:** High
- **Stimulus:** 15 classrooms lock their rosters within the same 10-second interval prior to 08:30 AM.
- **Environment:** Active Coordinator Analytical Dashboard session.
- **System Response:** Backend aggregates the new numbers and broadcasts `CLASS_ATTENDANCE_LOCKED` WebSocket events.
- **Testable Metric / Success Threshold:** The Coordinator's total school-wide headcount display increments and recalculates required lunch portion counts in **$< 1.0\text{ second}$** without requiring manual page reload.

### Scenario QS-05: Uncompromising Allergen Visibility
- **Quality Property:** `#safe` (Medical Protection, Preventative UI)
- **Priority:** Critical (Priority 3)
- **Stimulus:** Teacher opens classroom roll-call, or coordinator views trolley distribution instructions for a class containing a student with diagnosed severe peanut allergy.
- **Environment:** Routine daily check-in and classroom serving operations.
- **System Response:** UI component renders an un-dismissible high-contrast amber/red badge (`ALLERGY_ALERT: PEANUT`) directly adjacent to the student's name on attendance and trolley sheets.
- **Testable Metric / Success Threshold:** **100% display persistence**. The allergen warning cannot be hidden, minimized, or scrolled out of view during interaction.

### Scenario QS-06: 10:30 AM Statutory Food Safety Inspection Barrier
- **Quality Property:** `#safe` (Food Hygiene Compliance, Decision 1246/QĐ-BYT)
- **Priority:** Critical
- **Stimulus:** Coordinator inspects hot delivery containers from the catering vendor and enters thermometer readings on the receiving sheet.
- **Environment:** Delivery dock receiving window at 10:30 AM.
- **System Response:** System prompts for probe temperature reading. If temperature is $< 65.0^\circ\text{C}$ or if 24-hour food retention sample photo is missing, the system blocks delivery acceptance with `422 UNPROCESSABLE ENTITY: HACCP_TEMP_DEFICIT`.
- **Testable Metric / Success Threshold:** Exactly **0% of catering deliveries** can enter `ACCEPTED` status without a validated temperature reading of **$\ge 65.0^\circ\text{C}$** and retention sample photo attachment.

### Scenario QS-07: Classroom Roll-Call Ergonomics
- **Quality Property:** `#usable` (Operability, Time-to-Task)
- **Priority:** Medium (Priority 4)
- **Stimulus:** Homeroom teacher arrives in class and conducts attendance verification for 40 students on a 6.1" smartphone.
- **Environment:** Noisy classroom, teacher holding phone in one hand.
- **System Response:** Roster defaults to all students "Present"; teacher toggles only absent students with single-tap cards and hits confirm.
- **Testable Metric / Success Threshold:** Total time from screen unlock to locked submission is **$< 90\text{ seconds}$** for a standard class of 40 students.

### Scenario QS-08: Dock Receiving Inspection Ergonomics
- **Quality Property:** `#usable` (Touch Ergonomics at Delivery Dock)
- **Priority:** Medium
- **Stimulus:** Semi-Boarding Coordinator conducts 3-step receiving inspection at the school delivery dock using a mobile tablet.
- **Environment:** Outdoor covered loading dock, standing position.
- **System Response:** Streamlined checklist cards, camera integration for quick photo uploads, and large numeric pads for temperature input.
- **Testable Metric / Success Threshold:** Complete receiving check-in, 3-step inspection logging, and sample jar photo upload is achievable in **$< 3\text{ minutes}$** total elapsed time.
