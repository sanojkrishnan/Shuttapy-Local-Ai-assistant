import { useEffect, useRef } from "react";
import { useShuttapyState } from "../../Hooks/useShuttapyState";
import { useShuttapyVoice } from "../../Hooks/useShuttapyVoice";
import { HEAD, MUTE } from "../../Utils/UIElements";
import ShuttapyMascot from "./ShuttapyMascot";

const TEST_SENTENCE =
  "nee poda, nee pande udayipa";

function NewChat({ chat, DefaultMode, mode }) {
  const { state, greetText } = useShuttapyState({
    enable: ["error", "sleep", "success"],
    talk: false, // the voice hook controls talking
  });
  const { speak, stop, speaking, supported } = useShuttapyVoice();
  const spokenRef = useRef("");

  // speak the greeting whenever it changes
  useEffect(() => {
    if (state === "greet" && greetText && spokenRef.current !== greetText) {
      spokenRef.current = greetText;
      speak(greetText);
    }
  }, [state, greetText, speak]);

  // browsers block audio before any click, so retry on first interaction
  useEffect(() => {
    const unlock = () => {
      if (state === "greet" && greetText && !speaking) speak(greetText);
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    return () => window.removeEventListener("pointerdown", unlock);
  }, [state, greetText, speaking, speak]);

  return (
    <div className="flex flex-col items-center justify-center">
      {!chat && (
        <div className="mx-auto mt-[9vh] grid justify-items-center gap-3 text-center">
          <h1 className={`m-0 text-[clamp(32px,5vw,50px)] ${HEAD}`}>
            {mode === "chat" ? "Hi, I'm Shuttapy." : DefaultMode.label}
          </h1>
          <p className={`m-0 max-w-[42ch] leading-relaxed ${MUTE}`}>
            {DefaultMode.hint}
          </p>

          <ShuttapyMascot
            state={state}
            greetText={greetText}
            talking={speaking}
            onPoke={() => speak("Hehe, that tickles!")}
          />

          {/* ---- test button ---- */}
          {!speaking && (
            <button
              type="button"
              disabled={!supported}
              onClick={() => (speaking ? stop() : speak(TEST_SENTENCE))}
              className="
              rounded-full px-5 py-2 text-sm font-medium
              border border-current/20
              transition active:scale-95
              hover:bg-black/5 dark:hover:bg-white/10
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            >
              {!supported
                ? "Speech not supported"
                : speaking
                  ? "⏹ Stop"
                  : "🔊 Test Shuttapy voice"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default NewChat;
