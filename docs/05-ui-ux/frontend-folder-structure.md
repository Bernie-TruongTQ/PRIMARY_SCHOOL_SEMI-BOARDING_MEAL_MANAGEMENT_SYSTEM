# Frontend Folder Structure Blueprint (ReactJS + TypeScript + Vite)

> **Hệ thống**: Hệ thống Quản lý Bán trú Tiểu học (Primary School Semi-Boarding Meal Management System)  
> **Kiến trúc**: Atomic Design kết hợp Layered Services & Feature-Driven Role Portals  
> **Technology Stack**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4, Lucide/Heroicons, Axios / TanStack Query  

---

## 1. Nguyên tắc Thiết kế Cấu trúc Thư mục Frontend

Cấu trúc thư mục Frontend được thiết kế phân tầng triệt để, tách bạch hoàn toàn giữa **Tầng Trình diễn (UI Presentation)**, **Tầng Xử lý Trạng thái (Hooks/State)** và **Tầng Tương tác Dữ liệu (API Services & DTOs)**:

1. **Tuân thủ 4 Cổng thông tin độc lập (4 Fixed Role Portals)**:
   - `/coordinator/*`: Cổng Điều phối viên (MGR) — Dashboard chốt sĩ số, bộ đệm an toàn buffer, biên bản kiểm tra 3 bước 10:30 AM, phân phối xe đẩy và đối soát 13:00 PM.
   - `/accountant/*`: Cổng Kế toán (ACC) — Biểu phí đơn giá, tạo batch hóa đơn trừ ngày nghỉ có phép, đối soát VietQR, công nợ nhà cung cấp.
   - `/parent/*`: Cổng Phụ huynh (PAR) — Mobile-first, đăng ký bán trú, khai báo dị ứng, thực đơn tuần, mã VietQR thanh toán.
   - `/admin/*`: Cổng Quản trị viên (ADM) — Năm học, lớp học, học sinh, phê duyệt thực đơn 1 cấp, quản lý tài khoản.

2. **Áp dụng Atomic Design**:
   - `atoms/`: Phần tử giao diện nguyên tử, tái sử dụng toàn hệ thống, không chứa domain logic (Button, Input, Badge, StatusChip).
   - `molecules/`: Tổ hợp các atom thành cụm tương tác (SearchInput, MetricStatCard, FilterBar, DatePickerField, TemperatureInput).
   - `organisms/`: Các khối giao diện phức hợp (AppShell, Header, Sidebar, AttendanceTable, InspectionFormSheet, ReconciliationGrid).
   - `screens/`: Màn hình hoàn chỉnh tích hợp context nghiệp vụ theo từng route.

