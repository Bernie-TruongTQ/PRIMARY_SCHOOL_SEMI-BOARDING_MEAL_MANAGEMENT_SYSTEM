# Primary School Semi-Boarding Meal Management System

> A comprehensive web-based operations platform designed to manage the full meal lifecycle for primary school semi-boarding programs — from student attendance and dynamic demand forecasting through kitchen preparation, food safety compliance, and cost transparency.

---

## Problem Statement

Primary schools operating semi-boarding programs face recurring operational friction across the meal supply and preparation value chain:

- **Attendance Discrepancy:** Manual paper rosters lead to persistent meal over/under-production daily.
- **Food Over/Under-Production:** Absence of dynamic scaling from confirmed student headcounts to raw ingredient purchase and preparation quantities.
- **Emergency Disruption:** Late arrivals, sudden absences, and dietary changes occurring after the morning cutoff lack an auditable, real-time approval workflow.
- **Traceability Gaps:** Raw ingredient batches, pantry inventory, and distributed meal trays are disconnected, making food safety investigations slow and unreliable.
- **Cost Opacity:** Expense reconciliation and per-meal cost calculations are performed across disconnected spreadsheets, detached from actual kitchen yields.

---

## Project Methodology

This repository adheres to a **strict top-down decomposition methodology**, guaranteeing that every engineering artifact is directly traceable to its upstream operational requirement:

```
Top-Down Mind Map (System Scope & Strategic Intent)
       ↓
Core vs. Supporting Domain Classification
       ↓
Selected Core Operational Features
       ↓
Actor Roles & Use Cases
       ↓
Information Architecture & Screen Inventory
       ↓
Task Flows & Wireframes
       ↓
Relational Database Architecture (DDL & ERD)
       ↓
Interactive Working Prototype
```

---

## Repository Structure

```
primary-school-meal-management/
│
├── README.md                          ← Main project documentation (Project Map)
│
├── docs/                              ← Comprehensive top-down engineering documentation
│   ├── README.md                      ← Documentation index and methodology guide
│   ├── traceability.md                ← End-to-end traceability chain mapping
│   │
│   ├── 01-top-down/                   ← System decomposition & business domain analysis
│   │   ├── README.md
│   │   ├── PRIMARY_SCHOOL_SEMI-BOARDING_MEAL_MANAGEMENT_SYSTEM.png ← Full system mind map
│   │   ├── business-domains.md
│   │   └── core-supporting-classification.md
│   │
│   ├── 02-core-features/              ← Deep dive into the 3 active MVP core modules
│   │   ├── README.md
│   │   └── core-feature-breakdown.md
│   │
│   ├── 03-roles-usecases/             ← Actors, permissions, and UML use case models
│   │   ├── README.md
│   │   ├── roles.md
│   │   ├── role-feature-mapping.md
│   │   ├── usecase-overview.md        ← UC-00 System Overview (Mermaid)
│   │   ├── usecase-admin.md           ← UC-ADM School Administrator
│   │   ├── usecase-manager.md         ← UC-MGR Meal/Nutrition Manager
│   │   ├── usecase-kitchen.md         ← UC-KIT Kitchen Staff
│   │   ├── usecase-teacher.md         ← UC-TCH Homeroom Teacher
│   │   └── usecase-storekeeper.md     ← UC-STO Storekeeper
│   │
│   ├── 04-information-architecture/   ← Navigation models, task flows, and screen catalog
│   │   ├── README.md
│   │   ├── sitemap.md
│   │   ├── screen-hierarchy.md
│   │   ├── task-flows.md
│   │   └── screen-inventory.md
│   │
│   ├── 05-ui-ux/                      ← Design system tokens, wireframes, and mockups
│   │   ├── README.md
│   │   ├── wireframes/
│   │   ├── mockups/
│   │   └── design-system.md
│   │
│   └── 06-database/                   ← Database design, schema, and data dictionary
│       ├── README.md
│       ├── PRIMARY_SCHOOL_SEMI-BOARDING_MEAL_MANAGEMENT_SYSTEM.png ← Relational ERD
│       ├── database-erd.md
│       ├── schema.dbml
│       └── data-dictionary.md
│
├── database/                          ← SQL scripts and database documentation
│   ├── PRIMARY SCHOOL SEMI-BOARDING MEAL MANAGEMENT SYSTEM.sql
│   └── DBDOCS.md
│
├── frontend/                          ← Interactive frontend prototype application
│   ├── README.md                      ← Prototype technical architecture and user guide
│   ├── index.html                     ← Unified interactive application (M1, M2, M3)
│   ├── css/                           ← Modular Vanilla CSS design tokens & layouts
│   └── js/                            ← Role-separated vanilla ES6 JavaScript modules
│
├── screenshots/                       ← High-resolution UI captures categorized by role
│   ├── README.md                      ← Complete visual catalog with screen annotations
│   ├── gv/                            ← Homeroom Teacher screens (SCR-TCH-*)
│   ├── qlb/                           ← Meal/Nutrition Manager screens (SCR-MGR-*)
│   └── knb/                           ← Kitchen Staff Kiosk screens (SCR-KIT-*)
│
└── prototype/                         ← Legacy prototype documentation
    └── README.md
```

