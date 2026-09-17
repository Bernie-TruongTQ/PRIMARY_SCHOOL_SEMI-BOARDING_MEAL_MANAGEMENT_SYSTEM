# Business Domains — Full Decomposition

## System

**Primary School Semi-Boarding Meal Management System**
*(Scope Constraint: Dedicated **Lunch-Only** Operational Service — breakfast, afternoon snacks, and dinner are strictly out of scope).*

A system that manages the end-to-end lunch meal lifecycle for primary school semi-boarding programs: from student eligibility and lunch registration, nutritional lunch menu planning, morning demand forecasting, catering vendor coordination, lunch meal receiving and classroom distribution, through monthly lunch fee assessment, operational reporting, user access control, allergen monitoring, and master academic calendar management.

---

## Domain 1 — Student Meal Management

Manages student meal program eligibility, meal registration, and daily participation tracking.

| Sub-Domain / Capability | Functions (Level 3) | Scope Notes |
|------------------------|---------------------|-------------|
| **Student Meal Eligibility Management** | Define Meal Eligibility Criteria, Determine Student Meal Eligibility | In MVP Scope |
| **Meal Registration Management** | Register for Meals, Modify Meal Registration, Cancel Meal Registration, Record Dietary Note at Registration | In MVP Scope |
| **Meal Attendance Management** | Record Meal Attendance, Monitor Meal Attendance | In MVP Scope (attendance monitoring simplified) |

---

## Domain 2 — Meal Planning & Menu Management

Manages dishes, nutritional menu creation, and daily/weekly meal schedules.

| Sub-Domain / Capability | Functions (Level 3) | Scope Notes |
|------------------------|---------------------|-------------|
| **Dish Management** | Define Dish, Manage Dish Information | In MVP Scope |
| **Menu Management** | Create Menu, Assign Dishes to Menu, Approve Menu | In MVP Scope (single-level approval) |
| **Meal Schedule Management** | Define Meal Schedule, Assign Menu to Schedule | In MVP Scope |

---

## Domain 3 — Meal Operation

Manages the daily execution of demand forecasting, catering orders, food receiving, quality inspection, classroom distribution, and quantity reconciliation.

| Sub-Domain / Capability | Functions (Level 3) | Scope Notes |
|------------------------|---------------------|-------------|
| **Meal Demand & Quantity Management** | Determine Meal Demand, Calculate Expected Meal Quantity, Send Meal Order to Catering Vendor | In MVP Scope |
| **Meal Receiving from Vendor** | Record Delivered Quantity from Vendor, Inspect Delivered Meal Quality, Confirm Received Quantity | In MVP Scope |
| **Meal Distribution** | Record Distributed Quantity | In MVP Scope |
| **Meal Reconciliation** | Reconcile Ordered vs Delivered Quantity, Resolve Quantity Discrepancies | In MVP Scope (streamlined discrepancy handling) |

---

## Domain 4 — Meal Fee & Cost Management

Manages meal fee schedules, student charge calculations, parent payments, and catering vendor operational cost tracking.

| Sub-Domain / Capability | Functions (Level 3) | Scope Notes |
|------------------------|---------------------|-------------|
| **Meal Fee Configuration** | Define Meal Fee, Set Effective Period | In MVP Scope |
| **Meal Fee Assessment** | Determine Chargeable Meals, Calculate Meal Fees | In MVP Scope |
| **Meal Payment Management** | Record Meal Payment, Track Payment Status | In MVP Scope (simplified payment status tracking: unpaid/partial/paid) |
| **Meal Cost Management** | Record Meal Costs, Calculate Meal Cost | In MVP Scope (catering vendor cost & payable tracking) |

---

## Domain 5 — Reporting & Transparency

Provides operational dashboards, vendor reconciliation summaries, financial billing reports, and parent transparency updates.

| Sub-Domain / Capability | Functions (Level 3) | Scope Notes |
|------------------------|---------------------|-------------|
| **Operational Reporting** | Generate Daily Meal Operation Report, Generate Reconciliation Report | In MVP Scope (catering reconciliation focused) |
| **Cost & Fee Reporting** | Generate Fee Report, Generate Payment Report, Generate Cost Report | In MVP Scope (catering payables & revenue reports) |
| **Transparency Information Management** | Prepare Transparency Information, Publish Transparency Information | In MVP Scope (published menus and daily delivery verification) |

---

## Domain 6 — User & Access Management

Manages user accounts, authentication, and role-based permissions across system stakeholders.

| Sub-Domain / Capability | Functions (Level 3) | Scope Notes |
|------------------------|---------------------|-------------|
| **User Account Management** | Register User Account, Update User Information | In MVP Scope |
| **Role & Permission Management** | Define Role, Assign Permission to Role, Assign Role to User | In MVP Scope (fixed system roles: System Admin, School Accountant, Semi-Boarding Coordinator, Parent) |

---

## Domain 7 — Nutrition & Health Management

Manages student dietary restrictions, food allergies, and menu safety alerts.

| Sub-Domain / Capability | Functions (Level 3) | Scope Notes |
|------------------------|---------------------|-------------|
| **Allergy & Dietary Restriction Management** | Record Student Allergy/Dietary Restriction, Flag Restricted Ingredients in Menu, Alert on Menu-Restriction Conflict | In MVP Scope (visual conflict warnings without hard blocking) |

---

## Domain 8 — Master Data & System Configuration

Maintains institutional school structure, academic calendars, serving rules, and student profiles.

| Sub-Domain / Capability | Functions (Level 3) | Scope Notes |
|------------------------|---------------------|-------------|
| **Academic Structure Management** | Manage School Year/Semester, Manage Class & Grade Information, Manage Student Profile | In MVP Scope |
| **System Configuration Management** | Configure Lunch Serving Day, Configure Holiday/Non-Meal Day Calendar | In MVP Scope |

