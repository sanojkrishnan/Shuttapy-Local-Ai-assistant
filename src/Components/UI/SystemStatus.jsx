import { useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip,
  XAxis, YAxis,
} from "recharts";
import { Activity, ArrowDown, ArrowUp, Cpu, MemoryStick } from "lucide-react";
import { LINE, PANEL } from "../../Utils/UIElements";
import useMockStats from "../../Hooks/useMockStats";

const C = {
  violet: "#8b5cf6",
  emerald: "#10b981",
  sky: "#38bdf8",
  amber: "#fbbf24",
  red: "#ef4444",
  track: "rgba(128,128,128,0.2)",
};

const levelColor = (pct) => (pct > 90 ? C.red : pct > 70 ? C.amber : C.violet);

/* ---------- shared tooltip ---------- */
function Tip({ active, payload, unit = "%" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-[11px] shadow-md dark:border-white/10 dark:bg-[#14122B]">
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-1.5 tabular-nums">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="uppercase opacity-70">{p.dataKey}</span>
          <span className="font-medium">
            {Number(p.value).toFixed(unit === "%" ? 0 : 1)}
            {unit === "%" ? "%" : ` ${unit}`}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- ring gauge (RadialBarChart) ---------- */
function Ring({ label, icon: Icon, value, sub }) {
  const pct = Math.round(value);

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative h-[92px] w-[92px]"
        role="meter"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={[{ value: pct, fill: levelColor(pct) }]}
            innerRadius="76%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            barSize={9}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              background={{ fill: C.track }}
              cornerRadius={10}
              animationDuration={600}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-lg font-semibold tabular-nums">
          {pct}%
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium">
        <Icon size={13} aria-hidden="true" /> {label}
      </div>
      <div className="text-[11px] tabular-nums opacity-60">{sub}</div>
    </div>
  );
}

/* ---------- history (AreaChart with toggle chips) ---------- */
const SERIES = [
  { key: "cpu", label: "CPU", color: C.violet },
  { key: "ram", label: "RAM", color: C.emerald },
  { key: "gpu", label: "GPU", color: C.sky },
];

function History({ data }) {
  const [visible, setVisible] = useState({ cpu: true, ram: true, gpu: false });

  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        {SERIES.map((s) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={visible[s.key]}
            onClick={() => setVisible((v) => ({ ...v, [s.key]: !v[s.key] }))}
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-opacity ${LINE} ${
              visible[s.key] ? "opacity-100" : "opacity-40"
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.label}
          </button>
        ))}
      </div>

      <div className="h-32 w-full text-current">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.1} />
            <XAxis dataKey="t" hide />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<Tip />} cursor={{ stroke: "currentColor", strokeOpacity: 0.2 }} />
            {SERIES.filter((s) => visible[s.key]).map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={1.8}
                fill={`url(#fill-${s.key})`}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------- resource bars (horizontal BarChart) ---------- */
function BarTick({ x, y, payload, rows }) {
  const row = rows.find((r) => r.name === payload.value);
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-6} y={-2} textAnchor="end" fontSize={11} fontWeight={500} fill="currentColor">
        {payload.value}
      </text>
      <text x={-6} y={11} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.55}>
        {row?.detail}
      </text>
    </g>
  );
}

function Bars({ rows }) {
  return (
    <div style={{ height: rows.length * 40 }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 0, right: 4, left: 0, bottom: 0 }}
          barSize={8}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={92}
            tickLine={false}
            axisLine={false}
            tick={<BarTick rows={rows} />}
          />
          <Bar
            dataKey="value"
            radius={8}
            background={{ fill: C.track, radius: 8 }}
            animationDuration={500}
          >
            {rows.map((r) => (
              <Cell key={r.name} fill={levelColor(r.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------- network (LineChart) ---------- */
function Network({ data, down, up }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs tabular-nums">
        <span className="flex items-center gap-1">
          <ArrowDown size={13} style={{ color: C.emerald }} aria-hidden="true" />
          {down.toFixed(1)} MB/s
        </span>
        <span className="flex items-center gap-1">
          <ArrowUp size={13} style={{ color: C.violet }} aria-hidden="true" />
          {up.toFixed(1)} MB/s
        </span>
      </div>
      <div className="h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
            <XAxis dataKey="t" hide />
            <YAxis hide domain={[0, "dataMax + 1"]} />
            <Tooltip content={<Tip unit="MB/s" />} />
            <Line type="monotone" dataKey="down" stroke={C.emerald} strokeWidth={1.6} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="up" stroke={C.violet} strokeWidth={1.6} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------- panel ---------- */
export default function SystemStats() {
  const { stats: s, connected } = useMockStats();

  const rows = [
    { name: "GPU", value: Math.round(s.gpu), detail: `${Math.round(s.gpu)}% · ${Math.round(s.gpuTemp)}°C` },
    { name: "VRAM", value: Math.round(s.vram), detail: `${((s.vram / 100) * 12).toFixed(1)} / 12 GB` },
    { name: "Disk", value: Math.round(s.disk), detail: `${Math.round((s.disk / 100) * 512)} / 512 GB` },
  ];

  return (
    <section
      aria-label="System resources"
      className={`rounded-2xl border p-4 ${PANEL} ${LINE}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide opacity-70">
          <Activity size={14} aria-hidden="true" /> Local Resources
        </h3>
        <span className="flex items-center gap-1.5 text-[11px] opacity-70">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              connected ? "animate-pulse bg-emerald-500" : "bg-red-500"
            }`}
          />
          {connected ? "Live" : "Offline"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Ring label="CPU" icon={Cpu} value={s.cpu} sub={`${Math.round(s.cpuTemp)}°C`} />
        <Ring
          label="RAM"
          icon={MemoryStick}
          value={s.ram}
          sub={`${((s.ram / 100) * 32).toFixed(1)} / 32 GB`}
        />
      </div>

      <hr className={`my-4 border-t ${LINE}`} />
      <History data={s.history} />

      <hr className={`my-4 border-t ${LINE}`} />
      <Bars rows={rows} />

      <hr className={`my-4 border-t ${LINE}`} />
      <Network data={s.history} down={s.down} up={s.up} />
    </section>
  );
}