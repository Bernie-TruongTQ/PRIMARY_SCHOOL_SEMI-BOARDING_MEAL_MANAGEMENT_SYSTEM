# Information Architecture: Primary School Semi-Boarding Meal Management System

## 1. Site Map

A hierarchical map of every page and view organized strictly across the **4 Autonomous Portals** corresponding to the **Fixed 4-Role RBAC Model** (`MGR`, `ACC`, `PAR`, `ADM`) defined in [Phase 01 — MVP Baseline](../01-top-down/MVP.md), [Phase 02 — Core Features Breakdown](../02-core-features/core-feature-breakdown.md), and [Phase 03 — Roles & Use Cases](../03-roles-usecases/README.md).

> [!IMPORTANT]
> **Operational Scope & Context:**
> - **Lunch-Only Scope**: The system strictly operates for daily lunch service on standard school days (Mon–Fri). Breakfast, afternoon snacks, and dinner are out of scope.
> - **External Catering Vendor Workflow**: Meals are prepared by a licensed catering vendor and delivered hot to school. The school team manages demand, dispatches orders, inspects delivery, distributes trays, and reconciles counts (no internal kitchen cooking batches/burners).

```
- Global Entry /
  - Authentication & Role Landing /login
- Semi-Boarding Coordinator Portal /coordinator (MGR)
  - Daily Attendance & Roster Lock /coordinator/attendance
    - Filter: ?class_id=:classId&date=:date
    - Absence Reason Context Modal (Layer 2.5)
  - Classroom Attendance Monitor /coordinator/attendance-monitor
  - Lunch Demand Aggregation & Order Dispatch /coordinator/demand
    - Buffer Configuration Drawer (Layer 2.5)
    - Vendor Purchase Order Preview /coordinator/demand/order
  - Food Receiving & 3-Step Safety Inspection /coordinator/receiving
    - Inspection Sheet (Temp >= 65°C, Seals, Sensory) (Layer 2.5)
  - Classroom Tray Distribution Logging /coordinator/distribution
  - Post-Lunch Quantity Reconciliation & Discrepancies /coordinator/reconciliation
    - Discrepancy Adjustment Modal (Layer 2.5)
  - Dish & Recipe Nutritional Catalog /coordinator/dishes
    - Dish Detail & Allergen Linkage /coordinator/dishes/:dishId
  - Weekly Menu Planning & Submission /coordinator/menus
    - Menu Composer & Nutrient Summary /coordinator/menus/:menuId
    - Serving Calendar Assignment /coordinator/menus/schedule
  - Daily Operational Reports /coordinator/reports
- School Accountant Portal /accountant (ACC)
  - Financial Dashboard & Overview /accountant/dashboard
  - Meal Fee Schedule Configuration /accountant/fee-rates
    - Fee Rate Detail & Validity Period /accountant/fee-rates/:configId
  - Monthly Chargeable Meal Assessment & Invoicing /accountant/billing
    - Batch Calculation Wizard /accountant/billing/generate
    - Student Invoice Detail & Absence Credits /accountant/billing/:invoiceId
  - Meal Fee Payment Collections & 3-State Tracking /accountant/payments
    - Payment Entry Modal (Layer 2.5)
  - Catering Vendor Cost Tracking & Payables /accountant/vendor-payables
    - Reconciliation Batch Accrual /accountant/vendor-payables/:orderId
  - Financial & Debt Aging Reports /accountant/reports
- Parent Portal /parent (PAR)
  - Home & Child Daily Dashboard /parent/dashboard
  - Semester Meal Program Registration /parent/registration
    - Registration Form & Dietary Preferences /parent/registration/apply
  - Child Medical Allergy & Health Profile /parent/allergies
    - Add/Edit Allergy Modal (Layer 2.5)
  - Daily Lunch Menu & Delivery Transparency /parent/menu-transparency
    - Daily Inspection Badge & Nutrition /parent/menu-transparency/:date
  - Monthly Meal Invoices & Electronic Receipts /parent/billing
    - Invoice Detail & Bank Transfer QR Code /parent/billing/:invoiceId
- School Administrator Portal /admin (ADM)
  - School Setup & Academic Hierarchy /admin/academic
    - School Years & Semesters /admin/academic/terms
    - Grades & Classrooms /admin/academic/classes
    - Student Directory & Profiles /admin/academic/students
  - Meal Program Eligibility Criteria /admin/eligibility
  - Serving Days & Institutional Holiday Calendar /admin/calendar
  - Weekly Menu Approval Hub (1-Level Review) /admin/menu-approvals
    - Menu Review & Approval Sheet /admin/menu-approvals/:menuId
  - Staff & Parent User Accounts /admin/users
    - User Account Detail & Fixed Role Assignment /admin/users/:userId
```

