# 1. Introduction and Goals

## 1.1 Requirements Overview

The **Primary School Semi-Boarding Meal Management System** is a unified operational platform designed to automate and govern the full daily meal supply chain in primary school semi-boarding programs — spanning morning student roll-call, dynamic recipe scaling, emergency cutoff triage, kitchen cooking batch execution, and yield reconciliation.

### Essential Features

1. **Daily Student Meal Attendance & Roll-Call (`F-PAR-01`):** Enables homeroom teachers to rapidly record student meal participation and dietary exceptions on classroom tablets or smartphones.
2. **Attendance Modification with Audit Trail (`F-PAR-02`):** Captures individual student status alterations (absent, late arrival, extra meal) with mandatory reasons and timestamps prior to the morning deadline.
3. **Class Roster Lock & Morning Cutoff Enforcement (`F-PAR-03`):** Automatically freezes classroom meal rosters at the strict **08:00 AM cutoff** to establish an immutable baseline for daily procurement and cooking.
4. **Aggregated Demand Headcount Calculation (`F-DMD-01`):** Dynamically consolidates confirmed classroom headcounts, segregates standard rations from special dietary needs, and rolls them up across grade levels.
5. **Dynamic Recipe Weight & Safety Buffer Scaling (`F-DMD-02`):** Translates net meal counts into precise raw ingredient weights based on standardized nutritional recipes with configurable safety buffer margins (3%–5%).
6. **Post-Cutoff Emergency Request Workflow (`F-DMD-03`):** Provides a formal triage, approval, and audit trail mechanism for meal managers to accept late arrivals or sudden absences without disrupting active kitchen shifts.
7. **Kitchen Shift & Dish Target Scheduling (`F-PRP-01`):** Decomposes daily meal demands into synchronized cooking schedules across specialized kitchen stations (Rice, Soup, Main Dish, Stir-Fry).
8. **Pantry Ingredient Allocation Requisition (`F-PRP-02`):** Generates digital storekeeper requisition slips mapped directly to recipe requirements to prevent ingredient stockouts.
9. **Cooking Batch Execution & Temperature Verification (`F-PRP-03`):** Tracks batch start/finish milestones and mandates internal core temperature logging (≥ 75°C) to ensure strict compliance with food safety regulations.
10. **Prepared Yield Verification & Discrepancy Reconciliation (`F-PRP-04`):** Compares gross finished cooking weights against planned recipe targets, logging root causes for any yield variances exceeding ±3%.

### Business Context

Primary school semi-boarding operations traditionally suffer from significant operational inefficiencies: manual paper attendance rosters lead to frequent headcount mismatches, leading to daily food waste or food shortages. The absence of dynamic scaling mechanisms means kitchen staff either guess ingredient quantities or prepare excessive safety buffers, inflating operational costs. Furthermore, sudden late arrivals after 08:00 AM create chaos without a structured approval mechanism, and dietary allergen information recorded in administrative student files often fails to reach kitchen serving lines in time.

The system resolves these challenges by introducing a top-down, real-time feedback loop. Homeroom teachers confirm attendance in under 90 seconds; the demand engine instantly calculates exact raw ingredient weights with governed buffer margins; and kitchen staff follow digitized batch plans on industrial touchscreen kiosks with integrated temperature verification. This guarantees nutritional compliance, minimizes meal expenditure opacity, and safeguards student health.

### References

- **Top-Down Requirements Documentation:** [docs/01-top-down/business-domains.md](../docs/01-top-down/business-domains.md)
- **Core MVP Feature Specifications:** [docs/02-core-features/core-feature-breakdown.md](../docs/02-core-features/core-feature-breakdown.md)
- **Actor Roles & Use Case Models:** [docs/03-roles-usecases/usecase-overview.md](../docs/03-roles-usecases/usecase-overview.md)
- **C4 Architecture Models:** [c4/README.md](../c4/README.md)
- **End-to-End Traceability Matrix:** [docs/traceability.md](../docs/traceability.md)

---

## 1.2 Quality Goals

The architecture of the Primary School Semi-Boarding Meal Management System is governed by four core quality goals under the **arc42 Q42 Quality Model**. All technical and structural decisions documented in subsequent sections must directly support these targets.

> ⚠️ **Mandatory Review:** The following quality goals must be formally agreed upon and signed off by the primary stakeholders identified in Section 1.3 before major architectural implementations.

