import { useCallback, useEffect, useRef, useState } from "react";

/* ---------- state hook ---------- */
export function useShuttapyState(initial = "wake") {
  const [base, setBase] = useState(initial);
  const [flash, setFlash] = useState(null);
  const timer = useRef();

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

  const success = useCallback(() => play("success", 800), [play]);
  const error = useCallback(() => play("error", 1000), [play]);

  return { state: flash ?? base, set: setBase, success, error };
}

/* ---------- mascot ---------- */
const NO_BLINK = new Set(["wake", "error"]);

function ShuttapyMascot({
  state = "idle",
  size = 320,
  followCursor = true,
  onPoke,
}) {
  const rootRef = useRef(null);
  const pokeTimer = useRef();
  const [blink, setBlink] = useState(false);
  const [poked, setPoked] = useState(false);

  /* Blinking (leak-free, occasional double blink) */
  useEffect(() => {
    if (NO_BLINK.has(state)) {
      setBlink(false);
      return;
    }
    let cancelled = false;
    let t1, t2;

    const loop = (quick = false) => {
      const delay = quick ? 200 : 2500 + Math.random() * 4000;
      t1 = setTimeout(() => {
        if (cancelled) return;
        setBlink(true);
        t2 = setTimeout(() => {
          if (cancelled) return;
          setBlink(false);
          loop(!quick && Math.random() < 0.2); // 20% double blink
        }, 130);
      }, delay);
    };

    loop();
    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      setBlink(false);
    };
  }, [state]);

  /* Eyes follow the cursor (CSS vars, no re-renders) */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !followCursor) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const MAX = 10;
    let raf = 0;
    let idleTimer;

    const setLook = (x, y) => {
      el.style.setProperty("--look-x", x.toFixed(2));
      el.style.setProperty("--look-y", y.toFixed(2));
    };

    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const k = Math.min(dist / 250, 1);
        setLook((dx / dist) * MAX * k, (dy / dist) * MAX * k * 0.7);
      });
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setLook(0, 0), 4000); // look back to center
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      setLook(0, 0);
    };
  }, [followCursor]);

  useEffect(() => () => clearTimeout(pokeTimer.current), []);

  const handlePoke = () => {
    if (poked) return;
    setPoked(true);
    onPoke?.();
    pokeTimer.current = setTimeout(() => setPoked(false), 500);
  };

  return (
    <div
      ref={rootRef}
      onClick={handlePoke}
      style={{ "--size": `${size}px` }}
      className={`shuttapy-mascot state-${state} ${blink ? "is-blinking" : ""} ${
        poked ? "is-poked" : ""
      }`}
    >
      <svg
        width="688"
        height="595"
        viewBox="0 0 688 595"
        xmlns="http://www.w3.org/2000/svg"
        className="shuttapy-svg"
        aria-label="Shuttapy"
        role="img"
      >
        <g className="shuttapy-character">
          <g className="shuttapy-head-group">
            <path
              className="shuttapy-head"
              d="m 316,401.85824 c -64.78766,-5.39297 -97.31878,-21.31782 -110.33761,-54.0132 -4.05083,-10.17321 -5.77417,-20.02485 -5.84255,-33.39939 -0.18935,-37.03639 10.03379,-69.90382 28.51648,-91.68066 9.88728,-11.64947 29.03056,-22.86434 49.68801,-29.10914 24.58363,-7.43169 50.46764,-10.22332 86.6806,-9.34864 32.33947,0.78112 51.49735,3.64479 72.79507,10.88121 34.31401,11.65903 53.09382,31.15162 62.44167,64.81158 5.85731,21.09119 5.5997,57.38374 -0.56076,79 -5.05848,17.74954 -17.87663,34.21475 -33.94644,43.60497 -16.5672,9.68087 -40.07167,15.9282 -70.93447,18.85389 -15.25375,1.44601 -63.00776,1.68896 -78.5,0.39938 z"
            />

            <g className="shuttapy-face">
              <path
                className="shuttapy-eye shuttapy-left-eye"
                d="m 255.63245,310.87557 c 1.22573,-1.15151 2.53879,-3.95709 2.91791,-6.23462 1.43858,-8.6421 8.19071,-16.93564 14.54765,-17.86864 3.4657,-0.50866 9.2599,1.34904 12.10992,3.88261 2.49837,2.22096 6.76868,11.01067 6.7823,13.96022 0.0149,3.2313 3.69199,7.20311 7.69075,8.30722 5.19394,1.43412 9.93515,-0.75937 11.92254,-5.51587 1.36264,-3.26127 1.36931,-4.46101 0.0605,-10.8791 -2.9342,-14.38833 -9.21433,-23.21364 -20.45198,-28.74064 -5.87849,-2.89122 -7.64719,-3.28549 -14.69736,-3.27631 -6.56872,0.009 -9.04238,0.4903 -13.71116,2.67019 -11.34534,5.29722 -19.43374,16.76986 -21.82719,30.9598 -1.45453,8.62344 -0.80298,11.37322 3.30053,13.9294 3.81293,2.37517 8.02799,1.93188 11.35561,-1.19426 z"
              />
              <path
                className="shuttapy-eye shuttapy-right-eye"
                d="m 407.05463,310.45056 c 0.99361,-0.8992 2.7217,-4.63094 3.8402,-8.29274 3.54205,-11.59614 10.68911,-17.39646 19.41789,-15.75893 4.72723,0.88683 10.13593,7.00543 12.13084,13.72302 0.85604,2.8826 1.55644,5.85487 1.55644,6.60505 0,0.75017 1.10455,2.46849 2.45455,3.81849 C 448.35259,312.4435 449.95709,313 453.53147,313 459.9733,313 464,309.0716 464,302.78702 c 0,-10.69888 -5.49315,-23.40622 -12.9663,-29.99504 -8.09461,-7.13673 -11.23459,-8.29208 -22.5337,-8.29121 -8.90325,6.9e-4 -10.55449,0.29334 -15.05571,2.66839 -9.86009,5.20263 -17.58838,15.70045 -20.07139,27.26424 -2.07404,9.65912 -1.79378,12.29956 1.67349,15.76684 2.60452,2.60452 3.56532,2.96218 6.62403,2.46582 1.9677,-0.31932 4.39059,-1.31629 5.38421,-2.2155 z"
              />
              <path
                className="shuttapy-mouth"
                d="m 367.8108,343.90782 c 10.10729,-4.95372 16.11081,-15.29116 12.70515,-21.87697 -2.17465,-4.20532 -5.30106,-4.6443 -15.41368,-2.16421 -10.81999,2.65356 -15.65467,2.67579 -25.42424,0.11689 -8.61853,-2.2574 -11.84962,-1.8968 -14.1254,1.57648 -1.95905,2.9899 -1.96027,5.52861 -0.005,10.20846 5.96643,14.27969 26.09793,20.06212 42.26307,12.13935 z"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

export default ShuttapyMascot;