---

## 2. Navigation Model

### Primary Navigation
- **Portal Switcher / Top Header**: Persistent header displaying system branding, authenticated user identity, assigned role badge (`Quản Trị Viên`, `Kế Toán`, `Phụ Trách Bán Trú`, `Phụ Huynh`), and session cutoff indicators.
- **Role-Based Primary Navbars**:
  - **MGR Portal Navbar**: Horizontal analytical and operational tabs:
    `[Điểm Danh & Khóa Sổ]` | `[Giám Sát Tiến Độ]` | `[Nhu Cầu & Đặt Suất]` | `[Nhận & Kiểm Nghiệm]` | `[Chia Suất Về Lớp]` | `[Đối Soát Sản Lượng]` | `[Thực Đơn & Món Ăn]` | `[Báo Cáo Vận Hành]`
  - **ACC Portal Navbar**: Financial management tabs:
    `[Tổng Quan Tài Chính]` | `[Biểu Phí Suất Ăn]` | `[Tính Phí & Phát Hành Hóa Đơn]` | `[Thu Phí & Công Nợ]` | `[Chi Phí & Công Nợ Catering]` | `[Báo Cáo Kế Toán]`
  - **PAR Portal Navbar**: Mobile-first parent tabs (bottom tab-bar on mobile, top bar on desktop):
    `[Trang Chủ]` | `[Đăng Ký Ăn]` | `[Hồ Sơ Dị Ứng]` | `[Thực Đơn & Minh Bạch]` | `[Hóa Đơn & Thanh Toán]`
  - **ADM Portal Navbar**: Master administration tabs:
    `[Cơ Cấu Năm Học]` | `[Tiêu Chuẩn Xét Duyệt]` | `[Lịch Ăn & Ngày Nghỉ]` | `[Duyệt Thực Đơn]` | `[Tài Khoản & Phân Quyền]`

### Secondary Navigation
- **Classroom Selector Ribbon** (`/coordinator/attendance`, `/coordinator/distribution`): Horizontal scroll chip list (`Lớp 1A`, `Lớp 1B`, `Lớp 2A`...) allowing rapid switching between classrooms.
- **Academic Term & Month Selector** (`/accountant/billing`, `/accountant/reports`): Dropdown filter by School Year (e.g. `2026-2027`), Semester (`HK1`), and Billing Month.
- **Child Selector Switcher** (`/parent/*`): Pill switcher for parents having multiple children enrolled in the school.

### Utility Navigation
- **Cutoff Countdown Banner**: Persistent dynamic notification pill in the operational portal:
  - `08:30 AM Cutoff`: Classroom attendance lock deadline.
  - `08:45 AM Cutoff`: Vendor purchase order dispatch deadline.
  - `10:30 AM Checkpoint`: Food receiving and temperature verification window.
  - `11:00 AM Checkpoint`: Classroom trolley distribution start.
  - `13:00 PM Checkpoint`: Post-lunch quantity reconciliation.
- **User Account & Session Controls**: Quick links to user profile, password change, and logout.

### Mobile & Responsive Navigation
- **Mobile Thumb Zone**: On mobile viewports (e.g., Parent portal or Coordinator inspecting docking bay on phone/tablet), critical actions (Attendance switch, Receiving Pass/Fail, Pay bill) are anchored in the lower 60% of the screen.
- **Contextual Slide-Up Bottom Sheets (Layer 2.5)**: Secondary interactions (entering absence reasons, logging food temperature, adding an allergy) slide up from the bottom edge without losing underlying page state.

---

## 3. Content Hierarchy

