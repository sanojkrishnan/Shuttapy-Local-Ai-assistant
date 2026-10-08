// helper to extract error message from axios error
export const extractError = (err, fallback) => {
  // No response at all = request never reached the server
  if (!err.response) {
    if (err.code === "ECONNABORTED") {
      return "Request timed out. Please try again.";
    }
    return "Unable to connect to the server. Please check your connection and try again.";
  }

  return (
    err.response?.data?.error?.message ||
    err.response?.data?.message ||
    err.message ||
    fallback
  );
};
