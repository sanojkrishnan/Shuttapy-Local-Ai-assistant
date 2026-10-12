import {
  speak,
  stopSpeaking,
  useShuttapyState,
} from "../../Hooks/useShuttapyState";
import { HEAD, MUTE } from "../../Utils/UIElements";
import ShuttapyMascot from "./ShuttapyMascot";
//     import { setShuttapyGreeting } from "./hooks/useShuttapyState";

function NewChat({ chat, DefaultMode, mode }) {
  // Example: everything except the success hop
  const { state, greetText, talking } = useShuttapyState({
    enable: ["error", "sleep", "success"],
    talk: true,
  });
  //  useEffect(() => { replay(); }, [chatId, replay]);  //if new chat is added use this

  // setShuttapyGreeting(aiGreeting)
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
                    leading-relaxed
                    ${MUTE}
                  `}
          >
            {DefaultMode.hint}
          </p>
          <ShuttapyMascot
            state={state}
            greetText={greetText}
            talking={talking}
          />
        </div>
      )}

      {/* <Button onClick={() => speak("Hello Sanoj, I can talk now!")}>
        Test talk
      </Button>
      <Button onClick={stopSpeaking}>Stop</Button> */}
    </div>
  );
}

export default NewChat;
