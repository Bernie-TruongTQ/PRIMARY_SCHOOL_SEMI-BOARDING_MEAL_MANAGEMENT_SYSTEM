# 12. Glossary

## Overview

This section defines domain-specific, architectural, and operational terms used across the Semi-Boarding Meal Management System architecture documentation. It establishes a canonical ubiquitous language to ensure unambiguous communication between educators, coordinators, accountants, parents, school administrators, catering vendor representatives, and software engineers.

---

## 12.1 Domain Vocabulary

| Term | Preferred Canonical Name | Definition in the Context of THIS System | Aliases / Not to be Confused With |
|:---|:---|:---|:---|
| **Semi-Boarding** | Semi-Boarding Program (*Bán trú*) | The school-managed operational service where primary school students remain on campus during midday for structured lunch catering and rest. | *Boarding* (full overnight residency, not applicable here). |
| **Morning Cutoff** | Cutoff Deadline (*Giờ chốt sổ điểm danh*) | The hard temporal boundary (**08:30:00 AM**) after which classroom attendance rosters are frozen against direct teacher modifications to allow catering orders to be dispatched. | *Class bell / Academic period start*. |
| **Order Dispatch Deadline** | Catering Order Deadline (*Giờ gửi đơn*) | The operational deadline (**08:45:00 AM**) by which the Coordinator must transmit the formal electronic lunch purchase order to the external Catering Vendor. | *Morning Cutoff (08:30 AM)*. |
| **Buffer Margin** | Safety Buffer Margin (*Tỷ lệ đệm*) | A configurable percentage ($0\%\text{--}10\%$, default 3%–5%) added to net confirmed student headcounts when calculating catering purchase order quantities. | *Food waste / Kitchen shrinkage*. |
| **Standard Ration** | Standard Meal Portion | The baseline nutritional lunch portion formulated for general primary school students without dietary restrictions. | *Special dietary portion*. |
| **Special Dietary Ration** | Special Dietary Ration | A customized meal portion prepared separately for students flagged with severe medical allergies (e.g., peanut-free, seafood-free, gluten-free, lactose-free) or vegetarian diets. | *Vegetarian option only*. |
| **3-Step Food Inspection** | 3-Step Food Safety Protocol (*Kiểm thực 3 bước*) | Mandatory Vietnamese regulatory protocol (Decision 1246/QĐ-BYT): Step 1 (Dock receiving & core temp check $\ge 65^\circ\text{C}$), Step 2 (Pre-serving seal & sensory check), Step 3 (Classroom distribution & 24h food retention sampling). | *General health inspection*. |
| **24-Hour Retention Sample** | Food Retention Sample (*Lưu mẫu thức ăn 24h*) | Standardized, physically sealed and labeled sample jars of each delivered dish preserved in a dedicated refrigerator for 24 hours with photographic logging. | *Leftover meal storage*. |
| **3-Way Quantity Reconciliation** | Post-Lunch Reconciliation (*Đối soát 3 bên*) | The daily 13:00 PM operational comparison between Ordered Portions vs. Delivered Portions vs. Consumed Portions, logging variance reasons and updating the vendor payable ledger. | *Monthly financial ledger audit*. |
| **VietQR Dynamic Payment** | Dynamic VietQR (*Thanh toán VietQR động*) | Automated bank transfer QR code embedding the student invoice reference number and exact payable amount for instantaneous webhook reconciliation. | *Static banking QR sticker*. |

---

## 12.2 Acronyms and Abbreviations

| Acronym | Canonical Expansion | Meaning in THIS Architecture |
|:---:|:---|:---|
| **ACC** | School Accountant | User role managing meal fee schedules, monthly student billing, VietQR payment tracking, and catering vendor payables. |
| **ADM** | School Administrator | User role managing academic structures, terms, classes, serving calendars, 1-level menu approvals, and staff user accounts. |
| **ADR** | Architecture Decision Record | Documented record capturing the context, choice, alternatives, and consequences of significant architectural decisions. |
| **HACCP** | Hazard Analysis Critical Control Point | Systematic preventative approach to food safety biological, chemical, and physical hazards. |
| **MGR** | Semi-Boarding Coordinator | Operational lead overseeing daily lunch attendance, demand aggregation, catering order dispatch, receiving inspection, and reconciliation. |
| **MOH** | Ministry of Health (*Bộ Y tế*) | Regulatory authority governing school collective kitchen hygiene standards (Decision 1246/QĐ-BYT). |
| **PAR** | Parent / Guardian | Service beneficiary registering students for boarding, declaring medical allergies, inspecting daily menus, and paying invoices. |
| **PII** | Personally Identifiable Information | Sensitive student data (names, photos, medical allergies, parental contacts). |
| **Q42** | Quality 42 Quality Model | arc42 standardized quality model categorizing architectural quality properties (`#reliable`, `#efficient`, `#safe`, etc.). |
| **RBAC** | Role-Based Access Control | Access authorization model restricting API endpoint operations according to fixed user role permissions (`MGR`, `ACC`, `PAR`, `ADM`). |
| **SIS** | School Information System | External master authority for student identities, class enrollments, and medical allergy profiles. |
| **SPA** | Single-Page Application | Client-side web application structured into 4 autonomous role portals. |
| **WSS** | WebSocket Secure | Encrypted real-time bi-directional transport protocol used for instantaneous alert and status event distribution. |
