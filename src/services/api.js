const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

async function refreshAccessToken() {
  const refresh = localStorage.getItem('school_refresh_token');
  if (!refresh) return null;

  const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  if (data.access) {
    localStorage.setItem('school_access_token', data.access);
  }
  if (data.refresh) {
    localStorage.setItem('school_refresh_token', data.refresh);
  }

  return data.access || null;
}

export async function apiRequest(path, options = {}) {
  const requestOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  const token = localStorage.getItem('school_access_token');
  const isAuthRoute = path.startsWith('/auth/');
  if (token && !isAuthRoute) {
    requestOptions.headers.Authorization = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE_URL}${path}`, requestOptions);

  const shouldRefresh = response.status === 401 && !isAuthRoute;

  if (shouldRefresh) {
    const access = await refreshAccessToken();
    if (access) {
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...requestOptions,
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${access}`,
        },
      });
    }
  }

  if (!response.ok) {
    const error = new Error('API request failed');
    error.status = response.status;
    try {
      error.payload = await response.json();
    } catch {
      error.payload = null;
    }
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
