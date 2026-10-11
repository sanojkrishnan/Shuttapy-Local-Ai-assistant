import axios from "axios";
import { API_CONFIG } from "../config/app";

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

// Request interceptor: let the browser set the multipart boundary for file uploads
apiClient.interceptors.request.use((config) => {
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    config.headers.delete?.("Content-Type");
  }

  return config;
});

// Response interceptor: log errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    if (status >= 500) {
      console.error("Server error:", message);
    } else if (!error.response) {
      console.error("Network error:", message);
    }

    return Promise.reject(error);
  },
);

// Wrappers that return response.data directly
export const api = {
  get: (url, config) => apiClient.get(url, config).then((res) => res.data),

  post: (url, data, config) =>
    apiClient.post(url, data, config).then((res) => res.data),

  put: (url, data, config) =>
    apiClient.put(url, data, config).then((res) => res.data),

  patch: (url, data, config) =>
    apiClient.patch(url, data, config).then((res) => res.data),

  delete: (url, config) =>
    apiClient.delete(url, config).then((res) => res.data),

  // for multipart/form-data (file uploads)
  upload: (url, formData, config) =>
    apiClient.post(url, formData, config).then((res) => res.data),
};

export default apiClient;
