# 2. Architecture Constraints

## Overview

Architectural freedom for the **Primary School Semi-Boarding Meal Management System** is governed by strict operational timelines, educational environment limits, national food safety regulations, and lightweight technology stack choices. These constraints are non-negotiable boundaries derived from physical kitchen operations, school network infrastructure, and statutory compliance.

---

## 2.1 Technical Constraints

| Constraint | Background / Operational Reason | Architectural Impact |
|:---|:---|:---|
| **Vanilla Frontend Stack**<br>*(HTML5, ES6 Modules, Vanilla CSS)* | Minimizes framework bloat, guarantees instant cold-start times on low-power classroom tablets and kitchen kiosks, and eliminates long-term npm frontend build fragility. | No heavy client framework (React/Angular/Vue); all UI state and rendering must be managed using native DOM APIs, custom event buses, and modular CSS design tokens. |
| **Node.js & Express.js Backend** | Established runtime providing non-blocking asynchronous I/O, ideal for concurrent morning roll-call spikes and real-time event distribution. | All backend domain services, route handlers, and validation schemas must run on Node.js LTS with standard Express middleware. |
| **PostgreSQL 15 as Primary RDBMS** | Strong ACID compliance is mandatory to maintain mathematical integrity across attendance rosters, dish portion weights, and immutable audit logs. | Requires normalized relational tables, explicit check constraints, foreign keys, and composite indexes on `(meal_schedule_id, status)` and `(student_id, date)`. |
| **WebSocket Real-time Layer**<br>*(Socket.io over WSS)* | Immediate broadcast of roster lock status, kitchen station batch completions, and emergency amendment requests without expensive client polling. | System architecture must include a persistent WebSocket server alongside the stateless HTTP REST API. |
| **Media File Storage for Compliance Evidence** | Storage required for photographic evidence of digital scale readings and 24-hour food retention sample labels. | High-resolution image upload endpoints with local disk or S3-compatible object storage backends. |
| **Heterogeneous Client Devices** | Diverse hardware: teacher smartphones/tablets, administrative desktop displays, and wall-mounted 15.6"+ industrial kitchen kiosks. | Portals must strictly adapt: 390px mobile-first cards for teachers, dense data grids for managers, and $\ge 48\text{px}$ touch targets with high-contrast themes for kitchen kiosks. |

---

## 2.2 Organizational and Operational Constraints

| Constraint | Background / Operational Reason | Architectural Impact |
|:---|:---|:---|
| **Strict 08:00 AM Morning Cutoff Deadline** | Kitchen cooking shifts begin promptly at 08:00 AM to prepare meals for the 11:30 AM lunch period. Late numbers directly disrupt ingredient batching and cooking timelines. | Backend must enforce automated temporal guards rejecting direct attendance writes post-08:00 AM, rerouting modifications to an emergency approval workflow. |
| **Kitchen Operating Environment** | Kitchen environments are noisy, humid, and hands are frequently wet or covered with food-grade gloves. | Complex dropdowns, tiny inputs, or multi-step wizard dialogues are prohibited on the kitchen interface; interaction is restricted to large touch toggles ($\le 2\text{ taps}$). |
| **Limited Campus Wi-Fi Bandwidth** | Morning roll-call coincides with school-wide campus network congestion as hundreds of teachers and staff arrive. | Payloads must be extremely lean (lightweight JSON), and client pages must load instantaneously with minimal network overhead. |
| **Fixed Catering Budget per Meal** | Semi-boarding meal fees are fixed per term by school boards and parent committees; food waste or inventory shrinkage cannot be offset by price hikes. | Demand engine must enforce tight buffer margin boundaries (3%–5% default, capped at 10%) to prevent ingredient over-purchasing. |

---

## 2.3 Regulatory and Compliance Constraints

| Constraint | Background / Operational Reason | Architectural Impact |
|:---|:---|:---|
| **Vietnam Food Safety Law & MOH Regulations**<br>*(Decision 1246/QĐ-BYT & Law 55/2010/QH12)* | Mandates the 3-step food safety inspection protocol (*Kiểm thực 3 bước*) and 24-hour retention food sampling (*Lưu mẫu thức ăn 24 giờ*) for all collective catering facilities. | System must implement digital records for raw ingredient delivery checks, cooking temperature logs ($\ge 75^\circ\text{C}$), pre-serving sensory checks, and photographic logs of sealed sample jars. |
| **Children's Data Protection & Student Privacy** | Student identities, health conditions, dietary restrictions, and attendance records constitute sensitive student personal data (PII). | Enforces strict Role-Based Access Control (RBAC). Teachers can only access their assigned classroom students; external public access is prohibited. |
| **Audit Log Immutability** | Financial accountability requires a transparent, tamper-proof record of every meal cancellation, post-cutoff addition, and yield variance. | Modification history must be recorded in dedicated append-only tables (`meal_participation_changes`, `meal_demand_changes`) with user ID, timestamps, and explicit reasons. |

---

## 2.4 Conventions

| Convention | Description & Standards |
|:---|:---|
| **API Architecture** | Standardized RESTful JSON over HTTPS. Strict HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `403 Forbidden`, `409 Conflict`, `422 Unprocessable Entity`). |
| **Database Conventions** | PostgreSQL `snake_case` naming for tables, columns, and constraints. Primary keys use `SERIAL` integers or `UUID`. Explicit timestamps `created_at` and `updated_at` on all stateful tables. |
| **Architectural Documentation** | Standardized using **arc42** structure and **C4 Model** diagrams (Levels 1–4) with PlantUML and inline Mermaid representations. |
| **Code Style & Typing** | Clean ES6+ JavaScript modules. Domain layer adheres to Domain-Driven Design (DDD) encapsulation, separating controllers, service layers, and repository interfaces. |
