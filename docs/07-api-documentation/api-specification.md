# Primary School Semi-Boarding Meal Management System — RESTful API Specification

**Document Version:** 1.0.0-MVP  
**Architecture Standard:** OpenAPI 3.0.3 Compatible / RESTful Standard  
**Operating Model:** External Catering Vendor Model (Lunch-Only Scope, Mon–Fri)  
**Security Standard:** Bearer JWT in `Authorization` header / HTTP-Only Cookies  

---

## 1. Global Architectural Conventions & Policies

### 1.1 Base URL & Versioning
- **Base URL:** `https://api.schoolmeals.edu.vn/api/v1`
- **Protocol:** HTTPS only (TLS 1.3 required in production).
- **Format:** All requests and responses use `application/json; charset=utf-8` (except multipart image uploads for food inspections).

### 1.2 Authentication & Fixed 4-Role RBAC Model
Authentication uses cryptographically signed JSON Web Tokens (JWT).
Every protected endpoint requires:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```
The token payload contains:
```json
{
  "sub": 102,
  "username": "coordinator.lan",
  "email": "lan.tran@school.edu.vn",
  "role": "MGR",
  "iat": 1773738000,
  "exp": 1773766800
}
```

The system enforces a **Fixed 4-Role RBAC Model**:
1. `ADM`: School Administrator / Principal (Academic setup, calendar, 1-level menu approval, user accounts).
2. `MGR`: Semi-Boarding Coordinator / Meal Manager (Classroom attendance monitoring, cutoff lock, demand calculation, catering PO dispatch, receiving inspection, distribution, reconciliation).
3. `ACC`: School Accountant (Meal fee configuration, monthly billing batch, VietQR payments, catering vendor payables).
4. `PAR`: Student Parent / Guardian (Semester boarding registration, medical allergy declaration, daily menu/inspection transparency, bill payments).

### 1.3 Statutory Operational Cutoffs & Temporal Guards
The API enforces non-negotiable temporal constraints governed by server time (`UTC+07:00 / Asia/Ho_Chi_Minh`):
- **08:30:00 AM (Attendance Lock)**: `POST /api/v1/classes/:id/attendance/bulk` is rejected with `409 Conflict` (`CUTOFF_EXCEEDED`) after 08:30:00 AM. Subsequent adjustments require `POST /api/v1/participations/:id/amend` with mandatory justification notes.
- **08:45:00 AM (PO Dispatch Deadline)**: `POST /api/v1/demands/dispatch-order` must execute before 08:45:00 AM to guarantee the external catering vendor can prepare and ship hot thermal containers.
- **10:30:00 AM (Receiving & 3-Step Inspection)**: `POST /api/v1/operations/receiving/inspect` enforces Ministry of Health Decision 1246/QĐ-BYT: core food temp $T_{\text{core}} \ge 65.0^\circ\text{C}$, tamper-evident seals intact, sensory check pass, and 24-hour food retention sample photo uploaded. If $T_{\text{core}} < 65.0^\circ\text{C}$, the request returns `422 Unprocessable Entity` (`HACCP_TEMP_DEFICIT`).
- **11:00:00 AM (Classroom Distribution)**: `POST /api/v1/operations/distribution/confirm` records meal tray dispatch to classroom trolleys.
- **13:00:00 PM (3-Way Reconciliation)**: `POST /api/v1/operations/reconciliation/resolve` compares Ordered vs. Delivered vs. Consumed, enforces discrepancy logging, and automatically posts accepted payable counts to `vendor_payables`.

### 1.4 Standardized Response Envelopes
All responses follow a predictable envelope pattern:

**Success Response Envelope (2xx):**
```json
{
  "success": true,
  "data": {},
  "metadata": {
    "timestamp": "2026-10-12T08:31:00+07:00",
    "requestId": "req_88a91f2c-49b0"
  }
}
```

**Paginated Response Envelope:**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 45,
    "totalPages": 3
  },
  "metadata": {
    "timestamp": "2026-10-12T08:31:00+07:00",
    "requestId": "req_88a91f2c-49b0"
  }
}
```

**Standard Error Envelope (4xx, 5xx):**
```json
{
  "success": false,
  "error": {
    "code": "CUTOFF_EXCEEDED",
    "message": "Classroom attendance roster is locked after 08:30:00 AM. Direct modifications are disallowed.",
    "details": [
      {
        "field": "cutoff_time",
        "value": "08:30:00",
        "currentTime": "08:32:15"
      }
    ]
  },
  "metadata": {
    "timestamp": "2026-10-12T08:32:15+07:00",
    "requestId": "req_f1a23b90-11ce"
  }
}
```

### 1.5 Standard Error Code Reference

| HTTP Status | Error Code | Description | Resolution / Action |
|---|---|---|---|
| `400 Bad Request` | `VALIDATION_ERROR` | Request payload fails schema validation or missing required fields | Check request body against parameter definitions |
| `401 Unauthorized` | `UNAUTHENTICATED` | Missing, expired, or cryptographically invalid Bearer JWT | Re-authenticate via `POST /api/v1/auth/login` |
| `403 Forbidden` | `INSUFFICIENT_ROLE` | Authenticated user lacks required fixed role permissions | Check endpoint RBAC policy against active role |
| `404 Not Found` | `RESOURCE_NOT_FOUND` | Targeted entity ID does not exist | Verify path parameter ID |
| `409 Conflict` | `CUTOFF_EXCEEDED` | Attempted modification after 08:30:00 AM attendance lock | Submit amendment request via `/participations/:id/amend` |
| `409 Conflict` | `STATE_CONFLICT` | Resource already in final state (e.g. menu already approved) | Verify current state before transition |
| `422 Unprocessable Entity` | `HACCP_TEMP_DEFICIT` | Dock receiving core food temperature $< 65.0^\circ\text{C}$ | Reject delivery shipment or initiate secondary inspection |
| `422 Unprocessable Entity` | `MISSING_SAMPLE_PHOTO` | 24-hour food retention sample photo missing from inspection | Upload valid sample jar image before clearing |
| `500 Internal Error` | `INTERNAL_SERVER_ERROR`| Unhandled server-side exception | Contact system administrator with `requestId` |

