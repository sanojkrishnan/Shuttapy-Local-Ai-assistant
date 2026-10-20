import axios from "axios";
import { API_CONFIG } from "../config/app";

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

// Existing request interceptor
apiClient.interceptors.request.use((config) => {
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    config.headers.delete?.("Content-Type");
  }

  return config;
});

// Existing response interceptor
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

// Existing API methods + generic streaming method
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

  upload: (url, formData, config) =>
    apiClient.post(url, formData, config).then((res) => res.data),

  // Generic streaming POST request
  // Generic streaming POST request
  stream: async (url, data, onChunk, config = {}) => {
    const baseURL = apiClient.defaults.baseURL || "";
    const fullURL = `${baseURL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;

    const controller = new AbortController();
    const inactivityTimeout = config.timeout ?? 120000;
    let timeoutId;
    let timedOut = false;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, inactivityTimeout);
    };

    const externalSignal = config.signal;
    const abortFromExternalSignal = () => controller.abort();

    if (externalSignal?.aborted) {
      controller.abort();
    } else {
      externalSignal?.addEventListener("abort", abortFromExternalSignal, {
        once: true,
      });
    }

    const response = await fetch(fullURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    }).catch((error) => {
      if (timedOut) {
        throw new Error("Stream timed out because no response data arrived.");
      }
      throw error;
    });

    try {
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || `Request failed: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("The server did not return a response stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullReply = "";

      resetTimeout();

      try {
        while (true) {
          const { value, done } = await reader.read();

          if (done) break;

          resetTimeout();

          const chunk = decoder.decode(value, { stream: true });

          if (chunk) {
            fullReply += chunk;
            onChunk?.(chunk);
          }
        }

        const remaining = decoder.decode();

        if (remaining) {
          fullReply += remaining;
          onChunk?.(remaining);
        }

        return { reply: fullReply };
      } catch (error) {
        if (timedOut) {
          throw new Error(
            "Stream timed out because no new response data arrived.",
          );
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
        reader.releaseLock();
      }
    } finally {
      clearTimeout(timeoutId);
      externalSignal?.removeEventListener("abort", abortFromExternalSignal);
    }
  },
};

export default apiClient;
