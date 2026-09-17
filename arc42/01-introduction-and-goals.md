# 1. Introduction and Goals

## 1.1 Requirements Overview

The **Primary School Semi-Boarding Meal Management System** is a unified operational platform designed to automate, monitor, and govern the full daily meal supply chain in primary school semi-boarding programs (*Bán trú*). The system operates strictly under an **External Catering Vendor Operating Model** with a **Dedicated Lunch-Only Scope** on standard school days (Monday–Friday).

Instead of managing in-house kitchen cooking cauldrons or raw bulk ingredient stockpiles, the school operations team manages upstream demand aggregation, dynamic safety buffer calculations, electronic purchase order dispatching to licensed external caterers, dock receiving with 3-step food safety inspections, classroom meal trolley distribution, post-service quantity reconciliation, monthly student meal fee assessments, and parental transparency.

### Essential Features (Mapped Across Value Chain)

1. **Student Meal Eligibility & Registration Management (`F-PAR-01`, `F-PAR-02`):** Manages student boarding intake eligibility and semester-level meal program registrations, including dietary notes and medical allergy declarations.
2. **Daily Student Attendance & 08:30 AM Cutoff Lock (`F-PAR-03`, `F-PAR-04`):** Enables homeroom teachers and the Semi-Boarding Coordinator to log daily lunch attendance, monitor school-wide check-in progress, and enforce an immutable roster lock at exactly **08:30 AM**.
3. **Nutritional Dish Catalog & Weekly Menu Management (`F-PLN-01`, `F-PLN-02`, `F-PLN-03`):** Maintains the standardized dish catalog with allergen tags, allows coordinators to compose weekly lunch menus, supports 1-level administrative approval, and binds approved menus to academic calendars.
4. **Demand Aggregation & Buffer Calculation (`F-OPS-01`):** Aggregates locked attendance headcounts, separates standard portions from special dietary requirements, and applies a configurable safety buffer ($0\%\text{--}10\%$, default $3\%\text{--}5\%$) to calculate exact dish quantities.
5. **Catering Vendor Purchase Order Dispatch (`F-OPS-02`):** Formats and transmits legally binding daily lunch purchase orders to the contracted Catering Vendor before the strict **08:45 AM Order Deadline**.
6. **10:30 AM Receiving & 3-Step Food Safety Inspection (`F-OPS-03`):** Records dock delivery arrivals and enforces statutory 3-step inspections (*Kiểm thực 3 bước* per Decision 1246/QĐ-BYT), mandating core temperature checks ($\ge 65^\circ\text{C}$), thermal container seal verification, sensory checks, and 24-hour food retention sample logging (*Lưu mẫu 24 giờ*).
7. **11:00 AM Classroom Meal Trolley Distribution (`F-OPS-04`):** Directs the allocation and handover of inspected hot meal trays into designated classroom delivery trolleys based on verified attendance rosters.
8. **13:00 PM Post-Lunch Quantity Reconciliation & Payables Accrual (`F-OPS-05`):** Performs 3-way reconciliation (Ordered vs. Delivered vs. Consumed), requires mandatory discrepancy reason logging, and accrues verified vendor payables for the School Accountant.
9. **Meal Fee Rate Setup & Monthly Billing Assessment (`F-FEE-01`, `F-FEE-02`):** Allows accountants to define term meal unit rates, calculate monthly billable meals from attendance logs (automatically crediting valid excused absences), and generate itemized student billing statements.
10. **Payment Tracking & Caterer Cost Accounting (`F-FEE-03`, `F-FEE-04`):** Tracks parent fee collections across 3 streamlined states (`unpaid`, `partial`, `paid`) integrated with VietQR dynamic payment codes, while managing contractual vendor costs and payment vouchers.
11. **Parental Transparency & Operational Reporting (`F-REP-01`, `F-REP-02`, `F-REP-03`):** Publishes daily verified menus and food inspection badges to parents, produces daily operational logs, and exports financial debt aging reports.
12. **Medical Allergy Safeguards & Fixed 4-Role RBAC (`F-NUT-01`, `F-NUT-02`, `F-USR-01`, `F-USR-02`):** Scans student allergy records against daily menu ingredients to generate non-blocking, persistent visual warnings, all strictly governed by a fixed 4-role access model (`MGR`, `ACC`, `PAR`, `ADM`).

