const DELAYS = ["0ms", "150ms", "300ms"];

function Dots() {
  return (
    <span className="flex items-center gap-1.5" aria-hidden="true">
      {DELAYS.map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: delay }}
          className="h-2 w-2 rounded-full bg-slate-400 animate-bounce motion-reduce:animate-pulse"
        />
      ))}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="w-56 space-y-2 sm:w-72" aria-hidden="true">
      <div className="h-3 w-full animate-pulse rounded bg-slate-300/70" />
      <div className="h-3 w-5/6 animate-pulse rounded bg-slate-300/70" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-slate-300/70" />
    </div>
  );
}

/**
 * Props
 * - variant: "dots" (typing indicator) | "skeleton" (placeholder lines)
 * - label:   optional text shown next to the dots, e.g. "Thinking…"
 */
export default function ChatLoader({ variant = "dots", label }) {
  return (
    <div className="flex justify-start" role="status" aria-live="polite">
      <div className="px-2 py-1">
        {variant === "skeleton" ? (
          <Skeleton />
        ) : (
          <div className="flex items-center gap-3">
            <Dots />
            {label && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {label}
              </span>
            )}
          </div>
        )}
        <span className="sr-only">{label || "Assistant is responding"}</span>
      </div>
    </div>
  );
}

/* ---------- Usage ----------

import ChatLoader from "./ChatLoader";

{messages.map((m) => <Message key={m.id} {...m} />)}
{isLoading && <ChatLoader label="Thinking…" />}

// or a placeholder while the first tokens arrive:
{isLoading && <ChatLoader variant="skeleton" />}

*/