---

## Artifact Index

| Phase | Artifact | Description | Status |
|:---:|---|---|:---:|
| **—** | [Documentation Hub](docs/README.md) | Central navigation hub for all 6 top-down engineering phases | ✅ Complete |
| **01** | [Top-Down Decomposition](docs/01-top-down/README.md) | Business domain classification & system mind map | ✅ Complete |
| **02** | [Core Feature Breakdown](docs/02-core-features/README.md) | In-depth breakdown of the 3 active MVP core modules | ✅ Complete |
| **03** | [Roles & Use Cases](docs/03-roles-usecases/README.md) | Actor definition, permission matrix, and UML use cases | ✅ Complete |
| **04** | [Information Architecture](docs/04-information-architecture/README.md) | Screen inventory, sitemap, and operational task flows | ✅ Complete |
| **05** | [UI/UX Wireframes & Mockups](docs/05-ui-ux/README.md) | Design system, UI component library, and wireframes | 🔄 In Progress |
| **06** | [Database Architecture](docs/06-database/README.md) | Relational ERD, DBML schema, and data dictionary | ✅ Complete |
| **—** | [Traceability Chain](docs/traceability.md) | End-to-end forward and backward requirements tracing | ✅ Complete |
| **—** | [Interactive Prototype](frontend/README.md) | Prototype architecture guide and live web app ([Launch App](frontend/index.html)) | ✅ Reference |
| **—** | [UI Visual Catalog](screenshots/README.md) | Complete catalog of 11 system screenshots mapped to screen IDs | ✅ Reference |

---

## Traceability

Every artifact in this repository is strictly derived from the tier directly above it. See [docs/traceability.md](docs/traceability.md) for the complete end-to-end mapping:

$$\text{Core Domain} \longrightarrow \text{Core Capability} \longrightarrow \text{Core Feature} \longrightarrow \text{Actor} \longrightarrow \text{Use Case} \longrightarrow \text{Task Flow} \longrightarrow \text{Screen} \longrightarrow \text{DB Entity}$$

---

## System Architecture & Data Models

### 1. Top-Down System Decomposition Mind Map

The mind map illustrates the comprehensive structural breakdown from institutional strategic goals to functional domains, distinguishing between core operational modules and supporting capabilities:

![Top-Down Decomposition Mind Map](docs/01-top-down/PRIMARY_SCHOOL_SEMI-BOARDING_MEAL_MANAGEMENT_SYSTEM.png)

*For detailed business domain analysis and scope justification, refer to [docs/01-top-down/README.md](docs/01-top-down/README.md).*

---

### 2. Relational Database Architecture (Schema & ERD)

A robust 3NF relational schema that seamlessly interconnects the 3 active operational modules: from classroom student attendance (`meal_participations`), aggregated demand calculation (`meal_demands`, `meal_demand_dish_quantities`) to kitchen preparation execution (`meal_preparation_plans`) and physical yield verification (`meal_preparations`, `prepared_quantity_confirmations`):

![Database Schema & ERD](docs/06-database/PRIMARY_SCHOOL_SEMI-BOARDING_MEAL_MANAGEMENT_SYSTEM.png)

*For complete entity specifications, data dictionaries, and SQL scripts, refer to [docs/06-database/README.md](docs/06-database/README.md).*

---

## User Interface & Role Workflows (UI Showcase)

The platform delivers purpose-built user experiences tailored to the three primary operational actors in the semi-boarding meal supply chain, with real-time state synchronization across all interfaces:

### 1. Homeroom Teacher — Classroom Supervisor (GV / TCH)
*Classroom operations: Manages daily student rosters, records meal participation, flags medical dietary restrictions/allergies, and locks headcounts before the morning cutoff deadline.*