---

## 2. Authentication & User Management (Domain 6: `F-USR`)

### 2.1 Authenticate User (Login)
- **Endpoint:** `POST /api/v1/auth/login`
- **Feature ID:** `F-USR-01`
- **Actor / Screen:** Public / `SCR-AUTH-01` (Login Portal)
- **RBAC Policy:** Public (No authentication required)
- **Description:** Authenticates user credentials, validates active account status, and issues access JWT token containing assigned fixed role (`ADM`, `MGR`, `ACC`, `PAR`).

**Request Body:**
```json
{
  "username": "coordinator.lan",
  "password": "SecurePassword123!"
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 28800,
    "tokenType": "Bearer",
    "user": {
      "id": 102,
      "username": "coordinator.lan",
      "email": "lan.tran@school.edu.vn",
      "fullName": "Trần Thị Lan",
      "phone": "0912345678",
      "role": "MGR",
      "roleName": "Phụ trách Bán trú"
    }
  },
  "metadata": {
    "timestamp": "2026-10-12T07:45:00+07:00",
    "requestId": "req_01"
  }
}
```

**Code Example (cURL):**
```bash
curl -X POST https://api.schoolmeals.edu.vn/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "coordinator.lan",
    "password": "SecurePassword123!"
  }'
```

---

### 2.2 Get Current User Profile
- **Endpoint:** `GET /api/v1/users/profile`
- **Feature ID:** `F-USR-01`
- **RBAC Policy:** `ADM`, `MGR`, `ACC`, `PAR`
- **Description:** Returns profile details of the authenticated identity. If role is `PAR`, includes associated children.

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": 401,
    "username": "parent.minh",
    "email": "minh.nguyen@gmail.com",
    "fullName": "Nguyễn Văn Minh",
    "role": "PAR",
    "children": [
      {
        "studentId": 1052,
        "studentCode": "HS2026-042",
        "fullName": "Nguyễn Hoàng Nam",
        "className": "2A",
        "hasSevereAllergy": true
      }
    ]
  },
  "metadata": {
    "timestamp": "2026-10-12T07:46:00+07:00",
    "requestId": "req_02"
  }
}
```

---

### 2.3 List Users with Role Assignment
- **Endpoint:** `GET /api/v1/admin/users`
- **Feature ID:** `F-USR-02`
- **RBAC Policy:** `ADM` only
- **Query Parameters:**
  - `role` (optional): Filter by `ADM`, `MGR`, `ACC`, `PAR`.
  - `page` (default: 1): Page number.
  - `pageSize` (default: 20): Items per page.

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": 102,
      "username": "coordinator.lan",
      "fullName": "Trần Thị Lan",
      "email": "lan.tran@school.edu.vn",
      "role": "MGR",
      "isActive": true,
      "lastLoginAt": "2026-10-12T07:45:00+07:00"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 52,
    "totalPages": 3
  }
}
```

---

### 2.4 Create User Account with Fixed Role
- **Endpoint:** `POST /api/v1/admin/users`
- **Feature ID:** `F-USR-02`
- **RBAC Policy:** `ADM` only
- **Description:** Administrator provisions a staff or parent user with an immutable assigned role from the fixed 4-role set.

**Request Body:**
```json
{
  "username": "accountant.huong",
  "email": "huong.le@school.edu.vn",
  "fullName": "Lê Thị Hương",
  "phone": "0987654321",
  "password": "TemporaryPassword123!",
  "role": "ACC"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": 103,
    "username": "accountant.huong",
    "email": "huong.le@school.edu.vn",
    "fullName": "Lê Thị Hương",
    "role": "ACC",
    "isActive": true,
    "createdAt": "2026-10-12T07:50:00+07:00"
  }
}
```

---

## 3. Master Data & Academic Configuration (Domain 8: `F-MST`)

### 3.1 List Academic Terms & Semesters
- **Endpoint:** `GET /api/v1/master/terms`
- **Feature ID:** `F-MST-01`
- **RBAC Policy:** `ADM`, `MGR`, `ACC`
- **Description:** Returns academic school years and semesters.

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "2026-2027",
      "name": "Năm học 2026 - 2027",
      "isActive": true,
      "semesters": [
        {
          "id": 1,
          "code": "SEM1",
          "name": "Học kỳ 1",
          "startDate": "2026-09-05",
          "endDate": "2027-01-15",
          "isActive": true
        },
        {
          "id": 2,
          "code": "SEM2",
          "name": "Học kỳ 2",
          "startDate": "2027-01-20",
          "endDate": "2027-05-31",
          "isActive": false
        }
      ]
    }
  ]
}
```

---

### 3.2 List Grades and Classes
- **Endpoint:** `GET /api/v1/master/classes`
- **Feature ID:** `F-MST-01`
- **RBAC Policy:** `ADM`, `MGR`, `ACC`
- **Query Parameters:**
  - `schoolYearId` (required, integer)
  - `gradeLevel` (optional, 1..5)

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "name": "2A",
      "gradeLevel": 2,
      "gradeName": "Khối 2",
      "homeroomTeacherId": 204,
      "homeroomTeacherName": "Nguyễn Thị Mai",
      "classroomLocation": "Phòng 204 - Dãy B",
      "totalEnrolledStudents": 32,
      "registeredBoardingStudents": 30
    }
  ]
}
```

