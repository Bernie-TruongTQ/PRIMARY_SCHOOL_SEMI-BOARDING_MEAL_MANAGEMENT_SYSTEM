# C4 Level 3 — Component Diagram: Reporting & Transparency (Domain 5)

## 1. Overview

This document specifies the internal software components within the **Backend API Service** container that implement **Domain 5: Reporting & Transparency** (`F-REP`).

### Operational Objectives
- Aggregate daily meal operational event streams to produce daily operation summaries and caterer reconciliation statements (`F-REP-01`).
- Provide financial intelligence dashboards for the School Accountant: fee collection velocity, student debt aging, and vendor payable accruals (`F-REP-02`).
- Power the Parent Transparency Portal: publishing daily approved menus, dish nutritional breakdowns, and verified food safety inspection badges (`F-REP-03`).

---

## 2. Component Diagram (C4Component)

```mermaid
C4Component
  title Component Diagram — Domain 5: Reporting & Transparency

  Container(spa, "Single-Page Application", "HTML5/ES6/CSS", "Provides Coordinator Reports (/coordinator/reports), Accountant Reports (/accountant/reports), and Parent Transparency Portal (/parent/menu-transparency)")
  ContainerDb(db, "Relational Database", "PostgreSQL 15", "Primary transactional tables and reporting materialized views")
  ContainerDb(storage, "Compliance Storage", "S3 Storage", "Fetches verified temperature probe readout photos and 24-hour retention sample photos")

  Container_Boundary(api, "Backend API Service — Domain 5") {
    Component(reportCtrl, "Reporting & Transparency Controller", "Express.js Router", "Exposes REST endpoints for operational summaries, financial audits, and public parent transparency feeds")
    Component(opsReportService, "Daily Operational Reporting Service", "Reporting Service", "Aggregates attendance counts, ordered counts, delivered counts, and discrepancy metrics into daily operations reports")
    Component(financeReportService, "Financial & Debt Reporting Service", "Reporting Service", "Computes collection percentages, uncollected student balances, debt aging tiers, and caterer liabilities")
    Component(transparencyService, "Parent Transparency Publisher", "Domain Service", "Prepares published daily meal profiles: menu dishes, nutritional summaries, inspection timestamps, and food safety pass badges")
    Component(reportingRepo, "Reporting Repository", "Data Access", "Executes optimized aggregation queries and reads reporting materialized views")
  }

  Rel(spa, reportCtrl, "Requests operational summaries, financial metrics, and published transparency feeds", "JSON / HTTPS")
  Rel(reportCtrl, opsReportService, "Compiles daily operations reports")
  Rel(reportCtrl, financeReportService, "Compiles fee collection and debt reports")
  Rel(reportCtrl, transparencyService, "Fetches parent transparency views")
  Rel(reportCtrl, reportingRepo, "Executes read-optimized reporting queries")

  Rel(transparencyService, storage, "Links verified inspection photo URLs for parent display", "S3 API")
  Rel(reportingRepo, db, "Reads attendance, demand, deliveries, reconciliations, bills, and payments", "SQL")
```

---

## 3. Component Details & Operational Responsibilities

### 3.1. Reporting & Transparency Controller
- **Endpoint Definitions:**
  - `GET /api/v1/reports/operations/daily?date=:date`: Compiles the comprehensive daily operational report (`F-REP-01`).
  - `GET /api/v1/reports/operations/vendor-reconciliation?month=:month`: Generates vendor reconciliation statement (`F-REP-01`).
  - `GET /api/v1/reports/finance/fee-collections?term=:termId`: Returns collection rates, unpaid balances, and debt aging (`F-REP-02`).
  - `GET /api/v1/reports/finance/caterer-payables?month=:month`: Itemizes reconciled caterer payables by delivery day (`F-REP-02`).
  - `GET /api/v1/transparency/menu-daily?date=:date`: Public / Parent transparency feed for today's lunch (`F-REP-03`).

### 3.2. Daily Operational Reporting Service
- Aggregates operational checkpoints:
  - Total student enrollment vs. confirmed lunch attendees.
  - Ordered portion count vs. accepted delivered portion count.
  - Inspection checkpoint timestamps (e.g., 10:25 AM arrival, 72°C core temp, Pass).
  - Classroom distribution completion metrics (e.g., 20/20 classrooms delivered by 11:15 AM).
  - Quantity discrepancy summary and documented justifications.

### 3.3. Financial & Debt Reporting Service
- Computes analytical metrics:
  - **Collection Velocity:** Total assessed meal fees vs. collected revenue ($92\%$ collected by Day 15).
  - **Student Debt Aging:** Tiered categorization of overdue balances ($0\text{--}30\text{ days}$, $31\text{--}60\text{ days}$, $>60\text{ days}$).
  - **Vendor Payable Summary:** Exact monthly invoice baseline matched against signed delivery sheets.

### 3.4. Parent Transparency Publisher
- Exposes food safety and nutrition data to build parental trust:
  - Scheduled dish names, descriptions, and allergen warnings.
  - Verified food receiving timestamp and temperature pass badge ($\ge 65^\circ\text{C}$).
  - Food retention sample verification photo.
