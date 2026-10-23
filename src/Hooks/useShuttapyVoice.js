import { useCallback, useEffect, useRef, useState } from "react";

const PREFERRED = [
  "Microsoft Aria", "Microsoft Jenny", "Microsoft Zira",
  "Samantha", "Karen", "Tessa", "Veena", "Heera",
  "Google UK English Female", "Google US English",
];

function pickVoice(voices, lang = "en") {
  const inLang = voices.filter((v) => v.lang.toLowerCase().startsWith(lang));
  // prefer local voices: no network lag
  const pool = inLang.some((v) => v.localService)
    ? inLang.filter((v) => v.localService)
    : inLang;
  for (const name of PREFERRED) {
    const hit = pool.find((v) => v.name.includes(name));
    if (hit) return hit;
  }
  return (
    pool.find((v) => /female|woman|girl/i.test(v.name)) ||
    pool[0] ||
    voices[0] ||
    null
  );
}

// split into short chunks so Chrome doesn't cut off long speech
function chunkText(text, max = 180) {
  const clean = text.replace(/[*_`#>]/g, "").replace(/\s+/g, " ").trim();
  const sentences = clean.match(/[^.!?]+[.!?]*/g) || [clean];
  const chunks = [];
  let cur = "";
  for (const s of sentences) {
    if ((cur + s).length > max && cur) {
      chunks.push(cur.trim());
      cur = s;
    } else cur += s;
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}

export function useShuttapyVoice({
  lang = "en",
  pitch = 1.6,
  rate = 1.05,
  volume = 1,
} = {}) {
  const [speaking, setSpeaking] = useState(false);
  const voiceRef = useRef(null);
  const queueRef = useRef([]);
  const currentRef = useRef(null); // keeps utterance from being GC'd
  const tokenRef = useRef(0);
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      voiceRef.current = pickVoice(window.speechSynthesis.getVoices(), lang);
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, [supported, lang]);

  const stop = useCallback(() => {
    if (!supported) return;
    tokenRef.current++;
    queueRef.current = [];
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const next = useCallback(
    (token) => {
      if (token !== tokenRef.current) return;
      const text = queueRef.current.shift();
      if (!text) {
        setSpeaking(false);
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) u.voice = voiceRef.current;
      u.lang = voiceRef.current?.lang || lang;
      u.pitch = pitch;
      u.rate = rate;
      u.volume = volume;
      u.onstart = () => setSpeaking(true);
      u.onend = () => next(token);
      u.onerror = (e) => {
        if (e.error === "canceled" || e.error === "interrupted") return;
        next(token);
      };
      currentRef.current = u;
      window.speechSynthesis.speak(u);
    },
    [lang, pitch, rate, volume],
  );

  const speak = useCallback(
    (text) => {
      if (!supported || !text) return;
      const synth = window.speechSynthesis;
      const token = ++tokenRef.current;
      queueRef.current = chunkText(text);

      if (synth.speaking || synth.pending) synth.cancel();
      if (synth.paused) synth.resume();

      // small delay after cancel() avoids Chrome dropping the next utterance
      setTimeout(() => next(token), 80);
    },
    [supported, next],
  );

  useEffect(() => () => supported && window.speechSynthesis.cancel(), [supported]);

  return { speak, stop, speaking, supported };
}