---

### 3.3 List Serving Calendar & Non-Meal Holidays
- **Endpoint:** `GET /api/v1/master/calendar/holidays`
- **Feature ID:** `F-MST-02`
- **RBAC Policy:** `ADM`, `MGR`, `ACC`, `PAR`
- **Query Parameters:**
  - `schoolYearId` (required, integer)
  - `month` (optional, `YYYY-MM`)

**Description:** Returns scheduled institutional non-serving holidays (Tet, Teacher's Day, etc.) that are automatically subtracted from fee assessments and daily meal operations.

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "Kỷ niệm Ngày Nhà giáo Việt Nam",
      "startDate": "2026-11-20",
      "endDate": "2026-11-20",
      "description": "Nghỉ lễ toàn trường, không phục vụ bán trú"
    }
  ]
}
```

---

## 4. Student Meal & Participation Management (Domain 1: `F-PAR`)

### 4.1 Get Student Boarding Eligibility
- **Endpoint:** `GET /api/v1/students/eligibility`
- **Feature ID:** `F-PAR-01`
- **RBAC Policy:** `ADM`, `MGR`, `PAR`
- **Query Parameters:**
  - `studentId` (required, integer)

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "studentId": 1052,
    "studentCode": "HS2026-042",
    "fullName": "Nguyễn Hoàng Nam",
    "eligibilityStatus": "eligible",
    "verifiedAt": "2026-08-25T14:30:00+07:00",
    "criteriaMet": [
      "Đủ điều kiện sức khỏe",
      "Đang học lớp chính khóa bán trú"
    ]
  }
}
```

---

### 4.2 Register / Modify Semester Meal Program
- **Endpoint:** `POST /api/v1/registrations/apply`
- **Feature ID:** `F-PAR-02`
- **Actor / Screen:** Parent / `SCR-PAR-02`
- **RBAC Policy:** `PAR`, `MGR`, `ADM`
- **Description:** Enrolls student in semester lunch program and records dietary preferences.

**Request Body:**
```json
{
  "studentId": 1052,
  "semesterId": 1,
  "status": "active",
  "dietaryNotes": "Kiêng tôm cua do dị ứng nhẹ ngoài da"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "registrationId": 804,
    "studentId": 1052,
    "semesterId": 1,
    "status": "active",
    "registeredAt": "2026-09-01T09:15:00+07:00"
  }
}
```

---

### 4.3 Get Classroom Daily Attendance Roster
- **Endpoint:** `GET /api/v1/classes/:classId/attendance`
- **Feature ID:** `F-PAR-03`, `F-PAR-04`, `F-NUT-01`
- **Actor / Screen:** Homeroom Teacher, Coordinator / `SCR-TCH-01`, `SCR-MGR-01`
- **RBAC Policy:** `MGR`, `ADM`
- **Path Parameters:**
  - `classId` (integer): ID of class (e.g. `12` for class 2A).
- **Query Parameters:**
  - `date` (format: `YYYY-MM-DD`, default: today).

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "classId": 12,
    "className": "2A",
    "mealScheduleId": 42,
    "mealDate": "2026-10-12",
    "cutoffTime": "08:30:00",
    "isLocked": false,
    "totalRegistered": 30,
    "summary": {
      "present": 28,
      "absentExcused": 2,
      "absentUnexcused": 0
    },
    "students": [
      {
        "participationId": 5012,
        "studentId": 1052,
        "studentCode": "HS2026-042",
        "fullName": "Nguyễn Hoàng Nam",
        "status": "present",
        "notes": null,
        "allergyWarnings": [
          {
            "allergenType": "seafood",
            "allergenName": "Tôm, cua",
            "severity": "moderate"
          }
        ]
      },
      {
        "participationId": 5013,
        "studentId": 1053,
        "studentCode": "HS2026-043",
        "fullName": "Lê Bảo Anh",
        "status": "absent_excused",
        "notes": "Nghỉ ốm có phép",
        "allergyWarnings": []
      }
    ]
  }
}
```

---

### 4.4 Bulk Submit Classroom Attendance (Pre-Cutoff)
- **Endpoint:** `POST /api/v1/classes/:classId/attendance/bulk`
- **Feature ID:** `F-PAR-03`
- **Actor / Screen:** Homeroom Teacher / `SCR-TCH-01`
- **RBAC Policy:** `MGR`, `ADM`
- **Temporal Constraint:** **Must execute before 08:30:00 AM**. `AttendanceCutoffGuard` will intercept and return `409 Conflict` if server time $\ge 08:30:00$.

**Request Body:**
```json
{
  "mealScheduleId": 42,
  "attendees": [
    {
      "studentId": 1052,
      "status": "present",
      "notes": null
    },
    {
      "studentId": 1053,
      "status": "absent_excused",
      "notes": "Nghỉ ốm có đơn phép"
    }
  ]
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "classId": 12,
    "mealScheduleId": 42,
    "updatedCount": 30,
    "confirmedPresent": 28,
    "confirmedAbsent": 2,
    "savedAt": "2026-10-12T08:21:40+07:00"
  }
}
```

**Cutoff Exceeded Error (`409 Conflict`):**
```json
{
  "success": false,
  "error": {
    "code": "CUTOFF_EXCEEDED",
    "message": "Classroom attendance roster was locked at 08:30:00 AM. Direct mutations are blocked.",
    "details": [
      {
        "cutoff": "08:30:00",
        "serverTime": "08:31:14"
      }
    ]
  }
}
```

---

### 4.5 Lock Classroom Attendance Roster
- **Endpoint:** `POST /api/v1/classes/:classId/attendance/lock`
- **Feature ID:** `F-PAR-03`, `F-PAR-04`
- **RBAC Policy:** `MGR`, `ADM`
- **Description:** Formally seals the classroom roster for the day, triggering a real-time event via WebSocket to the Coordinator dashboard.

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "classId": 12,
    "mealScheduleId": 42,
    "isLocked": true,
    "lockedBy": 102,
    "lockedAt": "2026-10-12T08:25:00+07:00",
    "presentCount": 28
  }
}
```