### Screen: Daily Attendance & Roster Lock (`/coordinator/attendance`)
1. **Cutoff Timer & Class Progress Ribbon** — Highest priority: Displays remaining time to 08:30 AM and live headcount (`Sĩ số: 32 | Ăn: 30 | Vắng: 2`).
2. **Classroom Roster Card List** — Core operational view: Alphabetical student roster cards with tactile toggle pills (`Ăn` [Green] vs `Vắng` [Red]).
3. **Dietary & Allergy Warning Badges** — Safety critical: Prominent orange warning chips immediately adjacent to student names (`Dị ứng: Lạc`, `Kiêng: Hải sản`).
4. **Bottom Floating Action Bar** — Pinned primary action: Quick "Đánh dấu tất cả có mặt" and primary "Khóa sổ điểm danh" CTA.

### Screen: Lunch Demand Aggregation & Order Dispatch (`/coordinator/demand`)
1. **School-Wide Attendance Rollup Metric Cards** — Highest priority: Total registered students, confirmed attendees, excused absences, and unsubmitted classes.
2. **Safety Buffer Configuration & Final Demand** — Decision control: Configurable buffer percentage stepper ($0\%\text{--}10\%$, default $3\%\text{--}5\%$) and calculated final portion demand:
   $$\text{Final Demand} = \text{round}(\text{Confirmed Attendance} \times (1 + \text{Buffer\%}))$$
3. **Menu Dish Portion Breakdown** — Operational detail: Expected dish quantities translated from active weekly menu.
4. **Order Dispatch CTA** — Bottom action: Primary "Chốt Nhu Cầu & Gửi Đơn Cho Catering (trước 08:45 AM)" button.

### Screen: Food Receiving & 3-Step Inspection (`/coordinator/receiving`)
1. **Delivery Header & Container Count Verification** — Highest priority: Catering PO match (`Đã đặt: 630 suất | Thực giao: 630 hộp/khay`).
2. **3-Step Safety Inspection Form** — Mandatory compliance gate:
   - Step 1: Core food probe temperature reading ($\ge 65^\circ\text{C}$).
   - Step 2: Container seal integrity check (Pass / Fail).
   - Step 3: Sensory evaluation (Odor, color, texture: Pass / Fail).
3. **Acceptance Decision CTA** — Primary action: "Ký Nhận Đủ & Đạt Chuẩn" or "Từ Chối / Lập Biên Bản Bất Thường".

### Screen: Monthly Billing & Invoicing (`/accountant/billing`)
1. **Monthly Financial Summary Cards** — Highest priority: Total billed amount, total collected, outstanding receivables, and caterer payables accrued.
2. **Student Billing Grid** — Core financial table: Student name, class, attended meals, excused absence credits, unit rate (35,000 VND), net invoice amount, and payment status (`unpaid`, `partial`, `paid`).
3. **Action Controls** — Batch operations: "Chạy tính phí tháng", "Xuất hóa đơn", "Gửi thông báo phụ huynh".

### Screen: Daily Menu & Transparency Portal (`/parent/menu-transparency`)
1. **Today's Lunch Menu Hero Card** — Highest priority: Meal photos, dish names (Main, Soup, Side, Dessert), nutritional values (Kcal, protein, carbs).
2. **Food Safety Verification Badge** — Trust & compliance: Real-time badge showing:
   - "Đã giao lúc 10:25 AM — Nhiệt độ kiểm tra: 72°C (Đạt chuẩn an toàn)".
   - Sample meal photo preserved at school clinic.
3. **Allergen & Ingredient Transparency Sheet** — Ingredient list with highlighted common allergens.

---

## 4. Critical User Flows

### Flow 1: Morning Attendance Recording & Cutoff Lock (MGR / Classroom Coordinator)
1. User logs into `/coordinator/attendance` at 07:50 AM.
2. Selects assigned classroom (e.g. `Lớp 1A`).
3. System loads active enrolled meal roster defaulting to `Ăn`.
4. User toggles absent students to `Vắng` and enters reason (e.g., "Sốt xuất huyết, phụ huynh xin nghỉ").
5. User reviews allergy warning chips (`F-NUT-02`) to ensure dietary safety.
6. User taps "Khóa sổ điểm danh" at 08:25 AM:
   - If time $\le$ 08:30 AM $\rightarrow$ System persists records as `confirmed` and locks interface to Read-Only (`F-PAR-03`).
   - If time $>$ 08:30 AM $\rightarrow$ System alerts cutoff passed; changes require administrative override.

