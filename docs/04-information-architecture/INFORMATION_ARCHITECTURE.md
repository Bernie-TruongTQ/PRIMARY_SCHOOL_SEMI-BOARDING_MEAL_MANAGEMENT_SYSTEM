# Information Architecture: Primary School Semi-Boarding Meal Management System

## 1. Site Map

A hierarchical map of every page and view across the 4 autonomous role portals, including their respective URL patterns:

- **Global Entry** `/`
  - Auth & Role Redirection `/login`
- **Teacher Portal** `/teacher`
  - Classroom Attendance Roster `/teacher/roster`
    - Class Filter `?class_id=:classId&session_date=:date`
    - Attendance Amendment Bottom Sheet `/teacher/roster/amend` (Modal context)
    - Roster Lock & Handover Summary `/teacher/roster/confirm`
  - Post-Lock Emergency Request Sheet `/teacher/emergency-request`
- **Manager Portal** `/manager`
  - Demand Determination Dashboard `/manager/demand`
    - Date & Session Filter `?date=:date&session=:sessionId`
  - Expected Raw Dish Quantities `/manager/quantities`
  - Post-Lock Emergency Review Queue `/manager/changes`
    - Request Detail Modal `?request_id=:requestId`
  - Kitchen Shift Plan Authoring `/manager/prep-plans`
    - Plan Detail & Station Schedule `/manager/prep-plans/:planId`
  - Daily Preparation Reconciliation & Audit `/manager/reconciliation`
- **Kitchen Kiosk Portal** `/kitchen` (Touch Kiosk Mode)
  - Active Prep Shift Board `/kitchen/shift`
  - Storage Ingredient Receiving Checklist `/kitchen/ingredients`
  - Station Cooking Timers & Batch Logger `/kitchen/cooking`
    - Station Filter `?station=:stationId`
  - Prepared Yield Verification Gate `/kitchen/verification`
- **Admin Portal** `/admin`
  - Student & Classroom Directory `/admin/students`
    - Student Profile & Dietary Notes `/admin/students/:studentId`
  - Meal Schedules & Cutoff Parameters `/admin/schedules`
  - Dish & Recipe Master Catalog `/admin/catalog`
    - Recipe Detail & Thermal Yield Factors `/admin/catalog/:dishId`
  - User Accounts & Access Control `/admin/users`

---

## 2. Navigation Model

### Primary Navigation
- **Portal Switcher / Role Selector**: Persistent top bar component allowing authorized staff to transition between their operational role views (`Giáo Viên (M1)`, `Quản Lý Bếp (M2 & M3)`, `Kiosk Nhà Bếp (M3)`).
- **Portal Tab Bar**: Role-specific sub-navigation bar:
  - **Teacher**: Single-screen focused navigation with contextual slide-up sheets (keeps homeroom teachers 100% focused on student attendance).
  - **Manager**: Horizontal analytical tab bar (`Nhu Cầu & Suất Ăn`, `Định Lượng Nguyên Liệu`, `Duyệt Yêu Cầu Phát Sinh`, `Kế Hoạch Bếp`, `Đối Soát Sản Lượng`).
  - **Kitchen**: Giant touch tabs optimized for grease-resistant gloves (`Bảng Ca Trực`, `Nhận Thực Phẩm`, `Đang Nấu & Mẻ`, `Nghiệm Thu Suất`).

### Secondary Navigation
- **Classroom Selector Ribbon** (Teacher Portal): Horizontal scroll chip list (`Lớp 1A`, `Lớp 1B`, `Lớp 2A`...) allowing rapid switching between assigned homerooms.
- **Station Filter Tabs** (Kitchen Portal): Station-level grouping (`Tất cả`, `Chảo Xào`, `Tủ Cơm`, `Nồi Canh`).
- **Date & Session Ribbon** (Manager Portal): Fast switching between morning session types (`Bữa Sáng`, `Bữa Trưa`, `Bữa Xế`).

