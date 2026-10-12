import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResponse } from "../redux/slice/messageSlice";

export default function useFileMethods({ addMessages }) {
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

    addMessages([{ role: "user", content }]);
    setText("");
    setFiles([]);

    try {
      const res = await dispatch(fetchResponse({ message: content })).unwrap();
      const reply = res?.reply ?? res;

      addMessages([
        {
          role: "assistant",
          content: typeof reply === "string" ? reply : JSON.stringify(reply),
        },
      ]);
    } catch {
      // errorMessage is already set by the slice; Composer's effect shows it
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