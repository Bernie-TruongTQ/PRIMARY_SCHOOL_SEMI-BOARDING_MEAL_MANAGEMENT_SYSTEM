# Phase 07 — API Documentation (RESTful API Specification)

## 1. Overview & Architectural Alignment

This directory houses the comprehensive, production-grade **RESTful API Documentation** for the **Primary School Semi-Boarding Meal Management System (MVP Scope)**.

The API contract is derived strictly top-down from:
- **Upstream Requirements**: [Phase 01: Top-Down Mind Map](../01-top-down/README.md) & [MVP Baseline (MVP.md)](../01-top-down/MVP.md)
- **Core Features**: [Phase 02: Core Feature Breakdown (24 MVP Features across 8 Domains)](../02-core-features/core-feature-breakdown.md)
- **Roles & Use Cases**: [Phase 03: Fixed 4-Role RBAC Model & UML Use Cases](../03-roles-usecases/README.md)
- **Information Architecture**: [Phase 04: Screen Hierarchy & 4 Autonomous Portals](../04-information-architecture/INFORMATION_ARCHITECTURE.md)
- **Database Architecture**: [Phase 06: Relational Persistence Schema (DBML & 3NF PostgreSQL 15)](../06-database/README.md)
- **Architecture Blueprints**: [arc42 Architecture Documentation Suite](../../arc42/README.md) & [C4 Architecture Models](../../c4/README.md)

---

## 2. Operating Model & Core Invariants

```
Operating Model: External Catering Vendor Operating Model
Scope Bounding:  Dedicated Lunch-Only Scope (Mon–Fri)
Security Model:  Fixed 4-Role RBAC (ADM, MGR, ACC, PAR) via HTTP-Only JWT Bearer Token
```

### Statutory Daily Operational Milestones (Golden Timelines)
1. **08:30:00 AM**: Classroom Attendance Lock (`AttendanceCutoffGuard` rejects mutations with `409 Conflict`).
2. **08:45:00 AM**: Demand Aggregation, Safety Buffer Calculation ($0\%\text{--}10\%$) & Electronic PO Dispatch to External Catering Vendor.
3. **10:30:00 AM**: Delivery Dock Arrival & 3-Step Food Safety Inspection (Decision 1246/QĐ-BYT: Core Temp $\ge 65^\circ\text{C}$, Tamper Seals, Sensory Pass, 24h Retention Samples).
4. **11:00:00 AM**: Classroom Meal Trolley Distribution with Allergen Warning Tags.
5. **13:00:00 PM**: Post-Lunch 3-Way Quantity Reconciliation (Ordered vs. Delivered vs. Consumed) & Automated Vendor Payable Accrual.
6. **Monthly**: Automated Student Fee Billing (with excused absence credits) & Dynamic VietQR Payment Collection.

---

## 3. Documentation Structure

| Document | Focus & Scope | Standard / Format |
|---|---|---|
| [**api-specification.md**](api-specification.md) | Comprehensive human-readable REST API documentation covering all 8 business domains, endpoint schemas, request/response models, and error codes | Markdown, cURL, JS/TS, Python |
| [**openapi.yaml**](openapi.yaml) | Formal machine-readable OpenAPI 3.0.3 specification ready for Swagger UI, Redoc, and client SDK codegen | OpenAPI 3.0.3 YAML |

---

## 4. Master Domain to API Route Group Mapping

| Domain # | Business Domain | Feature IDs | Primary Route Prefix | Controller / Service | Primary Roles |
|:---:|---|---|---|---|:---:|
| **6** | **User & Access Management** | `F-USR-01..02` | `/api/v1/auth`, `/api/v1/users`, `/api/v1/admin/users` | `AuthenticationController`, `UserController` | Public, All Roles, `ADM` |
| **8** | **Master Data & Academic Config** | `F-MST-01..02` | `/api/v1/master` | `MasterDataController` | `ADM`, `MGR` |
| **1** | **Student Meal & Participation** | `F-PAR-01..04` | `/api/v1/students`, `/api/v1/classes`, `/api/v1/participations` | `ParticipationController` | `MGR`, `PAR`, `ADM` |
| **2** | **Meal Planning & Menu Management** | `F-PLN-01..03` | `/api/v1/dishes`, `/api/v1/menus`, `/api/v1/schedules` | `MenuPlanningController` | `MGR`, `ADM` |
| **7** | **Nutrition & Food Allergy Alerts** | `F-NUT-01..02` | `/api/v1/nutrition`, `/api/v1/students/:id/allergies` | `NutritionAllergyController` | `PAR`, `MGR`, `ADM` |
| **3** | **Meal Operations (Demand & Catering)** | `F-OPS-01..05` | `/api/v1/demands`, `/api/v1/operations` | `DemandController`, `OperationsController` | `MGR` |
| **4** | **Meal Fee & Cost Management** | `F-FEE-01..04` | `/api/v1/finance` | `FeeCostController` | `ACC`, `PAR` |
| **5** | **Reporting & Transparency** | `F-REP-01..03` | `/api/v1/reports`, `/api/v1/transparency` | `ReportingTransparencyController` | `MGR`, `ACC`, `PAR`, `ADM` |

---

## 5. Traceability & Verification

Every endpoint in this API documentation links directly to:
1. **Feature ID** in [Phase 02](../02-core-features/core-feature-breakdown.md)
2. **Actor & Use Case ID** in [Phase 03](../03-roles-usecases/README.md)
3. **Screen ID** in [Phase 04](../04-information-architecture/INFORMATION_ARCHITECTURE.md)
4. **Relational Database Entities** in [Phase 06](../06-database/schema.dbml)
5. **C4 Component Specifications** in [c4/](../../c4/README.md)
