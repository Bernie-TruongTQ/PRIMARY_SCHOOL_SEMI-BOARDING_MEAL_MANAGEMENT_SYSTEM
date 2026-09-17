# Phase 04 — Information Architecture

## Overview

Information Architecture (IA) establishes the structural backbone of the **Primary School Semi-Boarding Meal Management System**. It directly translates the top-down decomposition ([Phase 01 — Top-Down](../01-top-down/README.md)), core feature breakdown and INVEST criteria ([Phase 02 — Core Features](../02-core-features/README.md)), and actor role specifications ([Phase 03 — Roles & Use Cases](../03-roles-usecases/README.md)) into an intuitive, high-performance structural hierarchy for frontend and database implementation.

```
Phase 01: Top-Down Mindmap & MVP Scope Baseline (MVP.md)
                         ↓
Phase 02: 8 Business Domains & 24 Core Features (core-feature-breakdown.md, invest-requirements.md)
                         ↓
Phase 03: Fixed 4-Role RBAC Model (MGR, ACC, PAR, ADM) & 27 Use Cases (roles.md, usecase-overview.md)
                         ↓
Phase 04: Information Architecture (This Suite)
 ├── INFORMATION_ARCHITECTURE.md  → Master canonical specification (Sitemap, Nav, Hierarchy, Glossary, Growth, URL)
 └── screen-hierarchy.md          → View nesting, Level 1 & 2 portals, and Layer 2.5 modal depth limits
                         ↓
Phase 05: UI/UX Wireframes & Interaction Design
                         ↓
Phase 06: Relational Database Schema & Entities (DDL)
```

---

## Core System Architecture Principles

1. **Fixed 4-Role Autonomy & RBAC Isolation**:
   - In strict compliance with [MVP.md](../01-top-down/MVP.md) and [roles.md](../03-roles-usecases/roles.md), the system provides **4 dedicated portals**:
     - **Semi-Boarding Coordinator Portal (`/coordinator`) [MGR]**: Daily attendance locking, attendance progress monitoring, demand calculation with safety buffer, catering PO dispatch, 3-step food temperature/quality inspection, classroom tray distribution, and post-lunch reconciliation.
     - **School Accountant Portal (`/accountant`) [ACC]**: Meal fee configuration, monthly chargeable meal calculation & parent invoicing, 3-state payment tracking (`unpaid`, `partial`, `paid`), catering vendor payable accrual, and financial reports.
     - **Parent Portal (`/parent`) [PAR]**: Semester meal program registration, child allergy profiles, daily published menus with food safety verification badges, and monthly invoices with dynamic VietQR payment codes.
     - **School Administrator Portal (`/admin`) [ADM]**: Academic master data (years, terms, classes, students), meal eligibility criteria, Mon–Fri serving calendars & holiday exclusions, 1-level weekly menu approval, and user account management.
2. **Dedicated Lunch-Only Scope**:
   - The system operates strictly for **Daily Lunch Service** on standard school days (Mon–Fri). Breakfast, afternoon snacks, and dinner are strictly out of scope.
3. **External Catering Vendor Workflow (No In-House Cooking)**:
   - Meals are cooked off-site by an accredited catering partner. The school team governs morning demand forecasting (08:30–08:45 AM), food delivery inspection at 10:30 AM (core temperature $\ge 65^\circ\text{C}$), classroom tray distribution at 11:00 AM, and post-service discrepancy reconciliation at 13:00 PM.
4. **Strict Navigation Depth ($\le 2$ Levels)**:
   - Direct access to any primary view within 1 click (`/:portal/:screen`). Secondary forms (absence reasons, temperature logs, discrepancy justification, allergy edits) use non-destructive **Layer 2.5 Contextual Sheets / Modals**.

---

## Documentation Suite in this Directory

| Document | Description | Target Stakeholders |
|---|---|---|
| [**INFORMATION_ARCHITECTURE.md**](INFORMATION_ARCHITECTURE.md) | **Canonical Master IA Specification** covering sitemap, navigation model, content hierarchy, naming conventions & domain glossary, component reuse map, content growth plan, and URL strategy. | System Architects, Lead Engineers, Product Managers |
| [**screen-hierarchy.md**](screen-hierarchy.md) | Structural layout hierarchy, parent-child view relationships, modal bottom-sheet layers, and navigation depth constraints across the 4 fixed roles. | UI/UX Designers, Frontend Developers, Mobile Developers |

---

## Upstream & Downstream Traceability

- **Top-Down Decomposition & Scope**: [docs/01-top-down/MVP.md](../01-top-down/MVP.md) | [docs/01-top-down/business-domains.md](../01-top-down/business-domains.md)
- **Core Features & INVEST Stories**: [docs/02-core-features/core-feature-breakdown.md](../02-core-features/core-feature-breakdown.md) | [docs/02-core-features/invest-requirements.md](../02-core-features/invest-requirements.md)
- **Role Specifications & RACI**: [docs/03-roles-usecases/roles.md](../03-roles-usecases/roles.md) | [docs/03-roles-usecases/role-feature-mapping.md](../03-roles-usecases/role-feature-mapping.md) | [docs/03-roles-usecases/usecase-overview.md](../03-roles-usecases/usecase-overview.md)
- **UI/UX Design**: [docs/05-ui-ux/README.md](../05-ui-ux/README.md)
- **Relational Database**: [docs/06-database/README.md](../06-database/README.md)
