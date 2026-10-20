import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import Shuttapy from "./Components/Shuttapy";
import useGpuStats from "./Hooks/useGpuStats";
import useUpdationInfo from "./Hooks/useUpdationInfo";
import useNotifications from "./Hooks/useNotifications";

function App() {
  const { notify } = useNotifications();
  useGpuStats();
  useUpdationInfo();

  const { ollamaUpdate, ollamaUpdateError, modelUpdate } = useSelector(
    (state) => state.update,
  );

  // only models that actually have a newer version
  const outdatedModels = useMemo(
    () => modelUpdate.filter((m) => m.updateAvailable === true),
    [modelUpdate],
  );

  // remembers what we already notified about, so re-renders don't repeat it
  const notifiedRef = useRef("");

  useEffect(() => {
    if (ollamaUpdateError || !ollamaUpdate) return;

    const ollamaOutdated = ollamaUpdate.updateAvailable === true;
    if (!ollamaOutdated && outdatedModels.length === 0) return;

    const key = [
      ollamaOutdated ? ollamaUpdate.latestVersion : "",
      outdatedModels.map((m) => m.name).join(","),
    ].join("|");

    if (notifiedRef.current === key) return;
    notifiedRef.current = key;

    if (ollamaOutdated) {
      notify({
        title: "Ollama update available",
        message: `Version ${ollamaUpdate.latestVersion} is available (you have ${ollamaUpdate.currentVersion}).`,
        type: "confirm",
        needsAction: true,
      });
    }

    if (outdatedModels.length > 0) {
      notify({
        title: "Model updates available",
        message: `Newer versions found for: ${outdatedModels
          .map((m) => m.name)
          .join(", ")}`,
        type: "confirm",
        needsAction: true,
      });
    }
  }, [ollamaUpdateError, ollamaUpdate, outdatedModels, notify]);

  return <Shuttapy />;
}

export default App;
