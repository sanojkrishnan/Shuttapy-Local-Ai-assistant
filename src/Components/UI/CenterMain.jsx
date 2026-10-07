import { useRef, useState } from "react";
import useFileMethods from "../../Hooks/useFileMethods";
import { LINE, MUTE, PANEL} from "../../Utils/UIElements";
import NewChat from "./NewChat";
import { ArrowUp, Mic, Paperclip, ShieldAlert, Volume2 } from "lucide-react";
import Iris from "./Iris";
import { iconBtn } from "../../TailwindElements/tailwindClass";
import Header from "./Header";
import Dropdown from "./DropDown";
import { Button } from "./Button";

function CenterMain({ mode, setMode, DefaultMode, chat, setShowConfirmation }) {
  const [listening, setListening] = useState(false);
  const [speak, setSpeak] = useState(false);

  const fileRef = useRef(null);
  const taRef = useRef(null);

  const { handleFileSelect, removeFile, handleSend, files, text, setText } =
    useFileMethods(); //useFileMethods is a custom hook that handles file selection and removal, as well as sending messages with files attached.

  function handleVoice() {
    setListening((current) => !current); //this is to toggle the listening state, which is used to indicate if the app is currently listening for voice input
  }
  return (
    <>
      <main
        className="
          flex min-h-0 min-w-0
          flex-col
        "
      >
        {/* HEADER */}
        <Header mode={mode} setMode={setMode} DefaultMode={DefaultMode} />

        {/* CONVERSATION */}
        <div
          className="
            flex-1 overflow-auto
            px-5 py-6
          "
        >
          <div
            className="
              mx-auto flex max-w-[700px]
              flex-col gap-4
            "
          >
            {/* EMPTY STATE */}

            <NewChat chat={chat} DefaultMode={DefaultMode} mode={mode} />

            {/* MESSAGES */}

            {chat.messages.map((message, index) => {
              if (message.role === "confirm") {
                return (
                  <div
                    key={index}
                    role="alertdialog"
                    aria-label="Confirm action"
                    className={`
                        ml-9.5
                        grid max-w-130
                        gap-2 rounded-2xl
                        border-2
                        border-[#FFD43B]
                        p-3.5
                        ${PANEL}
                      `}
                  >
                    <b
                      className="
                          flex items-center
                          gap-2 text-[15px]
                        "
                    >
                      <ShieldAlert size={18} className="text-amber-500" />
                      Allow this action?
                    </b>

                    <code
                      className={`
                          break-all
                          text-[13px]
                          ${MUTE}
                        `}
                    >
                      The local AI agent is requesting permission to perform an
                      action.
                    </code>

                    <div
                      className="
                          flex gap-2
                        "
                    >
                      <Button
                        onClick={() => setShowConfirmation(false)}
                        className={`
                            rounded-full
                            bg-violet-600
                            px-4 py-1.5
                            text-white
                            hover:bg-violet-700
                            ${focus}
                          `}
                      >
                        Allow once
                      </Button>

                      <button
                        onClick={() => setShowConfirmation(false)}
                        className={`
                            rounded-full
                            border px-4 py-1.5
                            ${LINE}
                            ${focus}
                          `}
                      >
                        Don't do it
                      </button>
                    </div>
                  </div>
                );
              }

              const isUser = message.role === "user";

              return (
                <div
                  key={index}
                  className={`
                      flex items-start gap-2.5
                      ${isUser ? "justify-end" : ""}
                    `}
                >
                  {!isUser && <Iris size={28} think={false} />}

                  <div
                    className={`
                        max-w-[85%]
                        whitespace-pre-wrap
                        break-words
                        px-4 py-2.5
                        text-[15.5px]
                        leading-relaxed

                        ${
                          isUser
                            ? `
                              rounded-[20px_20px_4px_20px]
                              bg-[#FFD43B]
                              text-[#1D1A3B]
                            `
                            : `
                              rounded-[20px_20px_20px_4px]
                              border
                              ${PANEL}
                              ${LINE}
                            `
                        }
                      `}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMPOSER */}

        <div
          className="
            px-5 pb-5 pt-1.5
            custom-scrollbar
          "
        >
          <div
            className="
              mx-auto max-w-[700px]
            "
          >
            {/* QUICK ACTIONS */}

            <div
              className="
                flex gap-2
                overflow-x-auto
                pb-2.5
                mb-1.5
                custom-scrollbar
              "
            >
              {DefaultMode.actions.map((action) => (
                <button
                  key={action}
                  onClick={() => setText(action)}
                  className={`
                    shrink-0 rounded-full
                    border px-3.5 py-1.5
                    text-[13.5px]
                    hover:border-violet-500
                    ${PANEL}
                    ${LINE}
                    ${focus}
                  `}
                >
                  {action}
                </button>
              ))}
            </div>

            {/* FILE PREVIEW */}

            {files.length > 0 && (
              <div
                className="
                  mb-2 flex flex-wrap
                  gap-1.5
                "
              >
                {files.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => removeFile(file.name)}
                    className={`
                      rounded-full border
                      px-3 py-1
                      text-[13px]
                      ${PANEL}
                      ${LINE}
                    `}
                    title="Remove file"
                  >
                    {file.name}
                  </button>
                ))}
              </div>
            )}

            {/* INPUT */}

            <div
              className={`
                flex items-end gap-1.5
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
                  max-h-[150px]
                  flex-1 resize-none
                  border-0
                  bg-transparent
                  px-1 py-2
                  text-[15.5px]
                  outline-none
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

              {/* MODEL */}

              <Dropdown />

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
          </div>
        </div>
      </main>
    </>
  );
}

export default CenterMain;
