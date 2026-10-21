export function getErrorMessage(err, fallback = "Something went wrong") {
  if (!err) return fallback;

  // If the error is a JSON string, parse it first.
  if (typeof err === "string") {
    try {
      const parsed = JSON.parse(err);
      return getErrorMessage(parsed, fallback);
    } catch {
      // Use the string only if it is a short, plain message.
      return err.length > 200 ? fallback : err;
    }
  }

  if (typeof err !== "object") return fallback;

  const message =
    err.response?.data?.error?.message ??
    err.response?.data?.message ??
    err.data?.error?.message ??
    err.data?.message ??
    err.error?.message ??
    err.message;

  if (typeof message !== "string" || !message.trim()) {
    return fallback;
  }

  // Never display a serialized error or stack trace.
  if (
    message.length > 200 ||
    message.includes('"stack"') ||
    message.includes("Error:") ||
    message.includes(" at ")
  ) {
    return fallback;
  }

  return message.trim();
}
