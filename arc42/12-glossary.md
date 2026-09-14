# 12. Glossary

## Overview

This section defines domain-specific, architectural, and operational terms used across the Semi-Boarding Meal Management System architecture documentation. It establishes a canonical ubiquitous language to ensure unambiguous communication between educators, kitchen culinary staff, school administrators, and software engineers.

---

## 12.1 Domain Vocabulary

| Term | Preferred Canonical Name | Definition in the Context of THIS System | Aliases / Not to be Confused With |
|:---|:---|:---|:---|
| **Semi-Boarding** | Semi-Boarding Program (*Bán trú*) | The school-managed operational service where primary school students remain on campus during midday for structured lunch catering and rest. | *Boarding* (full overnight residency, not applicable here). |
| **Morning Cutoff** | Cutoff Deadline (*Giờ chốt sổ*) | The hard temporal boundary (**08:00:00 AM**) after which classroom attendance rosters are frozen against direct teacher modifications to allow kitchen batch cooking to start. | *Class bell / Academic period start*. |
| **Buffer Margin** | Safety Buffer Margin (*Tỷ lệ đệm*) | A configurable percentage (typically 3%–5%, capped at 10%) added to net confirmed student headcounts when converting recipes into raw ingredient procurement and cooking targets. | *Food waste / Kitchen shrinkage*. |
| **Standard Ration** | Standard Meal Portion | The baseline nutritional dish portion formulated for general primary school students without dietary restrictions. | *Dietary exception portion*. |
| **Special Dietary Ration** | Special Dietary Ration | A customized meal portion prepared separately for students flagged with severe medical allergies (e.g., peanut-free, seafood-free, gluten-free, lactose-free). | *Vegetarian option*. |
| **Emergency Amendment** | Post-Cutoff Emergency Change | An auditable, manager-approved exception request submitted by a teacher after 08:00 AM for late-arriving or suddenly departing students (`F-DMD-03`). | *Pre-cutoff absence note*. |
| **Yield Reconciliation** | Finished Yield Reconciliation | The operational comparison of actual measured kilograms of cooked food weighed on kitchen scales against the theoretical recipe target ($\pm 3\%$ tolerance limit). | *Financial cost reconciliation*. |
| **3-Step Food Inspection** | 3-Step Food Safety Protocol (*Kiểm thực 3 bước*) | Mandatory Vietnamese regulatory protocol (Decision 1246/QĐ-BYT): Step 1 (Raw ingredient receiving), Step 2 (Cooking temperature check $\ge 75^\circ\text{C}$), Step 3 (Pre-serving check & 24h food retention sampling). | *General health inspection*. |
| **24-Hour Retention Sample** | Food Retention Sample (*Lưu mẫu 24h*) | Standardized, physically sealed and labeled sample jars of each cooked dish preserved in a dedicated kitchen refrigerator for 24 hours with photographic logging. | *Leftover meal storage*. |

---

## 12.2 Acronyms and Abbreviations

| Acronym | Canonical Expansion | Meaning in THIS Architecture |
|:---:|:---|:---|
| **ADM** | School Administrator | User role managing system user accounts, master recipes, and academic terms. |
| **ADR** | Architecture Decision Record | Documented record capturing the context, choice, alternatives, and consequences of significant architectural decisions. |
| **HACCP** | Hazard Analysis Critical Control Point | Systematic preventative approach to food safety biological, chemical, and physical hazards. |
| **KIT** | Kitchen Staff / Head Chef | User role executing batch cooking shifts, logging probe temperatures, and weighing finished dish yields. |
| **MGR** | Meal / Nutrition Manager | Operational owner analyzing confirmed attendance, setting buffer margins, and approving emergency post-cutoff changes. |
| **MOH** | Ministry of Health (*Bộ Y tế*) | Regulatory authority governing school collective kitchen hygiene standards (Decision 1246/QĐ-BYT). |
| **PII** | Personally Identifiable Information | Sensitive student data (names, photos, medical allergies, parental contacts). |
| **Q42** | Quality 42 Quality Model | arc42 standardized quality model categorizing architectural quality properties (`#reliable`, `#efficient`, `#safe`, etc.). |
| **RBAC** | Role-Based Access Control | Access authorization model restricting API endpoint operations according to user role permissions. |
| **SIS** | School Information System | External master authority for student identities, class enrollments, and medical allergy profiles. |
| **SPA** | Single-Page Application | Client-side web application providing teacher roll-call, manager dashboards, and kitchen kiosk views. |
| **TCH** | Homeroom Teacher | Primary classroom educator responsible for morning roll-calls and dietary exception notices. |
| **WSS** | WebSocket Secure | Encrypted real-time bi-directional transport protocol used for instantaneous alert and status event distribution. |