### Business Context

Primary school semi-boarding operations traditionally face persistent operational frictions: paper-based morning attendance rosters lead to headcount mismatches, causing lunch shortages or excessive food waste; manual phone orders to external catering kitchens lack auditability; food safety inspections upon dock delivery are frequently recorded retrospectively; and monthly fee calculations require days of manual cross-referencing between teacher attendance sheets and accounting ledgers.

The system addresses these challenges through a closed-loop digital workflow:
- **08:30 AM:** Morning attendance frozen across all classrooms.
- **08:45 AM:** Electronic catering purchase order dispatched with mathematical buffer protection.
- **10:30 AM:** Delivered hot meals pass digital 3-step inspection ($\ge 65^\circ\text{C}$) before entering school grounds.
- **11:00 AM:** Hot food distributed via classroom trolleys.
- **13:00 PM:** 3-way reconciliation finalized, immediately closing daily operations and updating accounting ledgers.

### References

- **Top-Down Requirements Documentation:** [docs/01-top-down/business-domains.md](../docs/01-top-down/business-domains.md)
- **Baseline MVP Scope Specifications:** [docs/01-top-down/MVP.md](../docs/01-top-down/MVP.md)
- **Core Features Breakdown:** [docs/02-core-features/core-feature-breakdown.md](../docs/02-core-features/core-feature-breakdown.md)
- **Actor Roles & Use Case Models:** [docs/03-roles-usecases/usecase-overview.md](../docs/03-roles-usecases/usecase-overview.md)
- **Information Architecture:** [docs/04-information-architecture/INFORMATION_ARCHITECTURE.md](../docs/04-information-architecture/INFORMATION_ARCHITECTURE.md)
- **C4 Architecture Models:** [c4/README.md](../c4/README.md)

---

## 1.2 Quality Goals

