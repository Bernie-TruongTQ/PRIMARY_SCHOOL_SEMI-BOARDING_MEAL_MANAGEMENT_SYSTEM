# C4 Level 3 — Component Diagram: Domain 2 — Meal Planning & Menu Management

## 1. Overview

This document specifies the internal software components within the **Backend API Service** container that implement **Domain 2: Meal Planning & Menu Management** (`F-PLN`).

### Operational Objectives

- Maintain the school standard dish catalog with portion specifications and ingredient lists (`F-PLN-01`).
- Provide the Weekly Menu Composer allowing the Coordinator (`MGR`) to design nutritionally balanced menus for Monday through Friday (`F-PLN-02`).
- Enforce the administrative **1-Level Approval Workflow** (`draft` $\rightarrow$ `approved`) by the School Administrator / Principal (`ADM`) (`F-PLN-02`).
- Bind approved weekly menus to institutional calendar dates and sessions (`F-PLN-03`).

---

## 2. Component Diagram (C4Component)

![Component Diagram — Domain 2: Meal Planning & Menu Management](images/Domain2Components.png)

---

## 3. Component Details & Operational Responsibilities

### 3.1. Menu & Planning Controller

- **Endpoint Definitions:**
  - `GET /api/v1/dishes`: Retrieves active dishes with ingredient metadata (`F-PLN-01`).
  - `POST /api/v1/dishes`: Creates or updates standard dish profiles and standard portion units (`F-PLN-01`).
  - `GET /api/v1/menus/weekly?week=:weekNumber`: Retrieves weekly menu drafts or approved configurations (`F-PLN-02`).
  - `POST /api/v1/menus`: Saves or submits a weekly menu for administrative review (`F-PLN-02`).
  - `POST /api/v1/menus/:menuId/approve`: Administrative single-level approval sign-off (`F-PLN-02`).
  - `POST /api/v1/schedules/bind-menu`: Binds an approved menu to calendar date ranges (`F-PLN-03`).

### 3.2. Dish Catalog Service

- Enforces standard nutritional dish profiles:
  - Dish name, meal course category (`Main Entree`, `Side Dish`, `Soup`, `Dessert`).
  - Standard portion baseline (e.g., $100\text{g}$ braised pork, $120\text{g}$ rice, $150\text{ml}$ soup).
  - Ingredient associations (enabling automated downstream allergen detection).

### 3.3. Menu Composer Service

- Provides validation rules for weekly menus:
  - Ensures each standard school lunch contains required nutritional components (1 main, 1 side, 1 soup, 1 dessert/fruit).
  - Prevents dish repetition across consecutive days within the same school week.

### 3.4. Menu Approval Engine

- **Streamlined 1-Level Approval Workflow:**
  - State machine: `draft` $\rightarrow$ `submitted` $\rightarrow$ `approved` (or `rejected` with revision notes).
  - Principal / Administrator (`ADM`) performs single-click sign-off.
  - Upon approval, the menu is locked against ad-hoc dish alterations.

### 3.5. Schedule Binder Service

- Binds approved menus to active calendar school dates:
  - Populates `meal_schedules` records with the corresponding `menu_id`.
  - Flags active menus for morning classroom attendance roll calls and demand calculations.
