const API_BASE = import.meta.env.PROD
  ? 'https://jethro.onrender.com/api'
  : 'http://localhost:3001/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
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
    const error = await response
      .json()
      .catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Events
export const eventsApi = {
  getAll: () => request<any[]>('/events'),
  getUpcoming: () => request<any[]>('/events/upcoming'),
  getById: (id: string) => request<any>(`/events/${id}`),
  create: (data: any) =>
    request<any>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    request<any>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<any>(`/events/${id}`, { method: 'DELETE' }),
};

// Sermons
export const sermonsApi = {
  getAll: (params?: { search?: string; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    const qs = query.toString();
    return request<any[]>(`/sermons${qs ? `?${qs}` : ''}`);
  },
  getById: (id: string) => request<any>(`/sermons/${id}`),
  create: (data: any) =>
    request<any>('/sermons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    request<any>(`/sermons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<any>(`/sermons/${id}`, { method: 'DELETE' }),
};

// Books
export const booksApi = {
  getAll: () => request<any[]>('/books'),
  getById: (id: string) => request<any>(`/books/${id}`),
  create: (data: any) =>
    request<any>('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    request<any>(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<any>(`/books/${id}`, { method: 'DELETE' }),
};

// Blog
export const blogApi = {
  getAll: () => request<any[]>('/blog'),
  getById: (id: string) => request<any>(`/blog/${id}`),
  create: (data: any) =>
    request<any>('/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    request<any>(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<any>(`/blog/${id}`, { method: 'DELETE' }),
};

// Upload
export const uploadApi = {
  upload: async (file: File, bucket: string) => {
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
      const error = await response
        .json()
        .catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },
};
