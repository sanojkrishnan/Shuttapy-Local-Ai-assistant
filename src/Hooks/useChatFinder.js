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

  return {
    chats,
    setChats,
    activeId,
    setActiveId,
    chat,
    createNewChat,
  };
}
