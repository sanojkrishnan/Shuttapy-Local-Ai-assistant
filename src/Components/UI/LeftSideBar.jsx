import { Dot, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { HEAD, LINE, MUTE, PANEL, PAPER } from "../../Utils/UIElements";
import { MODES } from "../../Utils/Modes";
import { focus } from "../../TailwindElements/tailwindClass";
import { Button } from "./Button";
import ShuttapyMascot from "./ShuttapyMascot";
import BellButton from "./BellButton";

function LeftSideBar({
  chats,
  chat,
  setActiveId,
  createNewChat,
  mode,
  setMode,
  setShowConfirmation,
  showConfirmation,
}) {
  return (
    <>
      {/* LEFT SIDEBAR */}
      <aside
        className={`
          relative z-20
    hidden flex-col gap-3 overflow-auto
    border-r p-2 md:flex custom-scrollbar
    ${PANEL}
    ${LINE}
        `}
      >
        <div
          className={`
            flex items-center justify-center border-b-2
            text-[25px]
            ${HEAD}
          `}
        >
          <ShuttapyMascot size={80} />
          <span className="pr-6"> Shuttapy </span>
        </div>
        {/* VISUAL CONFIRMATION BUTTON */}

        <div className="m-1 flex justify-end">
          <BellButton
            showConfirmation={showConfirmation}
            setShowConfirmation={setShowConfirmation}
          />
        </div>

        {/* MODES */}

        <nav aria-label="Modes" className="flex flex-col gap-0.5">
          {Object.entries(MODES).map(([key, value]) => (
            <button
              key={key}
              aria-current={key === mode}
              onClick={() => setMode(key)}
              className={`
                flex items-center gap-2.5
                rounded-xl px-2.5 py-2
                text-left text-[14.5px]
                ${focus}
                ${
                  key === mode
                    ? "bg-[#1D1A3B] font-medium text-[#F8F7FD] dark:bg-[#EEEBFF] dark:text-[#1D1A3B]"
                    : `${MUTE} hover:bg-[#ECEAF6] dark:hover:bg-[#14122B]`
                }
              `}
            >
              <value.icon size={18} />

              {value.label}
            </button>
          ))}
        </nav>

        {/* NEW CHAT */}

        <button
          onClick={createNewChat}
          className={`
            flex items-center justify-center gap-2
            rounded-full border px-3.5 py-2
            text-sm
            ${LINE}
            ${focus}
          `}
        >
          <Plus size={16} />
          New chat
        </button>

        {/* CHAT LIST */}
        <div>
          <p className="mt-4 mb-2 flex">
            <Dot /> History
          </p>

          <div
            aria-label="Chats"
            className=" max-h-48
            flex min-h-0 flex-col gap-0.5
            overflow-auto
            custom-scrollbar
          "
          >
            <div>
              {chats.map((currentChat) => (
                <div
                  key={currentChat.id}
                  aria-current={currentChat.id === chat.id}
                  onClick={() => setActiveId(currentChat.id)}
                  className={`
                truncate rounded-lg
                px-2.5 py-1.5
                text-left text-[13.5px]
                flex items-center justify-between
                ${focus}
                ${currentChat.id === chat.id ? `${PAPER} text-inherit` : MUTE}
              `}
                >
                  <div>{currentChat.title}</div>
                  <Button className="text-center p-1 m-0 ">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default LeftSideBar;
