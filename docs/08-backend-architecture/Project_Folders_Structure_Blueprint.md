# Project Folder Structure Blueprint: NestJS 3-Tier Backend

> **System**: Primary School Semi-Boarding Meal Management System (Hệ thống Quản lý Bán trú Tiểu học)  
> **Framework**: NestJS (TypeScript)  
> **Pattern**: Feature-Based 3-Tier Architecture (Presentation $\to$ Business Logic $\to$ Data Access)  
> **ORM / Persistence**: Prisma ORM with PostgreSQL 15  
> **Status**: Approved Blueprint & Base Scaffolding  

---

## 1. Architectural Overview & Design Principles

The backend is structured using a **Feature-Based Three-Tier Architecture**. Each domain/feature module encapsulates its own distinct layers:

1. **Presentation Tier (Controllers & DTOs)**:
   - Handles incoming HTTP requests, route mapping (`/api/v1/...`), request validation (`ValidationPipe` + `class-validator`), and response transformation.
   - Guarded by authentication and role-based access control (`RolesGuard`, `JwtAuthGuard`).
   - Generates Swagger OpenAPI documentation decorators.
   - **Rule**: Controllers *only* call Services. Never interact with Prisma or repositories directly.

2. **Business Logic Tier (Services)**:
   - Contains pure business rules, transaction orchestration, domain validation (e.g., cutoff deadlines like 08:30 AM, 3-step food inspection temperature thresholds $\ge 65^\circ\text{C}$).
   - Independent of transport protocol (HTTP, Microservice, or WebSockets).
   - **Rule**: Services orchestrate repositories and other domain services. They never access raw SQL or `request` objects.

3. **Data Access Tier (Repositories & Prisma Data Layer)**:
   - Encapsulates database persistence logic using `PrismaClient` via `PrismaService`.
   - Isolates Prisma queries so database changes, indexing, and complex queries don't leak into business services.
   - Implements typed repository interfaces.

---

## 2. Directory Hierarchy (ASCII Tree)

```text
backend/
├── prisma/
│   ├── schema.prisma                  # 3NF Prisma schema (PostgreSQL)
│   └── migrations/                    # Prisma migration histories
├── src/
│   ├── common/                        # Cross-cutting concerns
│   │   ├── constants/                 # System constants, statutory times (08:30 cutoff)
│   │   ├── decorators/                # Custom decorators (@Roles, @CurrentUser)
│   │   │   └── roles.decorator.ts
│   │   ├── filters/                   # Exception filters (AllExceptionsFilter)
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/                    # Security guards (JwtAuthGuard, RolesGuard)
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/              # Logging, response transformation interceptors
│   │   ├── middleware/                # HTTP request correlation ID, raw body parsers
│   │   └── pipes/                     # Validation and sanitation pipes
│   │
│   ├── database/                      # Database module & connection management
│   │   └── prisma/
│   │       ├── prisma.service.ts      # PrismaClient lifecycle hook provider
│   │       └── prisma.module.ts       # Global Prisma module
│   │
│   ├── modules/                       # Feature-based 3-tier business modules
│   │   ├── auth/                      # Domain 6: Auth & Token Management
│   │   │   ├── controllers/           # Presentation: /api/v1/auth
│   │   │   ├── services/              # Business Logic: Token issuance, password hashing
│   │   │   ├── repositories/          # Data Access: Refresh tokens, credentials
│   │   │   ├── dto/                   # Data Transfer Objects & validation schemas
│   │   │   └── auth.module.ts
│   │   ├── users/                     # Domain 6: User Administration
│   │   │   ├── controllers/           # Presentation: /api/v1/users, /api/v1/admin/users
│   │   │   ├── services/              # Business Logic: User lifecycle, RBAC checks
│   │   │   ├── repositories/          # Data Access: User queries via Prisma
│   │   │   ├── dto/                   # DTOs: CreateUserDto, UpdateUserDto
│   │   │   └── users.module.ts
│   │   ├── students/                  # Domain 1: Student & Class Management
│   │   │   ├── controllers/           # /api/v1/students, /api/v1/classes
│   │   │   ├── services/              # Student assignment, class roster logic
│   │   │   ├── repositories/          # Student & Parent link queries
│   │   │   ├── dto/                   # Student DTOs
│   │   │   └── students.module.ts
│   │   ├── menus/                     # Domain 2: Meal Planning & Menus
│   │   │   ├── controllers/           # /api/v1/menus, /api/v1/dishes
│   │   │   ├── services/              # Weekly menu scheduling, recipe aggregation
│   │   │   ├── repositories/          # Menu & Dish persistence
│   │   │   ├── dto/                   # Menu DTOs
│   │   │   └── menus.module.ts
│   │   ├── operations/                # Domain 3: Daily Catering Operations
│   │   │   ├── controllers/           # /api/v1/demands, /api/v1/operations
│   │   │   ├── services/              # 08:30 cutoff lock, 3-step inspection, PO dispatch
│   │   │   ├── repositories/          # VendorOrder, DailyAttendance repositories
│   │   │   ├── dto/                   # DemandAggregationDto, InspectionDto
│   │   │   └── operations.module.ts
│   │   ├── finance/                   # Domain 4: Billing, Cost & Dynamic VietQR
│   │   │   ├── controllers/           # /api/v1/finance, /api/v1/invoices
│   │   │   ├── services/              # Monthly meal invoice generation, VietQR parsing
│   │   │   ├── repositories/          # Invoice & Payment transaction repositories
│   │   │   ├── dto/                   # InvoiceQueryDto, PaymentWebhookDto
│   │   │   └── finance.module.ts
│   │   ├── nutrition/                 # Domain 7: Nutrition & Food Allergy Alerts
│   │   │   ├── controllers/           # /api/v1/nutrition, /api/v1/students/:id/allergies
│   │   │   ├── services/              # Allergen checking engine, dietary warnings
│   │   │   ├── repositories/          # AllergyRecord repositories
│   │   │   ├── dto/                   # CreateAllergyDto, NutritionReportDto
│   │   │   └── nutrition.module.ts
│   │   └── reporting/                 # Domain 5: Analytics & Transparency
│   │       ├── controllers/           # /api/v1/reports, /api/v1/transparency
│   │       ├── services/              # Aggregated metrics, 3-way reconciliation audit
│   │       ├── repositories/          # Read-only reporting queries
│   │       ├── dto/                   # ReportFilterDto
│   │       └── reporting.module.ts
│   │
│   ├── app.module.ts                  # Root NestJS Module
│   └── main.ts                        # Application Bootstrap & Swagger Setup
│
├── test/                              # End-to-end tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env.example                       # Environment template
├── package.json                       # Dependencies & scripts
└── tsconfig.json                      # Path aliases (@common/*, @modules/*, @database/*)
```