The architecture of the Primary School Semi-Boarding Meal Management System is governed by four prioritized quality goals under the **arc42 Q42 Quality Model** ([quality.arc42.org](https://quality.arc42.org)). All structural patterns, interfaces, and technological choices must directly support these targets.

> ⚠️ **Mandatory Review:** The following quality goals must be formally agreed upon and signed off by the primary stakeholders identified in Section 1.3 before major architectural implementations.

| Priority | Quality Goal | Concrete Scenario |
|:---:|:---|:---|
| **1** | **`#reliable`**<br>Data Integrity & Temporal Cutoff Guard | **Strict 08:30 AM Attendance Freeze & Auditable Ordering:**<br>At exactly **08:30:00 AM**, the system must automatically freeze classroom attendance rosters. Exactly 100% of direct write attempts to confirmed rosters post-cutoff are rejected by the server (`409 Conflict`). Any post-lock amendment must be submitted as an auditable change request (`F-PAR-03`) with teacher identity and reason, and 100% of purchase orders dispatched to the external caterer at 08:45 AM must be immutable and digitally traceable. |
| **2** | **`#efficient`**<br>Peak Check-in Throughput & Instant Demand Rollup | **Sub-Second Roster Submission & Real-time Aggregation:**<br>During the peak morning check-in window (08:00 AM – 08:30 AM), the system must support 50+ concurrent teacher mobile sessions submitting roster updates with **$p95 \text{ latency} < 300\text{ms}$**. The central Semi-Boarding Coordinator dashboard must update aggregate school-wide headcounts and dish portion calculations in **$< 1.0\text{ second}$** via WebSocket push without manual page refresh. |
| **3** | **`#safe`**<br>Statutory Food Safety & Persistent Allergy Warnings | **HACCP Delivery Verification & Zero-Failure Allergy Indicator Propagation:**<br>The system must strictly block receiving sign-off (`422 Unprocessable Entity`) if delivery core temperature is $< 65^\circ\text{C}$ or if 24-hour food retention sample data is missing, enforcing compliance with Vietnamese Decision 1246/QĐ-BYT. Furthermore, 100% of students declared with medical allergies must render persistent, non-dismissible visual warning badges across Coordinator attendance lists and classroom distribution sheets. |
| **4** | **`#usable`**<br>Role-Tailored Operational Ergonomics | **Fast Classroom Check-In & Touchscreen Dock Receiving:**<br>A homeroom teacher must be able to complete daily attendance verification for a class of 40 students in **$< 90\text{ seconds}$** using a mobile device with single-hand touch navigation. The Semi-Boarding Coordinator must be able to complete the 3-step receiving inspection checklist on a mobile tablet at the delivery dock in **$< 3\text{ minutes}$**. |

*See [Section 10: Quality Requirements](10-quality-requirements.md) for detailed quality trees, evaluation scenarios, and architectural trade-off analyses.*

---

## 1.3 Stakeholders

The table below details the 4 fixed institutional user roles and external partners, their architectural touchpoints, and their respective sign-off responsibilities:

| Role Code / Category | Primary Representatives | Architectural Expectations | Documentation Concerns | Quality Goal Sign-off Authority |
|:---|:---|:---|:---|:---:|
| **MGR**<br>*(Semi-Boarding Coordinator)* | Semi-Boarding Coordinator, School Nutritionist | Needs real-time visibility into school-wide attendance, automated buffer scaling, instant order transmission, and dock receiving inspection workflows. | Section 1.2 (`#reliable`, `#efficient`), Section 5 (Demand & Receiving Components), Section 6 (08:30 & 10:30 Scenarios) | **Sign-off (`#reliable`, `#efficient`)** |
| **ACC**<br>*(School Accountant)* | School Accountant, Financial Controller | Needs automated calculation of monthly billable meals from verified attendance (crediting valid absences), VietQR payment reconciliation, and vendor payable tracking. | Section 1.2 (`#reliable`), Section 3 (Payment Gateway), Section 5 (Fee & Cost Component) | **Sign-off (`#reliable`)** |
| **PAR**<br>*(Parent / Guardian)* | Student Parents, Guardians | Expects intuitive mobile registration, transparent daily menus and inspection badges, guaranteed allergy visibility, and convenient electronic invoice settlement. | Section 1.2 (`#safe`, `#usable`), Section 3 (Notification Gateway), Section 8 (Allergy Concepts) | Consulted |
| **ADM**<br>*(School Administrator)* | School Principal, Vice Principal of Operations | Needs overall regulatory compliance (Decision 1246/QĐ-BYT), complete auditability, academic structure governance, and 1-level menu review. | Section 1.2 (`#safe`), Section 2 (Constraints), Section 7 (Deployment) | **Final System Approval** |
| **Software Engineers & Architects** | Fullstack Developers, DevOps Leads | Needs unambiguous component boundaries, explicit interface contracts, relational schemas, and clear deployment specifications. | Section 4 (Solution Strategy), Section 5 (Building Blocks), Section 8 (Crosscutting Concepts) | Technical Sign-off |
| **External Catering Vendor** | Catering Production Lead, Delivery Logistics Dispatcher | Expects accurate, immutable purchase orders by 08:45 AM and standardized delivery acceptance receipts at 10:30 AM. | Section 3 (IF-02 Catering Gateway), Section 6 (Order Dispatch Flow) | Informed |
| **Food Safety & Health Authorities** | District Department of Health / Education Inspectors | Demands tamper-proof digital records of 3-step inspections, temperature logs ($\ge 65^\circ\text{C}$), and 24-hour food retention sample logs. | Section 1.2 (`#safe`), Section 2 (Regulatory Constraints), Section 8 (Audit Logging) | Regulatory Compliance |

---

### Formal Sign-off Summary for Section 1.2:
- **Operational & Demand Goals (`#reliable`, `#efficient`):** Confirmed by **Semi-Boarding Coordinator (`MGR`)**.
- **Financial Integrity & Fee Calculations (`#reliable`):** Confirmed by **School Accountant (`ACC`)**.
- **Food Safety & Usability Goals (`#safe`, `#usable`):** Confirmed by **Semi-Boarding Coordinator & School Administration (`ADM`)**.
- **Overall System Governance & Compliance:** Approved by **School Principal / Vice Principal of Operations (`ADM`)**.
