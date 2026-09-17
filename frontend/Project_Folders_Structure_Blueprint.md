# Frontend Folder Structure Blueprint (React + TypeScript + Vite)

> **Project**: School Meal Provisioning System  
> **Target Directory**: `frontend/`  
> **Core Stack**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4, Heroicons  
> **Architectural Pattern**: Atomic Design combined with Layered Services and Feature-Driven Screens  
> **Specification Reference**: Standardized via `folder-structure-blueprint-generator`

---

## 1. Architectural Overview

The `frontend/` codebase employs a strictly organized layered architecture combined with **Atomic Design** for reusable UI elements and a **Modular Service Layer** for data fetching and API communications:

```
                  ┌───────────────────────────────┐
                  │          App (Routing)        │
                  └───────────────┬───────────────┘
                                  │
                  ┌───────────────▼───────────────┐
                  │   Organisms / Screens / Pages │
                  └───────────────┬───────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────▼─────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
│     Molecules     │   │  Custom Hooks     │   │     Services      │
└─────────┬─────────┘   └─────────┬─────────┘   └─────────┬─────────┘
          │                       │                       │
┌─────────▼─────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
│       Atoms       │   │ State / Context   │   │  API Client / DTO │
└───────────────────┘   └───────────────────┘   └───────────────────┘
```

### Core Organizational Principles:
1. **Atomic Design Hierarchy (`src/components/`)**:
   - `atoms`: Fundamental visual primitives with zero domain logic (Button, Input, Badge, Tag, Avatar, NavItem, Icon).
   - `molecules`: Combinations of atoms acting as cohesive UI units (SearchInput, MetricStatCard, DatePickerField, CopyButton).
   - `organisms`: Complex layouts and screen compositions that assemble atoms/molecules with domain structure (AppShell, Header, Sidebar, AttendanceTable, NutritionCalculator).
   - `screens`: Full-page view components corresponding to domain workflows and business states (DashboardScreen, AttendanceRosterScreen, DemandBoardScreen, KitchenShiftScreen, StudentDirectoryScreen).
2. **Layered Service & API Separation (`src/services/` & `src/types/`)**:
   - Business operations and HTTP communication are fully isolated from presentation components.
   - Centralizes API clients, endpoints, request interceptors, DTO contracts, and error handling.
3. **State Management & Custom Hooks (`src/hooks/` & `src/context/`)**:
   - Encapsulates side effects, polling routines, and business interactions outside presentation files.
4. **Naming Conventions**:
   - Components & Screens: `PascalCase.tsx` (or multi-file directory with `index.ts`).
   - Services, Hooks, Utils, Constants: `camelCase.ts` (e.g., `attendanceService.ts`, `useAttendance.ts`).
   - TypeScript Types/DTOs/Interfaces: `kebab-case.types.ts` or `kebab-case.model.ts`.

---

## 2. Directory Tree Blueprint

