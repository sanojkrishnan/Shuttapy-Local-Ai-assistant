export const API_CONFIG = {
  baseURL: import.meta.env.VITE_SERVER_URL,
  socketURL: import.meta.env.VITE_SOCKET_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const AUTH_CONFIG = {
  tokenKey: "authToken",
  userKey: "user",
  refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
};
