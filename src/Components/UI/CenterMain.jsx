import NewChat from "./NewChat";
import Header from "./Header";
import Messages from "./Messages";
import Composer from "./Composer";
import { useEffect, useRef, useState } from "react";

function CenterMain({
  mode,
  setMode,
  DefaultMode,
  chat,
  addMessages,
  setShowConfirmation,
  createNewChat,
}) {
  const scrollRef = useRef(null); // the scrolling container
  const messagesEndRef = useRef(null); // bottom of the messages
  const [atBottom, setAtBottom] = useState(true);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    // 40px tolerance so "almost at bottom" counts as bottom
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 40);
  }

  function scrollToBottom() {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [chat]);

  return (
    <>
      <main className="flex h-full min-h-0 min-w-0 flex-col items-center overflow-hidden">
        {/* HEADER */}
        <div className="w-full">
          <Header mode={mode} setMode={setMode} DefaultMode={DefaultMode} />
        </div>

        {/* CONVERSATION */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="
            flex-1 overflow-auto
            px-5 py-6
            custom-scrollbar
            mb-6
            w-full
          "
        >
          <div className="mx-auto flex max-w-175 flex-col gap-4 w-full">
            {/* EMPTY STATE */}
            <NewChat chat={chat} DefaultMode={DefaultMode} mode={mode} />

            {/* MESSAGES */}
            <Messages chat={chat} setShowConfirmation={setShowConfirmation} />

            {/* bottom marker */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* COMPOSER */}
        <Composer
          DefaultMode={DefaultMode}
          addMessages={addMessages}
          showScrollBtn={!atBottom}
          onScrollToBottom={scrollToBottom}
          chat={chat}
          createNewChat={createNewChat}
        />
      </main>
    </>
  );
}

export default CenterMain;