---

### 4.6 Post-Cutoff Emergency Attendance Amendment
- **Endpoint:** `POST /api/v1/participations/:id/amend`
- **Feature ID:** `F-PAR-02`, `F-PAR-03`
- **Actor / Screen:** Coordinator / `SCR-MGR-01`, `SCR-TCH-02`
- **RBAC Policy:** `MGR`, `ADM`
- **Description:** Allows adjusting locked attendance after 08:30 AM with a mandatory justification note, recording an audit entry into `meal_participation_changes`.

**Request Body:**
```json
{
  "newStatus": "absent_excused",
  "reason": "Phụ huynh gọi điện báo con sốt cao đón về lúc 08:35 AM"
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "participationId": 5012,
    "oldStatus": "present",
    "newStatus": "absent_excused",
    "amendedBy": 102,
    "amendedAt": "2026-10-12T08:36:12+07:00",
    "auditLogged": true
  }
}
```

---

## 5. Meal Planning & Menu Management (Domain 2: `F-PLN`)

### 5.1 List Dishes in Catalog
- **Endpoint:** `GET /api/v1/dishes`
- **Feature ID:** `F-PLN-01`
- **RBAC Policy:** `MGR`, `ADM`, `ACC`
- **Query Parameters:**
  - `courseType` (optional: `main_entree`, `side_dish`, `soup`, `dessert`)
  - `status` (default: `active`)

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "name": "Thịt heo kho trứng cút",
      "courseType": "main_entree",
      "standardPortionWeight": 100.0,
      "unit": "grams",
      "caloriesKcal": 280.5,
      "allergens": ["egg"]
    },
    {
      "id": 102,
      "name": "Canh bí xanh nấu thịt nạc",
      "courseType": "soup",
      "standardPortionWeight": 150.0,
      "unit": "ml",
      "caloriesKcal": 65.0,
      "allergens": []
    }
  ]
}
```

---

### 5.2 Create / Update Dish Profile
- **Endpoint:** `POST /api/v1/dishes`
- **Feature ID:** `F-PLN-01`
- **RBAC Policy:** `MGR`, `ADM`

**Request Body:**
```json
{
  "name": "Cá ba sa phi lê sốt cà chua",
  "courseType": "main_entree",
  "standardPortionWeight": 90.0,
  "unit": "grams",
  "caloriesKcal": 210.0,
  "description": "Cá fillet chiên vàng sốt cà chua tươi thì là",
  "ingredientIds": [12, 45, 8]
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": 108,
    "name": "Cá ba sa phi lê sốt cà chua",
    "courseType": "main_entree",
    "createdAt": "2026-10-12T09:00:00+07:00"
  }
}
```

---

### 5.3 Get Weekly Menu Details
- **Endpoint:** `GET /api/v1/menus/weekly`
- **Feature ID:** `F-PLN-02`
- **RBAC Policy:** `MGR`, `ADM`, `PAR`
- **Query Parameters:**
  - `schoolYearId` (required, integer)
  - `weekNumber` (required, 1..52)

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "menuId": 42,
    "schoolYearId": 1,
    "weekNumber": 42,
    "name": "Thực đơn Tuần 42 (12/10 - 16/10)",
    "approvalStatus": "approved",
    "approvedBy": 101,
    "approvedAt": "2026-10-09T16:00:00+07:00",
    "days": [
      {
        "dayOfWeek": 2,
        "dayName": "Thứ Hai",
        "dishes": [
          { "dishId": 101, "courseType": "main_entree", "name": "Thịt heo kho trứng cút" },
          { "dishId": 102, "courseType": "soup", "name": "Canh bí xanh nấu thịt nạc" },
          { "dishId": 103, "courseType": "side_dish", "name": "Bắp cải xào nấm" },
          { "dishId": 104, "courseType": "dessert", "name": "Chuối tiêu chín" }
        ]
      }
    ]
  }
}
```

---

### 5.4 Submit Weekly Menu for Review
- **Endpoint:** `POST /api/v1/menus`
- **Feature ID:** `F-PLN-02`
- **RBAC Policy:** `MGR`, `ADM`

**Request Body:**
```json
{
  "schoolYearId": 1,
  "weekNumber": 43,
  "name": "Thực đơn Tuần 43 (19/10 - 23/10)",
  "dishes": [
    { "dayOfWeek": 2, "dishId": 108 },
    { "dayOfWeek": 2, "dishId": 102 }
  ]
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "menuId": 43,
    "approvalStatus": "submitted",
    "submittedAt": "2026-10-12T09:30:00+07:00"
  }
}
```

---

### 5.5 Single-Level Menu Approval Sign-off
- **Endpoint:** `POST /api/v1/menus/:menuId/approve`
- **Feature ID:** `F-PLN-02`
- **Actor / Screen:** Principal / `SCR-ADM-04`
- **RBAC Policy:** `ADM` only
- **Description:** Administrator approves or rejects weekly menu. If approved, locks dishes against edits.

**Request Body:**
```json
{
  "decision": "approved",
  "notes": "Thực đơn đảm bảo dinh dưỡng và đa dạng món ăn."
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "menuId": 43,
    "approvalStatus": "approved",
    "approvedBy": 101,
    "approvedAt": "2026-10-12T10:00:00+07:00"
  }
}
```

