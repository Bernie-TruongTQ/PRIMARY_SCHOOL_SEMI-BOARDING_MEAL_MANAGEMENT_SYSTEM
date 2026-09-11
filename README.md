# Primary School Semi-Boarding Meal Management System
### Meal Operation Module

A web application designed for primary school semi-boarding meal management, streamlining daily meal execution across three key user personas: **Kitchen Staff**, **Homeroom Teachers**, and **Boarding Supervisors**.

---

## 🌟 Overview of the "Meal Operation" Module

The web application UI adopts a modern **Education & F&B SaaS aesthetic**, adhering to **Material Design 3 (MD3)** principles. It features a warm, appetite-friendly color palette (sunlit apricot/terracotta `#E05318`, fresh herb green `#16A34A`, set against clean warm neutrals `#F8FAFC`), standard 12px rounded cards, and seamless viewport switching between the **default Desktop / Tablet Dashboard** and an authentic **Mobile App (390px)** layout with a persistent bottom navigation bar.

---

## 📱 The 5 Core Operational Screens

### 1. Meal Demand Dashboard
- **Date & Meal Session Selector:** Switch between **Breakfast**, **Lunch**, and **Snack** sessions.
- **Top Summary Metric Cards:**
  - *Registered Students (420):* Baseline registration count snapshot.
  - *Confirmed Attend (408):* Real-time confirmed student attendance.
  - *Reported Absent (16):* Excused absences excluded from billing and meal prep.
  - *Extra Guests (4):* Additional portions allocated for supervising teachers and monitors.
- **Real-Time Cutoff Status Badge:** Real-time indicator displaying `Open for changes` with countdown vs `Locked` after the cutoff time.
- **Expandable Class Accordion Cards:** Overview of attendance ratios for Grades 1 through 5 (e.g., Class 1A, Class 2A). Expanding each card displays individual student absence reasons and medical/dietary notices (*⚠️ Peanut allergy, lactose sensitive*).
- **Floating Action Button (FAB) "Report Change":** Quickly submit attendance changes or extra guest requests with live summary updates.

### 2. Expected Meal Quantity
- **Summary Banner:** Highlights total planned headcount (412 portions), standard safety shrinkage buffer (+5%), and calculation status.
- **Standard Scaled Recipe Table:**
  - *Steamed Fragrant Jasmine Rice:* 160g / portion $\rightarrow$ 69.2 kg cooked.
  - *Caramelized Braised Salmon & Pork Balls:* 95g / portion $\rightarrow$ 41.1 kg.
  - *Kabocha Pumpkin & Minced Pork Broth:* 220ml / portion $\rightarrow$ 95.2 liters.
  - *Stir-fried Sweet Bok Choy & Straw Mushrooms:* 85g / portion $\rightarrow$ 36.8 kg.
  - *Fresh Cavendish Banana & Probiotic Yogurt:* 1 set / portion $\rightarrow$ 433 portions.
- **"Recalculate" Button:** Automatically updates raw ingredient quantities upon student headcount adjustments.
- **Calculation Status Badge:** Clearly indicates whether portions are `Auto-calculated` or `Manually adjusted` by kitchen management.

### 3. Meal Preparation Kanban
- **Overall Preparation Progress Header:** Displays real-time completion percentage (68%), preparation start timestamp (08:45 AM), and expected ready time (10:45 AM).
- **3-Stage Kanban Board:**
  - ⏳ *To Prepare:* Cold prep and fruit sorting (Desserts).
  - 🔥 *In Progress:* Active cooking and simmering with internal temperature monitoring (Proteins, Vegetables).
  - ✅ *Ready & Packaged:* Inspected and stored in hot-holding thermal cabinets (Rice, Soups).
- **Dish Kanban Cards:** Displays portion counts, assigned chef avatar, active step, and single-click stage advancement buttons (`Start Cooking →`, `Mark Ready ✓`).

### 4. Meal Distribution & Handover
- **Search & Filter Bar:** Instant search by class name or teacher name, plus quick Grade filter chips (*All Grades*, *Grade 1* through *Grade 5*).
- **Delivery Status Badges:** Color-coded stages for `Pending Dispatch` (amber), `Delivered` (blue), and `Confirmed Received` (green).
- **Expandable Handover Receipts:**
  - Quantity of trays delivered.
  - Departure timestamp from kitchen.
  - Dispatching kitchen staff & receiving homeroom teacher.
  - Special dietary / allergen safety notes.
- **Quick Handover Actions:** One-click `Mark as Delivered →` and `Confirm Receipt ✓` actions with instant timestamping.

### 5. Meal Reconciliation
- **Accuracy Donut Chart:** Interactive SVG visualization showing 98.1% reconciliation accuracy and 1.9% surplus/variance.
- **Comparison Table:** Comprehensive audit matrix of *Planned Quantity* vs *Actual Prepared* vs *Actual Consumed* vs *Leftover / Shortage*, with color-coded variance tags.
- **Supervisor & Kitchen Notes Log:** Real-time log for kitchen leads and supervisors to note student appetite feedback and document leftover repurposing.
- **"Export Report" Action:** Generate a print-ready modal summary and download daily reconciliation reports for administrative audit.

---

## 📁 Repository Structure

```
Top-Down-Approach/
├── database/
│   ├── PRIMARY SCHOOL SEMI-BOARDING MEAL MANAGEMENT SYSTEM.sql   # PostgreSQL schema & DDL definitions
│   └── PRIMARY SCHOOL SEMI-BOARDING MEAL MANAGEMENT SYSTEM.png   # Entity Relationship Diagram (ERD)
├── ui/
│   ├── index.html          # Main HTML structure with 5 screens, modals, and navigation
│   ├── css/
│   │   ├── style.css       # Material Design 3 tokens, appetite palette, layout & viewport modes
│   │   └── screens.css     # Dedicated styling for cards, tables, Kanban, handover, & reconciliation
│   └── js/
│       ├── mockData.js     # Mock dataset grounded in database schema
│       └── app.js          # Navigation, reactive formulas, role switching, & interactions
├── taste-SKILL.md          # UI/UX design guidelines and standards
└── README.md
```

---

## 🚀 Getting Started & Testing

Start a lightweight HTTP server in the repository root:

```bash
python -m http.server 8080 --directory ui
```

Open your browser and navigate to:
👉 **`http://localhost:8080`**

### User Experience Highlights:
- **Default Viewport:** The application defaults to the spacious **Desktop / Tablet Dashboard**. You can switch to the **Mobile (390px)** frame using the toolbar toggle at the top of the screen.
- **Role Switching:** Test different persona perspectives (**Kitchen Staff**, **Homeroom Teacher**, or **Boarding Supervisor**) via the role switcher button in the top app bar.
- **Interactive Workflows:** Try reporting an absence via the FAB button, moving dishes across the preparation Kanban columns, marking classroom deliveries, and logging reconciliation notes.
