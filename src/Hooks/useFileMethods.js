import { useState } from "react";

export default function useFileMethods({ addMessages }) {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");

  function handleFileSelect(event) {
    setFiles([...event.target.files]);
  }

  function removeFile(name) {
    setFiles((current) => current.filter((file) => file.name !== name));
  }

  function handleSend() {
    const content = text.trim();
    if (!content) return;

    addMessages([
      { role: "user", content },
      {
        role: "assistant",
        content:
          "This is the UI-only version of Shuttapy. Your local AI agent will handle this response here.",
      },
    ]);

    setText("");
    setFiles([]);
  }

  return { handleFileSelect, removeFile, handleSend, files, text, setText };
}
