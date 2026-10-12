export default function Iris({ size = 32, think = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={`${think ? "bg-gray-500" : ""} shrink-0 rounded-full w-fit  `}
    >
      {/* Outer eye */}
      <circle
        cx="20"
        cy="20"
        r="18"
        className={`fill-[#1D1A3B] dark:fill-[#0B0A1F] ${think ? "animate-pulse" : "animate-none"} origin-center transition-all`}
      />

      {/* Yellow eye border */}
      <circle
        cx="20"
        cy="20"
        r="12"
        fill="none"
        stroke="#FFD43B"
        strokeWidth="2"
        className={`${think ? "animate-pulse" : "animate-none"} transition-all`}
      />

      {/* Pupil */}
      <circle cx="20" cy="20" r="7" fill="#FFD43B" />
      <circle
        cx="20"
        cy="20"
        r="5"
        strokeWidth="2"
        className={` ${think ? " animate-pulse origin-center " : "animate-none"} transition-all fill-[#1D1A3B]  dark:fill-[#0B0A1F]`}
      />
    </svg>
  );
}
