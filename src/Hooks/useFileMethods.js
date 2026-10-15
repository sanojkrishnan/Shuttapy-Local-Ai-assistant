import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResponse, clearChatMessage } from "../redux/slice/messageSlice";

export default function useFileMethods({ chat, createNewChat, addMessages }) {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const isChatMessageLoading = useSelector(
    (state) => state.messages.isChatMessageLoading,
  );

  function handleFileSelect(event) {
    setFiles([...event.target.files]);
  }

  function removeFile(name) {
    setFiles((current) => current.filter((file) => file.name !== name));
  }

  async function handleSend() {
    const content = text.trim();

    if (!content || isChatMessageLoading) return;

    const chatId = chat?.id ?? createNewChat();

    // Show the user's message immediately.
    addMessages(chatId, [{ role: "user", content }]);

    setText("");
    setFiles([]);

    try {
      const result = await dispatch(
        fetchResponse({ message: content }),
      ).unwrap();

      const reply = result?.reply ?? result?.data?.reply ?? "";

      if (!reply) {
        throw new Error("Shuttapy returned an empty response.");
      }

      // Save the completed assistant response to chat history.
      addMessages(chatId, [
        {
          role: "assistant",
          content: reply,
        },
      ]);

      dispatch(clearChatMessage());
    } catch (err) {
      console.error("Send failed:", err);
    }
  }

  return {
    handleFileSelect,
    removeFile,
    handleSend,
    files,
    text,
    setText,
    isChatMessageLoading,
  };
}
