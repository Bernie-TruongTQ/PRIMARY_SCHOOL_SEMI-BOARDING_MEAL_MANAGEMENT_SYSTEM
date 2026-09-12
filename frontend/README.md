# Interactive Frontend Prototype

> **Hoa Sen Elementary Dining Operations Platform**  
> A zero-dependency, pure client-side web application implementing the 3 core operational modules (Participation, Demand, Preparation) with real-time cross-role data synchronization.

---

## Overview & Architecture

The frontend prototype serves as an interactive reference implementation of the specifications defined in [Phase 04 (Information Architecture)](../docs/04-information-architecture/README.md) and [Phase 05 (UI/UX Design)](../docs/05-ui-ux/README.md).

It is built completely with **Vanilla Web Technologies** (pure HTML5, CSS3 Custom Properties, and modern ES6 JavaScript) — requiring no Node.js runtime, build pipelines, or third-party bundle dependencies.

```
frontend/
├── index.html                    ← Unified application shell & portal switcher
│
├── css/                          ← Modular Vanilla CSS Architecture
│   ├── style.css                 ← Core design tokens, color palette, typography & reset
│   ├── layout.css                ← App bar, navigation tabs, viewport simulator container
│   ├── teacher.css               ← Mobile-first roster cards, status pills, audit logs
│   ├── manager.css               ← Data-dense analytical dashboard, portion tables, modal styles
│   ├── kitchen.css               ← High-contrast kiosk layouts, station timers, large cards
│   ├── screens.css               ← Additional modal dialogs and alert banners
│   └── demand.css                ← Specialized demand workflow utilities
│
└── js/                           ← Modular Client-Side JavaScript Architecture
    ├── app.js                    ← App bootstrapping, portal tab switching & global actions
    ├── state.js                  ← Centralized reactive state store & localStorage persistence
    ├── mockData.js               ← Canonical seed dataset (students, dishes, menus, schedules)
    ├── teacher.js                ← Teacher Module (SCR-TCH-01, SCR-TCH-02, SCR-TCH-03, SCR-TCH-04)
    ├── manager.js                ← Manager Module (SCR-MGR-01, SCR-MGR-02, SCR-MGR-03, SCR-MGR-04, SCR-MGR-05)
    ├── kitchen.js                ← Kitchen Kiosk Module (SCR-KIT-01, SCR-KIT-02, SCR-KIT-03, SCR-KIT-04)
    ├── demandApp.js              ← Standalone demand calculation engine
    └── demandData.js             ← Baseline portion standards & recipe multipliers
```

---

## Technology Stack

1. **Semantic HTML5:** Clean accessible markup utilizing semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`).
2. **Vanilla CSS Design System:**
   - Color variables mapped to institutional branding (Emerald primary, Amber warning, Crimson danger, Slate neutral).
   - Fluid typography based on the Google Fonts *Inter* typeface.
   - Component-isolated stylesheets for each operational portal.
3. **Vanilla ES6+ JavaScript:**
   - Single-source-of-truth state container (`window.state`) with custom pub/sub event emitters.
   - Automatic local storage serialization (`localStorage.getItem('hs_dining_state')`).
   - Pure DOM manipulation with zero virtual DOM overhead.

---

## Key Capabilities

### 1. Dynamic Viewport Simulator (Mobile vs. Desktop)
At the top of the interface, a persistent viewport control bar allows instant toggling between:
- **Mobile Mode (390px container):** Simulates a smartphone viewport used by teachers in classrooms.
- **Desktop / Tablet Mode (100% fluid):** Simulates wide management workstation monitors or kitchen wall-mounted kiosks.

### 2. Role-Based Portal Switcher
Users can seamlessly switch between all 3 personas using the top navigation bar without reloading:
- **Homeroom Teacher Portal (Module 1):** Attendance tracking, food allergy notices, daily cutoff countdown, and roster locking.
- **Meal / Nutrition Manager Portal (Modules 2 & 3):** Live aggregation of class rosters, automated demand forecasting, recipe buffer configuration, emergency change approval, and final daily sign-off.
- **Kitchen Kiosk Portal (Module 3):** Industrial wall-mount dashboard, ingredient receiving checklist, real-time station cooking timers, and finished weight verification.

### 3. Reactive State Synchronization & Reset
- Actions performed in one portal immediately update the underlying state and reflect in other portals (e.g., locking Class 1A's attendance updates the Manager's live demand count and scales the Kitchen's cooking portion targets).
- A global **"↺ Khôi phục Dữ liệu" (Reset Data)** button resets `localStorage` back to pristine initial demonstration records.

---

## Quick Start & Running Locally

Because the prototype consists entirely of static HTML, CSS, and JS files, it can be served with any HTTP file server:

### Using Python (Recommended)
```bash
# Navigate to repository root
cd d:\WORKSPACE\Top-Down-Approach

# Start local server serving the frontend directory
python -m http.server 8080 --directory frontend
```

### Using Node / npx
```bash
npx serve frontend -p 8080
```

### Accessing the Application
Open your browser and navigate to:
**`http://localhost:8080/index.html`**

---

## Suggested Demo Walkthrough

To experience the full end-to-end operational lifecycle:

1. **Step 1 (Teacher Portal):**
   - Switch to **Giáo Viên (M1)**.
   - Inspect Class 1A students. Toggle student `#3 Lê Minh Khôi` to *Nghỉ có phép (Excused Absence)*.
   - Notice allergy warnings on `#2 Trần Phương Linh` (Peanuts) and `#4 Phạm Quỳnh Chi` (Seafood).
   - Click **Chốt Sổ Sĩ Số (SCR-TCH-03)** to lock Class 1A.
2. **Step 2 (Manager Portal):**
   - Switch to **Quản Lý Bếp (M2 & M3)**.
   - View **Xác Định Nhu Cầu (SCR-MGR-01)**: observe the progress bar showing confirmed classes and the calculated final demand.
   - Switch to **Định Lượng Món Ăn (SCR-MGR-02)**: examine how dish portions automatically recalculate. Adjust the manual override for *Thịt lợn kho trứng cút*.
   - Review pending emergency requests under **Yêu Cầu Khẩn Cấp (SCR-MGR-03)** and click **Phê Duyệt (+1)**.
3. **Step 3 (Kitchen Kiosk):**
   - Switch to **Kiosk Nhà Bếp (M3)**.
   - View **Bảng Kiosk Ca Bếp (SCR-KIT-01)**: notice updated portion quotas.
   - Navigate to **Trạm Nấu & Mẻ Nấu (SCR-KIT-03)**: observe active countdown timers for active cooking batches.
   - Navigate to **Cân Nghiệm Thu (SCR-KIT-04)**: verify scale weights against planned targets and review variance percentages.
