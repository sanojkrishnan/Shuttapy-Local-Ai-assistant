
const callbacks = new Map();

export function registerNotificationCallback(id, handlers) {
  callbacks.set(id, handlers);
}

export function runNotificationCallback(id, allowed) {
  const handlers = callbacks.get(id);

  // Remove before executing to prevent duplicate actions.
  callbacks.delete(id);

  if (allowed) {
    handlers?.onAllow?.();
  } else {
    handlers?.onDeny?.();
  }
}