| Priority | Quality Goal | Concrete Scenario |
|:---:|:---|:---|
| **1** | **`#reliable`**<br>Data Consistency & Cutoff Lockdown | **Strict Morning Cutoff Lock & 100% Auditable Amendments:**<br>At exactly **08:00:00 AM**, the system must automatically lock the daily meal participation rosters across all classrooms. Zero direct modifications to classroom counts are permitted post-lock. Exactly 100% of subsequent attendance adjustments must be submitted via the Emergency Change workflow (`F-DMD-03`), logged with teacher identity and reason, and require explicit Meal Manager approval before modifying kitchen demand calculations. |
| **2** | **`#efficient`**<br>Morning Roll-Call Throughput & Instant Demand Rollup | **High-Concurrency Roll-Call with Sub-Second Aggregation:**<br>During the peak morning check-in window (07:45 AM – 08:00 AM), the system must support 50+ concurrent teacher mobile sessions submitting roster updates with **$p95 \text{ latency} < 300\text{ms}$**. The central Meal Demand dashboard must reflect updated school-wide headcounts and dish quantity recalculations in **$< 1.0\text{ second}$** across all connected management sessions. |
| **3** | **`#safe`**<br>Dietary Allergen Visibility & Food Safety Compliance | **Zero-Failure Allergen Alert Propagation & Mandatory HACCP Logging:**<br>100% of students flagged with severe medical allergies in the School Information System (SIS) must persistently render prominent visual alert indicators on teacher roll-call screens and kitchen portioning displays. For 100% of cooking batches, the system must enforce core cooking temperature capture (mandating $\ge 75^\circ\text{C}$ for cooked proteins) before permitting the chef to mark the batch as "Ready for Serving". |
| **4** | **`#usable`**<br>Role-Tailored Operational Ergonomics | **Fast Classroom Check-In & Touchscreen Kitchen Interaction:**<br>A homeroom teacher must be able to complete daily attendance and meal status verification for a class of 40 students in **$< 90\text{ seconds}$** using a mobile device with single-hand touch navigation. Kitchen staff wearing food-grade gloves must be able to transition batch statuses and log weights on wall-mounted touchscreen kiosks in **$\le 2\text{ taps}$** per action. |

*See [Section 10: Quality Requirements](10-quality-requirements.md) for detailed quality trees, evaluation scenarios, and architectural trade-off analyses.*

---

## 1.3 Stakeholders

The table below details the key stakeholder roles, their touchpoints with the architecture documentation, and their respective approval responsibilities:

| Role / Category | Primary Representatives | Architectural Expectations | Documentation Concerns | Quality Goal Sign-off Authority |
|:---|:---|:---|:---|:---:|
| **Homeroom Teachers (`TCH`)**<br>*(End User / Frontline)* | Primary Class Teachers, Grade Level Leads | Needs intuitive, responsive mobile UI; expects attendance data to be saved reliably without loss during poor Wi-Fi coverage. | Section 1.2 (`#usable`), Section 6 (Runtime roll-call flow) | Consulted |
| **Meal / Nutrition Manager (`MGR`)**<br>*(Operational Owner)* | School Nutritionist, Catering Operations Manager | Needs real-time visibility into school-wide meal numbers, accurate recipe scaling formulas, and governed emergency change approval. | Section 1.2 (`#reliable`, `#efficient`), Section 5 (Demand component) | **Sign-off (`#reliable`, `#efficient`)** |
| **Kitchen Staff / Head Chef (`KIT`)**<br>*(Execution / Safety)* | Head Chef, Shift Leads, Kitchen Operators | Needs high-contrast, large-touch interfaces for greasy/wet environments; requires clear batch progression and ingredient allocations. | Section 1.2 (`#usable`, `#safe`), Section 5 (Prep component) | **Sign-off (`#safe`, `#usable`)** |
| **School Administrator / Board (`ADM`)**<br>*(Governance / Executive)* | Vice Principal of Operations, Chief Accountant | Needs end-to-end auditability, regulatory food safety compliance, transparent meal expenditure records, and minimal system downtime. | Section 1.2 (`#reliable`), Section 2 (Constraints), Section 7 (Deployment) | **Final System Approval** |
| **Software Engineers & Architects**<br>*(Implementation / Tech)* | Fullstack Developers, Backend Leads, DevOps Engineers | Needs unambiguous component boundaries, explicit interface contracts, relational schemas, and clear deployment specifications. | Section 4 (Solution Strategy), Section 5 (Building Blocks), Section 8 (Concepts) | Technical Sign-off |
| **Parents & PTA Representatives**<br>*(External Stakeholder)* | School Parent Committee | Expects guaranteed allergen safety for children, prompt absence meal charge deductions, and meal quality transparency. | Section 1.2 (`#safe`), Section 3 (External Interfaces) | Informed |
| **Food Safety & Health Authorities**<br>*(Regulatory / Audit)* | Local Department of Health / Education Inspectors | Demands immutable cooking temperature logs, ingredient batch origin traceability, and standardized hygiene workflows. | Section 1.2 (`#safe`), Section 8 (Audit Logging Concept) | Regulatory Compliance |

---

### Formal Sign-off Summary for Section 1.2:
- **Operational & Demand Goals (`#reliable`, `#efficient`):** Confirmed by **Meal / Nutrition Manager**.
- **Food Safety & Usability Goals (`#safe`, `#usable`):** Confirmed by **Head Chef & School Nutritionist**.
- **Overall System & Governance Goals:** Approved by **Vice Principal of Operations**.