### Flow 2: Session Demand Calculation & Catering PO Dispatch (MGR)
1. Coordinator accesses `/coordinator/demand` at 08:31 AM.
2. Verifies that 100% of classrooms have finalized rosters (`F-PAR-04`).
3. Evaluates total confirmed attendance (e.g. 600 students).
4. Sets safety buffer to $+5\%$; system calculates $600 \times 1.05 = 630$ portions (`F-OPS-01`).
5. Coordinator reviews scaled raw dish portions and clicks "Gửi Đơn Cho Đơn Vị Nấu (Catering)" at 08:40 AM.
6. System generates purchase order record in `catering_orders` with status `dispatched` (`F-OPS-02`).

### Flow 3: Food Receiving, Temperature Inspection & Classroom Distribution (MGR)
1. Catering delivery truck arrives at school staging dock at 10:25 AM.
2. Coordinator accesses `/coordinator/receiving` (`F-OPS-03`).
3. Verifies 630 meal containers delivered against order.
4. Uses calibrated food probe thermometer to measure temperature ($72^\circ\text{C} \ge 65^\circ\text{C}$).
5. Verifies container tamper seals and visual smell/color as "Pass".
6. Clicks "Chấp Thuận & Ký Nhận"; delivery status transitions to `accepted`.
7. At 11:00 AM, coordinator opens `/coordinator/distribution` (`F-OPS-04`), supervises trolley loading per class count, and logs distribution completion.

### Flow 4: Post-Lunch Quantity Reconciliation & Discrepancy Resolution (MGR $\rightarrow$ ACC)
1. Lunch service concludes at 13:00 PM; Coordinator accesses `/coordinator/reconciliation` (`F-OPS-05`).
2. System loads daily figures:
   - Ordered: 630 portions.
   - Delivered & Accepted: 630 portions.
   - Consumed in Classrooms: 600 portions.
   - Surplus Reserve: 30 portions.
3. If vendor had a delivery shortfall (e.g. delivered 620 portions), Coordinator enters discrepancy reason and logs actual delivered count.
4. Coordinator clicks "Xác Nhận Đối Soát Ngày". Data is finalized and synced with Accountant Portal (`F-FEE-04`) for caterer payable settlement.

### Flow 5: Monthly Fee Invoicing & Payment Tracking (ACC $\rightarrow$ PAR)
1. At month-end, Accountant accesses `/accountant/billing` (`F-FEE-02`).
2. Selects billing month and clicks "Chạy Tính Phí Suất Ăn".
3. System calculates chargeable meals for each student:
   $$\text{Chargeable Meals} = \text{Attended Days} - \text{Valid Excused Absence Credits}$$
4. Invoices are generated in `student_meal_bills` with status `unpaid`.
5. Parents receive invoice on `/parent/billing` (`F-FEE-03`) with itemized attendance dates and dynamic VietQR code.
6. Once parent pays via bank transfer, Accountant logs payment on `/accountant/payments`; bill status transitions to `paid`.

---

## 5. UI Naming Conventions & Domain Glossary

Consistent terminology strictly aligned with [Phase 01](../01-top-down/business-domains.md), [Phase 02](../02-core-features/core-feature-breakdown.md), and [Phase 03](../03-roles-usecases/roles.md):

