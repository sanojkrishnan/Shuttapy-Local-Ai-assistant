export const extractError = (
  err,
  fallback = "Unable to connect to the server.",
) => {
  const data = err.response?.data;

  // Prefer the specific error returned by the backend.
  if (typeof data?.error === "string") {
    return data.error;
  }

  if (typeof data?.error?.message === "string") {
    return data.error.message;
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  // Handle request failures where no response arrived.
  if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
    return "Request timed out.";
  }

  if (err.code === "ERR_NETWORK") {
    return "Unable to connect to the server. Check whether the backend is running.";
  }

  return err.message || fallback;
};
