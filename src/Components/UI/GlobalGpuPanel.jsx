import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Clock,
  Cloud,
  ShieldCheck,
  ShieldOff,
  Wallet,
  Wifi,
} from "lucide-react";
import { LINE, PANEL } from "../../Utils/UIElements";
import { GPU_OPTIONS } from "../../Hooks/useMockRentedGpu";
import { Button } from "./Button";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGpu,
  selectGpuReadings,
  selectGpuStatus,
  selectPermitted,
  selectSelectedGpu,
  setPermitted,
} from "../../redux/slice/gpuSlice";

const C = {
  violet: "#8b5cf6",
  amber: "#fbbf24",
  red: "#ef4444",
  track: "rgba(128,128,128,0.2)",
};
const levelColor = (p) => (p > 90 ? C.red : p > 70 ? C.amber : C.violet);

const fmtUptime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h ? `${h}h ${m}m` : `${m}m ${String(sec).padStart(2, "0")}s`;
};

/* ---------- status indicator ---------- */
const STATUS = {
  off: { label: "Not permitted", dot: "bg-gray-400", ping: false },
  idle: { label: "Permitted · idle", dot: "bg-emerald-500", ping: false },
  active: { label: "Utilising", dot: "bg-violet-500", ping: true },
};

function StatusPill({ status }) {
  const s = STATUS[status];
  return (
    <span
      role="status"
      aria-live="polite"
      className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${LINE}`}
    >
      <span className="relative flex h-2 w-2">
        {s.ping && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${s.dot}`}
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`}
        />
      </span>
      {s.label}
    </span>
  );
}

/* ---------- permission button (with confirm step) ---------- */
function PermissionControl({ permitted, onChange, rate }) {
  const [confirming, setConfirming] = useState(false);

  if (permitted) {
    return (
      <Button
        type="button"
        role="switch"
        aria-checked="true"
        onClick={() => onChange(false)}
        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors`}
      >
        <span className="flex items-center gap-2 font-medium">
          <ShieldCheck
            size={16}
            className="text-emerald-500"
            aria-hidden="true"
          />
          Shuttapy can use global GPU
        </span>
        <span className="text-[11px] text-red-500">Revoke</span>
      </Button>
    );
  }

  if (confirming) {
    return (
      <div className={`rounded-xl border p-3 text-xs ${LINE}`}>
        <p className="mb-2 leading-relaxed">
          Shuttapy will be able to run jobs on a rented GPU. Billing is about{" "}
          <strong>${rate.toFixed(2)}/hr</strong> while it is in use. You can
          revoke at any time.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              onChange(true);
              setConfirming(false);
            }}
            className="flex-1 rounded-lg bg-violet-600 py-1.5 font-medium text-white hover:bg-violet-700"
          >
            Allow
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className={`flex-1 rounded-lg border py-1.5 ${LINE}`}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked="false"
      onClick={() => setConfirming(true)}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-xs font-medium text-white transition-colors hover:bg-violet-700"
    >
      <ShieldOff size={16} aria-hidden="true" />
      Allow Shuttapy to use global GPU
    </button>
  );
}

/* ---------- small stat cell ---------- */
function Stat({ icon: Icon, label, value }) {
  return (
    <div className={`rounded-lg border px-2 py-1.5 ${LINE}`}>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide opacity-60">
        <Icon size={11} aria-hidden="true" /> {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function GpuSelector({ options, value, onChange, locked }) {
  return (
    <div className="mb-3">
      <div
        role="radiogroup"
        aria-label="Choose GPU"
        className={`grid grid-cols-2 gap-1.5 rounded-xl border p-1 ${LINE}`}
      >
        {options.map((o) => {
          const on = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={locked && !on}
              onClick={() => onChange(o.id)}
              className={`rounded-lg px-2 py-1.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                on
                  ? "bg-violet-600 text-white"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <div className="text-xs font-semibold">{o.short}</div>
              <div
                className={`text-[10px] tabular-nums ${on ? "opacity-80" : "opacity-60"}`}
              >
                {o.vramTotal} GB · ${o.rate.toFixed(2)}/hr
              </div>
            </button>
          );
        })}
      </div>
      {locked && (
        <p className="mt-1 text-[10px] opacity-60">
          Switching is locked while a job is running.
        </p>
      )}
    </div>
  );
}

/* ---------- panel ---------- */
export default function GlobalGpuPanel() {
  const dispatch = useDispatch();
  const permitted = useSelector(selectPermitted);
  const gpu = useSelector(selectGpuReadings);
  const selected = useSelector(selectSelectedGpu);
  const status = useSelector(selectGpuStatus);
  const rate = selected.rate;

  const vramPct = (gpu.vram / selected.vramTotal) * 100;

  return (
    <section
      aria-label="Global GPU"
      className={`rounded-2xl border p-2 py-4 ${PANEL} ${LINE}`}
    >
      {/* header */}
      <div className="flex items-center mb-4 justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide opacity-70">
          <Cloud size={14} aria-hidden="true" /> Global GPU
        </h3>
        <p className="text-[11px]">
          <StatusPill status={status} />
        </p>
      </div>

      {/* permission */}
      <PermissionControl
        permitted={permitted}
        onChange={(v) => dispatch(setPermitted(v))}
        rate={rate}
      />
      <div className={`mt-2 ${permitted ? "block" : "hidden"}`}>
        <GpuSelector
          options={GPU_OPTIONS}
          value={selected.id}
          onChange={(id) => dispatch(selectGpu(id))}
          locked={status === "active"}
        />
      </div>

      {/* readings (dimmed until permitted) */}
      <div className={`mt-4 ${permitted ? "block" : "hidden"} `}>
        <div className="flex flex-col items-center justify-center gap-3">
          {/* <UtilRing value={gpu.util} /> */}
          <div className="grid flex-1 grid-cols-2 w-full gap-1.5">
            <Stat
              icon={Wifi}
              label="Ping"
              value={`${Math.round(gpu.latency)}ms`}
            />
            <Stat icon={Clock} label="Up" value={fmtUptime(gpu.uptime)} />
          </div>
        </div>

        {/* VRAM */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs">
            <span className="font-medium">VRAM</span>
            <span className="tabular-nums opacity-60">
              {gpu.vram.toFixed(1)} / {selected.vramTotal} GB
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${vramPct}%`, background: levelColor(vramPct) }}
            />
          </div>
        </div>

        {/* utilisation history */}
        <div className="mt-4">
          <div className="mb-1 text-[11px] opacity-60">
            Utilisation · last 60s
          </div>
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={gpu.history}
                margin={{ top: 4, right: 4, left: -22, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="gpu-util-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={C.violet} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={C.violet} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />
                <XAxis dataKey="t" hide />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 50, 100]}
                  tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(v) => [`${Math.round(v)}%`, "util"]}
                  labelFormatter={() => ""}
                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="util"
                  stroke={C.violet}
                  strokeWidth={1.8}
                  fill="url(#gpu-util-fill)"
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* cost */}
        <hr className={`my-4 border-t ${LINE}`} />
        <div className="grid grid-cols-2 gap-1.5">
          <Stat icon={Wallet} label="Rate" value={`$${rate.toFixed(2)}/hr`} />
          <Stat
            icon={Wallet}
            label="Session"
            value={`$${gpu.sessionCost.toFixed(3)}`}
          />
        </div>
      </div>
    </section>
  );
}
