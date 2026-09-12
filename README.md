# Primary School Semi-Boarding Meal Management System

> A web-based system designed to manage the full meal lifecycle for primary school semi-boarding programs — from student registration and menu planning through kitchen execution, food safety, and cost transparency.

---

## Problem Statement

Primary schools operating semi-boarding programs face recurring operational friction across the full meal value chain:

- **Attendance Discrepancy:** Manual paper rosters lead to meal over/under-production daily.
- **Food Over/Under-Production:** No dynamic scaling from confirmed headcounts to raw ingredient quantities.
- **Emergency Disruption:** Late arrivals, absences, and dietary changes after the cutoff have no structured approval workflow.
- **Traceability Gaps:** Ingredient batches, supplier sources, and affected meals are not linked, making food safety incidents impossible to investigate quickly.
- **Cost Opacity:** Fee collection and cost-per-meal calculations are done in spreadsheets, disconnected from actual consumption.

---

## Project Methodology

This repository follows a **strict top-down decomposition methodology**, ensuring every artifact is traceable to its upstream source:

```
Top-down Mind Map
       ↓
Core / Supporting Classification
       ↓
Selected Core Features
       ↓
Roles & Use Cases
       ↓
Information Architecture
       ↓
Task Flows
       ↓
Wireframes / Mockups
       ↓
Database Architecture
       ↓
Prototype
```

---

## Repository Structure

```
primary-school-meal-management/
│
├── README.md                          ← You are here (Project Map)
│
├── docs/
│   ├── traceability.md               ← End-to-end traceability chain
│   │
│   ├── 01-top-down/
│   │   ├── README.md
│   │   ├── top-down-mindmap.png      ← Full system mind map
│   │   ├── business-domains.md
│   │   └── core-supporting-classification.md
│   │
│   ├── 02-core-features/
│   │   ├── README.md
│   │   └── core-feature-breakdown.md
│   │
│   ├── 03-roles-usecases/
│   │   ├── README.md
│   │   ├── roles.md
│   │   ├── role-feature-mapping.md
│   │   ├── usecase-overview.md       ← UC-00 System Overview (Mermaid)
│   │   ├── usecase-admin.md          ← UC-ADM School Administrator
│   │   ├── usecase-manager.md        ← UC-MGR Meal/Nutrition Manager
│   │   ├── usecase-kitchen.md        ← UC-KIT Kitchen Staff
│   │   ├── usecase-teacher.md        ← UC-TCH Homeroom Teacher
│   │   └── usecase-storekeeper.md    ← UC-STO Storekeeper
│   │
│   ├── 04-information-architecture/
│   │   ├── README.md
│   │   ├── sitemap.md
│   │   ├── screen-hierarchy.md
│   │   ├── task-flows.md
│   │   └── screen-inventory.md
│   │
│   ├── 05-ui-ux/
│   │   ├── README.md
│   │   ├── wireframes/
│   │   ├── mockups/
│   │   └── design-system.md
│   │
│   └── 06-database/
│       ├── README.md
│       ├── database-erd.md
│       ├── schema.dbml
│       └── data-dictionary.md
│
├── database/
│   ├── PRIMARY SCHOOL SEMI-BOARDING MEAL MANAGEMENT SYSTEM.sql
│   └── DBDOCS.md
│
├── ui/
│   ├── demand.html
│   ├── index.html
│   ├── css/
│   └── js/
│
└── prototype/
    └── README.md
```

---

## Artifact Index

| Phase | Artifact | Status |
|-------|----------|--------|
| 01 | [Top-Down Decomposition](docs/01-top-down/README.md) | ✅ Complete |
| 02 | [Core Feature Breakdown](docs/02-core-features/README.md) | ✅ Complete |
| 03 | [Roles & Use Cases](docs/03-roles-usecases/README.md) | ✅ Complete |
| 04 | [Information Architecture](docs/04-information-architecture/README.md) | ✅ Complete |
| 05 | [UI/UX Wireframes & Mockups](docs/05-ui-ux/README.md) | 🔄 In Progress |
| 06 | [Database Architecture](docs/06-database/README.md) | ✅ Complete |
| — | [Traceability Chain](docs/traceability.md) | ✅ Complete |
| — | [Prototype](prototype/README.md) | ✅ Reference |

---

## Traceability

Every artifact in this repository is derived from the one above it. See [docs/traceability.md](docs/traceability.md) for the full end-to-end chain mapping:

**Core Domain → Core Capability → Core Feature → Actor → Use Case → Task Flow → Screen → DB Entity**

---

## Quick Start (Prototype)

```bash
python -m http.server 8080 --directory ui
```

Navigate to: **`http://localhost:8080/demand.html`**

The prototype covers the **Meal Demand & Quantity Management** flow (Phase 1 MVP core screen trio).
