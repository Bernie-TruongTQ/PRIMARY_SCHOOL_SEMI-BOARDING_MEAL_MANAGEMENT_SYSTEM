# C4 Level 2 — Container Diagram

## 1. Overview

The **Container Diagram** decomposes the Primary School Semi-Boarding Meal Management System into its high-level technical building blocks, deployment units, and communication boundaries.

### Architectural Drivers & Operational Flow

- **Role Portals in Web SPA**: Enforces the 4-Role RBAC Model with dedicated portal segments (`/coordinator`, `/accountant`, `/parent`, `/admin`) as specified in the [Information Architecture](file:///d:/WORKSPACE/Top-Down-Approach/docs/04-information-architecture/INFORMATION_ARCHITECTURE.md).
- **Backend API Service**: Executes core business rules across all 8 business domains, including the **08:30 AM** classroom attendance lock, **08:45 AM** catering vendor purchase order dispatch, **10:30 AM** 3-step receiving inspection, **11:00 AM** trolley distribution, and **13:00 PM** quantity reconciliation.
- **WebSocket Event Broker**: Provides real-time synchronization for live attendance tracking countdowns, emergency absence updates, and hot delivery status alerts.
- **PostgreSQL 15 Database**: Serves as the ACID-compliant primary datastore with immutable audit ledgers.
- **Compliance & Media Storage**: Retains 24-hour food inspection photographs, digital thermometer probe readings, and container seal verifications.

---

## 2. Container Diagram (C4Container)

![Container Diagram](images/ContainerView.png)

---

## 3. Container Technical Responsibilities & Architecture

### 3.1. Single-Page Application (SPA)

- **Technology Stack:** HTML5, Modern Vanilla JavaScript (ES6 Modules), CSS Custom Properties / Design Tokens (zero-dependency, lightweight, instant first contentful paint).
- **Autonomous Role Portals:**
  1. **Coordinator Portal (`/coordinator`)**:
     - *Attendance & Roster Lock (`/coordinator/attendance`)*: Student roster cards with tactile toggle pills (`Present` / `Absent`), orange allergy warning chips, and 08:30 AM cutoff countdown timer.
     - *Demand & Order Dispatch (`/coordinator/demand`)*: Attendance rollup cards, configurable safety buffer stepper ($0\%\text{--}10\%$), expected dish breakdown, and 08:45 AM order dispatch CTA.
     - *Receiving & Inspection (`/coordinator/receiving`)*: 3-step safety check sheet (core temperature probe $\ge 65^\circ\text{C}$, container seals, visual/sensory check).
     - *Classroom Distribution (`/coordinator/distribution`)*: Classroom trolley portion checklist for the 11:00 AM serving window.
     - *Post-Lunch Reconciliation (`/coordinator/reconciliation`)*: Three-way comparison grid (Ordered vs. Delivered vs. Consumed) and discrepancy reason logger.
  2. **Accountant Portal (`/accountant`)**:
     - *Fee Schedules (`/accountant/fee-rates`)*: Term-level meal unit rate configuration.
     - *Billing & Invoicing (`/accountant/billing`)*: Batch calculation wizard generating student invoices with automated excused absence credits.
     - *Payment Collections (`/accountant/payments`)*: Streamlined 3-state tracking (`unpaid`, `partial`, `paid`) with VietQR generation.
     - *Caterer Cost & Payables (`/accountant/vendor-payables`)*: Reconciled delivery quantity accruals and payment settlement.
  3. **Parent Portal (`/parent`)**:
     - Mobile-first responsive views: semester boarding registration, medical allergy declarations, daily published menu & food inspection badges, and electronic invoice payments.
  4. **Admin Portal (`/admin`)**:
     - Academic years, terms, classes, student profiles, meal eligibility rules, lunch serving/holiday calendars, 1-level weekly menu approvals, and staff account RBAC.

### 3.2. Backend API Service

- **Technology Stack:** Node.js / Express.js runtime (or NestJS architecture) with JSON Schema validation and TypeScript typing.
- **Architectural Responsibilities:**
  - **Fixed 4-Role RBAC Enforcement:** Strictly validates JWT identity and permissions (`ADM`, `ACC`, `MGR`, `PAR`).
  - **Temporal Cutoff Guard:** Hard-locks classroom attendance updates at 08:30 AM, blocking unapproved post-cutoff modifications.
  - **Demand Aggregation & Buffer Engine:** Mathematical evaluation:
    $$
    \text{Final Order Quantity} = \text{round}\Big(\sum \text{Present Students} \times (1 + \text{Buffer\%})\Big)
    $$
  - **External Catering Integration Adapter:** Formats structured electronic purchase orders transmitted to the catering partner by 08:45 AM.
  - **3-Step Receiving & Safety Validator:** Enforces validation: core probe temp must be $\ge 65^\circ\text{C}$ before hot meals can be accepted.
  - **Reconciliation & Discrepancy Engine:** Computes variance:
    $$
    \text{Variance} = \text{Accepted Delivered Quantity} - \text{Ordered Quantity}
    $$

    Feeds accepted counts directly into the Accountant payable ledger (`vendor_payables`).
  - **Immutable Audit Logging:** Captures all changes to attendance, demands, and bills with user ID, timestamps, previous state, and new state.

### 3.3. Real-time Event Broker (WebSocket Service)

- **Technology Stack:** WebSocket Server (Socket.io protocol over WSS).
- **Core Channels:**
  - `CLASS_ATTENDANCE_CONFIRMED`: Broadcasts classroom submission events to the Coordinator Attendance Monitor.
  - `CUTOFF_DEADLINE_APPROACHING`: Emits warning pulses at 10, 5, and 1 minute before 08:30 AM.
  - `CATERER_ORDER_ACKNOWLEDGED`: Signals vendor receipt of daily order.
  - `INSPECTION_PASSED`: Triggers immediate distribution clearance and publishes transparency badges to parents.

### 3.4. Relational Database (PostgreSQL 15)

- **Storage Model:** Third normal form (3NF) relational schema with check constraints, foreign keys, and composite indexes.
- **Key Tables:**
  - `meal_participations`, `meal_participation_changes`, `meal_demands`, `meal_demand_dish_quantities`
  - `catering_orders`, `meal_deliveries`, `meal_inspections`, `meal_distributions`, `meal_reconciliations`, `meal_discrepancies`
  - `meal_fee_configs`, `student_meal_bills`, `student_billing_items`, `meal_payments`, `catering_costs`, `vendor_payables`
  - `dishes`, `ingredients`, `menus`, `menu_dishes`, `meal_schedules`, `dietary_alerts`, `student_allergies`
  - `school_years`, `grades`, `classes`, `students`, `meal_calendars`, `holidays`, `users`, `roles`

### 3.5. Compliance & Document Storage

- S3-compatible cloud object store maintaining 24-hour food retention sample photographs, temperature digital probe readout snapshots, and PDF delivery receipts.
