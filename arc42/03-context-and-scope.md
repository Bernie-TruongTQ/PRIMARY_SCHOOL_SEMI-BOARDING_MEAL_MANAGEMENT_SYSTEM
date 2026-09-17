# 3. Context and Scope

## 3.1 Business Context

The **Primary School Semi-Boarding Meal Management System** operates as the central operational platform connecting school classrooms, semi-boarding coordination, financial accounting, parents, and external catering vendors. It defines the exact boundaries of automated lunch attendance, catering purchase order generation, dock food inspection, classroom trolley distribution, fee assessment, and parental transparency.

### Business Context Diagram

```mermaid
C4Context
    title System Context Diagram — Semi-Boarding Meal Management System

    Person(mgr, "Semi-Boarding Coordinator", "MGR — Oversees daily lunch attendance, demand aggregation, catering orders, food receiving inspection, classroom distribution, and discrepancy reconciliation")
    Person(acc, "School Accountant", "ACC — Configures meal fee rates, calculates monthly student chargeable meals, tracks parent fee collections, and reconciles catering vendor payables")
    Person(par, "Parent / Guardian", "PAR — Registers student boarding participation, declares medical food allergies, inspects daily published menus, and pays monthly invoices")
    Person(adm, "School Administrator", "ADM — Manages academic years, grade/class structures, meal eligibility policies, serving calendars, menu approvals, and staff user accounts")

    System(system, "Semi-Boarding Meal Management System", "Central platform governing lunch demand calculation, vendor purchase order dispatch, temperature/safety inspection, classroom distribution, billing, and parent transparency")

    System_Ext(sis, "School Information System (SIS)", "Master source for student identities, class rosters, and medical allergen profiles")
    System_Ext(caterer, "Catering Vendor Order Gateway", "External platform used by licensed catering partners to receive daily meal purchase orders by 08:45 AM and coordinate hot-delivery logistics")
    System_Ext(payment, "Banking / Payment Gateway (VietQR)", "VietQR / Napas electronic payment network facilitating automated reconciliation of monthly meal fee payments from parents")
    System_Ext(notifications, "Parent Notification Gateway", "Multi-channel notification service (SMS / Zalo / Push) broadcasting roster confirmations, food safety verification badges, and payment invoices")

    Rel(mgr, system, "Records attendance, calculates demand, dispatches orders, logs receiving & reconciliation", "HTTPS / Web SPA")
    Rel(acc, system, "Manages fee schedules, calculates billing, tracks payments, audits vendor payables", "HTTPS / Web SPA")
    Rel(par, system, "Registers participation, declares allergies, reviews daily menus, views bills", "HTTPS / Mobile Web SPA")
    Rel(adm, system, "Configures academic structures, calendars, reviews weekly menus, manages users", "HTTPS / Web SPA")

    Rel(system, sis, "Synchronizes student rosters, class enrollments, and medical allergy notes [IF-01]", "HTTPS / REST")
    Rel(system, caterer, "Transmits daily lunch purchase orders, portion counts, and delivery deadlines [IF-02]", "HTTPS / REST / Webhook")
    Rel(system, payment, "Generates dynamic VietQR payment payloads and receives transaction webhooks [IF-03]", "HTTPS / REST / Webhook")
    Rel(system, notifications, "Dispatches attendance alerts, daily inspection badges, and billing receipts [IF-04]", "HTTPS / REST")
```

### Business External Interfaces

| Interface ID | Partner Entity | What Goes In (To System) | What Goes Out (From System) | Operational Cadence |
|:---:|:---|:---|:---|:---:|
| **IF-01** | **School Information System (SIS)** | Student enrollments, classroom assignments, active academic term calendar, and medical dietary restrictions (peanut, seafood, lactose, gluten). | Daily student meal attendance status confirmation (Present, Absent, Excused). | Synchronized nightly at 00:00 + on-demand classroom change webhooks. |
| **IF-02** | **Catering Vendor Order Gateway** | Order receipt acknowledgments, delivery vehicle dispatch metadata, driver contact, and arrival confirmation. | Formal electronic lunch purchase orders specifying confirmed diner counts, buffer margins, portion breakdown, and 10:30 AM arrival deadline. | Transmitted daily between 08:30 AM and 08:45 AM. |
| **IF-03** | **Banking / Payment Gateway (VietQR / Napas)** | Asynchronous payment execution webhooks (transaction reference, amount, paid timestamp, invoice ID). | Dynamic VietQR payment requests embedded with invoice identifier and exact amount. | Real-time on parent invoice viewing & webhook callback settlement. |
| **IF-04** | **Parent Notification Gateway** | Delivery receipts and SMS/push delivery status acknowledgments. | Event-driven parent alerts: morning attendance confirmation, published daily menu & food inspection badge, monthly billing statements. | Real-time push / Zalo ZNS / SMS triggered upon operational events. |

---

## 3.2 Technical Context

The technical context specifies the network boundaries, communication protocols, data encodings, and security mechanisms connecting the Semi-Boarding Meal Management System with its external environment.

| Interface ID | Channel / Medium | Protocol | Data Format | Authentication & Security |
|:---:|:---|:---|:---|:---|
| **IF-USER** | Public/Campus Intranet | HTTPS (TLS 1.3) + WSS | HTML5, JSON, WebSockets | Session Cookie + JWT Bearer, Role-Based Access Control (RBAC). |
| **IF-01 (SIS)** | Campus VPN / Private Subnet | HTTPS REST | JSON (OpenAPI 3.0) | Mutual TLS (mTLS) + API Gateway Service Token. |
| **IF-02 (Caterer)** | Public Internet / Partner VPN | HTTPS REST / Webhook | JSON (Idempotent Event Payload) | Bearer Token + HMAC-SHA256 Payload Signature. |
| **IF-03 (Payment)** | Public Internet (Banking Network) | HTTPS REST / Webhook | JSON | OAuth 2.0 / API Secret + SHA256 Signature Verification. |
| **IF-04 (Notifications)** | Public Internet | HTTPS REST | JSON | API Key + Client Credentials with upstream SMS/Push Provider. |

---

## 3.3 Scope & Boundaries (What is OUT of Scope)

To maintain architectural focus and prevent scope creep, the following domains are strictly excluded from this system's responsibility boundary:

- **Raw Ingredient Procurement & Cooking Operations:** The school does not purchase raw bulk meat/produce or manage kitchen cooking cauldrons; food preparation is entirely performed by the contracted Catering Vendor.
- **Breakfast, Afternoon Snacks, and Dinners:** The system exclusively governs the midday lunch program on standard school days (Monday–Friday).
- **Tuition & Non-Meal School Fees:** Academic tuition, facility maintenance, and extracurricular activity billing remain strictly in the primary School Accounting / ERP system.
- **General Academic Attendance:** Morning campus gate check-in and academic subject period attendance belong strictly to the School Information System (SIS).
