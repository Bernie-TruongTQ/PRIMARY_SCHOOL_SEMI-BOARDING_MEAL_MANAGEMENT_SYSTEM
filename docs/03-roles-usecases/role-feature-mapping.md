# Role × Feature × Use Case Mapping

This table is the **derivation evidence** showing that every use case traces back to a specific core feature, which traces back to a core domain.

| Core Domain | Core Feature ID | Feature Name | Actor | Use Case ID | Use Case Name |
|-------------|----------------|--------------|-------|-------------|---------------|
| Student Meal Management | F-STU-01 | Manage Student Meal Eligibility | ADM | UC-ADM-01 | Enroll Student in Meal Program |
| Student Meal Management | F-STU-01 | Manage Student Meal Eligibility | ADM | UC-ADM-02 | Update Student Enrollment Status |
| Student Meal Management | F-STU-02 | Register Student for Meal Session | ADM | UC-ADM-03 | Register Student for Meal Session |
| Student Meal Management | F-STU-03 | Record Daily Meal Participation | TCH | UC-TCH-01 | Record Student Attendance for Meal |
| Student Meal Management | F-STU-03 | Record Daily Meal Participation | TCH | UC-TCH-02 | Submit Attendance Before Cutoff |
| Meal Planning & Menu Management | F-MPN-01 | Design Weekly Menu | MGR | UC-MGR-01 | Create Weekly Menu |
| Meal Planning & Menu Management | F-MPN-02 | Assign Dishes & Standard Portions | MGR | UC-MGR-02 | Assign Dishes to Menu |
| Meal Planning & Menu Management | F-MPN-03 | Approve & Publish Menu | MGR | UC-MGR-03 | Approve and Publish Menu |
| Meal Planning & Menu Management | F-MPN-04 | Calculate Meal Demand Quantities | MGR | UC-MGR-04 | Review Auto-Calculated Quantities |
| Meal Planning & Menu Management | F-MPN-04 | Calculate Meal Demand Quantities | MGR | UC-MGR-05 | Override Dish Buffer Percentage |
| Meal Operation | F-MOP-01 | Determine Meal Demand (Cutoff Lock) | MGR | UC-MGR-06 | Monitor Daily Demand Status |
| Meal Operation | F-MOP-02 | Manage Post-Cutoff Change Requests | MGR | UC-MGR-07 | Approve Change Request |
| Meal Operation | F-MOP-02 | Manage Post-Cutoff Change Requests | MGR | UC-MGR-08 | Reject Change Request |
| Meal Operation | F-MOP-02 | Manage Post-Cutoff Change Requests | TCH | UC-TCH-03 | Submit Post-Cutoff Change Request |
| Meal Operation | F-MOP-03 | Record Meal Preparation | KIT | UC-KIT-01 | View Meal Preparation Plan |
| Meal Operation | F-MOP-03 | Record Meal Preparation | KIT | UC-KIT-02 | Record Prepared Quantity |
| Meal Operation | F-MOP-03 | Record Meal Preparation | KIT | UC-KIT-03 | Confirm Preparation Complete |
| Meal Operation | F-MOP-04 | Record Meal Distribution | KIT | UC-KIT-04 | View Distribution Plan |
| Meal Operation | F-MOP-04 | Record Meal Distribution | KIT | UC-KIT-05 | Record Distributed Quantity |
| Meal Operation | F-MOP-05 | Confirm Meal Handover & Reconcile | KIT | UC-KIT-06 | Confirm Meal Handover |
| Meal Operation | F-MOP-05 | Confirm Meal Handover & Reconcile | TCH | UC-TCH-04 | Acknowledge Meal Handover |
| — | System Config | System Configuration | ADM | UC-ADM-04 | Manage Meal Sessions |
| — | System Config | System Configuration | ADM | UC-ADM-05 | Manage User Accounts & Roles |
| — | System Config | System Configuration | ADM | UC-ADM-06 | Manage Dish Catalog |

---

## Role Summary

| Actor | Total Use Cases | Core Domain Coverage |
|-------|----------------|----------------------|
| ADM | 6 | Cross-cutting (config + student enrollment) |
| MGR | 8 | Meal Planning, Meal Operation |
| KIT | 6 | Meal Operation |
| TCH | 4 | Student Meal Mgmt, Meal Operation |
| STO | — | Food Safety *(Phase 1.5)* |
| **Total** | **24** | |