### Utility Navigation
- **Cutoff Countdown Indicator**: Real-time persistent countdown pill (`08:30 AM Cutoff • 42 min remaining`), shifting from Green $\rightarrow$ Amber (15m remaining) $\rightarrow$ Crimson Red (`Locked`).
- **Data Reset Action**: Secondary utility button (`↺ Khôi phục Dữ liệu`) providing deterministic demonstration state reset.
- **Device Viewport Toggle**: Top simulator bar (`Xem điện thoại di động` vs `Toàn màn hình desktop`) for developer and stakeholder testing.

### Mobile Navigation
- **One-Handed Thumb Zone**: All primary mobile actions for teachers (present/absent toggle, save draft, lock roster) sit within the bottom 60% of the viewport.
- **Slide-Up Bottom Sheet**: Modals on mobile slide upwards from the bottom edge with a draggable handle, preserving context of the underlying classroom list.

---

## 3. Content Hierarchy

### Screen: Classroom Attendance Roster (`/teacher/roster`)
1. **Cutoff Clock & Class Metric Ribbon** — Highest priority: Shows remaining time before 08:30 AM lock and current headcount tally (`Sĩ số: 32 | Ăn: 30 | Vắng: 2`).
2. **Student Attendance Card List** — Core work area: Alphabetical student roster cards with large tactile "Ăn" (Green) vs "Vắng" (Red) toggle pills.
3. **Medical Dietary Alert Badges** — Safety critical: Bright orange warning chips immediately adjacent to student names (`Dị ứng lạc`, `Không ăn hải sản`).
4. **Primary Floating Action Bar** — Bottom pinned: Quick Mark All Present shortcut and primary "Khóa sổ điểm danh" CTA.

### Screen: Demand Determination Dashboard (`/manager/demand`)
1. **School-wide Rollup Metric Cards** — Highest priority: Total Base Registered, Confirmed Attendance, Absent Headcount, and Calculated Final Demand.
2. **Classroom Submission Progress Grid** — Operational oversight: 20-card status board showing which classes have confirmed (`20/20 Lớp đã nộp`).
3. **Forecasting Method & Safety Buffer Steppers** — Decision control: Radio selectors for formula type and `[-]` / `[+]` buffer % stepper ($0\%\text{--}10\%$).
4. **Demand Lock CTA** — Bottom action: Primary "Chốt Nhu Cầu & Sinh Kế Hoạch Bếp" button.

### Screen: Active Shift Kiosk Board (`/kitchen/shift`)
1. **Shift Countdown Banner & Target Headcount** — Highest priority: Oversized readout (`630 Suất • Hoàn thành trước 10:45 AM`).
2. **Station Progress Cards** — Live status: 4 high-contrast cards (Rice, Sauté, Soup, Vegetables) showing planned quantities and active batch status.
3. **Direct Action Buttons** — Station entry: Touch targets (`Vào Nấu`, `Xem Nguyên Liệu`, `Nghiệm Thu`).

### Screen: Prepared Yield Verification Gate (`/kitchen/verification`)
1. **Variance & Tolerance Indicator** — Highest priority: High-visibility comparison badge showing percentage discrepancy ($\Delta\%$) against $\pm 3\%$ window.
2. **Dish Weighed Yield Entry Rows** — Core input: Target planned weight vs actual scale reading.
3. **Mandatory Discrepancy Textarea** — Gated condition: Only unlocks when variance exceeds $3\%$.
4. **Release Gate CTA** — Final action: "Ký Duyệt & Xuất Khay Về Lớp".

---

## 4. Critical User Flows

### Flow 1: Morning Attendance & Cutoff Lock (Teacher)
1. Teacher opens `/teacher/roster` at 07:45 AM on classroom smartphone.
2. Teacher views classroom roster pre-populated with default "Eating" status.
3. Teacher toggles 2 absent students to "Absent".
   - If student has recorded food allergies, teacher verifies the allergy badge is acknowledged.
4. Teacher taps "Confirm & Lock Roster" at 08:25 AM.
   - If before 08:30 AM $\rightarrow$ System persists records as `confirmed` and locks interface to Read-Only.
   - If after 08:30 AM $\rightarrow$ System alerts teacher that cutoff passed and auto-diverts delta into an Emergency Request sheet (`SCR-TCH-04`).
