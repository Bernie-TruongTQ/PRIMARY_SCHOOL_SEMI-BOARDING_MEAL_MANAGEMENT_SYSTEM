# Minimum Viable Product (MVP) Scope Baseline

> **Primary School Semi-Boarding Meal Management System**  
> *(Scope Bounding: Dedicated **Lunch-Only** Operational Service, Monday to Friday, under an **External Catering Vendor Operating Model**).*

This document defines the complete **MVP (Minimum Viable Product)** scope baseline for the system (combining core `[MVP]` capabilities and streamlined `[MVP-Streamlined]` capabilities). All deferred Phase 2 and discarded out-of-scope features have been excised, creating an actionable baseline ready for sprint backlog breakdown.

---

## 1. Student Meal Management

- **Student Meal Eligibility Management**
  - Define Meal Eligibility Criteria
  - Determine Student Meal Eligibility
- **Meal Registration Management**
  - Register for Meals
  - Modify Meal Registration
  - Cancel Meal Registration
  - Record Dietary Note at Registration
- **Meal Attendance Management**
  - Record Meal Attendance *(daily morning classroom roll call)*
  - Monitor Meal Attendance `[Streamlined: real-time grade/classroom lock progress tracking]`

---

## 2. Meal Planning & Menu Management

- **Dish Management**
  - Define Dish
  - Manage Dish Information *(nutritional specifications, portion metrics, and allergen indicators)*
- **Menu Management**
  - Create Menu
  - Assign Dishes to Menu
  - Approve Menu `[Streamlined: single-level administrative approval by School Principal / System Admin]`
- **Meal Schedule Management**
  - Define Meal Schedule
  - Assign Menu to Schedule

---

## 3. Meal Operation

- **Meal Demand & Quantity Management**
  - Determine Meal Demand *(post-cutoff headcount rollup)*
  - Calculate Expected Meal Quantity `[with configurable dynamic safety buffer: 0% to 10%]`
  - Send Meal Order to Catering Vendor `[statutory cutoff deadline: 08:45 AM electronic purchase order dispatch]`
- **Meal Receiving from Vendor**
  - Record Delivered Quantity from Vendor `[delivery dock arrival: 10:30 AM]`
  - Inspect Delivered Meal Quality `[statutory 3-step food safety inspection under MOH Decision 1246/QĐ-BYT: core temperature T ≥ 65.0°C, intact tamper-evident container seals, sensory evaluation, and mandatory 24-hour food retention sample photos]`
  - Confirm Received Quantity
- **Meal Distribution**
  - Record Distributed Quantity `[trolley allocation to homeroom teachers at 11:00 AM]`
- **Meal Reconciliation `[Streamlined]`**
  - Reconcile Ordered vs. Delivered vs. Consumed Quantity `[post-lunch 3-way reconciliation at 13:00 PM]`
  - Resolve Quantity Discrepancies `[Streamlined: mandatory justification logs for shortages/damages/rejects]`

---

## 4. Meal Fee & Cost Management

- **Meal Fee Configuration**
  - Define Meal Fee *(term student meal rate and caterer contracted unit cost)*
  - Set Effective Period
- **Meal Fee Assessment**
  - Determine Chargeable Meals *(automated attendance calculation with excused absence credits)*
  - Calculate Meal Fees *(monthly billing rollups)*
- **Meal Payment Management `[Streamlined]`**
  - Record Meal Payment
  - Track Payment Status `[Streamlined: 3 distinct lifecycle states: UNPAID, PAID, OVERDUE; dynamic VietQR code support]`
- **Meal Cost Management `[Streamlined]`**
  - Record Meal Costs
  - Calculate Meal Cost `[Streamlined: monthly accounts payable liability accrual owed to external catering vendor based on verified reconciliation]`

---

## 5. Reporting & Transparency `[Streamlined]`

- **Operational Reporting `[Streamlined]`**
  - Generate Daily Meal Operation Report
  - Generate Reconciliation Report `[Streamlined: vendor delivery reconciliation audit trail]`
- **Cost & Fee Reporting `[Streamlined]`**
  - Generate Fee Report *(student fee billing ledger)*
  - Generate Payment Report *(collection velocity and outstanding receivables)*
  - Generate Cost Report `[Streamlined: caterer liabilities and accounts payable summaries]`
- **Transparency Information Management `[Streamlined]`**
  - Prepare Transparency Information
  - Publish Transparency Information `[Streamlined: daily public/parent feed showing approved lunch menus, delivery inspection badges, and food sample photos]`

---

## 6. User & Access Management `[Streamlined]`

- **User Account Management**
  - Register User Account
  - Update User Information
- **Role & Permission Management `[Streamlined]`**
  - Define Role *(Fixed 4-Role RBAC Model)*:
    1. **`ADM`**: System Administrator / School Principal
    2. **`MGR`**: Semi-Boarding Coordinator / Meal Operations Manager
    3. **`ACC`**: School Accountant
    4. **`PAR`**: Student Parent / Legal Guardian
  - Assign Permission to Role `[Streamlined: immutable role-permission bindings; no custom ad-hoc permission sets]`
  - Assign Role to User

---

## 7. Nutrition & Health Management `[Streamlined]`

- **Allergy & Dietary Restriction Management**
  - Record Student Allergy/Dietary Restriction *(medical declarations)*
  - Flag Restricted Ingredients in Menu
  - Alert on Menu-Restriction Conflict `[Streamlined: non-blocking, high-visibility visual warning badges on teacher attendance rosters and manager dashboards]`

---

## 8. Master Data & System Configuration

- **Academic Structure Management**
  - Manage School Year/Semester
  - Manage Class & Grade Information
  - Manage Student Profile
- **System Configuration Management**
  - Configure Lunch Serving Day *(standard Monday–Friday academic days)*
  - Configure Holiday/Non-Meal Day Calendar