---

## 6. Meal Operation & External Catering Management (Domain 3: `F-OPS`)

### 6.1 Aggregate Lunch Demand & Calculate Safety Buffer
- **Endpoint:** `POST /api/v1/demands/calculate`
- **Feature ID:** `F-OPS-01`
- **Actor / Screen:** Coordinator / `SCR-MGR-01`
- **RBAC Policy:** `MGR`, `ADM`
- **Description:** Runs immediately after 08:30:00 AM attendance lockdown. Aggregates all confirmed attendees across classrooms and applies safety buffer margin ($0\%\text{--}10\%$).

**Request Body:**
```json
{
  "mealScheduleId": 42,
  "bufferRate": 0.05
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "mealDemandId": 901,
    "mealScheduleId": 42,
    "mealDate": "2026-10-12",
    "confirmedAttendance": 1200,
    "specialDietaryCount": 18,
    "bufferRate": 0.05,
    "bufferQuantity": 60,
    "finalDemandCount": 1260,
    "determinationMethod": "attendance_based",
    "status": "calculated",
    "dishBreakdown": [
      {
        "dishId": 101,
        "name": "Thịt heo kho trứng cút",
        "expectedQuantity": 126.0,
        "unit": "kg"
      },
      {
        "dishId": 102,
        "name": "Canh bí xanh nấu thịt nạc",
        "expectedQuantity": 189.0,
        "unit": "liters"
      }
    ]
  }
}
```

---

### 6.2 Dispatch Purchase Order to Catering Vendor
- **Endpoint:** `POST /api/v1/demands/dispatch-order`
- **Feature ID:** `F-OPS-02`
- **Actor / Screen:** Coordinator / `SCR-MGR-01`
- **RBAC Policy:** `MGR`, `ADM`
- **Temporal Constraint:** **Must execute before 08:45:00 AM**.
- **Description:** Generates formal purchase order record and transmits payload electronically to external catering partner.

**Request Body:**
```json
{
  "mealDemandId": 901,
  "vendorName": "Công ty Suất ăn Công nghiệp Hà Nội SunFood",
  "targetDeliveryTime": "2026-10-12T10:30:00+07:00",
  "notes": "18 suất ăn riêng không hải sản đóng thùng dán nhãn màu vàng"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "cateringOrderId": 650,
    "orderCode": "PO-20261012-01",
    "mealDemandId": 901,
    "vendorName": "Công ty Suất ăn Công nghiệp Hà Nội SunFood",
    "totalOrderedPortions": 1260,
    "standardPortions": 1242,
    "specialDietaryPortions": 18,
    "status": "dispatched",
    "dispatchedAt": "2026-10-12T08:38:20+07:00",
    "vendorAcknowledged": true,
    "vendorTrackingRef": "SF-VN-99214"
  }
}
```

---

### 6.3 Dock Receiving Check-in (Vehicle Arrival)
- **Endpoint:** `POST /api/v1/operations/receiving/checkin`
- **Feature ID:** `F-OPS-03`
- **Actor / Screen:** Coordinator / `SCR-MGR-02`
- **RBAC Policy:** `MGR`, `ADM`
- **Description:** Records catering truck arrival at loading dock (~10:30 AM).

**Request Body:**
```json
{
  "cateringOrderId": 650,
  "vehiclePlate": "29H-882.14",
  "driverName": "Vũ Văn Thắng",
  "thermalContainerCount": 42,
  "deliveredPortions": 1260
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "mealDeliveryId": 320,
    "cateringOrderId": 650,
    "arrivalTime": "2026-10-12T10:28:15+07:00",
    "vehiclePlate": "29H-882.14",
    "status": "arrived"
  }
}
```

---

### 6.4 Submit 3-Step Food Safety Inspection (Decision 1246/QĐ-BYT)
- **Endpoint:** `POST /api/v1/operations/receiving/inspect`
- **Feature ID:** `F-OPS-03`
- **Actor / Screen:** Coordinator, School Nurse / `SCR-MGR-02`
- **RBAC Policy:** `MGR`, `ADM`
- **Statutory Rules:**
  - `coreTemperature` must be $\ge 65.0^\circ\text{C}$ (returns `422 HACCP_TEMP_DEFICIT` if $< 65.0^\circ\text{C}$).
  - `containerSealsIntact` must be `true`.
  - `sensoryEvalPass` must be `true`.
  - `retentionSampleTaken` must be `true`.

**Request Body:**
```json
{
  "mealDeliveryId": 320,
  "coreTemperature": 72.5,
  "containerSealsIntact": true,
  "sensoryEvalPass": true,
  "retentionSampleTaken": true,
  "thermometerPhotoUrl": "https://storage.schoolmeals.edu.vn/inspections/20261012-temp-725.jpg",
  "samplePhotoUrl": "https://storage.schoolmeals.edu.vn/inspections/20261012-sample-jar.jpg",
  "notes": "Nhiệt độ đạt chuẩn, niêm chì nguyên vẹn, mẫu lưu niêm phong tủ lạnh chuyên dụng"
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "inspectionId": 320,
    "mealDeliveryId": 320,
    "inspectionResult": "passed",
    "inspectedAt": "2026-10-12T10:33:00+07:00",
    "status": "accepted",
    "readyForDistribution": true
  }
}
```

**HACCP Temperature Rejection (`422 Unprocessable Entity`):**
```json
{
  "success": false,
  "error": {
    "code": "HACCP_TEMP_DEFICIT",
    "message": "Nhiệt độ thức ăn không đạt chuẩn an toàn thực phẩm (Quy định: >= 65.0°C).",
    "details": [
      {
        "measuredTemp": 58.2,
        "minimumAllowed": 65.0,
        "riskLevel": "CRITICAL_HAZARD"
      }
    ]
  }
}
```

