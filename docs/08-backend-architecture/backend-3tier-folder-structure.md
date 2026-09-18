# Backend 3-Tier Architecture & Folder Structure Blueprint (NestJS + Prisma + PostgreSQL)

> **Hệ thống**: Hệ thống Quản lý Bán trú Tiểu học (Primary School Semi-Boarding Meal Management System)  
> **Kiến trúc**: Feature-Based 3-Tier Architecture (Presentation $\to$ Business Logic $\to$ Data Access)  
> **Framework & ORM**: NestJS (TypeScript), Prisma ORM v5, PostgreSQL 15  
> **API Standard**: RESTful API chuẩn OpenAPI 3.0 (Swagger)  

---

## 1. Nguyên tắc Thiết kế Kiến trúc 3 Tầng (Three-Tier Principles)

Mỗi feature/domain module trong `src/modules/` đại diện cho một domain nghiệp vụ độc lập, được đóng gói khép kín theo đúng 3 tầng:

1. **Tầng Trình diễn (Presentation Tier — `controllers/`, `dto/`)**:
   - Tiếp nhận HTTP requests, định tuyến URI (`/api/v1/...`).
   - Khai báo Swagger OpenAPI decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`).
   - Kiểm tra tính hợp lệ dữ liệu đầu vào thông qua `ValidationPipe` kết hợp `class-validator` / `class-transformer`.
   - Bảo vệ route thông qua `JwtAuthGuard` và `RolesGuard` với 4 role cố định (`ADM`, `MGR`, `ACC`, `PAR`).
   - **Quy tắc**: Controller **chỉ** gọi sang Services. Tuyệt đối không tương tác trực tiếp với PrismaClient hoặc viết logic nghiệp vụ tại Controller.

2. **Tầng Nghiệp vụ (Business Logic Tier — `services/`, Business Engines)**:
   - Chứa toàn bộ các luật kinh doanh, quy định mốc thời gian vàng (08:30 AM lock, 08:45 AM dispatch, 10:30 AM inspection $\ge 65^\circ\text{C}$).
   - Độc lập hoàn toàn với giao thức truyền thông (HTTP, WebSocket hay Cron Job).
   - Quản trị Transaction (`$transaction`), tính toán bộ đệm an toàn buffer ($0\%\text{--}10\%$), đối soát 3 bên sai lệch (Discrepancy Engine).
   - **Quy tắc**: Service orchestrate các Repositories và các Services phụ trợ khác. Không nhận đối tượng `Request`/`Response` từ Express.

3. **Tầng Truy xuất Dữ liệu (Data Access Tier — `repositories/`, `prisma/`)**:
   - Đóng gói toàn bộ các câu truy vấn cơ sở dữ liệu sử dụng `PrismaService`.
   - Cô lập các truy vấn phức tạp (joins, grouping, aggregates, raw SQL transactions) để ngăn rò rỉ chi tiết tầng cơ sở dữ liệu lên tầng nghiệp vụ.
   - Định nghĩa Repository Interfaces giúp dễ dàng viết Unit Test (Mocking).

---

## 2. Sơ đồ Cấu trúc Cây Thư mục Chi tiết (ASCII Tree)

```text
backend/
├── prisma/
│   ├── schema.prisma                  # Prisma Schema 3NF chuẩn hóa PostgreSQL 15 (Mapping DBML)
│   ├── seed.ts                        # Script nạp dữ liệu mẫu ban đầu (Master Data, Roles, Users)
│   └── migrations/                    # Lịch sử các bản migration cơ sở dữ liệu
│
├── src/
│   ├── main.ts                        # Entry point: Cấu hình Global Prefix, ValidationPipe, Swagger UI
│   ├── app.module.ts                  # Root Module tổng hợp cấu hình ConfigModule, PrismaModule và Feature Modules
│   │
│   ├── common/                        # Thành phần dùng chung xuyên suốt hệ thống (Cross-cutting Concerns)
│   │   ├── constants/                 # Các hằng số hệ thống (Mốc giờ 08:30:00, Tỷ lệ Buffer, Ngưỡng nhiệt độ 65°C)
│   │   │   ├── operational-times.constant.ts
│   │   │   └── error-codes.constant.ts
│   │   ├── decorators/                # Custom Decorators
│   │   │   ├── roles.decorator.ts     # @Roles(Role.MGR, Role.ACC)
│   │   │   └── current-user.decorator.ts # @CurrentUser() lấy payload từ JWT
│   │   ├── filters/                   # Exception Filters xử lý lỗi toàn cục
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/                    # Security Guards bảo mật
│   │   │   ├── jwt-auth.guard.ts      # Xác thực Bearer Token
│   │   │   ├── roles.guard.ts         # Kiểm tra quyền 4 Roles cố định (ADM, MGR, ACC, PAR)
│   │   │   └── cutoff-time.guard.ts   # Chặn cập nhật điểm danh sau 08:30 AM (HTTP 409 Conflict)
│   │   ├── interceptors/              # Interceptors ghi log và chuẩn hóa format JSON phản hồi
│   │   │   ├── transform-response.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   └── pipes/                     # Validation & Parse Pipes
│   │       └── parse-date.pipe.ts
│   │
│   ├── database/                      # Quản lý kết nối Cơ sở dữ liệu
│   │   └── prisma/
│   │       ├── prisma.service.ts      # Provider quản lý vòng đời PrismaClient ($connect, $disconnect)
│   │       └── prisma.module.ts       # Module Global cung cấp PrismaService
│   │
│   └── modules/                       # Các Feature Modules nghiệp vụ theo Domain
│       │
│       ├── auth/                      # Domain 6: Xác thực & Quản lý Phiên đăng nhập
│       │   ├── controllers/           # POST /api/v1/auth/login, /refresh, /logout
│       │   ├── services/              # Băm mật khẩu bcrypt, phát hành & kiểm tra JWT
│       │   ├── repositories/          # Truy vấn User credentials, Refresh Token session
│       │   ├── dto/                   # LoginDto, AuthResponseDto
│       │   └── auth.module.ts
│       │
│       ├── users/                     # Domain 6: Quản trị Người dùng & Phân quyền RBAC
│       │   ├── controllers/           # GET/POST/PUT /api/v1/users, /api/v1/admin/users
│       │   ├── services/              # Quản lý vòng đời tài khoản, kiểm tra vai trò
│       │   ├── repositories/          # Truy vấn bảng users, roles, user_roles
│       │   ├── dto/                   # CreateUserDto, UpdateUserDto, UserResponseDto
│       │   └── users.module.ts
│       │
│       ├── students/                  # Domain 1 & Domain 8: Học sinh, Lớp học & Điểm danh
│       │   ├── controllers/           # /api/v1/students, /api/v1/classes, /api/v1/participations
│       │   ├── services/              # Điểm danh học sinh, ghi nhận vắng có phép/không phép
│       │   ├── repositories/          # AttendanceRepository, StudentRepository
│       │   ├── dto/                   # AttendanceRollCallDto, StudentResponseDto
│       │   └── students.module.ts
│       │
│       ├── menus/                     # Domain 2: Quản lý Thực đơn & Món ăn
│       │   ├── controllers/           # /api/v1/dishes, /api/v1/menus
│       │   ├── services/              # Lên thực đơn tuần, phê duyệt thực đơn 1 cấp
│       │   ├── repositories/          # MenuRepository, DishRepository
│       │   ├── dto/                   # CreateMenuDto, CreateDishDto, MenuApprovalDto
│       │   └── menus.module.ts
│       │
│       ├── operations/                # Domain 3: Điều hành Suất ăn & Nhà cung cấp
│       │   ├── controllers/
│       │   │   ├── demand.controller.ts      # POST /api/v1/demands/calculate, /dispatch-order
│       │   │   └── operations.controller.ts  # POST /api/v1/operations/receiving, /inspect, /reconcile
│       │   ├── services/
│       │   │   ├── demand.service.ts         # Tính tổng suất ăn chốt sáng theo lớp
│       │   │   ├── buffer.engine.ts          # Tính bộ đệm an toàn buffer 0% - 10%
│       │   │   ├── catering-dispatch.service.ts # Bắn đơn hàng PO điện tử trước 08:45 AM
│       │   │   ├── receiving.service.ts      # Tiếp nhận hàng & kiểm thực 3 bước (>=65°C)
│       │   │   ├── distribution.service.ts   # Lập bảng phân bổ xe đẩy 11:00 AM
│       │   │   └── reconciliation.engine.ts  # Đối soát 3 bên 13:00 PM & tính thừa thiếu
│       │   ├── repositories/
│       │   │   ├── demand.repository.ts      # meal_demands, meal_demand_dish_quantities
│       │   │   ├── catering-order.repository.ts # catering_orders
│       │   │   ├── receiving.repository.ts   # meal_deliveries, meal_inspections
│       │   │   └── reconciliation.repository.ts # meal_reconciliations, meal_discrepancies
│       │   ├── dto/
│       │   │   ├── calculate-demand.dto.ts
│       │   │   ├── dispatch-order.dto.ts
│       │   │   ├── receiving-inspect.dto.ts
│       │   │   └── reconciliation-resolve.dto.ts
│       │   └── operations.module.ts
│       │
│       ├── finance/                   # Domain 4: Biểu phí, Hóa đơn & VietQR
│       │   ├── controllers/           # /api/v1/finance/rates, /invoices, /payments/webhook
│       │   ├── services/
│       │   │   ├── fee-schedule.service.ts   # Biểu phí đơn giá suất ăn
│       │   │   ├── billing-batch.service.ts  # Tính hóa đơn tháng trừ ngày vắng có phép
│       │   │   ├── vietqr.service.ts         # Sinh mã VietQR động chuẩn Napas
│       │   │   ├── payment.service.ts        # Xử lý webhook thanh toán từ ngân hàng
│       │   │   └── vendor-payable.service.ts # Ghi nhận công nợ nhà cung cấp từ biên bản đối soát
│       │   ├── repositories/
│       │   │   ├── fee-config.repository.ts  # meal_fee_configs
│       │   │   ├── billing.repository.ts     # student_meal_bills, student_billing_items
│       │   │   ├── payment.repository.ts     # meal_payments
│       │   │   └── payable.repository.ts     # vendor_payables
│       │   ├── dto/
│       │   │   ├── generate-billing.dto.ts
│       │   │   ├── payment-webhook.dto.ts
│       │   │   └── fee-config.dto.ts
│       │   └── finance.module.ts
│       │
│       ├── nutrition/                 # Domain 7: Dinh dưỡng & Cảnh báo Dị ứng Y tế
│       │   ├── controllers/           # /api/v1/nutrition, /api/v1/students/:id/allergies
│       │   ├── services/              # Quét đối soát món ăn trong thực đơn với dị ứng học sinh
│       │   ├── repositories/          # student_allergies, ingredients
│       │   ├── dto/                   # DeclareAllergyDto, AllergyConflictReportDto
│       │   └── nutrition.module.ts
│       │
│       └── reporting/                 # Domain 5: Báo cáo Vận hành & Minh bạch Bán trú
│           ├── controllers/           # /api/v1/reports/daily-operations, /financial-summary
│           ├── services/              # Tổng hợp dữ liệu báo cáo vận hành & công nợ
│           ├── repositories/          # Truy vấn dữ liệu thống kê tổng hợp
│           ├── dto/                   # OperationalReportFilterDto
│           └── reporting.module.ts
```
