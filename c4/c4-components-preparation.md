# C4 Level 3 — Component Diagram: Domain 3B — Meal Receiving, Distribution & Reconciliation (Module 3)

## 1. Overview

This document specifies the internal software components within the **Backend API Service** container that implement the execution and settlement stages of **Domain 3: Meal Operation** — specifically **Module 3: Meal Receiving, Distribution & Reconciliation** (`F-OPS-03`, `F-OPS-04`, `F-OPS-05`).

### Operational Objectives & Lifecycle Checkpoints

- **10:30 AM — Receiving & 3-Step Quality Inspection (`F-OPS-03`)**: Validates delivered hot meal shipments from the external catering vendor, checking:
  1. Core temperature probe ($\ge 65^\circ\text{C}$).
  2. Thermal container tamper-evident seals and cleanliness.
  3. Visual sensory inspection (aroma, color, texture).
- **11:00 AM — Classroom Tray Distribution (`F-OPS-04`)**: Coordinates portion allocation across classroom meal trolleys according to confirmed attendance.
- **13:00 PM — Post-Lunch Quantity Reconciliation (`F-OPS-05`)**: Reconciles ordered portions versus delivered versus actual consumed portions, logs discrepancy reasons, and updates the School Accountant's vendor payable ledger.

---

## 2. Component Diagram (C4Component)

![Component Diagram — Module 3: Meal Receiving, Distribution & Reconciliation](images/Module3Components.png)

---

## 3. Component Details & Operational Responsibilities

### 3.1. Operations Controller

- **Endpoint Definitions:**
  - `POST /api/v1/operations/receiving/checkin`: Records delivery arrival timestamp, vehicle license plate, and container count (`F-OPS-03`).
  - `POST /api/v1/operations/receiving/inspect`: Records the 3-step inspection results (temperature readings, container seal integrity, sensory check, and sample photo) (`F-OPS-03`).
  - `GET /api/v1/operations/distribution/plan`: Returns classroom trolley portion allocation list for 11:00 AM distribution (`F-OPS-04`).
  - `POST /api/v1/operations/distribution/confirm`: Confirms trolley dispatch to designated classrooms (`F-OPS-04`).
  - `POST /api/v1/operations/reconciliation/calculate`: Runs the 13:00 PM reconciliation calculation (`F-OPS-05`).
  - `POST /api/v1/operations/reconciliation/resolve`: Saves discrepancy reasons and finalizes accepted vendor billing quantities (`F-OPS-05`).

### 3.2. Quality & Safety Inspection Validator

- **3-Step Inspection Protocol (at 10:30 AM):**
  1. **Core Temperature Probe**: Measures core temperature across thermal food containers.
     $$
     \text{Condition: } T_{\text{core}} \ge 65^\circ\text{C}
     $$

     If $T_{\text{core}} < 65^\circ\text{C}$, the batch is flagged as high-risk, requiring secondary validation or vendor rejection.
  2. **Container Seal & Cleanliness Check**: Verifies tamper-evident seals on insulated delivery bins.
  3. **Visual & Sensory Evaluation**: Evaluates visual presentation, aroma, and texture.
- Captures and uploads compliance artifacts: digital thermometer probe readout photo and mandatory 24-hour food retention sample photos.

### 3.3. Classroom Distribution Coordinator

- Executes at **11:00 AM**:
  - Pulls verified morning attendance counts per classroom.
  - Generates trolley packing lists (e.g., Class 1A: 30 regular meal sets + 1 peanut-free tray).
  - Tracks trolley dispatch timestamps and serving confirmations across all classrooms.

### 3.4. Meal Reconciliation Engine

- Executes at **13:00 PM** post-lunch:
  - Performs 3-way reconciliation:

    $$
    \text{Delivery Variance} = \text{Delivered Quantity} - \text{Ordered Quantity}
    $$

    $$
    \text{Consumption Variance} = \text{Consumed Trays} - \text{Delivered Quantity}
    $$
  - Identifies anomalies:

    - *Vendor Shortfall:* Caterer delivered fewer portions than ordered.
    - *Excess Leftover:* Significantly more unconsumed food than expected buffer.

### 3.5. Discrepancy Resolution Manager

- **Discrepancy Handling Rules:**
  - If $\text{Delivery Variance} \neq 0$, the system enforces a mandatory `discrepancy_reason` (e.g., `Vendor Shortfall: 10 meals missing`, `Spillage during transit`).
  - Automatically calculates the **Final Billable / Payable Quantity**:
    $$
    \text{Payable Quantity} = \min(\text{Ordered Quantity}, \text{Accepted Delivered Quantity})
    $$
  - Propagates reconciled payable records directly to the School Accountant's ledger (`catering_costs`, `vendor_payables`), preventing the school from being billed for unserved food.

### 3.6. Operations Repository

- Wraps reconciliation and payable updates inside database transactions.
- Enforces relational linkages connecting `catering_orders`, `meal_deliveries`, `meal_inspections`, `meal_distributions`, and `meal_reconciliations`.
