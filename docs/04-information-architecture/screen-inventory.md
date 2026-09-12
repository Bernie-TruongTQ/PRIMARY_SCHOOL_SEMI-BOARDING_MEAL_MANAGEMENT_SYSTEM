# Screen Inventory

Every screen in the system is listed here with its traceability source.

| Screen ID | Screen Name | Portal | Actor | Source Use Case | Task Flow |
|-----------|-------------|--------|-------|----------------|-----------|
| SCR-ADM-01 | Student List | Admin | ADM | UC-ADM-01 | — |
| SCR-ADM-02 | Enroll Student Form | Admin | ADM | UC-ADM-01 | — |
| SCR-ADM-03 | Update Enrollment Status | Admin | ADM | UC-ADM-02 | — |
| SCR-ADM-04 | Register Student for Meal Session | Admin | ADM | UC-ADM-03 | — |
| SCR-ADM-05 | Meal Session Configuration | Admin | ADM | UC-ADM-04 | — |
| SCR-ADM-06 | User & Role Management | Admin | ADM | UC-ADM-05 | — |
| SCR-ADM-07 | Dish Catalog | Admin | ADM | UC-ADM-06 | — |
| SCR-MGR-01 | Weekly Menu List | Manager | MGR | UC-MGR-01 | TF-03 |
| SCR-MGR-02 | Create / Edit Menu | Manager | MGR | UC-MGR-01 | TF-03 |
| SCR-MGR-03 | Assign Dishes & Portions | Manager | MGR | UC-MGR-02 | TF-03 |
| SCR-MGR-04 | Approve & Publish Menu | Manager | MGR | UC-MGR-03 | TF-03 |
| SCR-MGR-05 | Daily Demand Status Board | Manager | MGR | UC-MGR-06 | TF-04 |
| SCR-MGR-06 | Review Calculated Quantities | Manager | MGR | UC-MGR-04, UC-MGR-05 | TF-04 |
| SCR-MGR-07 | Change Request List | Manager | MGR | UC-MGR-07, UC-MGR-08 | TF-02 |
| SCR-MGR-08 | Change Request Detail | Manager | MGR | UC-MGR-07, UC-MGR-08 | TF-02 |
| SCR-KIT-01 | Preparation Plan View | Kitchen | KIT | UC-KIT-01 | TF-05 |
| SCR-KIT-02 | Record Prepared Quantity | Kitchen | KIT | UC-KIT-02 | TF-05 |
| SCR-KIT-03 | Confirm Preparation Complete | Kitchen | KIT | UC-KIT-03 | TF-05 |
| SCR-KIT-04 | Distribution Plan View | Kitchen | KIT | UC-KIT-04 | TF-06 |
| SCR-KIT-05 | Record Distributed Quantity | Kitchen | KIT | UC-KIT-05 | TF-06 |
| SCR-KIT-06 | Confirm Meal Handover | Kitchen | KIT | UC-KIT-06 | TF-07 |
| SCR-TCH-01 | Class Roster — Meal Attendance | Teacher | TCH | UC-TCH-01 | TF-01 |
| SCR-TCH-02 | Submit Attendance / Lock Demand | Teacher | TCH | UC-TCH-02 | TF-01 |
| SCR-TCH-03 | Submit Change Request Form | Teacher | TCH | UC-TCH-03 | TF-02, TF-08 |
| SCR-TCH-04 | Acknowledge Meal Handover | Teacher | TCH | UC-TCH-04 | TF-07 |

---

## Prototype Coverage

The current prototype (`ui/demand.html`) covers:

| Screen ID | Screen Name | Status |
|-----------|-------------|--------|
| SCR-TCH-01 | Class Roster — Meal Attendance | ✅ Prototype |
| SCR-TCH-02 | Submit Attendance / Lock Demand | ✅ Prototype |
| SCR-MGR-06 | Review Calculated Quantities | ✅ Prototype |
| SCR-TCH-03 | Submit Change Request Form | ✅ Prototype |
| SCR-MGR-07 | Change Request List | ✅ Prototype |

**25 screens total. 5 prototyped. 20 pending design.**
