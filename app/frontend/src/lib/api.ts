import type { BlogArticle, Book, Event, Sermon } from '../types';

const API_BASE = import.meta.env.PROD
  ? 'https://jethro.onrender.com/api'
  : 'http://localhost:3001/api';

/**
 * Request bodies are intentionally `Record<string, unknown>` rather than a
 * per-endpoint type: the admin dashboard posts one bag of form values for four
 * different record shapes and the API is what validates and normalises it.
 * Responses, which is what callers actually consume, are typed precisely.
 */
type Body = Record<string, unknown>;

/** Shape of the JSON error payload the backend returns on failure. */
type ErrorBody = { error?: string };

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('admin_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Only send admin token for non-GET requests (mutations)
  if (token && options.method && options.method !== 'GET') {
    headers['x-api-key'] = token;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ErrorBody = await response
      .json()
      .catch((): ErrorBody => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// Events
export const eventsApi = {
  getAll: () => request<Event[]>('/events'),
  getUpcoming: () => request<Event[]>('/events/upcoming'),
  getById: (id: string) => request<Event>(`/events/${id}`),
  create: (data: Body) =>
    request<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Body) =>
    request<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<Event>(`/events/${id}`, { method: 'DELETE' }),
};

// Sermons
export const sermonsApi = {
  getAll: (params?: { search?: string; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    const qs = query.toString();
    return request<Sermon[]>(`/sermons${qs ? `?${qs}` : ''}`);
  },
  getById: (id: string) => request<Sermon>(`/sermons/${id}`),
  create: (data: Body) =>
    request<Sermon>('/sermons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Body) =>
    request<Sermon>(`/sermons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<Sermon>(`/sermons/${id}`, { method: 'DELETE' }),
};

// Books
export const booksApi = {
  getAll: () => request<Book[]>('/books'),
  getById: (id: string) => request<Book>(`/books/${id}`),
  create: (data: Body) =>
    request<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Body) =>
    request<Book>(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<Book>(`/books/${id}`, { method: 'DELETE' }),
};

// Blog
export const blogApi = {
  getAll: () => request<BlogArticle[]>('/blog'),
  getById: (id: string) => request<BlogArticle>(`/blog/${id}`),
  create: (data: Body) =>
    request<BlogArticle>('/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Body) =>
    request<BlogArticle>(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<BlogArticle>(`/blog/${id}`, { method: 'DELETE' }),
};

// Upload
export type UploadResult = { url: string };

export const uploadApi = {
  upload: async (file: File, bucket: string): Promise<UploadResult> => {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: token ? { 'x-api-key': token } : {},
      body: formData,
    });

    if (!response.ok) {
      const error: ErrorBody = await response
        .json()
        .catch((): ErrorBody => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json() as Promise<UploadResult>;
  },
};
