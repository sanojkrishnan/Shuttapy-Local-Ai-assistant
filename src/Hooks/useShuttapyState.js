import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useSelector } from "react-redux";

const GREET_MS = 5600; // matches the wave loop in the CSS
const ALL = ["greet", "error", "wake", "sleep", "success"];

/* ---------- shared greeting TEXT only (timing is per mascot) ---------- */
let greetText = "Hi, I'm Shuttapy!";
const textListeners = new Set();

const subscribeText = (cb) => {
  textListeners.add(cb);
  return () => textListeners.delete(cb);
};
const getText = () => greetText;

/* Call when the AI connects, or before each new chat:
   setShuttapyGreeting("Hello Sanoj, ready when you are!") */
export function setShuttapyGreeting(text) {
  if (!text || text === greetText) return;
  greetText = text;
  textListeners.forEach((l) => l());
}

/*
  useShuttapyState({ initial, enable })
  enable = which emotions THIS mascot may show:
  "greet" | "error" | "wake" | "sleep" | "success"
*/
export function useShuttapyState({ initial = "idle", enable = ALL } = {}) {
  const [base, setBase] = useState(initial);
  const [flash, setFlash] = useState(null);
  const timer = useRef();
  const wasStarted = useRef(false);

  const on = (name) => enable.includes(name);
  const canSuccess = enable.includes("success");

  const [greeting, setGreeting] = useState(true); // true on every mount
  const text = useSyncExternalStore(subscribeText, getText);

  // each mount (or replay) gets its own full greeting;
  // if the AI's text arrives mid-greeting, the timer restarts so it gets full screen time
  useEffect(() => {
    if (!greeting) return;
    const t = setTimeout(() => setGreeting(false), GREET_MS);
    return () => clearTimeout(t);
  }, [greeting, text]);

  const replay = useCallback(() => setGreeting(true), []);

  const { started, starting, startingError } = useSelector(
    (state) => state.shuttapy,
  );

  // wake -> idle automatically (but never clobber a newer state)
  useEffect(() => {
    if (initial !== "wake") return;
    const t = setTimeout(
      () => setBase((s) => (s === "wake" ? "idle" : s)),
      1200,
    );
    return () => clearTimeout(t);
  }, [initial]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const play = useCallback((s, ms) => {
    clearTimeout(timer.current);
    setFlash(s);
    timer.current = setTimeout(() => setFlash(null), ms);
  }, []);

  const success = useCallback(() => play("success", 1400), [play]);
  const error = useCallback(() => play("error", 1400), [play]);

  // celebrate the moment startup finishes (only if this mascot allows it)
  useEffect(() => {
    if (canSuccess && started && !wasStarted.current) success();
    wasStarted.current = started;
  }, [started, success, canSuccess]);

  // priority: flash > error > greet > wake > sleep > manual state
  let state;
  if (flash) state = flash;
  else if (on("error") && startingError) state = "error";
  else if (on("greet") && greeting) state = "greet";
  else if (on("wake") && starting) state = "wake";
  else if (on("sleep") && !started) state = "sleep";
  else state = base;

  return { state, greetText: text, set: setBase, success, error, replay };
}
