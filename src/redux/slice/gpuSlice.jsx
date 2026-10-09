import { createSlice } from "@reduxjs/toolkit";

const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v));
const POINTS = 30;
const INTERVAL = 2000;

export const GPU_OPTIONS = [
  {
    id: "rtx-4060",
    name: "NVIDIA RTX 4060",
    short: "RTX 4060",
    vramTotal: 8,
    tdp: 115,
    idleW: 12,
    rate: 0.2,
    region: "eu-west",
    baseLatency: 38,
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

const getOption = (id) => GPU_OPTIONS.find((g) => g.id === id);

const makeReadings = (g, sessionCost = 0) => ({
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

const initialState = {
  permitted: false,
  gpuId: GPU_OPTIONS[0].id,
  gpu: makeReadings(GPU_OPTIONS[0]),
};

const gpuSlice = createSlice({
  name: "gpu",
  initialState,
  reducers: {
    setPermitted(state, action) {
      state.permitted = action.payload;
    },

    selectGpu(state, action) {
      const next = getOption(action.payload);
      const active = state.permitted && state.gpu.busy;
      if (!next || active || next.id === state.gpuId) return;
      state.gpuId = next.id;
      state.gpu = makeReadings(next, state.gpu.sessionCost); // keep running cost
    },

    tick: {
      // random values are created here, outside the reducer
      prepare: () => ({
        payload: {
          r1: Math.random(),
          r2: Math.random(),
          r3: Math.random(),
          r4: Math.random(),
        },
      }),
      reducer(state, action) {
        const { r1, r2, r3, r4 } = action.payload;
        const sel = getOption(state.gpuId);
        const s = state.gpu;

        const busy = state.permitted ? (s.busy ? r1 > 0.15 : r1 < 0.3) : false;

        const targetUtil = busy ? 85 : 2;
        const util = clamp(
          s.util + (targetUtil - s.util) * 0.5 + (r2 - 0.5) * 8,
        );
        const targetVram = sel.vramTotal * (busy ? 0.65 : 0.05);
        const vram = clamp(
          s.vram + (targetVram - s.vram) * 0.4,
          0,
          sel.vramTotal,
        );
        const last = s.history[s.history.length - 1];

        state.gpu = {
          busy,
          util,
          vram,
          temp: clamp(32 + util * 0.45, 30, 90),
          power: sel.idleW + (util / 100) * (sel.tdp - sel.idleW),
          latency: clamp(sel.baseLatency + (r3 - 0.5) * 10, 15, 120),
          uptime: state.permitted ? s.uptime + INTERVAL / 1000 : 0,
          sessionCost:
            s.sessionCost + (busy ? (sel.rate * INTERVAL) / 3.6e6 : 0),
          history: [...s.history.slice(1), { t: last.t + 1, util }],
        };
      },
    },
  },
});

export const { setPermitted, selectGpu, tick } = gpuSlice.actions;
export default gpuSlice.reducer;

/* ---------- selectors ---------- */
export const selectPermitted = (s) => s.gpu.permitted;
export const selectGpuReadings = (s) => s.gpu.gpu;
export const selectSelectedGpu = (s) => getOption(s.gpu.gpuId);
export const selectGpuStatus = (s) =>
  !s.gpu.permitted ? "off" : s.gpu.gpu.busy ? "active" : "idle";
