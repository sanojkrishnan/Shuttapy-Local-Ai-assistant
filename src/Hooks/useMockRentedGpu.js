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