```
frontend/
├── public/                         # Static assets served without bundler processing
│   ├── favicon.ico
│   └── mock-data/                  # Optional mock JSON fixtures for offline development
├── src/
│   ├── main.tsx                    # React application entry point
│   ├── index.css                   # Global styles & Tailwind CSS directives / tokens
│   ├── vite-env.d.ts               # Vite environment type declarations
│   │
│   ├── app/                        # High-level application setup and orchestration
│   │   ├── app.tsx                 # Root layout and portal/screen state router
│   │   ├── routes.ts               # Route registry (PageId, PortalId mappings)
│   │   └── providers.tsx           # Global context providers wrapper (Auth, QueryClient)
│   │
│   ├── components/                 # Atomic Design Component Hierarchy
│   │   ├── atoms/                  # Primitive UI atoms
│   │   │   ├── button/             # Reusable Button atom
│   │   │   │   ├── button.tsx
│   │   │   │   └── index.ts
│   │   │   ├── input/              # Text input, Checkbox, Select, Switch
│   │   │   ├── NavItem.tsx         # Navigation item atom
│   │   │   ├── StatusBadge.tsx     # Status indicator badge atom
│   │   │   └── index.ts
│   │   │
│   │   ├── molecules/              # Multi-atom visual groups
│   │   │   ├── copy-button/        # Interactive copy-to-clipboard button
│   │   │   ├── SearchInput.tsx     # Search box with icon and clear trigger
│   │   │   ├── MetricStatCard.tsx  # KPI metric display card
│   │   │   ├── FilterBar.tsx       # Date range and filter trigger row
│   │   │   └── index.ts
│   │   │
│   │   └── organisms/              # Complex composites & Portal Screens
│   │       ├── AppShell.tsx        # Shell layout (Sidebar, Navbar, Portal switcher)
│   │       ├── Header.tsx          # Top navigation header & User profile menu
│   │       ├── Sidebar.tsx         # Portal navigation drawer
│   │       ├── card/               # Complex composite card layouts
│   │       └── screens/            # Domain-specific portal screens
│   │           ├── DashboardScreen.tsx        # Overview analytics (Admin / Manager)
│   │           ├── AttendanceRosterScreen.tsx # Meal attendance tracking (Teacher)
│   │           ├── DemandBoardScreen.tsx      # Kitchen demand & portioning (Manager)
│   │           ├── KitchenShiftScreen.tsx     # Kitchen prep & cooking schedule
│   │           └── StudentDirectoryScreen.tsx # Student & classroom roster management
│   │
│   ├── services/                   # Business Services & Data Access Layer
│   │   ├── api.ts                  # Configured HTTP client (BaseURL, interceptors, error mapping)
│   │   ├── attendanceService.ts    # Attendance sync and update requests
│   │   ├── demandService.ts        # Demand calculation and approval requests
│   │   ├── kitchenService.ts       # Kitchen shift and prep schedule operations
│   │   ├── studentService.ts       # Student directory and classroom endpoints
│   │   ├── authService.ts          # Session management and role authorization
│   │   └── index.ts                # Barrel export for service layer
│   │
│   ├── types/                      # TypeScript Contracts, Interfaces & DTOs
│   │   ├── common.ts               # ApiResponse<T>, Pagination, PortalId, PageId
│   │   ├── attendance.ts           # AttendanceStatus, ClassroomRollup, StudentAttendance
│   │   ├── demand.ts               # DemandCalculation, DishPortion, MealShift
│   │   ├── student.ts              # Student, Classroom, DietaryPreference
│   │   └── index.ts
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   ├── useAttendance.ts        # Attendance querying and optimistic updates
│   │   ├── useDemandCalculator.ts  # Demand buffer calculations and unit conversion
│   │   ├── useDebounce.ts          # Generic input debouncing
│   │   └── index.ts
│   │
│   ├── context/                    # React Context State Providers
│   │   ├── AuthContext.tsx         # Active authenticated session & active portal state
│   │   └── NotificationContext.tsx # Toast and system banner notification queue
│   │
│   ├── constants/                  # Static Configurations & Immutable Settings
│   │   ├── navigation.ts           # Portal navigation routes and permission definitions
│   │   ├── mealConfigs.ts          # Default buffer rates and baseline meal portions
│   │   └── storageKeys.ts          # LocalStorage and SessionStorage access keys
│   │
│   └── utils/                      # Pure Utility and Helper Functions
│       ├── formatters.ts           # Currency, date (dd/MM/yyyy), and unit formatters
│       ├── calculations.ts         # Standard nutrition and ingredient weight math
│       └── validators.ts           # Input schema validation helpers
│
├── .gitignore
├── AGENTS.md
├── package.json
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json               # Configured with modular path aliases
├── tsconfig.node.json
└── vite.config.ts                  # Configured with matching path aliases
```

---

## 3. Directory Responsibilities & Specifications

