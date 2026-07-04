import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the stored JWT to every outgoing request, if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("medibridge_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralize 401 handling: clear the stale session so the UI can react.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("medibridge_token");
      localStorage.removeItem("medibridge_user");
    }
    return Promise.reject(error);
  }
);

export default api;