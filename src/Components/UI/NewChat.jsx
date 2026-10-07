import { HEAD, MUTE } from "../../Utils/UIElements";
import Iris from "./Iris";

function NewChat({ chat, DefaultMode, mode }) {
  console.log("CHAT FROM THE NEWCHAT ,", chat);
  return (
    <div className="flex flex-col items-center justify-center">
      {chat.messages.length === 0 && (
        <div
          className="
                  mx-auto mt-[9vh]
                  grid justify-items-center
                  gap-3 text-center
                "
        >
          <h1
            className={`
                    m-0
                    text-[clamp(32px,5vw,50px)]
                    ${HEAD}
                  `}
          >
            {mode === "chat" ? "Hi, I'm Shuttapy." : DefaultMode.label}
          </h1>

          <p
            className={`
                    m-0 max-w-[42ch]
                    leading-relaxed mb-16
                    ${MUTE}
                  `}
          >
            {DefaultMode.hint}
          </p>
          <Iris size="250" />
        </div>
      )}
    </div>
  );
}

export default NewChat;
