import { useState } from "react";
import useChatFinder from "./useChatFinder";

export default function useFileMethods() {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");

  const { setChats, activeId } = useChatFinder();

  function handleFileSelect(event) {
    setFiles([...event.target.files]);
  }

  function removeFile(name) {
    setFiles((current) => current.filter((file) => file.name !== name));
  }

  function handleSend() {
    if (!text.trim()) return;

    const userMessage = {
      role: "user",
      content: text.trim(),
    };

    setChats((current) =>
      current.map((c) =>
        c.id === activeId
          ? {
              ...c,
              title:
                c.messages.length === 0 ? text.trim().slice(0, 30) : c.title,
              messages: [
                ...c.messages,
                userMessage,
                {
                  role: "assistant",
                  content:
                    "This is the UI-only version of Shuttapy. Your local AI agent will handle this response here.",
                },
              ],
            }
          : c,
      ),
    );

    setText("");
    setFiles([]);
  }

  return {
    handleFileSelect,
    removeFile,
    handleSend,
    files,
    text,
    setText,
  };
}
