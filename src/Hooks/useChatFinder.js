import { useState } from "react";

export default function useChatFinder() {
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const chat = chats.find((c) => c.id === activeId) ?? null;

  function createNewChat() {
    const id = Date.now().toString();
    setChats((current) => [{ id, title: "New chat", messages: [] }, ...current]);
    setActiveId(id);
    return id; // caller can use it immediately
  }

  function addMessages(chatId, newMessages) {
    if (!chatId || !newMessages?.length) return;

    setChats((current) =>
      current.map((c) =>
        c.id === chatId
          ? {
              ...c,
              title:
                c.messages.length === 0
                  ? newMessages[0].content.slice(0, 30)
                  : c.title,
              messages: [...c.messages, ...newMessages],
            }
          : c,
      ),
    );
  }

  return { chats, setChats, activeId, setActiveId, chat, createNewChat, addMessages };
}