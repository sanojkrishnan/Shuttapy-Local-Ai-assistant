import { useState } from "react";
import { DEMO_CHATS } from "../Utils/Demo";

export default function useChatFinder() {
  const [chats, setChats] = useState(DEMO_CHATS);

  const [activeId, setActiveId] = useState("1");

  const chat = chats.find((c) => c.id === activeId) ?? chats[0]; //find the chat with the active id, if not found return the first chat

  function createNewChat() {
    //this function creates a new chat object with a unique id, title, and empty messages array
    const newChat = {
      id: Date.now().toString(),
      title: "New chat",
      messages: [],
    };

    setChats((current) => [newChat, ...current]);

    setActiveId(newChat.id);
  }

  function addMessages(newMessages) {
    const targetId = chat?.id; // `chat` already falls back to chats[0]

    setChats((current) =>
      current.map((c) =>
        c.id === targetId
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

  return {
    chats,
    setChats,
    activeId,
    setActiveId,
    chat,
    createNewChat,
    addMessages,
  };
}