---

### 6.5 Get Classroom Trolley Distribution Plan
- **Endpoint:** `GET /api/v1/operations/distribution/plan`
- **Feature ID:** `F-OPS-04`
- **RBAC Policy:** `MGR`, `ADM`
- **Query Parameters:**
  - `mealDeliveryId` (required, integer)

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "deliveryId": 320,
    "totalPortionsToDistribute": 1260,
    "classes": [
      {
        "classId": 12,
        "className": "2A",
        "location": "Phòng 204 - Dãy B",
        "allocatedPortions": 28,
        "specialDietaryPortions": 1,
        "dietaryNote": "1 khay không hải sản (HS Nguyễn Hoàng Nam)",
        "status": "preparing"
      }
    ]
  }
}
```

---

### 6.6 Confirm Classroom Trolley Distribution
- **Endpoint:** `POST /api/v1/operations/distribution/confirm`
- **Feature ID:** `F-OPS-04`
- **Actor / Screen:** Coordinator / `SCR-MGR-02`
- **RBAC Policy:** `MGR`, `ADM`

**Request Body:**
```json
{
  "mealDeliveryId": 320,
  "classId": 12,
  "allocatedPortions": 28,
  "specialDietaryPortions": 1,
  "receivedByTeacherId": 204
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "distributionId": 710,
    "classId": 12,
    "status": "delivered",
    "distributedAt": "2026-10-12T11:05:00+07:00"
  }
}
```

---

### 6.7 Run 3-Way Post-Lunch Quantity Reconciliation (13:00 PM)
- **Endpoint:** `POST /api/v1/operations/reconciliation/calculate`
- **Feature ID:** `F-OPS-05`
- **Actor / Screen:** Coordinator / `SCR-MGR-03`
- **RBAC Policy:** `MGR`, `ADM`, `ACC`
- **Description:** Compares Ordered vs. Delivered vs. Consumed at 13:00 PM.

**Request Body:**
```json
{
  "cateringOrderId": 650
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "cateringOrderId": 650,
    "orderedQuantity": 1260,
    "deliveredQuantity": 1260,
    "consumedQuantity": 1202,
    "leftoverQuantity": 58,
    "deliveryVariance": 0,
    "consumptionVariance": -58,
    "varianceType": "exact_match",
    "recommendedPayablePortions": 1260
  }
}
```

---

### 6.8 Resolve Reconciliation Discrepancy & Accrue Payables
- **Endpoint:** `POST /api/v1/operations/reconciliation/resolve`
- **Feature ID:** `F-OPS-05`, `F-FEE-04`
- **Actor / Screen:** Coordinator / `SCR-MGR-03`
- **RBAC Policy:** `MGR`, `ADM`
- **Description:** Saves mandatory discrepancy reason and posts accepted payable portions directly to the School Accountant's ledger (`vendor_payables`).

**Request Body:**
```json
{
  "cateringOrderId": 650,
  "deliveredQuantity": 1260,
  "acceptedPayableQuantity": 1260,
  "discrepancyCount": 58,
  "discrepancyReason": "58 suất đệm an toàn không dùng hết được lưu trữ / hủy theo quy định",
  "financialImpactNote": "Nhà trường thanh toán đủ 1.260 suất theo hợp đồng đặt trước"
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "reconciliationId": 412,
    "cateringOrderId": 650,
    "acceptedPayableQuantity": 1260,
    "accruedInVendorLedger": true,
    "reconciledAt": "2026-10-12T13:10:00+07:00"
  }
}
```

---

## 7. Nutrition & Food Allergy Safeguards (Domain 7: `F-NUT`)

### 7.1 Get Student Allergy Profile
- **Endpoint:** `GET /api/v1/students/:studentId/allergies`
- **Feature ID:** `F-NUT-01`
- **RBAC Policy:** `PAR`, `MGR`, `ADM`

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "studentId": 1052,
    "fullName": "Nguyễn Hoàng Nam",
    "allergies": [
      {
        "id": 14,
        "allergenType": "seafood",
        "allergenName": "Tôm, cua, ghẹ",
        "severity": "moderate",
        "medicalActionPlan": "Uống thuốc kháng histamin nếu nổi mề đay, báo ngay cho nhân viên y tế",
        "diagnosedBy": "Bệnh viện Nhi Trung ương"
      }
    ]
  }
}
```

---

### 7.2 Declare / Update Student Medical Allergy
- **Endpoint:** `POST /api/v1/students/:studentId/allergies`
- **Feature ID:** `F-NUT-01`
- **Actor / Screen:** Parent / `SCR-PAR-03`
- **RBAC Policy:** `PAR`, `ADM`

**Request Body:**
```json
{
  "allergenType": "peanut",
  "allergenName": "Đậu phộng / Lạc",
  "severity": "severe_anaphylaxis",
  "medicalActionPlan": "Tiêm bút tiêm Epinephrine tự động và gọi cấp cứu 115 ngay lập tức",
  "diagnosedBy": "Bệnh viện Bạch Mai"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "studentId": 1052,
    "allergenType": "peanut",
    "severity": "severe_anaphylaxis",
    "createdAt": "2026-10-12T14:00:00+07:00"
  }
}
```

---