3. **Layered Services & API Integration**:
   - Mọi liên lạc HTTP đều đi qua `src/services/apiClient.ts` có Axios interceptors tự động đính kèm Bearer Token JWT và xử lý refresh token.
   - DTOs và TypeScript Interfaces khớp chuẩn 100% với schema OpenAPI 3.0 ([openapi.yaml](file:///d:/WORKSPACE/Top-Down-Approach/docs/07-api-documentation/openapi.yaml)).

---

## 2. Sơ đồ Cấu trúc Cây Thư mục Chi tiết (ASCII Tree)

```text
frontend/
├── public/                                # Tài nguyên tĩnh không qua đóng gói
│   ├── favicon.ico
│   └── mock-data/                         # Mock JSON fixtures phục vụ dev offline
│
├── src/
│   ├── main.tsx                           # Entry point của ứng dụng React
│   ├── index.css                          # Global styles, Tailwind CSS v4 tokens
│   ├── vite-env.d.ts                      # Vite types
│   │
│   ├── app/                               # Khởi tạo và định tuyến cấp cao
│   │   ├── app.tsx                        # Root layout & Router component
│   │   ├── routes.ts                      # Bảng định nghĩa Routes theo 4 Portals
│   │   └── providers.tsx                  # Wrapper các Global Providers (Auth, QueryClient)
│   │
│   ├── components/                        # Cấu trúc Atomic Design UI
│   │   ├── atoms/                         # UI Primitives không có domain logic
│   │   │   ├── button/                    # Nút bấm tái sử dụng (Primary, Outline, Danger)
│   │   │   ├── input/                     # Ô nhập text, số, checkbox, toggle pill
│   │   │   ├── StatusBadge.tsx            # Huy hiệu trạng thái (Present, Paid, Unpaid)
│   │   │   ├── AllergenChip.tsx           # Tag hiển thị dị ứng thực phẩm cảnh báo
│   │   │   ├── TemperatureBadge.tsx       # Tag hiển thị đạt/không đạt kiểm tra >=65°C
│   │   │   └── index.ts
│   │   │
│   │   ├── molecules/                     # Tổ hợp các atoms
│   │   │   ├── SearchInput.tsx            # Ô tìm kiếm có icon và nút clear
│   │   │   ├── MetricStatCard.tsx         # Thẻ hiển thị KPI thống kê
│   │   │   ├── FilterBar.tsx              # Thanh chọn khoảng ngày, lớp học, trạng thái
│   │   │   ├── BufferStepper.tsx          # Bộ điều khiển tăng giảm buffer 0% - 10%
│   │   │   ├── VietQRCodeView.tsx         # Component render mã VietQR kèm số tiền
│   │   │   └── index.ts
│   │   │
│   │   └── organisms/                     # Layouts và Khối màn hình phức tạp
│   │       ├── AppShell.tsx               # Shell chung (Header + Sidebar + Main content)
│   │       ├── Header.tsx                 # Thanh tiêu đề, thông báo, User Profile
│   │       ├── Sidebar.tsx                # Menu điều hướng theo Portal
│   │       ├── AttendanceRosterTable.tsx  # Bảng điểm danh học sinh với toggle chốt 08:30 AM
│   │       ├── InspectionFormSheet.tsx    # Phiếu kiểm tra 3 bước giao nhận cơm 10:30 AM
│   │       ├── ReconciliationGrid.tsx     # Bảng đối soát 3 bên 13:00 PM (Đặt - Giao - Ăn)
│   │       │
│   │       └── screens/                   # Các màn hình hoàn chỉnh theo 4 Portals
│   │           ├── coordinator/           # Cổng Điều phối viên (MGR)
│   │           │   ├── AttendanceScreen.tsx       # Màn hình chốt sĩ số điểm danh sáng
│   │           │   ├── DemandBoardScreen.tsx      # Màn hình tính toán suất ăn & bắn PO nhà bếp
│   │           │   ├── ReceivingScreen.tsx        # Màn hình nhận hàng & kiểm thực 3 bước
│   │           │   ├── DistributionScreen.tsx     # Màn hình phân phối xe đẩy về các lớp
│   │           │   └── ReconciliationScreen.tsx   # Màn hình đối soát 13:00 PM & tính thừa thiếu
│   │           │
│   │           ├── accountant/            # Cổng Kế toán (ACC)
│   │           │   ├── FeeRatesScreen.tsx         # Cấu hình đơn giá suất ăn học kỳ
│   │           │   ├── BillingBatchScreen.tsx     # Chạy tính tiền ăn & trừ ngày vắng có phép
│   │           │   ├── PaymentLedgerScreen.tsx    # Sổ theo dõi đóng tiền & kiểm tra VietQR
│   │           │   └── VendorPayablesScreen.tsx   # Quản lý công nợ & thanh toán nhà cung cấp
│   │           │
│   │           ├── parent/                # Cổng Phụ huynh (PAR - Mobile First)
│   │           │   ├── ParentDashboardScreen.tsx  # Trang tổng quan con em
│   │           │   ├── MenuDailyScreen.tsx        # Xem thực đơn & huy hiệu kiểm thực an toàn
│   │           │   ├── AllergyDeclarationScreen.tsx # Khai báo hồ sơ dị ứng y tế
│   │           │   └── InvoicePaymentScreen.tsx   # Xem hóa đơn tháng & quét VietQR
│   │           │
│   │           └── admin/                 # Cổng Quản trị viên (ADM)
│   │               ├── MasterDataScreen.tsx       # Thiết lập năm học, kỳ học, lớp, lịch ăn
│   │               ├── MenuApprovalScreen.tsx     # Duyệt thực đơn 1 cấp theo tuần
│   │               └── UserManagementScreen.tsx   # Quản lý tài khoản và gán Role cố định
│   │
│   ├── services/                          # Tầng Data Access & Gọi API (Khớp OpenAPI 3.0)
│   │   ├── apiClient.ts                   # Axios instance cấu hình BaseURL & Interceptors
│   │   ├── authService.ts                 # Gọi /api/v1/auth (login, refresh, logout)
│   │   ├── demandService.ts               # Gọi /api/v1/demands (tính suất, bắn PO)
│   │   ├── operationsService.ts           # Gọi /api/v1/operations (checkin, inspect, reconcile)
│   │   ├── financeService.ts              # Gọi /api/v1/finance (biểu phí, hóa đơn, VietQR)
│   │   ├── menuService.ts                 # Gọi /api/v1/menus, /api/v1/dishes
│   │   ├── nutritionService.ts            # Gọi /api/v1/nutrition (quét dị ứng)
│   │   └── studentService.ts              # Gọi /api/v1/students, /api/v1/classes
│   │
│   ├── hooks/                             # Custom Hooks đóng gói State & Side-effects
│   │   ├── useAuth.ts                     # Quản lý thông tin đăng nhập, vai trò RBAC
│   │   ├── useCountdownCutoff.ts          # Đếm ngược đến mốc chốt 08:30 AM
│   │   ├── useDemandCalculator.ts         # Hook tính toán tức thời suất ăn + buffer
│   │   ├── useInspectionValidator.ts      # Validate nhiệt độ >= 65°C & ảnh lưu mẫu
│   │   ├── useVietQRPolling.ts            # Polling hoặc WebSocket kiểm tra trạng thái thanh toán
│   │   └── useWebSocket.ts                # Lắng nghe sự kiện realtime từ Broker
│   │
│   ├── context/                           # React Contexts toàn cục
│   │   ├── AuthContext.tsx                # Context phiên người dùng
│   │   └── NotificationContext.tsx        # Toast thông báo toàn hệ thống
│   │
│   ├── types/                             # TypeScript Models & DTOs (Mapping 1:1 OpenAPI)
│   │   ├── auth.types.ts                  # LoginDto, UserRole ('ADM' | 'MGR' | 'ACC' | 'PAR')
│   │   ├── demand.types.ts                # DemandCalculationDto, CateringOrderDto
│   │   ├── operations.types.ts            # InspectionDto, DistributionDto, ReconciliationDto
│   │   ├── finance.types.ts               # FeeConfigDto, StudentBillDto, PaymentWebhookDto
│   │   ├── menu.types.ts                  # DishDto, MenuDto, CourseType
│   │   └── student.types.ts               # StudentDto, ParticipationStatus, AllergyDto
│   │
│   └── utils/                             # Tiện ích dùng chung
│       ├── currencyFormatter.ts           # Định dạng tiền tệ VND (e.g. 700.000 đ)
│       ├── dateFormatter.ts               # Xử lý ngày tháng định dạng VN (DD/MM/YYYY)
│       └── temperatureValidator.ts        # Hàm helper kiểm tra ngưỡng an toàn vệ sinh thực phẩm
```
