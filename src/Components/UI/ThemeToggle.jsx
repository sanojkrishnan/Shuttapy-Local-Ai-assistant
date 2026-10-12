import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const THEME_TRANSITION_DELAY = 500;

export default function ThemeToggle() {
  const [exploding, setExploding] = useState(false);
  const { dark, setDark } = useTheme();
  const [animDark, setAnimDark] = useState(dark);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.overflow = exploding ? "hidden" : "";
  }, [exploding]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleClick = () => {
    if (exploding) return;

    // explosion starts from the center of the button
    const rect = buttonRef.current.getBoundingClientRect();
    setOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    const next = !animDark;
    setAnimDark(next);
    setExploding(true);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDark(next);
    }, THEME_TRANSITION_DELAY);
  };

  return (
    <div className="flex items-center gap-2 z-40">
      <div className="relative max-w-20 max-h-20">
        <button
          ref={buttonRef}
          onClick={handleClick}
          aria-label="Toggle theme"
          className="cursor-pointer relative w-fit h-fit"
        >
          {/* Moon */}
          <svg
            className={`absolute inset-0 size-8 fill-blue-200 transition-all duration-300 ease-in-out
            ${
              animDark
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-50 -rotate-90"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>

          {/* Sun */}
          <Sun
            className={`size-8 fill-[#ffd43b] text-[#ffd43b] transition-all duration-300 ease-in-out
            ${
              !animDark
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-50 rotate-90"
            }`}
          />
        </button>
      </div>

      {/* Full-screen explosion, rendered outside the sidebar */}
      {exploding &&
        createPortal(
          <div
            onAnimationEnd={() => setExploding(false)}
            className={`theme-explode pointer-events-none fixed inset-0 z-[9999] ${
              animDark ? "bg-gray-950" : "bg-[#ffd43b]"
            }`}
            style={{ "--x": `${origin.x}px`, "--y": `${origin.y}px` }}
          />,
          document.body
        )}
    </div>
  );
}