### 7.3 Detect Daily Menu-Allergen Conflicts
- **Endpoint:** `GET /api/v1/nutrition/conflicts/today`
- **Feature ID:** `F-NUT-02`
- **RBAC Policy:** `MGR`, `ADM`
- **Description:** Compares today's lunch menu ingredients against active confirmed student diners to produce non-blocking visual safety warnings.

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "servingDate": "2026-10-12",
    "totalConflicts": 2,
    "alerts": [
      {
        "studentId": 1052,
        "studentName": "Nguyễn Hoàng Nam",
        "className": "2A",
        "allergenType": "seafood",
        "conflictingDish": "Cá ba sa phi lê sốt cà chua",
        "recommendation": "Cung cấp suất ăn thay thế: Thịt heo kho trứng cút"
      }
    ]
  }
}
```

---

## 8. Meal Fee & Cost Management (Domain 4: `F-FEE`)

### 8.1 Configure Meal Fee Schedule & Caterer Cost Rate
- **Endpoint:** `POST /api/v1/finance/fee-rates`
- **Feature ID:** `F-FEE-01`
- **Actor / Screen:** Accountant / `SCR-ACC-01`
- **RBAC Policy:** `ACC`, `ADM`

**Request Body:**
```json
{
  "schoolYearId": 1,
  "name": "Biểu phí Bán trú Học kỳ 1 (2026-2027)",
  "mealFeeRate": 35000.0,
  "catererCostRate": 28000.0,
  "effectiveFrom": "2026-09-05",
  "effectiveTo": "2027-01-15"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Biểu phí Bán trú Học kỳ 1 (2026-2027)",
    "mealFeeRate": 35000.0,
    "catererCostRate": 28000.0,
    "isActive": true
  }
}
```

---

### 8.2 Generate Monthly Student Billing Batch
- **Endpoint:** `POST /api/v1/finance/billing/generate-batch`
- **Feature ID:** `F-FEE-02`
- **Actor / Screen:** Accountant / `SCR-ACC-02`
- **RBAC Policy:** `ACC`, `ADM`
- **Description:** Automatically computes monthly student bills: counts scheduled serving days, adds unexcused absences, and deducts excused absences logged prior to 08:30 AM cutoff.

**Request Body:**
```json
{
  "billingMonth": "2026-10",
  "feeConfigId": 4,
  "dueDate": "2026-11-10"
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "billingMonth": "2026-10",
    "totalInvoicesGenerated": 1200,
    "totalBilledAmount": 882000000.0,
    "totalCreditedAbsences": 142,
    "generatedAt": "2026-10-31T17:00:00+07:00"
  }
}
```

---

### 8.3 Get Student Invoice & VietQR Payload
- **Endpoint:** `GET /api/v1/finance/bills/student/:studentId`
- **Feature ID:** `F-FEE-02`, `F-FEE-03`
- **Actor / Screen:** Parent, Accountant / `SCR-PAR-04`, `SCR-ACC-02`
- **RBAC Policy:** `PAR`, `ACC`, `ADM`
- **Query Parameters:**
  - `month` (format: `YYYY-MM`)

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "invoiceId": 8901,
    "studentId": 1052,
    "studentName": "Nguyễn Hoàng Nam",
    "className": "2A",
    "billingMonth": "2026-10",
    "totalScheduledMeals": 22,
    "attendedMeals": 20,
    "creditedAbsences": 2,
    "unexcusedAbsences": 0,
    "totalChargeableMeals": 20,
    "unitPrice": 35000.0,
    "totalAmount": 700000.0,
    "paidAmount": 0.0,
    "remainingAmount": 700000.0,
    "paymentStatus": "unpaid",
    "dueDate": "2026-11-10",
    "vietqr": {
      "bankCode": "ICB",
      "accountNumber": "108872164999",
      "accountName": "TRUONG TIEU HOC BAN TRU",
      "amount": 700000,
      "transferContent": "TIENAN 1052 T10",
      "qrImageUrl": "https://img.vietqr.io/image/ICB-108872164999-compact2.png?amount=700000&addInfo=TIENAN%201052%20T10"
    }
  }
}
```

---

### 8.4 Record Payment Transaction
- **Endpoint:** `POST /api/v1/finance/payments/record`
- **Feature ID:** `F-FEE-03`
- **Actor / Screen:** Accountant, Banking Webhook / `SCR-ACC-03`
- **RBAC Policy:** `ACC`, `ADM`
- **Description:** Records payment (VietQR bank transfer or cash) and updates invoice status (`unpaid` $\rightarrow$ `partial` / `paid`).

**Request Body:**
```json
{
  "studentMealBillId": 8901,
  "amount": 700000.0,
  "paymentMethod": "vietqr_bank_transfer",
  "transactionReference": "FT26285892184910",
  "notes": "Thanh toan VietQR tu dong qua webhook Ngan hang"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "paymentId": 4120,
    "studentMealBillId": 8901,
    "paymentCode": "PAY-20261102-01",
    "amountPaid": 700000.0,
    "updatedPaymentStatus": "paid",
    "recordedAt": "2026-11-02T10:14:22+07:00"
  }
}
```

---