5. Teacher receives confirmation toast: "Lớp 1A đã khóa sổ thành công".

### Flow 2: Demand Calculation & Shift Publishing (Nutrition Manager)
1. Manager accesses `/manager/demand` at 08:30 AM.
2. Manager confirms 20/20 classrooms have completed roster freeze (Total: 600 students).
3. Manager selects `participation_based` calculation method and applies a $+5\%$ safety buffer.
4. System computes: Base $600 \times 1.05 = 630$ final portions.
5. Manager navigates to `/manager/quantities` to review raw ingredient translations (e.g. 63.0 kg pork, 70 kg rice).
6. Manager clicks "Chốt Nhu Cầu & Sinh Kế Hoạch"; demand status transitions to `confirmed` and is instantly broadcast to kitchen kiosks.

### Flow 3: Post-Lock Emergency Change Triage (Teacher $\rightarrow$ Manager $\rightarrow$ Kitchen)
1. Teacher receives late arrival at 09:15 AM; opens Emergency Sheet (`SCR-TCH-04`).
2. Teacher enters $+1$ lunch portion with reason "Học sinh đến trễ do khám bệnh".
3. Manager receives urgent banner on `/manager/changes` with pending $+1$ delta.
4. Manager evaluates kitchen cooking capacity:
   - If Approved $\rightarrow$ `meal_demands` updates to `revised` (631 meals), kitchen kiosk receives audio chime, and push notice confirms to teacher.
   - If Rejected $\rightarrow$ Reason note entered and teacher receives rejection notice.

### Flow 4: Kitchen Cooking Execution & Scale Verification (Kitchen)
1. Station cook checks `/kitchen/shift` at 08:50 AM and opens Steamer Station (`SCR-KIT-03`).
2. Cook loads rice cabinet and taps "Bắt đầu mẻ #1"; live timer counts down 45 minutes.
3. Timer alarms at 09:35 AM; cook unloads steamer and places pan on floor scale.
4. Cook enters 70.0 kg on oversized touch numpad and taps "Hoàn thành mẻ".
5. At 10:45 AM, Head Chef opens `/kitchen/verification` (`SCR-KIT-04`).
   - If yield is within $\pm 3\%$ of target $\rightarrow$ Chef taps "Ký Duyệt & Xuất Khay" (Status: `matched`).
   - If yield discrepancy $> 3\%$ $\rightarrow$ Primary CTA disables until chef logs explanation note (Status: `discrepancy`).

---

## 5. UI Naming Conventions & Domain Glossary

| Concept | Label in UI | Operational Definition & System Role |
|---|---|---|
| Student Meal Attendance | **Điểm danh suất ăn** | Daily recording of student presence for scheduled meal sessions (`F-PAR-01`). |
| Participation Status | **Trạng thái ăn (Ăn / Vắng)** | Binary state (`recorded`, `cancelled`, `confirmed`) determining meal delivery. |
| Cutoff Deadline | **Giờ chốt sổ (08:30 AM)** | Hard time limit after which classroom rosters freeze into read-only mode (`F-PAR-03`). |
| Attendance Amendment | **Điều chỉnh điểm danh** | Modifying attendance post-initial entry with mandatory justification audit trail (`F-PAR-02`). |
| Post-Lock Emergency Change | **Yêu cầu phát sinh khẩn cấp** | Request for headcount adjustment submitted after daily cutoff (`F-DMD-03`). |
| Demand Headcount | **Tổng nhu cầu suất ăn** | Aggregated school-wide headcount derived from attendance plus safety buffer (`F-DMD-01`). |
| Safety Buffer | **Hệ số dự phòng (%)** | Configurable multiplier ($0\%\text{--}10\%$) applied to absorb sudden overflow. |
| Expected Raw Quantity | **Định lượng nguyên liệu thô** | Calculated weight of raw storage ingredients required for the menu (`F-DMD-02`). |
| Kitchen Preparation Plan | **Kế hoạch ca nấu** | Published schedule assigning quantities and target completion times to stations (`F-PRP-01`). |
| Cooking Batch | **Mẻ chế biến** | Single operational cooking cycle tracked by station timers and scale weigh-in (`F-PRP-03`). |
| Prepared Yield Verification | **Nghiệm thu sản lượng** | Final inspection comparing cooked weight against target with $\pm 3\%$ tolerance check (`F-PRP-04`). |

