import { useState } from "react";
import {
  DEFAULT_PERMS,
  DOT,
  HEAD,
  LINE,
  MUTE,
  PANEL,
  PERMS,
} from "../../Utils/UIElements";
import {
  Activity,
  Brain,
  ChevronDown,
  Laptop,
  ShieldCheck,
} from "lucide-react";
import { DEMO_MEMORIES, DEMO_TRACE } from "../../Utils/Demo";
import SystemStats from "./SystemStatus";
import GlobalGpuPanel from "./GlobalGpuPanel";
import Dropdown from "./DropDown";

function RightSideBar() {
  const [perms, setPerms] = useState(DEFAULT_PERMS);
  const [permissionOpen, setPermissionOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [trace] = useState(DEMO_TRACE);
  const [memories] = useState(DEMO_MEMORIES);

  const [used] = useState("Local model");
  return (
    <>
      <aside
        aria-label="Activity"
        className={`
          custom-scrollbar
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
            border-t ${activityOpen && "py-4"}
            first:border-t-0
            first:pt-0
            ${LINE}
          `}
        >
          <button
            onClick={() => setActivityOpen((prev) => !prev)}
            className={`
              py-4 w-full flex items-center justify-between cursor-pointer
              gap-2 text-[15px]
              ${HEAD}
            `}
          >
            <h2
              className={`
             flex gap-2 items-center
              ${HEAD}
            `}
            >
              <Activity size={16} />
              Activity
            </h2>
            <ChevronDown
              size={22}
              aria-hidden="true"
              className={`transition-transform duration-200 ${activityOpen ? "rotate-180" : ""}`}
            />
          </button>
          <div className={`${activityOpen ? "block" : "hidden"}`}>
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
          </div>
        </section>

        {/* MEMORY */}

        <section
          className={`
            border-t ${memoryOpen && "pb-4"}
            ${LINE}
          `}
        >
          <button
            onClick={() => setMemoryOpen((prev) => !prev)}
            className={`
              py-4 w-full flex items-center justify-between cursor-pointer
              gap-2 text-[15px]
              ${HEAD}
            `}
          >
            <h2
              className={`
             flex gap-2 items-center
              ${HEAD}
            `}
            >
              <Brain size={16} />
              Memory
            </h2>
            <ChevronDown
              size={22}
              aria-hidden="true"
              className={`transition-transform duration-200 ${memoryOpen ? "rotate-180" : ""}`}
            />
          </button>
          <div className={`${memoryOpen ? "block" : "hidden"}`}>
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
          </div>
        </section>

        {/* PERMISSIONS */}

        <section
          className={`
            border-t ${permissionOpen && "pb-4"}
            ${LINE}
          `}
        >
          <button
            onClick={() => setPermissionOpen((prev) => !prev)}
            className={`
              py-4 w-full flex items-center justify-between cursor-pointer
              gap-2 text-[15px]
              ${HEAD}
            `}
          >
            <h2 className="flex gap-2 items-center">
              <ShieldCheck size={16} />
              Permissions
            </h2>
            <ChevronDown
              size={22}
              aria-hidden="true"
              className={`transition-transform duration-200 ${permissionOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div className={`${permissionOpen ? "block" : "hidden"}`}>
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

                <Dropdown buttonClass={"py-1"} className="" align="right" />
              </label>
            ))}
          </div>
          {/* ALWAYS ASK DELETE */}

          {/* <label
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
          </label> */}
        </section>
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
            <Laptop size={16} />
            Resources
          </h2>
          <div className="mb-4">
            <GlobalGpuPanel />
          </div>
          <div className="mb-4">
            <SystemStats />
          </div>
        </section>
      </aside>
    </>
  );
}

export default RightSideBar;
