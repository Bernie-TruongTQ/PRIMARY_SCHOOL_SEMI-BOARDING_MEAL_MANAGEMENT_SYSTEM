# Business Domains — Full Decomposition

## System

**Primary School Semi-Boarding Meal Management System**

A system that manages the full meal lifecycle for primary school semi-boarding programs: from student enrollment in the meal program through planning, kitchen execution, food safety inspection, fee management, and operational reporting.

---

## Domain 1 — Student Meal Management

Manages student eligibility, registration, and daily participation in the semi-boarding meal program.

| Sub-Domain / Capability | Functions (Level 3) |
|------------------------|---------------------|
| **Meal Eligibility** | Determine Student Eligibility, Enroll Student in Meal Program, Suspend/Cancel Enrollment |
| **Meal Registration** | Register Student for Meal Session, Manage Registration Period, Track Registration Status |
| **Meal Participation** | Record Daily Attendance, Record Absence with Reason, Record Extra Guest, Toggle Participation Within Cutoff |

---

## Domain 2 — Meal Planning & Menu Management

Manages the planning, design, and nutritional compliance of daily and weekly menus.

| Sub-Domain / Capability | Functions (Level 3) |
|------------------------|---------------------|
| **Menu Design** | Create Weekly Menu, Assign Dishes to Menu, Set Standard Portion Sizes |
| **Nutritional Compliance** | Check Nutritional Balance, Flag Allergen Conflicts, Approve Menu |
| **Demand Calculation** | Calculate Required Headcount, Scale Recipe by Headcount, Apply Safety Buffer |

---

## Domain 3 — Meal Operation

Manages the end-to-end daily execution of meal preparation, distribution, and handover.

| Sub-Domain / Capability | Functions (Level 3) |
|------------------------|---------------------|
| **Meal Demand Determination** | Open Demand Form, Lock Demand at Cutoff, Approve Post-Cutoff Change Requests |
| **Meal Preparation** | View Preparation Plan, Record Prepared Quantity, Confirm Preparation Complete |
| **Meal Distribution** | View Distribution Plan, Record Distributed Quantity per Class, Handle Distribution Exceptions |
| **Meal Handover** | Confirm Meal Handover to Class, Record Handover Quantity, Generate Handover Receipt |
| **Meal Reconciliation** | Compare Prepared vs. Distributed vs. Expected, Record Leftover Quantity, Flag Discrepancies |

---

## Domain 4 — Food Safety & Traceability

Manages incoming food batch inspection, supplier traceability, and food safety incident response.

| Sub-Domain / Capability | Functions (Level 3) |
|------------------------|---------------------|
| **Food Batch Management** | Register Food Batch, Record Receiving Inspection, Mark Batch as Pass/Fail |
| **Traceability** | Link Batch to Ingredient, Link Ingredient to Dish, Link Dish to Meal, Trace Affected Meals |
| **Incident Management** | Log Food Safety Incident, Identify Affected Students, Escalate Incident, Close Incident |

---

## Domain 5 — Food Supply & Inventory *(Supporting)*

Manages supplier relationships, purchase orders, and ingredient stock levels.

| Sub-Domain / Capability | Functions (Level 3) |
|------------------------|---------------------|
| **Supplier Management** | Register Supplier, Manage Supplier Contracts, Rate Supplier Performance |
| **Purchase Orders** | Generate Purchase Order from Demand, Approve Purchase Order, Track Delivery Status |
| **Inventory Control** | Update Stock on Delivery, Deduct Stock on Preparation, Alert on Low Stock |

---

## Domain 6 — Meal Fee & Cost Management *(Supporting)*

Manages meal fee collection from families and cost-per-meal tracking.

| Sub-Domain / Capability | Functions (Level 3) |
|------------------------|---------------------|
| **Fee Configuration** | Set Meal Fee per Session, Configure Deduction Rules for Absences |
| **Fee Collection** | Generate Monthly Invoice, Record Payment, Issue Receipts |
| **Cost Tracking** | Calculate Cost per Meal, Compare Budget vs. Actual, Report Cost Variance |

---

## Domain 7 — Reporting & Transparency *(Supporting)*

Provides operational dashboards and parent-facing transparency reports.

| Sub-Domain / Capability | Functions (Level 3) |
|------------------------|---------------------|
| **Operational Reporting** | Daily Meal Summary Report, Weekly Menu Compliance Report, Monthly Cost Report |
| **Parent Transparency** | View Child's Meal Participation, View Daily Menu, Receive Allergen Alerts |
| **Management Dashboard** | Real-Time Demand Overview, Preparation Status Board, Incident Alert Feed |
