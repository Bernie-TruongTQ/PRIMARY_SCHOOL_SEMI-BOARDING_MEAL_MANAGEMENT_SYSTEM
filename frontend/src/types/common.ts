// src/types/common.ts
export type PortalId = 'admin' | 'teacher' | 'manager' | 'kitchen';

export type PageId =
  | 'dashboard'
  | 'attendance'
  | 'demand'
  | 'kitchen'
  | 'students'
  | 'schedules'
  | 'catalog'
  | 'users';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}
