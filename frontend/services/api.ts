'use client';

import { STORAGE_KEYS } from '@/lib/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Interceptor<T> = (value: T) => T | Promise<T>;

interface Interceptors {
  request: Interceptor<RequestInit>[];
  response: Interceptor<Response>[];
}

const interceptors: Interceptors = {
  request: [],
  response: [],
};

class ApiError extends Error {
  code: string;
  status: number;
  details?: Record<string, string[]>;

  constructor(message: string, code: string, status: number, details?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function addRequestInterceptor(fn: Interceptor<RequestInit>) {
  interceptors.request.push(fn);
}

function addResponseInterceptor(fn: Interceptor<Response>) {
  interceptors.response.push(fn);
}

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
  return null;
}

function buildHeaders(custom?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...custom,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

async function applyRequestInterceptors(options: RequestInit): Promise<RequestInit> {
  let result = options;
  for (const fn of interceptors.request) {
    result = await fn(result);
  }
  return result;
}

async function applyResponseInterceptors(response: Response): Promise<Response> {
  let result = response;
  for (const fn of interceptors.response) {
    result = await fn(result);
  }
  return result;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    throw new ApiError('Unauthorized', 'UNAUTHORIZED', 401);
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new ApiError(
      errorBody?.message || `Request failed with status ${response.status}`,
      errorBody?.code || 'HTTP_ERROR',
      response.status,
      errorBody?.details
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let optionsWithHeaders: RequestInit = {
    ...options,
    headers: buildHeaders(options.headers as Record<string, string> | undefined),
  };

  optionsWithHeaders = await applyRequestInterceptors(optionsWithHeaders);

  let response = await fetch(`${API_URL}${endpoint}`, optionsWithHeaders);
  response = await applyResponseInterceptors(response);

  return handleResponse<T>(response);
}

function get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
  return request<T>(endpoint, { method: 'GET', headers });
}

function post<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

function put<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
  return request<T>(endpoint, {
    method: 'PUT',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

function patch<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
  return request<T>(endpoint, {
    method: 'PATCH',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

function del<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE', headers });
}

async function upload<T>(endpoint: string, formData: FormData): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  response = await applyResponseInterceptors(response);
  return handleResponse<T>(response);
}

async function stream(
  endpoint: string,
  body: unknown,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new ApiError(
      errorBody?.message || `Stream failed with status ${response.status}`,
      errorBody?.code || 'STREAM_ERROR',
      response.status
    );
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new ApiError('ReadableStream not supported', 'STREAM_NOT_SUPPORTED', 500);
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const data = trimmed.slice(6);
          if (data === '[DONE]') return;
          onChunk(data);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export const apiClient = {
  get,
  post,
  put,
  patch,
  del,
  upload,
  stream,
  addRequestInterceptor,
  addResponseInterceptor,
};

export { ApiError };
export default apiClient;
