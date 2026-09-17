# Screen Hierarchy & View Structure

## 1. Structural Navigation Principles

The UI architecture adheres strictly to **Flat Information Hierarchy**:
1. **Maximum Navigation Depth $\le 2$ Levels**: Users reach their core daily view in 1 click from portal entry (`/:portal/:screen`). No deep nested sub-page mazes.
2. **Contextual Overlays for Secondary Actions (Layer 2.5)**: Actions requiring user attention or data input (e.g., absence reasons, 3-step receiving inspection, discrepancy notes, payment entries) are displayed using **Slide-Up Bottom Sheets (Mobile)** or **Modal Dialogs (Desktop)**. This prevents context switching and avoids losing screen state.
3. **Persistent Global Utility Shell**: A lightweight application bar provides instant portal switching, live countdown clocks to critical cutoffs, and session indicators.

---

## 2. Navigation Depth Hierarchy across 4 Fixed Roles

```
Level 0: Global App Shell (/)
│
├── Level 1: Portal Landing & Primary Operational Hubs
│   ├── Coordinator Hub (/coordinator/attendance)         [MGR]
│   ├── Accountant Dashboard (/accountant/dashboard)       [ACC]
│   ├── Parent Home Dashboard (/parent/dashboard)          [PAR]
│   └── Admin Academic Setup (/admin/academic)             [ADM]
│
└── Level 2: Sub-Process & Dedicated Workflow Screens
    ├── Coordinator: Attendance Monitor (/coordinator/attendance-monitor)
    ├── Coordinator: Demand & Order Dispatch (/coordinator/demand)
    ├── Coordinator: Food Receiving & Inspection (/coordinator/receiving)
    ├── Coordinator: Classroom Tray Distribution (/coordinator/distribution)
    ├── Coordinator: Post-Lunch Quantity Reconciliation (/coordinator/reconciliation)
    ├── Coordinator: Dish Catalog & Recipes (/coordinator/dishes)
    ├── Coordinator: Weekly Menu Planning (/coordinator/menus)
    ├── Coordinator: Operational Reports (/coordinator/reports)
    │
    ├── Accountant: Meal Fee Rate Setup (/accountant/fee-rates)
    ├── Accountant: Monthly Billing & Invoicing (/accountant/billing)
    ├── Accountant: Payment Collections & 3-State Track (/accountant/payments)
    ├── Accountant: Caterer Costs & Payables (/accountant/vendor-payables)
    ├── Accountant: Financial & Debt Reports (/accountant/reports)
    │
    ├── Parent: Semester Meal Registration (/parent/registration)
    ├── Parent: Allergy & Health Profile (/parent/allergies)
    ├── Parent: Daily Menu & Transparency Portal (/parent/menu-transparency)
    ├── Parent: Monthly Invoices & VietQR Pay (/parent/billing)
    │
    ├── Admin: Serving Days & Holiday Calendar (/admin/calendar)
    ├── Admin: Meal Eligibility Criteria (/admin/eligibility)
    ├── Admin: 1-Level Weekly Menu Approvals (/admin/menu-approvals)
    └── Admin: Staff Accounts & Fixed 4-Role RBAC (/admin/users)
    │
    └── Layer 2.5: Contextual Non-Destructive Modals (Zero URL Navigation)
        ├── [Modal] Absence Reason & Note Dialog
        ├── [Modal] Buffer Adjustment Drawer
        ├── [Modal] 3-Step Food Inspection & Probe Temp Form
        ├── [Modal] Delivery Discrepancy Reason Form
        ├── [Modal] Payment Receipt Entry Modal
        ├── [Modal] Student Allergy Record Modal
        └── [Modal] 1-Click Menu Approval Confirmation Prompt
```

---

## 3. Detailed Screen Breakdown by Portal

### 3.1. Semi-Boarding Coordinator Portal Hierarchy (`/coordinator`)

```
┌─────────────────────────────────────────────────────────────┐
│ Level 0: App Header (Role Selector: MGR, Cutoff Countdown)  │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Level 1: Daily Attendance & Roster Lock Screen              │
│ • Metric ribbon (Registered, Eating, Absent)                │
│ • Class switcher tab-bar (Class 1A, 1B, 2A...)              │
│ • Student card list with tactile Ăn/Vắng pills              │
│ • Orange allergy conflict chips                             │
│ • Primary CTA: "Khóa Sổ Điểm Danh" (before 08:30 AM)        │
└─────────────────────────────────────────────────────────────┘
          │                                  │
          ▼ (Click unsubmitted class)        ▼ (Post-attendance lock)
┌───────────────────────────────┐  ┌───────────────────────────────┐
│ Level 2: Attendance Monitor   │  │ Level 2: Demand & Order       │
│ • Real-time submission %      │  │ • Total attendance headcount  │
│ • 20-class visual status grid │  │ • Safety buffer stepper (0-10%)│
│ • Direct entry for late class │  │ • Dish quantities breakdown   │
│                               │  │ • CTA: "Gửi Đơn Cho Catering" │
└───────────────────────────────┘  └───────────────────────────────┘
                                                 │
                                                 ▼ (At 10:30 AM Delivery)
                                   ┌───────────────────────────────┐
                                   │ Level 2: Receiving & Quality  │
                                   │ • Insulated container count   │
                                   │ • Temp probe log (>= 65°C)    │
                                   │ • Seal & sensory check        │
                                   │ • CTA: "Ký Nhận Đạt Chuẩn"    │
                                   └───────────────────────────────┘
                                                 │
                                                 ▼ (At 11:00 AM Distribution)
                                   ┌───────────────────────────────┐
                                   │ Level 2: Tray Distribution    │
                                   │ • Classroom trolley checklist │
                                   │ • Allocated trays per class   │
                                   │ • Timestamped dispatch log    │
                                   └───────────────────────────────┘
                                                 │
                                                 ▼ (At 13:00 PM Post-Lunch)
                                   ┌───────────────────────────────┐
                                   │ Level 2: Quantity Reconcile   │
                                   │ • Ordered vs Delivered vs Used│
                                   │ • Discrepancy reason logger   │
                                   │ • Sync to Accountant payables │
                                   └───────────────────────────────┘
```

