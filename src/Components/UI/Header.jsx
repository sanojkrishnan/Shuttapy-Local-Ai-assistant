import { useEffect } from "react";
import { MODES } from "../../Utils/Modes";
import { HEAD, LINE, MUTE, PANEL } from "../../Utils/UIElements";
import { TriangleAlert } from "lucide-react";
import { selectPermitted } from "../../redux/slice/gpuSlice";
import { useDispatch, useSelector } from "react-redux";
import { startShuttapy } from "../../redux/slice/shuttapySlice";
import useShuttapyConnection from "../../Hooks/useShuttapyConnection";

function Header({ mode, setMode, DefaultMode }) {
  const permitted = useSelector(selectPermitted);
  // const { notify } = useNotifications();
  const dispatch = useDispatch();

  const { started, starting, startingError } = useShuttapyConnection();
  useEffect(() => {
    dispatch(startShuttapy());
  }, [dispatch]);

  // //notification
  // useEffect(() => {
  //   if (!startingError) return;

  //   notify({
  //     title: "Something Went Wrong...!",
  //     message: startingError,
  //     type: "error",
  //   });
  // }, [startingError, notify]);

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
              text-[12.5px] ${permitted ? "ml-2.5" : ""}
              ${MUTE}
            `}
        >
          <i
            className={`
                h-2 w-2 rounded-full
                ${started ? "bg-emerald-500" : starting ? "bg-yellow-500 animate-pulse" : startingError ? "bg-[#ff811b] animate-pulse" : " bg-red-500 animate-pulse"}
              `}
          />
          {started
            ? "Local Model"
            : starting
              ? "Connecting"
              : startingError
                ? "Error"
                : "Global Model"}
        </span>

        <span
          className={`flex rounded-xl border border-amber-100 p-1 px-2 items-center gap-1.5 text-[12px] font-semibold ${
            permitted ? "animate-pulse bg-red-500" : "opacity-30"
          }`}
        >
          {permitted ? (
            <span className="flex gap-1.5">
              <TriangleAlert size={16} />
              Global GPU on
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