| Domain Concept | UI Display Label (Vietnamese) | English Definition & Functional Role |
|---|---|---|
| **Student Meal Eligibility** | **Tiêu chuẩn ăn bán trú** | Institutional criteria determining boarding intake qualification (`F-PAR-01`). |
| **Meal Registration** | **Đăng ký suất ăn bán trú** | Term-level participation agreement signed by parents (`F-PAR-02`). |
| **Daily Attendance** | **Điểm danh suất ăn** | Daily recording of student presence for lunch (`F-PAR-03`). |
| **Attendance Cutoff** | **Giờ chốt sổ điểm danh (08:30)** | Strict deadline after which classroom rosters freeze to Read-Only (`F-PAR-03`). |
| **Attendance Progress** | **Giám sát tiến độ điểm danh** | School-wide monitoring board tracking completed vs pending class rosters (`F-PAR-04`). |
| **Nutritional Dish** | **Món ăn & Dinh dưỡng** | Recipe catalog item with portion standards and constituent ingredients (`F-PLN-01`). |
| **Weekly Menu** | **Thực đơn tuần** | Scheduled meal plan composed of dishes across Monday–Friday (`F-PLN-02`). |
| **1-Level Menu Approval** | **Phê duyệt thực đơn (1 cấp)** | Streamlined administrative sign-off by Principal (`F-PLN-02`). |
| **Serving Calendar** | **Lịch ăn & Ngày nghỉ** | Calendar binding approved menus to school days and excluding holidays (`F-PLN-03`, `F-MST-02`). |
| **Session Demand** | **Tổng nhu cầu suất ăn** | Headcount aggregated from confirmed attendance plus safety buffer (`F-OPS-01`). |
| **Safety Buffer (%)** | **Hệ số dự phòng (%)** | Configurable multiplier ($0\%\text{--}10\%$) to absorb unforeseen overflow (`F-OPS-01`). |
| **Catering Order** | **Đơn đặt suất ăn Catering** | Formal daily purchase order dispatched to catering vendor before 08:45 AM (`F-OPS-02`). |
| **Delivery Receiving & Inspection** | **Giao nhận & Kiểm nghiệm suất ăn** | 3-step safety verification (temperature $\ge 65^\circ\text{C}$, seals, sensory) at 10:30 AM (`F-OPS-03`). |
| **Classroom Distribution** | **Chia suất ăn về lớp** | Logging meal trolley dispatch to classrooms at 11:00 AM (`F-OPS-04`). |
| **Quantity Reconciliation** | **Đối soát số lượng suất ăn** | Daily reconciliation of Ordered vs Delivered vs Consumed counts at 13:00 PM (`F-OPS-05`). |
| **Discrepancy Resolution** | **Xử lý chênh lệch suất ăn** | Recording shortfall/excess reasons and adjusting caterer payables (`F-OPS-05`). |
| **Meal Fee Schedule** | **Biểu phí suất ăn** | Configured unit rate (e.g. 35,000 VND / meal) and semester validity period (`F-FEE-01`). |
| **Chargeable Meals** | **Số suất ăn tính phí** | Net meals billed after deducting excused absences (`F-FEE-02`). |
| **Meal Bill / Invoice** | **Hóa đơn tiền ăn bán trú** | Monthly itemized parent invoice (`F-FEE-02`). |
| **3-State Payment Tracking** | **Trạng thái thu phí** | Streamlined payment lifecycle: `Chưa thu (unpaid)`, `Thu một phần (partial)`, `Đã thu đủ (paid)` (`F-FEE-03`). |
| **Catering Payable** | **Công nợ đơn vị Catering** | Accrued vendor liability based on reconciled accepted deliveries (`F-FEE-04`). |
| **Daily Operations Report** | **Báo cáo vận hành hàng ngày** | Executive summary of attendance, orders, inspection, and surplus (`F-REP-01`). |
| **Financial Report** | **Báo cáo tài chính bán trú** | Monthly fee collection, debt aging, and vendor payable audit (`F-REP-02`). |
| **Parent Transparency Portal** | **Cổng thông tin bán trú phụ huynh** | Public/parent view showing daily menus, ingredients, and delivery verification badges (`F-REP-03`). |
| **Fixed 4-Role RBAC** | **Phân quyền 4 vai trò cố định** | Fixed roles (`ADM`, `ACC`, `MGR`, `PAR`) without runtime custom overrides (`F-USR-02`). |
| **Allergy Profile** | **Hồ sơ dị ứng học sinh** | Medical allergen declarations recorded by parents (`F-NUT-01`). |
| **Dietary Conflict Alert** | **Cảnh báo dị ứng thực đơn** | Visual warning chips highlighting menu conflicts with student allergies (`F-NUT-02`). |

---

## 6. Component Reuse Map

