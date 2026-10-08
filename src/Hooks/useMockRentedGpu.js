import { useEffect, useState } from "react";

const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v));
const POINTS = 30;

// specs (VRAM, TDP) are real; rate / region / ping are demo placeholders
export const GPU_OPTIONS = [
  {
    id: "rtx-4060",
    name: "NVIDIA RTX 4060",
    short: "RTX 4060",
    vramTotal: 8, // GB
    tdp: 115, // W
    idleW: 12,
    rate: 0.2, // $/hr
    region: "eu-west",
    baseLatency: 38, // ms
  },
  {
    id: "rtx-3060",
    name: "NVIDIA RTX 3060",
    short: "RTX 3060",
    vramTotal: 12,
    tdp: 170,
    idleW: 15,
    rate: 0.15,
    region: "us-east",
    baseLatency: 54,
  },
];

const makeInitial = (g, sessionCost = 0) => ({
  busy: false,
  util: 0,
  vram: 0,
  temp: 32,
  power: g.idleW,
  latency: g.baseLatency,
  uptime: 0,
  sessionCost,
  history: Array.from({ length: POINTS }, (_, i) => ({ t: i, util: 0 })),
});

export default function useMockRentedGpu(interval = 2000) {
  const [permitted, setPermitted] = useState(false);
  const [gpuId, setGpuId] = useState(GPU_OPTIONS[0].id);
  const selected = GPU_OPTIONS.find((g) => g.id === gpuId);
  const [gpu, setGpu] = useState(() => makeInitial(GPU_OPTIONS[0]));

  useEffect(() => {
    const timer = setInterval(() => {
      setGpu((s) => {
        // a job starts/stops randomly, only while permission is granted
        const busy = permitted
          ? s.busy
            ? Math.random() > 0.15
            : Math.random() < 0.3
          : false;

        const targetUtil = busy ? 85 : 2;
        const util = clamp(
          s.util + (targetUtil - s.util) * 0.5 + (Math.random() - 0.5) * 8,
        );
        const targetVram = selected.vramTotal * (busy ? 0.65 : 0.05);
        const vram = clamp(
          s.vram + (targetVram - s.vram) * 0.4,
          0,
          selected.vramTotal,
        );
        const last = s.history[s.history.length - 1];

        return {
          busy,
          util,
          vram,
          temp: clamp(32 + util * 0.45, 30, 90),
          power:
            selected.idleW + (util / 100) * (selected.tdp - selected.idleW),
          latency: clamp(
            selected.baseLatency + (Math.random() - 0.5) * 10,
            15,
            120,
          ),
          uptime: permitted ? s.uptime + interval / 1000 : 0,
          sessionCost:
            s.sessionCost + (busy ? (selected.rate * interval) / 3.6e6 : 0),
          history: [...s.history.slice(1), { t: last.t + 1, util }],
        };
      });
    }, interval);
    return () => clearInterval(timer);
  }, [permitted, selected, interval]);

  const status = !permitted ? "off" : gpu.busy ? "active" : "idle";

  // can't swap hardware mid-job
  const selectGpu = (id) => {
    if (status === "active" || id === gpuId) return;
    const next = GPU_OPTIONS.find((g) => g.id === id);
    if (!next) return;
    setGpuId(id);
    setGpu((s) => makeInitial(next, s.sessionCost)); // reset readings, keep the running cost
  };

  return {
    gpu,
    permitted,
    setPermitted,
    status,
    selected,
    selectGpu,
    rate: selected.rate,
  };
}
