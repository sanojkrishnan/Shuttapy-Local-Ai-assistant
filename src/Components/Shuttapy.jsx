import { useState } from "react";
import useChatFinder from "../Hooks/useChatFinder";
import useMode from "../Hooks/useMode";
import LeftSideBar from "./UI/LeftSideBar";
import CenterMain from "./UI/CenterMain";
import { PAPER } from "../Utils/UIElements";
import RightSideBar from "./UI/RightSideBar";

export default function Shuttapy() {
  //states
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { chats, setActiveId, chat, createNewChat } = useChatFinder(); //chat finder hook to manage chats and active chat

  const { DefaultMode, mode, setMode } = useMode(); //mode hook to manage the current mode of the app

  return (
    <div
      className={`
        grid h-screen grid-cols-1
        font-['Instrument_Sans']
        text-[#1D1A3B]
        dark:text-[#EEEBFF]
        md:grid-cols-[236px_1fr]
        xl:grid-cols-[236px_1fr_288px]
        ${PAPER}
      `}
    >
      <style>
        {`
          @import url(
            'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Instrument+Sans:wght@400;500&display=swap'
          );
        `}
      </style>

      {/* LEFT SIDEBAR */}

      <LeftSideBar
        chats={chats}
        chat={chat}
        setActiveId={setActiveId}
        createNewChat={createNewChat}
        mode={mode}
        setMode={setMode}
      />

      {/* CENTER */}
      <CenterMain
        mode={mode}
        setMode={setMode}
        DefaultMode={DefaultMode}
        chat={chat}
        setShowConfirmation={setShowConfirmation}
      />

      {/* RIGHT ACTIVITY PANEL */}
      <RightSideBar
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
      />
    </div>
  );
}
