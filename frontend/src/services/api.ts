import { ApiResponse } from '@/types';

export class ApiError extends Error {
  code: string;
  status: number;
  details?: any;

  constructor(message: string, code = 'INTERNAL_ERROR', status = 500, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

let envApiUrl = import.meta.env.VITE_API_URL || '/api';
if (envApiUrl && !envApiUrl.startsWith('http') && !envApiUrl.startsWith('/')) {
  // Gracefully handle Render's "host" property (e.g. backend.onrender.com)
  envApiUrl = `https://${envApiUrl}/api`;
}
const BASE_URL = envApiUrl.replace(/\/$/, '');

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
      ? localStorage.getItem('edu4loan_auth_token')
      : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await res.json();

    if (!res.ok || !data.success) {
      throw new ApiError(
        data.error?.message || `Request failed with status ${res.status}`,
        data.error?.code || 'API_ERROR',
        res.status,
        data.error?.details
      );
    }

    return data;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Network request failed', 'NETWORK_ERROR', 0);
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
