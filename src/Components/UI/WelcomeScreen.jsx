import { useEffect, useRef, useState } from "react";
import { useShuttapyState } from "../../Hooks/useShuttapyState";
import ShuttapyMascot from "./ShuttapyMascot";

function WelcomeScreen() {
  const { state, greetText } = useShuttapyState({
    enable: ["greet"],
  });

  const alreadyShownRef = useRef(
    typeof window !== "undefined" &&
      sessionStorage.getItem("introShown") === "true",
  );

  const [mounted, setMounted] = useState(!alreadyShownRef.current);
  const [exiting, setExiting] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    if (alreadyShownRef.current) return;

    const raf = requestAnimationFrame(() => {
      setLogoVisible(true);
    });

    const fadeTimer = setTimeout(() => {
      setExiting(true);
    }, 5500);

    const removeTimer = setTimeout(() => {
      sessionStorage.setItem("introShown", "true");
      setMounted(false);
    }, 6000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center dark:bg-gray-900 bg-blue-500 transition-opacity duration-700 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`transition-opacity duration-500 ${logoVisible ? "opacity-100" : "opacity-0"}`}
      >
        <ShuttapyMascot state={state} greetText={greetText} />
      </div>
    </div>
  );
}

export default WelcomeScreen;
