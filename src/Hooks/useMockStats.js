import { useEffect, useState } from "react";

const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v));
const walk = (v, step) => clamp(v + (Math.random() - 0.5) * step);

const POINTS = 30;

export default function useMockStats(interval = 2000) {
  const [stats, setStats] = useState({
    cpu: 28, ram: 54, gpu: 18, vram: 41, disk: 63,
    down: 1.2, up: 0.3, cpuTemp: 52, gpuTemp: 47,
    history: Array.from({ length: POINTS }, (_, i) => ({
      t: i, cpu: 28, ram: 54, gpu: 18, down: 1.2, up: 0.3,
    })),
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats((s) => {
        const cpu = walk(s.cpu, 22);
        const ram = walk(s.ram, 4);
        const gpu = walk(s.gpu, 18);
        const down = clamp(s.down + (Math.random() - 0.5) * 1.5, 0, 12);
        const up = clamp(s.up + (Math.random() - 0.5) * 0.6, 0, 4);
        const last = s.history[s.history.length - 1];

        return {
          ...s,
          cpu, ram, gpu, down, up,
          vram: walk(s.vram, 3),
          cpuTemp: clamp(40 + cpu * 0.4, 35, 95),
          gpuTemp: walk(s.gpuTemp, 3),
          history: [
            ...s.history.slice(1),
            { t: last.t + 1, cpu, ram, gpu, down, up },
          ],
        };
      });
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return { stats, connected: true };
}