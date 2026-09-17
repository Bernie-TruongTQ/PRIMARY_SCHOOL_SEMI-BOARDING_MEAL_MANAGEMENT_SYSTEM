# Phân tích & Đề xuất Kế hoạch Cập nhật `docs/06-database/schema.dbml`

Tài liệu này đối chiếu hiện trạng file [schema.dbml](file:///d:/WORKSPACE/Top-Down-Approach/docs/06-database/schema.dbml) với toàn bộ tài liệu kiến trúc chuẩn hóa của hệ thống:
- **arc42**: [01-introduction-and-goals.md](file:///d:/WORKSPACE/Top-Down-Approach/arc42/01-introduction-and-goals.md), [04-solution-strategy.md](file:///d:/WORKSPACE/Top-Down-Approach/arc42/04-solution-strategy.md), [05-building-block-view.md](file:///d:/WORKSPACE/Top-Down-Approach/arc42/05-building-block-view.md), [06-runtime-view.md](file:///d:/WORKSPACE/Top-Down-Approach/arc42/06-runtime-view.md), [08-crosscutting-concepts.md](file:///d:/WORKSPACE/Top-Down-Approach/arc42/08-crosscutting-concepts.md), [09-architecture-decisions.md](file:///d:/WORKSPACE/Top-Down-Approach/arc42/09-architecture-decisions.md), [12-glossary.md](file:///d:/WORKSPACE/Top-Down-Approach/arc42/12-glossary.md).
- **C4 Model**: [c4-context.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-context.md), [c4-containers.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-containers.md), [c4-components-participation.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-participation.md), [c4-components-demand.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-demand.md), [c4-components-preparation.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-preparation.md), [c4-components-fee-cost.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-fee-cost.md), [c4-components-nutrition.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-nutrition.md), [c4-components-master-data.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-master-data.md), [c4-components-users-rbac.md](file:///d:/WORKSPACE/Top-Down-Approach/c4/c4-components-users-rbac.md).
- **Docs 01 -> 04**:
  - [MVP.md](file:///d:/WORKSPACE/Top-Down-Approach/docs/01-top-down/MVP.md), [business-domains.md](file:///d:/WORKSPACE/Top-Down-Approach/docs/01-top-down/business-domains.md), [core-supporting-classification.md](file:///d:/WORKSPACE/Top-Down-Approach/docs/01-top-down/core-supporting-classification.md).
  - [core-feature-breakdown.md](file:///d:/WORKSPACE/Top-Down-Approach/docs/02-core-features/core-feature-breakdown.md), [invest-requirements.md](file:///d:/WORKSPACE/Top-Down-Approach/docs/02-core-features/invest-requirements.md).
  - [roles.md](file:///d:/WORKSPACE/Top-Down-Approach/docs/03-roles-usecases/roles.md), [role-feature-mapping.md](file:///d:/WORKSPACE/Top-Down-Approach/docs/03-roles-usecases/role-feature-mapping.md).
  - [INFORMATION_ARCHITECTURE.md](file:///d:/WORKSPACE/Top-Down-Approach/docs/04-information-architecture/INFORMATION_ARCHITECTURE.md).

---

## 1. Phát hiện Sự Lệch Chuẩn Nghiêm Trọng (Drift Analysis)

Hiện tại, file [schema.dbml](file:///d:/WORKSPACE/Top-Down-Approach/docs/06-database/schema.dbml) đang phản ánh mô hình cũ (**Bếp nấu nội bộ / In-house Kitchen Cooking**), bao gồm các bảng:
- `meal_preparation_plans`, `meal_preparation_plan_dishes`, `ingredient_allocations`, `meal_preparations`, `meal_preparation_dish_records`, `prepared_quantity_confirmations`.
- Các enum: `prep_plan_status_enum`, `allocation_status_enum`, `prep_record_status_enum`, `confirmation_status_enum`.
- `meal_type_enum` có cả `breakfast`, `lunch`, `dinner`, `snack`.

### Độ lệch so với Baseline Tài Liệu (arc42, C4, Docs 01-04):
1. **Mô hình Vận hành là Suất ăn Công nghiệp ngoài (External Catering Vendor Model)**:
   - Nhà trường **không** tổ chức nấu nướng, không phân bổ nguyên liệu (`ingredient_allocations`), không ghi nhận mẻ nấu nội bộ (`meal_preparations`).
   - Nhà trường quản lý: **Chốt nhu cầu & Đặt suất (`catering_orders`)** $\rightarrow$ **Giao nhận & Kiểm thực 3 bước (`meal_deliveries`, `meal_inspections`)** $\rightarrow$ **Chia suất về lớp (`meal_distributions`)** $\rightarrow$ **Đối soát 3 bên & Xử lý sai lệch (`meal_reconciliations`, `meal_discrepancies`)**.
2. **Phạm vi Bữa ăn là Lunch-Only (Chỉ Bữa Trưa)**:
   - Toàn bộ tài liệu xác nhận bữa ăn hợp lệ duy nhất là `lunch` (bỏ breakfast, dinner, snack).
3. **Thiếu hoàn toàn các Thực thể Trọng yếu của 8 Business Domains**:
   - **Domain 1 (Student Meal)**: Thiếu `meal_eligibility_criteria`, `student_meal_eligibilities`.
   - **Domain 2 (Meal Planning)**: Bảng `dishes` và `menus`, `menu_dishes` đang ở dạng simplified hoặc thiếu hoàn toàn bảng menu chính thức, chưa có cờ duyệt 1-cấp (`approved_by`, `status`).
   - **Domain 3 (Meal Operation)**: Thiếu hoàn toàn chuỗi giao nhận - kiểm thực - chia suất - đối soát:
     - `catering_orders`: Đơn hàng gửi catering trước 08:45 AM (gồm buffer $0\%\text{--}10\%$).
     - `meal_deliveries`: Tiếp nhận xe giao hàng lúc 10:30 AM (biển số xe, số thùng giữ nhiệt).
     - `meal_inspections`: Kiểm thực 3 bước QĐ 1246/QĐ-BYT (nhiệt độ lõi $\ge 65^\circ\text{C}$, niêm phong, cảm quan, ảnh lưu mẫu 24h).
     - `meal_distributions`: Nhật ký phân bổ khay ăn về xe đẩy từng lớp lúc 11:00 AM.
     - `meal_reconciliations` & `meal_discrepancies`: Đối soát 13:00 PM (Ordered vs Delivered vs Consumed) & cập nhật công nợ thực tế.
   - **Domain 4 (Fee & Cost)**: Thiếu hoàn toàn:
     - `meal_fee_configs`: Biểu phí theo kỳ học.
     - `student_meal_bills` & `student_billing_items`: Hóa đơn tiền ăn hàng tháng trừ ngày vắng có phép.
     - `meal_payments`: Thu tiền 3 trạng thái (`unpaid`, `partial`, `paid`) tích hợp mã động VietQR.
     - `catering_costs` / `vendor_payables`: Công nợ nhà cung cấp dựa trên suất ăn thực nhận & đối soát.
   - **Domain 6 (User & Access)**: `users` cần gắn với 4 Fixed Roles (`ADM`, `ACC`, `MGR`, `PAR`).
   - **Domain 7 (Nutrition & Health)**: Thiếu `student_allergies` (theo dõi dị ứng y tế: lạc, hải sản, trứng, sữa...) và `dietary_alerts` / liên kết món ăn có thành phần dị ứng.
   - **Domain 8 (Master Data)**: Thiếu `school_years`, `grades`, `classes`, `meal_calendars`, `holidays` (để tự động trừ ngày nghỉ học khi tính phí và điểm danh).

---

## 2. Thiết kế Kiến trúc Schema Mới cho `schema.dbml`

Cấu trúc DBML mới sẽ được tổ chức bài bản theo đúng 8 Business Domains và chuỗi giá trị vận hành thực tế:

### Phân nhóm Bảng theo Domain:
1. **Domain 8: Master Data & Academic Configuration (`F-MST`)**
   - `school_years` (Năm học & kỳ học)
   - `grades` (Khối lớp)
   - `classes` (Lớp học, gán GVCN / homeroom_teacher_id)
   - `students` (Hồ sơ học sinh đầy đủ)
   - `meal_calendars` & `holidays` (Lịch phục vụ bán trú T2–T6 và ngày nghỉ lễ)
2. **Domain 6: User & Access Management (`F-USR`)**
   - `roles` (Fixed 4 Roles: ADM, ACC, MGR, PAR)
   - `users` (Tài khoản người dùng, email, mật khẩu băm, role_id)
   - `parent_student_associations` (Liên kết phụ huynh - học sinh)
3. **Domain 7: Nutrition & Food Allergy Safeguards (`F-NUT`)**
   - `student_allergies` (Danh mục dị ứng y tế của học sinh, mức độ nghiêm trọng)
   - `dish_allergens` (Cảnh báo thành phần dị ứng trong món ăn)
4. **Domain 1: Student Meal Management & Roster Lock (`F-PAR`)**
   - `meal_eligibility_criteria` & `student_meal_eligibilities` (Tiêu chuẩn & kết quả xét duyệt ăn bán trú)
   - `meal_registrations` (Đăng ký ăn theo kỳ/tháng, ghi chú ăn kiêng)
   - `meal_participations` (Điểm danh hàng ngày, khóa sổ 08:30 AM `is_locked`)
   - `meal_participation_changes` (Audit log bất biến ghi vết sửa điểm danh kèm lý do)
5. **Domain 2: Meal Planning & Menu Management (`F-PLN`)**
   - `dishes` (Danh mục món ăn, định lượng chuẩn, loại món)
   - `ingredients` (Thành phần nguyên liệu để gắn thẻ dị ứng)
   - `menus` (Thực đơn tuần, quy trình duyệt 1 cấp: `draft`, `submitted`, `approved`, `rejected`)
   - `menu_dishes` (Chi tiết món ăn trong thực đơn theo ngày và loại món)
   - `meal_schedules` (Gán thực đơn đã duyệt vào ngày lịch phục vụ)
6. **Domain 3: Meal Operations — Catering Workflow (`F-OPS`)**
   - `meal_demands` (Tổng hợp nhu cầu lúc 08:30 AM, tỷ lệ đệm `buffer_rate` 0–10%, `final_demand_count`)
   - `meal_demand_dish_quantities` (Chi tiết số lượng từng món cần cung cấp)
   - `meal_demand_changes` (Audit log điều chỉnh nhu cầu)
   - `catering_orders` (Đơn đặt hàng gửi catering trước 08:45 AM, trạng thái đơn)
   - `meal_deliveries` (Tiếp nhận giao hàng lúc 10:30 AM, biển số xe, số thùng)
   - `meal_inspections` (Kiểm thực 3 bước QĐ 1246/QĐ-BYT: nhiệt độ lõi $\ge 65^\circ\text{C}$, niêm phong, cảm quan, ảnh mẫu lưu 24h)
   - `meal_distributions` (Nhật ký chia suất về xe đẩy các lớp lúc 11:00 AM)
   - `meal_reconciliations` (Đối soát 3 bên lúc 13:00 PM: Đặt vs Giao vs Ăn)
   - `meal_discrepancies` (Ghi nhận nguyên nhân chênh lệch & điều chỉnh suất thanh toán)
7. **Domain 4: Meal Fee & Caterer Cost Management (`F-FEE`)**
   - `meal_fee_configs` (Biểu phí suất ăn / bữa, hiệu lực áp dụng)
   - `student_meal_bills` (Hóa đơn tiền ăn hàng tháng của học sinh)
   - `student_billing_items` (Chi tiết số bữa ăn tính phí, số bữa vắng có phép được hoàn tiền)
   - `meal_payments` (Giao dịch thanh toán: 3 trạng thái `unpaid`, `partial`, `paid`, mã VietQR động)
   - `catering_costs` & `vendor_payables` (Công nợ phải trả nhà cung cấp suất ăn theo số lượng nghiệm thu)