---

### 3.2. School Accountant Portal Hierarchy (`/accountant`)

```
┌─────────────────────────────────────────────────────────────┐
│ Level 0: App Header (Role Selector: ACC, Month Selector)    │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Level 1: Financial Dashboard                                │
│ • Monthly collections summary card                          │
│ • Outstanding student debt balance card                     │
│ • Catering vendor payable liability card                    │
└─────────────────────────────────────────────────────────────┘
          │                           │                     │
          ▼                           ▼                     ▼
┌─────────────────────┐    ┌─────────────────────┐   ┌─────────────────────┐
│ Level 2: Monthly    │    │ Level 2: Payment    │   │ Level 2: Caterer    │
│ Billing & Invoicing │    │ Collections         │   │ Costs & Payables    │
│ • Excused credit run│    │ • Student debt list │   │ • Reconciled counts │
│ • 35k VND/meal rate │    │ • 3-State badge     │   │ • Contract unit cost│
│ • Batch invoice CTA │    │ • Payment log modal │   │ • Monthly statement │
└─────────────────────┘    └─────────────────────┘   └─────────────────────┘
```

---

### 3.3. Student Parent Portal Hierarchy (`/parent`)

```
┌─────────────────────────────────────────────────────────────┐
│ Level 0: App Header (Child Switcher: Nam Le - Class 2A)     │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Level 1: Child Home Dashboard                               │
│ • Today's lunch status (Ăn bán trú: Đã điểm danh)           │
│ • Active allergy reminder alert                             │
│ • Current month billing balance badge                       │
└─────────────────────────────────────────────────────────────┘
          │                           │                     │
          ▼                           ▼                     ▼
┌─────────────────────┐    ┌─────────────────────┐   ┌─────────────────────┐
│ Level 2: Daily Menu │    │ Level 2: Monthly    │   │ Level 2: Allergy    │
│ & Transparency      │    │ Bill & Payment      │   │ & Health Profile    │
│ • Daily dish photos │    │ • Itemized days     │   │ • Medical allergens │
│ • 10:25 AM verified │    │ • Excused credit -2 │   │ • Clinical severity │
│ • Temp: 72°C badge  │    │ • Dynamic VietQR pay│   │ • Emergency notes   │
└─────────────────────┘    └─────────────────────┘   └─────────────────────┘
```

---

### 3.4. School Administrator Portal Hierarchy (`/admin`)

```
┌─────────────────────────────────────────────────────────────┐
│ Level 0: App Header (Role Selector: ADM, Academic Term)     │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Level 1: School Master Data Hub                             │
│ • Academic years, semesters, grades, classrooms             │
│ • Student directory and eligibility evaluator               │
└─────────────────────────────────────────────────────────────┘
          │                           │                     │
          ▼                           ▼                     ▼
┌─────────────────────┐    ┌─────────────────────┐   ┌─────────────────────┐
│ Level 2: Calendar & │    │ Level 2: Weekly     │   │ Level 2: Staff &    │
│ Holiday Config      │    │ Menu Approval       │   │ Fixed RBAC Control  │
│ • Mon-Fri serving   │    │ • 1-Level sign-off  │   │ • 4 Fixed Roles     │
│ • Holiday toggle    │    │ • Nutrition review  │   │ • Account activation│
│ • Skip non-meal days│    │ • One-click Approve │   │ • No custom runtime │
└─────────────────────┘    └─────────────────────┘   └─────────────────────┘
```

---

## 4. Modal & Dialog Hierarchy Rules

1. **Strict Zero-Stacking Rule**: Modals can never spawn child modals. If a confirmation is required, the active modal transitions state inline or replaces content smoothly.
2. **Dirty State Protection**: If a user enters text into an absence reason, temperature log, or discrepancy explanation, clicking the backdrop does not dismiss the form without a confirmation prompt.
3. **Keyboard & Touch Accessibility**:
   - `ESC` closes clean dialogs on desktop.
   - Swipe-down gesture dismisses mobile bottom sheets.
   - Focus is trapped within modal boundaries while open and returned to the trigger element on close.
