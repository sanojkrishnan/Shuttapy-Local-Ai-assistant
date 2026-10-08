import { useState } from "react";
import { MODES } from "../../Utils/Modes";
import { HEAD, LINE, MUTE, PANEL } from "../../Utils/UIElements";
import { TriangleAlert } from "lucide-react";

function Header({ mode, setMode, DefaultMode }) {
  const [GPUConnected, setGPUConnected] = useState(false);
  const [live] = useState(true); //live is a state that indicates if the local AI agent is running or not. It is set to true for the demo version of this app.
  return (
    <>
      <header
        className={`
            flex items-center justify-between
            gap-3 border-b
            px-5 py-3.5
            ${LINE}
          `}
      >
        <select
          aria-label="Mode"
          value={mode}
          onChange={(event) => setMode(event.target.value)}
          className={`
              rounded-lg border
              px-2 py-1.5
              md:hidden
              ${PANEL}
              ${LINE}
            `}
        >
          {Object.entries(MODES).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>

        <b
          className={`
              hidden text-lg
              md:block
              ${HEAD}
            `}
        >
          {DefaultMode.label}
        </b>

        <span
          className={`
              flex items-center gap-1.5
              text-[12.5px]
              ${MUTE}
            `}
        >
          <i
            className={`
                h-2 w-2 rounded-full
                ${live ? "bg-emerald-500" : "bg-[#9C98C4]"}
              `}
          />
          Local AI
        </span>

        <span
          className={`flex rounded-xl border border-amber-100 p-1 px-2 items-center gap-1.5 text-[12px] font-semibold ${
            GPUConnected ? "animate-pulse bg-red-500" : "opacity-30"
          }`}
        >
          {GPUConnected ? (
            <span className="flex gap-1.5">
              <TriangleAlert size={16} />
              External GPU on
            </span>
          ) : (
            "External GPU off"
          )}
        </span>
      </header>
    </>
  );
}

export default Header;
