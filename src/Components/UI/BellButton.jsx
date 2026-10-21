import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { BellIcon, MonitorX, ShieldAlert, X } from "lucide-react";
import { MUTE } from "../../Utils/UIElements";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { removeNotification } from "../../redux/slice/notificationSlice";
import { runNotificationCallback } from "../../Utils/notificationCallback";

const AUTO_CLOSE_MS = 5000;

const STYLES = {
  amber: {
    border: "border-[#FFD43B]",
    icon: "text-amber-500",
  },
  red: {
    border: "border-red-500",
    icon: "text-red-500",
  },
  emerald: {
    border: "border-emerald-500",
    icon: "text-emerald-500",
  },
  sky: {
    border: "border-sky-500",
    icon: "text-sky-500",
  },
};

function BellButton() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(false);
  const [ringKey, setRingKey] = useState(0);
  const [panelLeft, setPanelLeft] = useState(0);
  const [popToken, setPopToken] = useState(0);

  const divRef = useRef(null);
  const panelRef = useRef(null);
  const closeTimerRef = useRef(null);
  const seenKeysRef = useRef(new Set());
  const osNotificationsRef = useRef(new Map());

  const dispatch = useDispatch();
  const globalNotifications = useSelector((state) => state.notifications.items);

  // Convert global Redux notifications into display notifications.
  const notifications = globalNotifications.map((n) => {
    const appearance = {
      success: { icon: BellIcon, color: "emerald" },
      error: { icon: MonitorX, color: "red" },
      warning: { icon: ShieldAlert, color: "amber" },
      info: { icon: BellIcon, color: "sky" },
    };

    const style = appearance[n.type] ?? appearance.info;

    return {
      ...n,
      key: n.id,
      icon: style.icon,
      color: style.color,
    };
  });

  // panel starts exactly where the sidebar ends
  const updatePanelPosition = useCallback(() => {
    const aside = divRef.current?.closest("aside");
    setPanelLeft(aside ? aside.getBoundingClientRect().right : 0);
  }, []);

  const clearCloseTimer = useCallback(() => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  // opens by itself, then closes after 5 seconds
  const popUp = useCallback(() => {
    updatePanelPosition();
    setOpen(true);
    setUnread(true);
    setRingKey((k) => k + 1);
    setPopToken((t) => t + 1); // (re)starts the 5 second countdown
  }, [updatePanelPosition]);

  function askOsPermission() {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }

  useEffect(askOsPermission, []);
  useEffect(() => clearCloseTimer, [clearCloseTimer]); // cleanup on unmount

  // auto-close 5 seconds after an automatic pop-up
  useEffect(() => {
    if (!popToken) return;
    const id = setTimeout(() => setOpen(false), AUTO_CLOSE_MS);
    return () => clearTimeout(id); // React cancels it on re-run/unmount
  }, [popToken]);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      const inButton = divRef.current?.contains(e.target);
      const inPanel = panelRef.current?.contains(e.target);
      if (!inButton && !inPanel) {
        setPopToken(0); // cancels the countdown
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // react to notifications appearing/disappearing
  const keys = notifications.map((n) => n.key).join("|");
  useEffect(() => {
    const current = new Set(notifications.map((n) => n.key));

    // removed notifications: also remove them from the Windows notification panel
    for (const key of [...seenKeysRef.current]) {
      if (!current.has(key)) {
        seenKeysRef.current.delete(key);
        osNotificationsRef.current.get(key)?.close();
        osNotificationsRef.current.delete(key);
      }
    }

    // new notifications: pop up + Windows notification
    const fresh = notifications.filter((n) => !seenKeysRef.current.has(n.key));
    if (fresh.length) {
      popUp();
      fresh.forEach((n) => {
        seenKeysRef.current.add(n.key);
        if (
          typeof Notification !== "undefined" &&
          Notification.permission === "granted"
        ) {
          const os = new Notification(n.title, { body: n.message, tag: n.key });
          os.onclick = () => {
            window.focus();
            popUp();
            os.close();
          };
          osNotificationsRef.current.set(n.key, os);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, popUp]);

  function dismiss(n) {
    if (!n.id) return;

    dispatch(removeNotification(n.id));
  }

  function handleToggle(e) {
    e.stopPropagation();
    clearCloseTimer(); // opened by hand = stays open
    updatePanelPosition();
    setOpen((prev) => !prev);
    setUnread(false);
    setRingKey((k) => k + 1);
    askOsPermission();
  }

  return (
    <div className="relative" ref={divRef}>
      <Button
        onMouseDown={handleToggle}
        className="w-fit h-fit p-2"
        title="Notifications"
      >
        <div
          key={ringKey}
          className="relative flex items-center justify-center gap-2"
        >
          <span
            className={`${unread && notifications.length ? "bg-red-500" : ""} absolute z-10 top-0 right-0 w-2 h-2 rounded-full`}
          ></span>
          <BellIcon className={` size-5 bellRing`} />
        </div>
      </Button>

      {createPortal(
        <div
          ref={panelRef}
          style={{ left: panelLeft }}
          className={`
            fixed ml-4 top-20 z-10 w-80 max-h-7/8 p-3 pb-5 flex flex-col gap-3
            rounded-2xl
            transition-all duration-300 ease-in-out overflow-auto custom-scrollbar
            ${
              open
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0 pointer-events-none"
            }
          `}
        >
          {notifications.length === 0 ? (
            <div className="rounded-2xl backdrop-blur-sm p-3 shadow-lg ">
              <p className={`text-[13px] ${MUTE}`}>No notifications</p>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = n.icon;
              const style = STYLES[n.color];
              return (
                <div
                  key={n.key}
                  className={`rounded-2xl border-2 p-3 dark:bg-white/10 shadow-lg backdrop-blur-sm bg-white/10  ${style.border}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center text-black dark:text-white gap-2 text-[13px] font-medium">
                      <Icon size={16} className={style.icon} />
                      {n.title}
                    </div>
                    <button
                      type="button"
                      aria-label="Clear notification"
                      onClick={() => dismiss(n)}
                      className="dark:text-white/60 text-black dark:hover:text-white hover:scale-120 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <p
                    className={`mt-2 text-[12px] overflow-x-clip leading-relaxed ${MUTE}`}
                  >
                    {n.message}
                  </p>

                  {n.needsAction && (
                    <div className="mt-2 flex gap-2">
                      <Button
                        className="px-3 py-1 text-xs"
                        onClick={() => {
                          if (!n.id) return;

                          runNotificationCallback(n.id, true);
                          dispatch(removeNotification(n.id));
                        }}
                      >
                        Allow
                      </Button>

                      <Button
                        className="px-3 py-1 text-xs"
                        onClick={() => {
                          if (!n.id) return;

                          runNotificationCallback(n.id, false);
                          dispatch(removeNotification(n.id));
                        }}
                      >
                        Deny
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}

export default BellButton;
