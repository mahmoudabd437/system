const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const TOKEN_KEY = "dar_bidaya_token";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = options.token || getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function signup(payload) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
    token: null,
  });
}

export function login(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    token: null,
  });
}

export function getMe() {
  return request("/me");
}

export function getDashboardSummary() {
  return request("/dashboard/summary");
}

export function getStages() {
  return request("/stages/");
}

export function createStage(payload) {
  return request("/stages/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateStage(id, payload) {
  return request(`/stages/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteStage(id) {
  return request(`/stages/${id}`, { method: "DELETE" });
}

export function getLatePayments() {
  return request("/late-payments/");
}

export function getStudents() {
  return request("/students/");
}
