// utils/getErrorMessage.js
//
// RTK's `.unwrap()` throws `action.payload` directly when a thunk calls
// `rejectWithValue(...)` — not an Error object. So whatever your thunk's
// rejectWithValue(extractError(err, "...")) actually returns is exactly
// what shows up here, unmodified. This handles the common shapes so the
// toast keeps working even if that shape ever changes.
export function getErrorMessage(err, fallback = "Something went wrong") {
  if (!err) return fallback;

  // extractError returned a plain string — the most likely case.
  if (typeof err === "string") return err;

  // extractError returned an Error-like object.
  if (err.message) return err.message;

  // Raw axios error slipped through somewhere instead of the extracted value.
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.data?.message) return err.data.message;

  return fallback;
}
