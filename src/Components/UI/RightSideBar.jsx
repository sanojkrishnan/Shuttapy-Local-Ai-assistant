import { useState } from "react";
import {
  DEFAULT_PERMS,
  DOT,
  HEAD,
  LINE,
  MUTE,
  PANEL,
  PERMS,
  SEL,
} from "../../Utils/UIElements";
import { Activity, Brain, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import { DEMO_MEMORIES, DEMO_TRACE } from "../../Utils/Demo";
import { focus } from "../../TailwindElements/tailwindClass";

function RightSideBar({ showConfirmation, setShowConfirmation }) {
  const [perms, setPerms] = useState(DEFAULT_PERMS);
  const [trace] = useState(DEMO_TRACE);
  const [memories] = useState(DEMO_MEMORIES);

  const [used] = useState("Local model");
  return (
    <>
      <aside
        aria-label="Activity"
        className={`
          hidden flex-col
          overflow-auto
          border-l p-4
          xl:flex
          ${PANEL}
          ${LINE}
        `}
      >
        {/* ACTIVITY */}

        <section
          className={`
            border-t py-4
            first:border-t-0
            first:pt-0
            ${LINE}
          `}
        >
          <h2
            className={`
              mb-2 flex items-center
              gap-2 text-[15px]
              ${HEAD}
            `}
          >
            <Activity size={16} />
            Activity
          </h2>

          {used && (
            <p
              className={`
                mb-1.5 text-[13px]
                ${MUTE}
              `}
            >
              Model: {used}
            </p>
          )}

          {trace.length === 0 ? (
            <p
              className={`
                text-[13px]
                leading-snug
                ${MUTE}
              `}
            >
              The plan and tool activity will appear here while the local AI
              agent works.
            </p>
          ) : (
            <ul
              className="
                grid list-none
                gap-2 p-0 text-sm
              "
            >
              {trace.map((item) => (
                <li
                  key={item.id}
                  className="
                    flex items-center
                    gap-2.5
                  "
                >
                  <span
                    className={`
                      h-2.5 w-2.5
                      shrink-0 rounded-full
                      ${DOT[item.status]}
                    `}
                  />

                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* MEMORY */}

        <section
          className={`
            border-t py-4
            ${LINE}
          `}
        >
          <h2
            className={`
              mb-2 flex items-center
              gap-2 text-[15px]
              ${HEAD}
            `}
          >
            <Brain size={16} />
            Memory
          </h2>

          {memories.length === 0 ? (
            <p
              className={`
                text-[13px]
                leading-snug
                ${MUTE}
              `}
            >
              Saved memories will appear here.
            </p>
          ) : (
            <ul
              className="
                grid list-none
                gap-2 p-0 text-sm
              "
            >
              {memories.map((memory, index) => (
                <li key={index}>{memory}</li>
              ))}
            </ul>
          )}
        </section>

        {/* PERMISSIONS */}

        <section
          className={`
            border-t py-4
            ${LINE}
          `}
        >
          <h2
            className={`
              mb-2 flex items-center
              gap-2 text-[15px]
              ${HEAD}
            `}
          >
            <ShieldCheck size={16} />
            Permissions
          </h2>

          {PERMS.map(([key, label]) => (
            <label
              key={key}
              className="
                  mb-2 flex
                  items-center
                  justify-between
                  gap-2
                  text-[13.5px]
                "
            >
              {label}

              <select
                value={perms[key]}
                onChange={(event) =>
                  setPerms((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
                className={SEL}
              >
                <option value="allow">Allow</option>

                <option value="ask">Ask first</option>

                <option value="off">Off</option>
              </select>
            </label>
          ))}

          {/* ALWAYS ASK DELETE */}

          <label
            className="
              mb-2 flex
              items-center
              justify-between
              gap-2
              text-[13.5px]
            "
          >
            <span
              className="
                flex items-center
                gap-1.5
              "
            >
              Delete files
              <Lock size={12} />
            </span>

            <select disabled className={SEL}>
              <option>Always ask</option>
            </select>
          </label>
        </section>

        {/* VISUAL CONFIRMATION BUTTON */}

        <button
          onClick={() => setShowConfirmation((current) => !current)}
          className={`
            mt-3 rounded-xl
            border px-3 py-2
            text-left text-[13px]
            ${LINE}
            ${focus}
          `}
        >
          {showConfirmation
            ? "Hide confirmation preview"
            : "Preview confirmation UI"}
        </button>

        {showConfirmation && (
          <div
            className={`
              mt-3 rounded-2xl
              border-2
              border-[#FFD43B]
              p-3
              ${PANEL}
            `}
          >
            <div
              className="
                flex items-center
                gap-2 text-[13px]
                font-medium
              "
            >
              <ShieldAlert size={16} className="text-amber-500" />
              Agent permission required
            </div>

            <p
              className={`
                mt-2 text-[12px]
                leading-relaxed
                ${MUTE}
              `}
            >
              The agent wants to perform an action on your computer.
            </p>

            <div
              className="
                mt-2 flex gap-2
              "
            >
              <button
                onClick={() => setShowConfirmation(false)}
                className="
                  rounded-full
                  bg-violet-600
                  px-3 py-1
                  text-xs text-white
                "
              >
                Allow
              </button>

              <button
                onClick={() => setShowConfirmation(false)}
                className={`
                  rounded-full
                  border px-3 py-1
                  text-xs
                  ${LINE}
                `}
              >
                Deny
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default RightSideBar;
