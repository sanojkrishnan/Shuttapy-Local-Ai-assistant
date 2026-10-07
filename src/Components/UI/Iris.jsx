import { useEffect, useRef, useState } from "react";

export default function Iris({ size = 32, think = false }) {
  const irisRef = useRef(null);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const [pupil, setPupil] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    function handleMouseMove(event) {
      if (!irisRef.current) return;

      const rect = irisRef.current.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;

      /*
       * Maximum pupil movement.
       *
       * Keep this SMALL because the pupil
       * must stay inside the yellow ring.
       */
      const maxMove = size * 0.02;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > maxMove) {
        target.current.x = (dx / distance) * maxMove;
        target.current.y = (dy / distance) * maxMove;
      } else {
        target.current.x = dx;
        target.current.y = dy;
      }
    }

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrame;

    function animate() {
      /*
       * Slowly move current position toward
       * the mouse position.
       */
      current.current.x += (target.current.x - current.current.x) * 0.06;

      current.current.y += (target.current.y - current.current.y) * 0.06;

      setPupil({
        x: current.current.x,
        y: current.current.y,
      });

      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [size]);

  return (
    <svg
      ref={irisRef}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Outer eye */}
      <circle
        cx="20"
        cy="20"
        r="18"
        className="fill-[#1D1A3B] dark:fill-[#0B0A1F]"
      />

      {/* Yellow eye border */}
      <circle
        cx="20"
        cy="20"
        r="12"
        fill="none"
        stroke="#FFD43B"
        strokeWidth="2"
      />

      {/* Pupil */}
      <circle
        cx="20"
        cy="20"
        r="7"
        fill="#FFD43B"
        style={{
          transform: `translate(${pupil.x}px, ${pupil.y}px)`,
          transition: "none",
        }}
      />
    </svg>
  );
}
