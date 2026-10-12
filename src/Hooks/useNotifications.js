import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  addNotification,
  removeNotification,
  clearNotifications,
} from "../redux/slice/notificationSlice";

import { registerNotificationCallback } from "../Utils/notificationCallback";

export default function useNotifications() {
  const dispatch = useDispatch();

  const notify = useCallback(
    ({ title, message, type = "info", needsAction= false }) => {
      dispatch(
        addNotification({
          title,
          message,
          type,
          needsAction
        }),
      );
    },
    [dispatch],
  );

  const confirm = useCallback(
    ({ title, message, onAllow, onDeny }) => {
      const id = crypto.randomUUID();

      registerNotificationCallback(id, {
        onAllow,
        onDeny,
      });

      dispatch(
        addNotification({
          id,
          title,
          message,
          type: "warning",
          needsAction: true,
        }),
      );

      return id;
    },
    [dispatch],
  );

  const dismiss = useCallback(
    (id) => dispatch(removeNotification(id)),
    [dispatch],
  );

  const clearAll = useCallback(
    () => dispatch(clearNotifications()),
    [dispatch],
  );

  return {
    notify,
    confirm,
    dismiss,
    clearAll,
  };
}
