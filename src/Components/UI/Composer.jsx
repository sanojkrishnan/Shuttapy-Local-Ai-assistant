import { ArrowUp, ChevronDown, Mic, Paperclip, Volume2 } from "lucide-react";
import Dropdown from "./DropDown";
import { iconBtn } from "../../TailwindElements/tailwindClass";
import { LINE, PANEL } from "../../Utils/UIElements";
import { useEffect, useRef, useState } from "react";
import useFileMethods from "../../Hooks/useFileMethods";
import QuickActions from "./QuickActions";
import FilePreview from "./FilePreview";
import { Button } from "./Button";

function Composer({
  DefaultMode,
  addMessages,
  showScrollBtn,
  onScrollToBottom,
}) {
  const [listening, setListening] = useState(false);
  const [speak, setSpeak] = useState(false);

  const fileRef = useRef(null);
  const taRef = useRef(null);

  const { handleFileSelect, removeFile, handleSend, files, text, setText } =
    useFileMethods({ addMessages }); //useFileMethods is a custom hook that handles file selection and removal, as well as sending messages with files attached.

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto"; // reset so it can shrink too
    el.style.height = `${el.scrollHeight}px`; // grow to fit content
  }, [text]);

  function handleVoice() {
    setListening((current) => !current); //this is to toggle the listening state, which is used to indicate if the app is currently listening for voice input
  }
  return (
    <>
      <div className="w-full ml-12 mb-4 px-5 pt-1.5">
        <div className="mx-auto w-full max-w-175">
          <QuickActions DefaultMode={DefaultMode} setText={setText} />
          <FilePreview files={files} removeFile={removeFile} />

          {/* INPUT ROW: pr-14 leaves room for the chevron */}
          <div className="relative mb-5 flex w-full items-center pr-14">
            {/* input box */}
            <div
              className={`
          relative z-10
          flex min-w-0 flex-1 items-end gap-1.5
          rounded-[26px]
          border py-2 pl-3 pr-2
          focus-within:border-violet-500
          ${PANEL}
          ${LINE}
        `}
            >
              {/* FILE INPUT */}

              <input
                ref={fileRef}
                type="file"
                multiple
                hidden
                onChange={handleFileSelect}
              />

              <button
                className={iconBtn}
                onClick={() => fileRef.current?.click()}
                aria-label="Attach files"
              >
                <Paperclip size={18} />
              </button>

              {/* TEXTAREA */}

              <textarea
                ref={taRef}
                rows={1}
                value={text}
                placeholder="Message Shuttapy"
                aria-label="Message"
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                className="
                  max-h-50
                  flex-1 resize-none
                  border-0
                  overflow-y-auto
                  bg-transparent
                  px-1 py-2
                  text-[15.5px]
                  outline-none
                  custom-scrollbar
                "
              />

              {/* MICROPHONE */}

              <button
                className={`
                  ${iconBtn}
                  ${
                    listening ? "animate-pulse bg-[#FFD43B] text-[#1D1A3B]" : ""
                  }
                `}
                onClick={handleVoice}
                aria-label="Voice input"
              >
                <Mic size={18} />
              </button>

              {/* SPEAKER */}

              <button
                className={`
                  ${iconBtn}
                  ${speak ? "bg-[#ECEAF6] dark:bg-[#14122B]" : ""}
                `}
                aria-pressed={speak}
                onClick={() => setSpeak((current) => !current)}
                aria-label="Read answers aloud"
              >
                <Volume2 size={18} />
              </button>

              <Dropdown openUp={true} />

              {/* SEND */}
              <button
                onClick={handleSend}
                disabled={!text.trim()}
                aria-label="Send message"
                className={`
                  grid h-10.5 w-10.5
                  shrink-0 place-items-center
                  rounded-full
                  bg-violet-600
                  text-white
                  hover:bg-violet-700
                  disabled:cursor-default
                  disabled:opacity-40
                  ${focus}
                `}
              >
                <ArrowUp size={20} />
              </button>
            </div>

            <div className="absolute right-0 z-0 flex items-center justify-center">
              <Button
                onClick={onScrollToBottom}
                aria-label="Scroll to bottom"
                aria-hidden={!showScrollBtn}
                tabIndex={showScrollBtn ? 0 : -1}
                className={`
            flex h-fit w-fit p-2
            transition-all duration-300 ease-out
            ${
              showScrollBtn
                ? "translate-x-0 opacity-100"
                : "-translate-x-14 opacity-0 pointer-events-none"
            }
          `}
              >
                <ChevronDown />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Composer;
