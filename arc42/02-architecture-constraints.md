# 2. Architecture Constraints

## Overview

Architectural freedom for the **Primary School Semi-Boarding Meal Management System** is governed by strict operational timelines, educational environment limits, national food safety regulations, and lightweight technology stack choices. These constraints are non-negotiable boundaries derived from external catering logistics, campus network infrastructure, and statutory compliance.

---

## 2.1 Technical Constraints

| Constraint | Background / Operational Reason | Architectural Impact |
|:---|:---|:---|
| **Vanilla Frontend Stack**<br>*(HTML5, ES6 Modules, Vanilla CSS)* | Minimizes framework bloat, guarantees instant cold-start times on low-power classroom tablets and coordinator mobile devices, and eliminates long-term npm frontend build fragility. | No heavy client framework (React/Angular/Vue); all UI state and rendering must be managed using native DOM APIs, custom event buses, and modular CSS design tokens across 4 autonomous role portals (`/coordinator`, `/accountant`, `/parent`, `/admin`). |
| **Node.js & Express.js Backend** | Established runtime providing non-blocking asynchronous I/O, ideal for concurrent morning roll-call bursts (50+ classrooms submitting simultaneously) with minimal memory footprint. | All backend domain services, route handlers, and validation schemas must run on Node.js LTS with standard Express middleware. |
| **PostgreSQL 15 as Primary RDBMS** | Strong ACID compliance is mandatory to maintain mathematical integrity across attendance rosters, catering orders, receiving inspection logs, fee billing batches, and immutable audit ledgers. | Requires normalized relational tables, explicit check constraints, foreign keys, and composite indexes on `(meal_schedule_id, status)` and `(student_id, date)`. |
| **WebSocket Real-time Layer**<br>*(Socket.io over WSS)* | Immediate broadcast of attendance lock signals, 08:30 AM countdown pulses, dock delivery arrival alerts, and emergency absence notices without expensive client polling. | System architecture must include a persistent WebSocket server alongside the stateless HTTP REST API. |
| **Media File Storage for Compliance Evidence** | Storage required for photographic evidence of digital thermometer readings, container seals, and 24-hour food retention sample labels. | High-resolution image upload endpoints with local disk or S3-compatible object storage backends. |
| **Heterogeneous Client Devices** | Diverse hardware: teacher smartphones, coordinator mobile tablets, accountant desktop workstations, and parent smartphones. | Portals must strictly adapt: 390px mobile-first cards for roll-calls and parents, data-dense analytical grids for coordinators and accountants. |

---

## 2.2 Organizational and Operational Constraints

| Constraint | Background / Operational Reason | Architectural Impact |
|:---|:---|:---|
| **Dedicated Lunch-Only Scope** | The system governs the midday lunch service on standard school days (Monday–Friday). Breakfast, afternoon snacks, and dinner are strictly excluded. | System scheduling engines, menus, demand calculations, and fee rates must strictly model single lunch sessions per calendar day. |
| **External Catering Operating Model** | Prepared hot meals are supplied by an external licensed catering partner. The school team does not manage raw ingredient procurement or cooking cauldrons. | The system manages purchase orders, receiving inspection, classroom trolley distribution, and 3-way quantity reconciliation rather than raw pantry inventory or chef cooking shifts. |
| **Fixed 4-Role RBAC Model** | Administrative policy mandates four fixed institutional roles without runtime custom permission overrides: Coordinator (`MGR`), Accountant (`ACC`), Parent (`PAR`), Administrator (`ADM`). | Permissions are strictly bound to system roles. Endpoints and UI navigation routes are statically segregated into 4 portal namespaces. |
| **Strict Operational Golden Timeline** | Logistics require disciplined milestones: **08:30 AM** (Attendance Cutoff) $\rightarrow$ **08:45 AM** (Vendor Order Dispatch) $\rightarrow$ **10:30 AM** (Receiving Inspection) $\rightarrow$ **11:00 AM** (Classroom Trolley Serving) $\rightarrow$ **13:00 PM** (3-Way Reconciliation). | Backend enforces temporal policy guards: direct attendance modifications are rejected after 08:30:00 AM; purchase orders are frozen after 08:45:00 AM. |
| **Fixed Catering Budget & Buffer Boundaries** | Semi-boarding meal fees are fixed per term; food waste or inventory shrinkage cannot be offset by price hikes. | Demand engine must enforce tight buffer margin boundaries ($0\%\text{--}10\%$, default $3\%\text{--}5\%$) to prevent catering expenditure overruns. |

---

## 2.3 Regulatory and Compliance Constraints

| Constraint | Background / Operational Reason | Architectural Impact |
|:---|:---|:---|
| **Vietnam Food Safety Law & MOH Regulations**<br>*(Decision 1246/QĐ-BYT & Law 55/2010/QH12)* | Mandates the 3-step food safety inspection protocol (*Kiểm thực 3 bước*) and 24-hour retention food sampling (*Lưu mẫu thức ăn 24 giờ*) for all collective catering facilities. | System must implement digital records for hot delivery receiving checks ($\ge 65^\circ\text{C}$), pre-serving container seal verification, sensory checks, and photographic logs of sealed sample jars. |
| **Children's Data Protection & Student Privacy** | Student identities, health conditions, dietary restrictions, and attendance records constitute sensitive student personal data (PII). | Enforces strict Role-Based Access Control (RBAC). Teachers can only access their assigned classroom students; external public access is prohibited. |
| **Audit Log Immutability** | Financial accountability requires a transparent, tamper-proof record of every meal cancellation, post-cutoff addition, and discrepancy adjustment. | Modification history must be recorded in dedicated append-only tables (`meal_participation_changes`, `meal_discrepancies`) with user ID, timestamps, and explicit reasons. |

---

## 2.4 Conventions

| Convention | Description & Standards |
|:---|:---|
| **API Architecture** | Standardized RESTful JSON over HTTPS. Strict HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `403 Forbidden`, `409 Conflict`, `422 Unprocessable Entity`). |
| **Database Conventions** | PostgreSQL `snake_case` naming for tables, columns, and constraints. Primary keys use `SERIAL` integers or `UUID`. Explicit timestamps `created_at` and `updated_at` on all stateful tables. |
| **Architectural Documentation** | Standardized using **arc42** structure and **C4 Model** diagrams (Levels 1–3) with inline Mermaid representations. |
| **Code Style & Typing** | Clean ES6+ JavaScript modules. Domain layer adheres to Domain-Driven Design (DDD) encapsulation, separating controllers, service layers, and repository interfaces. |
