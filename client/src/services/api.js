import axios from "axios";

const getApiBaseUrl = () => {
  if (typeof import.meta !== "undefined" && import.meta?.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== "undefined" && window.location?.hostname) {
    return `http://${window.location.hostname}:5000/api`;
  }
  return "http://localhost:5000/api";
};

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the stored JWT to every outgoing request, if present.
api.interceptors.request.use((config) => {
  try {
    if (typeof localStorage !== "undefined") {
      const token = localStorage.getItem("medibridge_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // Ignore storage errors in non-browser env
  }
  return config;
});

// Centralize 401 handling: clear the stale session so the UI can react.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      if (typeof localStorage !== "undefined" && error.response?.status === 401) {
        localStorage.removeItem("medibridge_token");
        localStorage.removeItem("medibridge_user");
      }
    } catch {
      // Ignore storage errors in non-browser env
    }
    return Promise.reject(error);
  }
);

export default api;