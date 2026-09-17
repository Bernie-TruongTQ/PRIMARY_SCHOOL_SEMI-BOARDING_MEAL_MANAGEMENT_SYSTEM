# C4 Level 3 — Component Diagram: Domain 7 — Nutrition & Health Management

## 1. Overview

This document specifies the internal software components within the **Backend API Service** container that implement **Domain 7: Nutrition & Health Management** (`F-NUT`).

### Operational Objectives

- Record student medical food allergies (e.g., peanuts, seafood, eggs, milk, gluten) and dietary preferences (`F-NUT-01`).
- Flag restricted ingredients within the standard dish and recipe catalog (`F-NUT-02`).
- Detect recipe-allergen conflicts between scheduled menu items and registered student medical profiles, generating non-blocking visual alert badges for coordinators and teachers (`F-NUT-02`).

---

## 2. Component Diagram (C4Component)

![Component Diagram — Domain 7: Nutrition & Health Management](images/Module7Components.png)

---

## 3. Component Details & Operational Responsibilities

### 3.1. Nutrition & Allergy Controller

- **Endpoint Definitions:**
  - `GET /api/v1/students/:studentId/allergies`: Retrieves declared allergies for a child (`F-NUT-01`).
  - `POST /api/v1/students/:studentId/allergies`: Records a new medical allergy or dietary restriction (`F-NUT-01`).
  - `GET /api/v1/nutrition/conflicts/today`: Evaluates scheduled menu dishes against confirmed student attendees (`F-NUT-02`).
  - `POST /api/v1/dishes/:dishId/ingredients/flag`: Associates specific allergen categories with a dish (`F-NUT-02`).

### 3.2. Allergy Profile Service

- Manages standardized medical allergen taxonomy:
  - Common allergens: `PEANUT`, `TREE_NUT`, `SEAFOOD`, `SHELLFISH`, `EGG`, `COW_MILK`, `SOY`, `WHEAT/GLUTEN`.
  - Dietary restrictions: `NO_BEEF`, `NO_PORK`, `VEGETARIAN`.
- Captures medical severity rating: `MILD`, `MODERATE`, `SEVERE_ANAPHYLAXIS`.

### 3.3. Ingredient Restriction Scanner

- Scans recipe compositions in Domain 2 (`dishes`, `ingredients`):
  - Example: If a dish contains *Peanut Oil* or *Crushed Peanuts*, the dish is tagged with `CONTAINS_PEANUT`.
  - Flags visible allergen chips on the dish catalog screen.

### 3.4. Menu-Restriction Conflict Alert Engine

- **Non-blocking Visual Warning Policy (MVP Scope):**
  - When the Coordinator opens the morning attendance roster or demand screen, the engine scans:
    $$
    \text{Conflict Alert} = \exists \text{ Student Diner with Allergy } A \land \text{ Menu Dish containing } A
    $$
  - Renders a prominent orange warning chip next to the student's name on the classroom roster:
    `[⚠️ DỊ ỨNG LẠC: ĐỔI SUẤT ĂN RIÊNG]`
  - Ensures special separate trays (without allergens) are reserved and clearly labeled on the catering order.