| Directory | Core Purpose & Scope | Naming Convention | Primary Artifacts |
| :--- | :--- | :--- | :--- |
| `src/app/` | Application root, portal router, context assembly | `PascalCase.tsx`, `camelCase.ts` | `app.tsx`, `routes.ts`, `providers.tsx` |
| `src/components/atoms/` | Atomic primitives without domain dependencies | `PascalCase.tsx` or `name/name.tsx` | `Button.tsx`, `StatusBadge.tsx`, `NavItem.tsx` |
| `src/components/molecules/` | Combinations of 2+ atoms for single UI functions | `PascalCase.tsx` | `SearchInput.tsx`, `MetricStatCard.tsx` |
| `src/components/organisms/` | Composite shell layout and domain screens | `PascalCase.tsx` | `AppShell.tsx`, `screens/DemandBoardScreen.tsx` |
| `src/services/` | REST/JSON API operations, request normalization | `*Service.ts` | `attendanceService.ts`, `demandService.ts` |
| `src/types/` | Data Transfer Objects, schemas, domain models | `*.types.ts` or `*.ts` | `common.ts`, `attendance.ts`, `demand.ts` |
| `src/hooks/` | Encapsulated business state and effects | `use*.ts` | `useAttendance.ts`, `useDemandCalculator.ts` |
| `src/context/` | Global state providers using React Context | `*Context.tsx` | `AuthContext.tsx`, `NotificationContext.tsx` |
| `src/utils/` | Deterministic pure helper functions | `camelCase.ts` | `formatters.ts`, `calculations.ts` |
| `src/constants/` | Runtime immutable system configuration | `camelCase.ts` | `navigation.ts`, `mealConfigs.ts` |

---

## 4. Path Aliases Configuration

To avoid brittle relative paths (e.g., `../../..`), path aliases are configured identically across `tsconfig.app.json` and `vite.config.ts`:

### In `frontend/tsconfig.app.json`:
```json
"paths": {
  "app/*": ["./src/app/*"],
  "components/*": ["./src/components/*"],
  "hooks/*": ["./src/hooks/*"],
  "services/*": ["./src/services/*"],
  "types/*": ["./src/types/*"],
  "utils/*": ["./src/utils/*"],
  "constants/*": ["./src/constants/*"]
}
```

### In `frontend/vite.config.ts`:
```typescript
resolve: {
  alias: {
    app: resolve(__dirname, "src", "app"),
    components: resolve(__dirname, "src", "components"),
    hooks: resolve(__dirname, "src", "hooks"),
    services: resolve(__dirname, "src", "services"),
    types: resolve(__dirname, "src", "types"),
    utils: resolve(__dirname, "src", "utils"),
    constants: resolve(__dirname, "src", "constants"),
  },
}
```

---

## 5. Implementation Templates

### 5.1. Service Template (`src/services/demandService.ts`)
```typescript
import { apiClient } from './api';
import type { ApiResponse } from 'types/common';
import type { DemandRollup, UpdateDemandPayload } from 'types/demand';

export const demandService = {
  async getDailyRollup(date: string): Promise<ApiResponse<DemandRollup>> {
    return apiClient.get<ApiResponse<DemandRollup>>(`/demand/rollup?date=${encodeURIComponent(date)}`);
  },

  async confirmHeadcount(payload: UpdateDemandPayload): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>('/demand/confirm', payload);
  },
};
```

### 5.2. Custom Hook Template (`src/hooks/useDemand.ts`)
```typescript
import { useState, useEffect } from 'react';
import { demandService } from 'services/demandService';
import type { DemandRollup } from 'types/demand';

export function useDemand(date: string) {
  const [data, setData] = useState<DemandRollup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    demandService
      .getDailyRollup(date)
      .then((res) => {
        if (isMounted) setData(res.data);
      })
      .catch((err: Error) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [date]);

  return { data, loading, error };
}
```

---

*This blueprint is generated to maintain consistent folder hierarchy, clear boundaries of concern, and uniform development standards across the frontend project.*
