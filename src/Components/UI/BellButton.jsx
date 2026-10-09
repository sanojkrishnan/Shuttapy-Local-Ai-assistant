import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { BellIcon, ShieldAlert } from "lucide-react";
import { LINE, MUTE, PANEL } from "../../Utils/UIElements";

function BellButton({ setShowConfirmation, showConfirmation }) {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDot, setNotificationDot] = useState(true);
  const [ringKey, setRingKey] = useState(0);
  const [panelLeft, setPanelLeft] = useState(0);
  const divRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      const inButton = divRef.current?.contains(event.target);
      const inPanel = panelRef.current?.contains(event.target);
      if (!inButton && !inPanel) setShowNotification(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleToggle(e) {
    e.stopPropagation();
    // the panel starts exactly where the sidebar ends
    const aside = divRef.current?.closest("aside");
    setPanelLeft(aside ? aside.getBoundingClientRect().right : 0);

    setShowConfirmation((prev) => !prev);
    setShowNotification((prev) => !prev);
    setNotificationDot(false);
    setRingKey((prev) => prev + 1);
  }

  return (
    <div className="relative" ref={divRef}>
      <Button className="" onMouseDown={handleToggle}>
        <div
          key={ringKey}
          className="relative flex items-center justify-center gap-2"
        >
          <BellIcon
            className={`${notificationDot ? "fill-red-500 text-red-500" : ""} size-4 bellRing`}
          />{" "}
          Notifications
        </div>
      </Button>

      {/* notification panel: rendered outside the sidebar */}
      {createPortal(
        <div
          ref={panelRef}
          style={{ left: panelLeft }}
          className={`
            fixed ml-4 top-20 z-10 w-80 p-3
            rounded-2xl border border-l-0 shadow-lg
            transition-all duration-300 ease-in-out
            ${PANEL} ${LINE}
            ${
              showNotification
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0 pointer-events-none"
            }
          `}
        >
          {showConfirmation ? (
            <div
              className={`rounded-2xl border-2 border-[#FFD43B] p-3 ${PANEL}`}
            >
              <div className="flex items-center text-white gap-2 text-[13px] font-medium">
                <ShieldAlert size={16} className="text-amber-500" />
                Agent permission required
              </div>

              <p className={`mt-2 text-[12px] leading-relaxed ${MUTE}`}>
                The agent wants to perform an action on your computer.
              </p>

              <div className="mt-2 flex gap-2">
                <Button
                  className="px-3 py-1 text-xs"
                  onClick={() => setShowConfirmation(false)}
                >
                  Allow
                </Button>
                <Button
                  onClick={() => setShowConfirmation(false)}
                  className={`px-3 py-1 text-xs`}
                >
                  Deny
                </Button>
              </div>
            </div>
          ) : (
            <p className={`text-[13px] ${MUTE} m-2`}>No notifications</p>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}

export default BellButton;