| Component Token | Base Element / Markup | Used Across Portals | Behavior & Responsive Adjustments |
|---|---|---|---|
| **App Header Shell** | `<header class="app-header">` | Coordinator, Accountant, Parent, Admin | Desktop shows full role menu & cutoff pills; Mobile condenses into hamburger/compact bar. |
| **Cutoff Countdown Pill** | `<div class="cutoff-pill">` | Coordinator (`attendance`, `demand`, `receiving`) | Live countdown; turns yellow at 15m remaining; turns red and locks when cutoff expires. |
| **Tactile Toggle Button** | `<button class="toggle-pill">` | Coordinator (`attendance`), Parent (`allergies`) | Oversized touch targets (minimum 44px) for rapid mobile/tablet finger toggling. |
| **Metric KPI Card** | `<div class="kpi-card">` | Coordinator (`demand`), Accountant (`billing`, `dashboard`) | Highlights key totals (Headcount, Billed VND, Collected VND); stacks vertically on mobile. |
| **Slide-Up Context Sheet (Layer 2.5)**| `<div class="slide-sheet">` | All Portals | Slides up from bottom on mobile; renders as centered modal on desktop (> 768px). Never stacked. |
| **Status Badge Component** | `<span class="badge status-{type}">` | All Portals | Unified color semantics: Green (`confirmed`, `paid`, `accepted`), Red (`unpaid`, `rejected`, `absent`), Yellow (`pending`, `partial`), Orange (`allergy-alert`). |
| **QR Invoice Card** | `<div class="vietqr-card">` | Parent (`billing`), Accountant (`payments`) | Renders standard VietQR code for instant banking app scanning with embedded reference code. |

---

## 7. Content Growth & Archival Plan

1. **Daily High-Velocity Partitions**:
   - Transactional entities (`meal_participations`, `catering_orders`, `meal_deliveries`, `meal_inspections`, `meal_distributions`, `meal_reconciliations`) generate records every school day.
   - All operational views default strictly to **Current Operational Date (`session_date = TODAY`)**.
2. **Monthly Financial Billing Windows**:
   - Monthly billing records (`student_meal_bills`, `student_billing_items`, `meal_payments`) are partitioned by School Year and Academic Month.
   - Historical billing queries utilize indexed month dropdowns with paginated results (50 items/page).
3. **Master Catalog Revalidation**:
   - Dish catalog (`dishes`), classrooms (`classes`), and student rosters (`students`) change infrequently (term-based). These are cached in client state and invalidated via background fetch.
4. **Historical Audit & Archival**:
   - Prior academic years are archived into read-only storage at the conclusion of the summer term, preserving immutable financial and reconciliation audit trails.

---

## 8. URL Strategy

### Structural Pattern
`/:portal/:resource[/:id][/:action]`

### Portal Routes
- `/coordinator/*` — Semi-Boarding Coordinator / Meal Manager Portal (`MGR`)
- `/accountant/*` — School Accountant Financial Portal (`ACC`)
- `/parent/*` — Student Parent / Guardian Portal (`PAR`)
- `/admin/*` — School Administrator Master Data Portal (`ADM`)

### Dynamic Segments
- `:classId` $\rightarrow$ Standard classroom code (e.g. `1A`, `2B`, `5C`).
- `:date` $\rightarrow$ ISO 8601 Date (`YYYY-MM-DD`).
- `:menuId` $\rightarrow$ Unique weekly menu identifier (e.g. `MNU-2026-W42`).
- `:invoiceId` $\rightarrow$ Monthly student billing identifier (e.g. `INV-202610-STU1024`).
- `:dishId` $\rightarrow$ Master dish catalog identifier (e.g. `DSH-042`).
- `:userId` $\rightarrow$ System user account identifier.

### Query Parameters
- `date` $\rightarrow$ Filter operational views by date (defaults to `TODAY`).
- `class_id` $\rightarrow$ Filter attendance and distribution by classroom.
- `status` $\rightarrow$ Filter state lists (`all`, `unpaid`, `partial`, `paid`, `confirmed`, `discrepancy`).
- `month` $\rightarrow$ Financial billing month filter (`YYYY-MM`).
