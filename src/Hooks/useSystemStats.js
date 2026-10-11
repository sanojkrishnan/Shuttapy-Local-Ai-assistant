import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectResources,
  selectResourceHistory,
  selectResourcesError,
  selectResourcesUpdatedAt,
} from "../redux/slice/systemResourceSlice";

const GB = 1024 ** 3;
const MB = 1024 ** 2;
const pct = (v) => (v == null ? 0 : v);

export default function useSystemStats() {
  const { cpu, memory, disk, gpu, network } = useSelector(selectResources);
  const history = useSelector(selectResourceHistory);
  const error = useSelector(selectResourcesError);
  const updatedAt = useSelector(selectResourcesUpdatedAt);

  return useMemo(() => {
    const vramTotal = (gpu?.vramTotal ?? 0) * MB; // backend sends MB
    const vramUsed = (gpu?.vramUsed ?? 0) * MB;

    return {
      connected: updatedAt != null && !error,
      ready: updatedAt != null,
      error,
      stats: {
        cpu: pct(cpu?.usage),
        cpuCores: cpu?.cores ?? null,
        cpuTemp: cpu?.temp ?? null,

        ram: pct(memory?.usedPercent),
        ramUsedGb: (memory?.used ?? 0) / GB,
        ramTotalGb: (memory?.total ?? 0) / GB,

        hasGpu: !!gpu,
        hasVram: !!gpu && gpu.vramUsed != null && (gpu.vramTotal ?? 0) > 0,
        gpu: pct(gpu?.usage),
        gpuTemp: gpu?.temp ?? null,
        vram: vramTotal ? (vramUsed / vramTotal) * 100 : 0,
        vramUsedGb: vramUsed / GB,
        vramTotalGb: vramTotal / GB,

        disk: pct(disk?.usedPercent),
        diskUsedGb: (disk?.used ?? 0) / GB,
        diskTotalGb: (disk?.total ?? 0) / GB,

        down: (network?.rx ?? 0) / MB,
        up: (network?.tx ?? 0) / MB,

        history,
      },
    };
  }, [cpu, memory, disk, gpu, network, history, error, updatedAt]);
}
