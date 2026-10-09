import { LINE, MUTE, PANEL } from "../../Utils/UIElements";
import Iris from "./Iris";
import { Button } from "./Button";
import { ShieldAlert } from "lucide-react";

function Messages({ chat, setShowConfirmation }) {
  //messages component is responsible for rendering the chat messages in the UI. It takes in the chat object and a function to set the showConfirmation state as props.
  return (
    <>
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
    </>
  );
}

export default Messages;