![SCR-TCH-01: Class Roster Meal Participation](screenshots/gv/gv-2.png)
> **SCR-TCH-01 — Class Roster Participation & Cutoff Countdown:**
> - **Real-Time Attendance:** Fast one-tap status toggling per student (*Attended*, *Excused Absence*, *Unexcused Absence*, *Guest Meal*).
> - **Allergy Safety Indicators:** High-visibility warning badges for students with registered dietary restrictions (e.g., peanut or seafood allergies) to ensure dietary isolation.
> - **Cutoff Enforcement:** Live countdown timer to the daily lock deadline (`08:30:00`) to guarantee kitchen prep timelines, paired with an emergency adjustment request trigger (`SCR-TCH-04`).

---

### 2. Meal / Nutrition Manager — Operations Supervisor (QLB / MGR)
*Operations office: Aggregates real-time attendance across all school grades, computes precise raw ingredient demand, configures safety buffer percentages (`Buffer %`), and reviews late emergency change requests.*

![SCR-MGR-01: Demand Determination Dashboard](screenshots/qlb/qlb-1.png)
> **SCR-MGR-01 — Demand Determination & Buffer Optimization:**
> - **Live Data Aggregation:** Real-time synchronization of submission progress across all classrooms with a dynamic visual completion indicator.
> - **Flexible Forecasting Models:** Selectable calculation engines (*Participation-Based Actuals*, *Registered Baseline Roster*, *7-Day Historical Moving Average*).
> - **Safety Buffer Adjustment:** Configurable portion buffer (`Buffer %`) to prevent shortages during tray distribution and absorb emergency headcounts.

![SCR-MGR-02: Dish Quantity Calculation & Overrides](screenshots/qlb/qlb-2.png)
> **SCR-MGR-02 — Dish Portion Calculation & Manual Overrides:**
> - **Automated Batch Scaling:** Automatically calculates required preparation quantities based on standard portion metrics: $\text{Planned Quantity} = \text{Standard Portion} \times \text{Final Demand} \times (1 + \text{Buffer})$.
> - **Audited Manual Overrides:** Allows managers to adjust dish quantities to account for seasonal ingredient yields or weather variations, enforcing mandatory justification notes.

---

### 3. Kitchen Staff / Head Chef — Kitchen Operations Kiosk (KNB / KIT)
*Kitchen floor operations: High-contrast touch kiosk interface designed for industrial tablet or wall-mounted displays. Guides chefs through shift targets, ingredient storage verification, cooking timers, and post-cook yield reconciliation.*

![SCR-KIT-01: Kitchen Prep Shift Dashboard](screenshots/knb/knb-1.png)
> **SCR-KIT-01 — Kitchen Shift Operational Kiosk:**
> - **Kiosk-Optimized Ergonomics:** Card-based high-contrast UI with large tap targets tailored for kitchen wall mounts and industrial tablets.
> - **Target Dish Visibility:** Displays real-time preparation quotas across all scheduled meal courses (staple carbs, primary proteins, vegetable broths, sides, desserts).
> - **One-Touch Workflow Transitions:** Immediate navigation across the four key kitchen phases: Ingredient Receiving (`SCR-KIT-02`), Station Cooking (`SCR-KIT-03`), and Yield Verification (`SCR-KIT-04`).

![SCR-KIT-03: Cooking Batch Execution & Timers](screenshots/knb/knb-3.png)
> **SCR-KIT-03 — Industrial Cooking Stations & Active Batch Timers:**
> - **Station-Segregated Execution:** Dedicated tracking by cooking appliance (24-tray industrial steam cabinets, pressure braising pans, 100L soup kettles).
> - **Real-Time Timers:** Active countdown monitors ensuring food safety thermal standards and precise doneness criteria.
> - **Seamless Handoff:** Direct transition from batch completion to scale weighing and yield variance logging.

---

## Quick Start (Prototype)

Run the unified interactive web prototype simulating all 3 core operational roles:

```bash
python -m http.server 8080 --directory frontend
```

Open in your browser: **`http://localhost:8080/index.html`**

The prototype features a dynamic viewport controller (toggling between Mobile 390px and Desktop / Kiosk Tablet modes) and role switching:
1. **Teacher Portal:** Record Class 1A attendance & lock roster (`SCR-TCH-01`, `SCR-TCH-03`).
2. **Manager Portal:** Aggregate school demand & scale dish portions (`SCR-MGR-01`, `SCR-MGR-02`).
3. **Kitchen Kiosk:** Review shift targets, run batch cooking timers & verify yield tolerances (`SCR-KIT-01` → `SCR-KIT-04`).
