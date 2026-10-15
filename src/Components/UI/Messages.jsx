import { LINE, PANEL } from "../../Utils/UIElements";
import Iris from "./Iris";
import { useSelector } from "react-redux";
import ChatLoading from "./ChatLoading";
import useNotifications from "../../Hooks/useNotifications";
import { useEffect } from "react";

function Messages({ chat }) {
  const {
    permissionMessage,
    errorMessage,
    isChatMessageLoading,
    chatMessage,
  } = useSelector((state) => state.messages);

  const { notify } = useNotifications();
  const messages = chat?.messages ?? [];

  useEffect(() => {
    if (!errorMessage && !permissionMessage) return;

    if (errorMessage) {
      notify({
        title: "Something Went Wrong...!",
        message: errorMessage,
        type: "error",
      });
    }

    if (permissionMessage) {
      notify({
        title: "Permission Required",
        message: permissionMessage,
        type: "confirm",
        needsAction: true,
      });
    }
  }, [errorMessage, permissionMessage, notify]);

  function renderAssistantBubble(content, loading = false) {
    return (
      <div className="flex items-start gap-2.5">
        <Iris think={loading} size={28} />

        <div
          className={`
            whitespace-pre-wrap
            break-words
            px-4 py-2.5
            text-[15.5px]
            leading-relaxed
            rounded-[4px_20px_20px_20px]
            max-w-[100%]
            ${PANEL}
            ${LINE}
          `}
        >
          {content || (loading ? <ChatLoading /> : null)}
        </div>
      </div>
    );
  }

  return (
    <>
      {messages.map((message, index) => {
        const isUser = message.role === "user";

        // Hide any old empty placeholder created by the previous hook.
        if (!isUser && !message.content && isChatMessageLoading) {
          return null;
        }

        return (
          <div
            key={index}
            className={`flex items-start gap-2.5 ${
              isUser ? "justify-end" : ""
            }`}
          >
            {!isUser && <Iris think={false} size={28} />}

            <div
              className={`
                whitespace-pre-wrap
                break-words
                px-4 py-2.5
                text-[15.5px]
                leading-relaxed
                ${
                  isUser
                    ? "rounded-[20px_4px_20px_20px] bg-[#FFD43B] text-[#1D1A3B] max-w-[85%]"
                    : `rounded-[4px_20px_20px_20px] max-w-[100%] ${PANEL} ${LINE}`
                }
              `}
            >
              {message.content}
            </div>
          </div>
        );
      })}

      {/* One temporary assistant bubble for the incoming stream. */}
      {isChatMessageLoading &&
        renderAssistantBubble(chatMessage, true)}
    </>
  );
}

export default Messages;