/**
 * Real API client connected to Backend NestJS (/api/v1)
 * Replaces mock state with actual live network calls.
 */

const API_BASE = 'http://localhost:3000/api/v1';

export interface DemandCalculationPayload {
  mealScheduleId: number;
  bufferRate: number;
}

export interface DispatchOrderPayload {
  mealDemandId: number;
  vendorName: string;
  targetDeliveryTime?: string;
  notes?: string;
}

export interface ReceivingCheckinPayload {
  cateringOrderId: number;
  vehiclePlate: string;
  driverName: string;
  thermalContainerCount: number;
  deliveredPortions: number;
}

export interface ReceivingInspectPayload {
  mealDeliveryId: number;
  coreTemperature: number;
  containerSealsIntact: boolean;
  sensoryEvalPass: boolean;
  retentionSampleTaken: boolean;
  thermometerPhotoUrl?: string;
  samplePhotoUrl?: string;
  notes?: string;
}

export interface DistributionConfirmPayload {
  mealDeliveryId: number;
  classId: number;
  allocatedPortions: number;
  specialDietaryPortions?: number;
  receivedByTeacherId?: number;
}

export interface ReconciliationPayload {
  cateringOrderId: number;
  mealDate: string;
  actualConsumedCount: number;
  discrepancyReason?: string;
}

export class ApiClient {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'x-mock-role': 'MGR', // Auto-authenticate as Coordinator
      ...(options.headers || {}),
    };

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.message || data?.error?.message || `HTTP ${response.status}: Request failed`;
      throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }

    return data;
  }

  // 1. Calculate Demand (08:30 AM)
  public static async calculateDemand(payload: DemandCalculationPayload) {
    return this.request<{ success: boolean; data: any }>('/demands/calculate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 2. Dispatch Order to Catering (08:45 AM)
  public static async dispatchOrder(payload: DispatchOrderPayload) {
    return this.request<{ success: boolean; data: any }>('/demands/dispatch-order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 3. Receiving Dock Check-in (10:30 AM)
  public static async checkinVehicle(payload: ReceivingCheckinPayload) {
    return this.request<{ success: boolean; data: any }>('/operations/receiving/checkin', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 4. HACCP 3-Step Food Inspection
  public static async inspectDelivery(payload: ReceivingInspectPayload) {
    return this.request<{ success: boolean; data: any }>('/operations/receiving/inspect', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 5. Distribution Plan (11:00 AM)
  public static async getDistributionPlan(mealDeliveryId: number) {
    return this.request<{ success: boolean; data: any }>(`/operations/distribution/plan?mealDeliveryId=${mealDeliveryId}`);
  }

  // 6. Confirm Distribution
  public static async confirmDistribution(payload: DistributionConfirmPayload) {
    return this.request<{ success: boolean; data: any }>('/operations/distribution/confirm', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 7. Post-Lunch Reconciliation (13:00 PM)
  public static async calculateReconciliation(payload: ReconciliationPayload) {
    return this.request<{ success: boolean; data: any }>('/operations/reconciliation/calculate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 8. Get Class Students from Database
  public static async getStudentsByClass(className: string) {
    return this.request<{ success: boolean; data: any[] }>(`/students/classes/${className}`);
  }

  // 9. Update Student Attendance
  public static async updateAttendance(studentId: string, status: string) {
    return this.request<{ success: boolean; data: any }>(`/students/${studentId}/attendance`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}
