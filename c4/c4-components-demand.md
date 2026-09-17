# C4 Level 3 — Component Diagram: Domain 3A — Meal Demand & Catering Order Management (Module 2)

## 1. Overview

This document specifies the internal software components within the **Backend API Service** container that implement the first operational stage of **Domain 3: Meal Operation** — specifically **Module 2: Meal Demand & Catering Order Management** (`F-OPS-01`, `F-OPS-02`).

### Operational Objectives

- Aggregate locked classroom attendance records across the entire school after the 08:30 AM cutoff (`F-OPS-01`).
- Apply an administrator-configurable safety buffer margin ($0\%\text{--}10\%$, standard default $3\%\text{--}5\%$) to compute final meal demand counts (`F-OPS-01`).
- Translate the final headcount into planned dish portion requirements according to the approved daily menu (`F-PLN-01`, `F-PLN-02`, `F-OPS-01`).
- Format and dispatch a formal electronic meal purchase order to the external Catering Vendor before the **08:45 AM Order Deadline** (`F-OPS-02`).

---

## 2. Component Diagram (C4Component)

![Component Diagram — Module 2: Meal Demand & Catering Order Management](images/Module2Components.png)

---

## 3. Component Details & Operational Responsibilities

### 3.1. Demand Controller

- **Endpoint Definitions:**
  - `GET /api/v1/demands/today`: Retrieves active demand calculation and catering order state (`draft`, `calculated`, `ordered`, `dispatched`).
  - `POST /api/v1/demands/calculate`: Aggregates confirmed attendance and calculates expected dish quantities (`F-OPS-01`).
  - `POST /api/v1/demands/dispatch-order`: Generates and transmits the formal catering purchase order (`F-OPS-02`).
  - `GET /api/v1/menus/active?date=:date`: Retrieves the approved menu and dish list for a given serving date (`F-PLN-03`).

### 3.2. Attendance Aggregation Engine

- Executes immediately upon the 08:30 AM attendance lock:
  - Aggregates verified student headcounts across all active classrooms.
  - Separates general meal counts from special dietary counts (e.g., vegetarian, gluten-free, peanut-free trays).
  - Flags any unconfirmed classrooms to prevent under-ordering.

### 3.3. Buffer Calculation Engine

- **Mathematical Formula:**
  $$
  \text{Final Demand Count} = \text{round}\Big(\text{Total Confirmed Attendance} \times (1 + \text{Buffer\%})\Big)
  $$
- *Operational Rule:*
  - Allows coordinators to fine-tune the safety buffer margin ($0\%\text{--}10\%$, default $3\%\text{--}5\%$).
  - Example: For 600 confirmed diners and a $5\%$ safety buffer:
    $$
    \text{Final Demand} = \text{round}(600 \times 1.05) = 630\text{ meals}
    $$
  - The extra 30 portions act as insurance against unexpected late arrivals, dropped trays, or extra helpings.

### 3.4. Menu Dish Quantity Calculator

- Multiplies the final demand count by the standard portion weights defined in the dish catalog:
  - *Main Entree:* $630 \times 100\text{g} = 63.0\text{ kg}$ finished braised pork.
  - *Staple (Rice):* $630 \times 120\text{g} = 75.6\text{ kg}$ steamed rice.
  - *Soup:* $630 \times 150\text{ml} = 94.5\text{ liters}$ vegetable soup.
- Stores breakdown in `meal_demand_dish_quantities`.

### 3.5. Catering Order Dispatcher

- **Timely Execution Constraint:**
  - Must execute prior to **08:45 AM** so external commercial kitchens can package and dispatch heated thermal containers.
  - Payload attributes:
    - Order ID, delivery date, target arrival time (**10:30 AM**), delivery dock location.
    - Total portion count, safety buffer count, itemized dish requirements, and allergy-safe tray specifications.
  - Records order status as `dispatched` in `catering_orders` and creates an audit snapshot.

### 3.6. Demand Repository

- Employs database row-level locking (`SELECT ... FOR UPDATE`) during recalculations to prevent race conditions during peak morning operations.
- Enforces relational consistency across `meal_schedules`, `menus`, `meal_demands`, and `catering_orders`.
