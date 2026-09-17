# C4 Level 3 — Component Diagram: Domain 8 — Master Data & System Configuration

## 1. Overview

This document specifies the internal software components within the **Backend API Service** container that implement **Domain 8: Master Data & System Configuration** (`F-MST`).

### Operational Objectives

- Maintain the primary institutional academic structure: School Years, Semesters, Grades, Classrooms, and Student Directories (`F-MST-01`).
- Configure institutional lunch serving rules (standard school serving days: Monday through Friday) (`F-MST-02`).
- Maintain the official school holiday calendar, national holidays, teacher development days, and non-meal dates (`F-MST-02`).

---

## 2. Component Diagram (C4Component)

![Component Diagram — Domain 8: Master Data & System Configuration](images/Module8Components.png)

---

## 3. Component Details & Operational Responsibilities

### 3.1. Master Data & Config Controller

- **Endpoint Definitions:**
  - `GET /api/v1/master/terms`: Retrieves school years and active semesters (`F-MST-01`).
  - `POST /api/v1/master/classes`: Creates or updates classroom records (e.g., `Class 1A`, `Grade 1`) (`F-MST-01`).
  - `GET /api/v1/master/students?classId=:classId`: Returns student roster for a class (`F-MST-01`).
  - `POST /api/v1/master/students`: Enrolls or updates student profile (`F-MST-01`).
  - `GET /api/v1/master/calendar/holidays?year=:year`: Lists scheduled non-meal holidays (`F-MST-02`).
  - `POST /api/v1/master/calendar/holidays`: Registers institutional holiday dates (`F-MST-02`).

### 3.2. Academic Structure Service

- Maintains organizational hierarchy:
  $$
  \text{School Year} \rightarrow \text{Semester} \rightarrow \text{Grade Level} \rightarrow \text{Classroom} \rightarrow \text{Student}
  $$
- Supports student year-end grade promotions and classroom reassignments.

### 3.3. Meal Calendar Configuration Service

- **Operational Rules:**
  - **Lunch Serving Days:** Configured as standard weekdays (Monday to Friday).
  - **Holiday Filter:** When generating daily attendance sheets or monthly fee invoices, dates flagged in `holidays` are automatically excluded from the billable serving day count.
  - Prevents the system from scheduling menus or demanding catering meals on holidays.

### 3.4. SIS Synchronization Service

- Nightly batch job or manual trigger:
  - Scans external School Information System (SIS) for changes in student enrollment (new transfers, classroom reassignments, withdrawals).
  - Keeps student directory synchronized with zero manual duplicate data entry.