---

## 3. Tier Responsibilities & Layer Placement Matrix

| Tier | Folder Location | Allowed Dependencies | Prohibited Dependencies | Key Technologies |
|---|---|---|---|---|
| **Tier 1: Presentation** | `modules/<feature>/controllers/`<br>`modules/<feature>/dto/` | Service Layer, DTOs, Common Guards/Decorators | Repositories, PrismaClient, Database connections | `@Controller`, `@Get`, `@Post`, `@Body`, `ValidationPipe`, `@ApiTags` |
| **Tier 2: Business Logic** | `modules/<feature>/services/` | Repository Layer, Other Domain Services, Domain DTOs | Request/Response objects (`req`, `res`), SQL queries, Prisma directly | `@Injectable()`, Domain calculation, Business exceptions |
| **Tier 3: Data Access** | `modules/<feature>/repositories/` | `PrismaService`, Prisma Types, Database Models | Controllers, HTTP decorators, Presentation concerns | `@Injectable()`, `prisma.<model>.findUnique()`, Transactions |

---

## 4. Naming Conventions & Standard File Patterns

### File Suffixes
- **Controller**: `<feature>.controller.ts`
- **Service**: `<feature>.service.ts`
- **Repository**: `<feature>.repository.ts`
- **Module**: `<feature>.module.ts`
- **DTO**: `create-<entity>.dto.ts`, `update-<entity>.dto.ts`, `<entity>-query.dto.ts`
- **Guard / Filter / Interceptor**: `<name>.guard.ts`, `<name>.filter.ts`, `<name>.interceptor.ts`

### TypeScript Path Aliases (in `tsconfig.json`)
```json
{
  "paths": {
    "@common/*": ["src/common/*"],
    "@modules/*": ["src/modules/*"],
    "@database/*": ["src/database/*"]
  }
}
```

---

## 5. Development Workflow & Extension Guide

### Adding a New Feature (e.g. `suppliers`)
1. Create directory `backend/src/modules/suppliers/`:
   - `controllers/suppliers.controller.ts`
   - `services/suppliers.service.ts`
   - `repositories/suppliers.repository.ts`
   - `dto/create-supplier.dto.ts`
   - `suppliers.module.ts`
2. Define entities in `backend/prisma/schema.prisma` and run `npm run prisma:generate`.
3. Implement `SuppliersRepository` injecting `PrismaService`.
4. Implement `SuppliersService` with business validations.
5. Implement `SuppliersController` with Swagger and role guards.
6. Register `SuppliersModule` into `AppModule` imports.