---

## 6. Component Reuse Map

| Component Token | Base Element / Markup | Used Across Views | Behavior & Responsive Differences |
|---|---|---|---|
| **App Shell Header** | `<header class="app-header">` | All Portals (`/teacher`, `/manager`, `/kitchen`, `/admin`) | Desktop shows full role switcher; Mobile compresses into icon dropdown; Kitchen displays high-contrast shift clock. |
| **Cutoff Status Chip** | `<div class="cutoff-badge">` | `SCR-TCH-01`, `SCR-MGR-01`, `SCR-KIT-01` | Displays countdown; switches to pulsating red when $< 15\text{m}$; displays locked icon post-08:30. |
| **Tactile Status Pill** | `<button class="status-pill">` | `SCR-TCH-01`, `SCR-KIT-02`, `SCR-KIT-03` | Oversized on Mobile (44px min touch target) and Kitchen Kiosk (56px touch target); hover/focus ring on desktop. |
| **Metric Summary Card** | `<div class="metric-card">` | `SCR-TCH-01`, `SCR-MGR-01`, `SCR-MGR-05` | Displays key integer values and progress percentage; 1-column on mobile, 4-column flex grid on desktop. |
| **Contextual Bottom Sheet / Modal** | `<div class="modal-sheet">` | `SCR-TCH-02`, `SCR-TCH-04`, `SCR-MGR-03`, `SCR-KIT-04` | Renders as slide-up bottom sheet on mobile ($< 768\text{px}$) with swipe-to-dismiss; centered modal on desktop ($> 768\text{px}$). |
| **Oversized Numpad** | `<div class="kiosk-numpad">` | `SCR-KIT-03`, `SCR-KIT-04` | High-contrast touch keypad for kiosk touchscreens; suppressed on desktop in favor of native keyboard input. |

---

## 7. Content Growth & Archival Plan

1. **Daily Operational Partitions**:
   - High-velocity transactional entities (`meal_participations`, `meal_demands`, `meal_preparations`, `meal_participation_changes`) generate $\sim 600\text{--}800$ records daily.
   - The UI defaults strictly to the **Current Operational Date (`session_date = TODAY`)**.
2. **Archival & Historic Inspection**:
   - Historical records older than 30 days are indexed by academic month for parent billing reconciliation and auditor export.
   - The UI provides a date-picker dropdown (`Lịch sử theo ngày`) with server-side pagination (50 records per page) to prevent client memory bloat.
3. **Static & Slow-Growing Catalogs**:
   - Student rosters (`students`), Classrooms (`classes`), and Recipes (`dishes`) change infrequently (term-based or annual). These are cached in client storage and updated via background revalidation.

---

## 8. URL Strategy

### URL Construction Rules
- **Pattern:** `/:portal/:resource[/:id][/:action]`
- **Examples:**
  - `/teacher/roster` — Default classroom view
  - `/manager/prep-plans/2026-09-15` — Daily preparation plan detail
  - `/kitchen/cooking?station=saute` — Sauté station filtered kiosk view

### Dynamic Segments
- `:portal` $\rightarrow$ `teacher` | `manager` | `kitchen` | `admin`
- `:classId` $\rightarrow$ Unique class code (e.g. `1A`, `2B`)
- `:planId` $\rightarrow$ Unique shift plan ID (e.g. `PLN-20260915-LUNCH`)
- `:dishId` $\rightarrow$ Unique catalog dish ID (e.g. `DSH-001`)

### Query Parameters
- `date` $\rightarrow$ ISO Date format `YYYY-MM-DD` (Defaults to current system date)
- `session` $\rightarrow$ Meal session code (`breakfast`, `lunch`, `snack`)
- `station` $\rightarrow$ Kitchen cooking line (`all`, `rice`, `saute`, `soup`)
- `status` $\rightarrow$ Filter state for requests (`all`, `pending`, `approved`, `rejected`)
