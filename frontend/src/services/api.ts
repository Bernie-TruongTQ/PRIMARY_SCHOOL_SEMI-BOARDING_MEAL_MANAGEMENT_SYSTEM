// src/services/api.ts
/**
 * Base API Client configuration
 * Sẵn sàng tích hợp Axios hoặc native Fetch với interceptors
 */

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = {
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  },

  async post<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  },
};