### 8.5 Get Monthly Catering Vendor Payables
- **Endpoint:** `GET /api/v1/finance/vendor-payables/monthly`
- **Feature ID:** `F-FEE-04`
- **Actor / Screen:** Accountant / `SCR-ACC-04`
- **RBAC Policy:** `ACC`, `ADM`
- **Query Parameters:**
  - `month` (required, `YYYY-MM`)

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "month": "2026-10",
    "vendorName": "Công ty Suất ăn Công nghiệp Hà Nội SunFood",
    "contractCostRate": 28000.0,
    "totalServingDays": 22,
    "totalReconciledPortions": 27720,
    "totalPayableAmount": 776160000.0,
    "settlementStatus": "pending_settlement",
    "dailyBreakdown": [
      {
        "date": "2026-10-12",
        "orderCode": "PO-20261012-01",
        "ordered": 1260,
        "accepted": 1260,
        "dailyCost": 35280000.0
      }
    ]
  }
}
```

---

## 9. Reporting & Transparency Portal (Domain 5: `F-REP`)

### 9.1 Daily Operational Summary Report
- **Endpoint:** `GET /api/v1/reports/operations/daily`
- **Feature ID:** `F-REP-01`
- **RBAC Policy:** `MGR`, `ADM`, `ACC`
- **Query Parameters:**
  - `date` (required, `YYYY-MM-DD`)

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "servingDate": "2026-10-12",
    "metrics": {
      "totalEnrolledStudents": 1250,
      "totalRegisteredBoarders": 1230,
      "confirmedDiners": 1200,
      "excusedAbsences": 30,
      "bufferPortions": 60,
      "totalOrderedPortions": 1260,
      "deliveredPortions": 1260,
      "consumedPortions": 1202,
      "unservedLeftover": 58
    },
    "compliance": {
      "receivingTime": "10:28:15",
      "coreTemperature": 72.5,
      "inspectionResult": "passed",
      "samplePreserved": true
    }
  }
}
```

---

### 9.2 Financial Collection & Debt Aging Report
- **Endpoint:** `GET /api/v1/reports/finance/fee-collections`
- **Feature ID:** `F-REP-02`
- **RBAC Policy:** `ACC`, `ADM`
- **Query Parameters:**
  - `schoolYearId` (required, integer)
  - `month` (optional, `YYYY-MM`)

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "month": "2026-10",
    "totalAssessedFees": 882000000.0,
    "totalCollectedRevenue": 811440000.0,
    "collectionRatePercentage": 92.0,
    "outstandingBalance": 70560000.0,
    "debtAging": {
      "currentUnder30Days": 65000000.0,
      "overdue31To60Days": 5560000.0,
      "overdueOver60Days": 0.0
    }
  }
}
```

---

### 9.3 Public / Parent Daily Lunch Transparency Feed
- **Endpoint:** `GET /api/v1/transparency/menu-daily`
- **Feature ID:** `F-REP-03`
- **Actor / Screen:** Parent / `SCR-PAR-04`
- **RBAC Policy:** `PAR`, `MGR`, `ADM`, Public
- **Query Parameters:**
  - `date` (format: `YYYY-MM-DD`, default: today)

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "date": "2026-10-12",
    "menuName": "Thực đơn Thứ Hai (Tuần 42)",
    "dishes": [
      {
        "courseType": "Món chính",
        "name": "Thịt heo kho trứng cút",
        "caloriesKcal": 280.5
      },
      {
        "courseType": "Món canh",
        "name": "Canh bí xanh thịt nạc",
        "caloriesKcal": 65.0
      },
      {
        "courseType": "Món rau",
        "name": "Bắp cải xào nấm",
        "caloriesKcal": 45.0
      },
      {
        "courseType": "Tráng miệng",
        "name": "Chuối tiêu",
        "caloriesKcal": 90.0
      }
    ],
    "foodSafetyVerification": {
      "deliveredAt": "10:28 AM",
      "coreTemperature": "72.5°C",
      "safetyStatus": "ĐẠT CHUẨN AN TOÀN VỆ SINH THỰC PHẨM",
      "inspectionPassed": true,
      "samplePhotoUrl": "https://storage.schoolmeals.edu.vn/inspections/20261012-sample-jar.jpg"
    }
  }
}
```

---

## 10. Verification & Automated Integration Test Matrix

```
Test Runner: Jest / Supertest (Node.js) or Vitest
Test Environment: Isolated PostgreSQL 15 container seeded with 06-database DDL
```

| Domain | Test Scenario | Target Endpoint | Expected Status | Validation Logic |
|:---:|---|---|:---:|---|
| **D6** | Login with valid credentials | `POST /auth/login` | `200 OK` | Valid JWT token containing role claims (`MGR`, `ACC`, etc.) |
| **D1** | Attendance submit before 08:30 AM | `POST /classes/12/attendance/bulk` | `200 OK` | Class status updated, audit counts match attendees |
| **D1** | Attendance submit after 08:30 AM | `POST /classes/12/attendance/bulk` | `409 Conflict` | Error code `CUTOFF_EXCEEDED`, database unchanged |
| **D1** | Post-cutoff emergency amendment | `POST /participations/:id/amend` | `200 OK` | Record updated, `meal_participation_changes` row inserted |
| **D2** | Approve weekly menu by Principal | `POST /menus/:id/approve` | `200 OK` | Status transitions from `submitted` to `approved` |
| **D3** | Calculate demand + 5% buffer | `POST /demands/calculate` | `200 OK` | `final_demand_count` equals $\text{round}(1200 \times 1.05) = 1260$ |
| **D3** | Dispatch catering PO | `POST /demands/dispatch-order` | `201 Created` | Status `dispatched`, vendor reference returned |
| **D3** | Inspect food with temp $\ge 65^\circ\text{C}$ | `POST /operations/receiving/inspect`| `200 OK` | Inspection `passed`, delivery cleared for trolley distribution |
| **D3** | Inspect food with temp $< 65^\circ\text{C}$ | `POST /operations/receiving/inspect`| `422 Unprocessable` | Error code `HACCP_TEMP_DEFICIT`, distribution blocked |
| **D3** | Post-lunch reconciliation & ledger accrual | `POST /operations/reconciliation/resolve`| `200 OK` | Reconciled count updates `vendor_payables` accurately |
| **D4** | Generate monthly billing batch | `POST /finance/billing/generate-batch`| `200 OK` | Excused absences refunded, VietQR dynamic payload created |
| **D4** | Pay bill via VietQR | `POST /finance/payments/record` | `201 Created` | Status transitions from `unpaid` to `paid` |
