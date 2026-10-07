export const MODELS = [
  ["auto", "Auto"],
  ["llama3.2", "llama3.2"],
  ["qwen2.5-coder", "qwen2.5-coder"],
  ["llava", "llava (vision)"],
];
export const PERMS = [
  ["read", "Read files"],
  ["write", "Create and edit files"],
  ["terminal", "Run commands"],
  ["browser", "Use the browser"],
  ["screen", "See my screen"],
];
export const DEFAULT_PERMS = {
  read: "allow",
  write: "ask",
  terminal: "ask",
  browser: "allow",
  screen: "ask",
};

/* Palette as reusable class strings */
export const PAPER = "bg-[#ECEAF6] dark:bg-[#14122B]";
export const PANEL = "bg-[#F8F7FD] dark:bg-[#1D1A3B]";
export const LINE = "border-[#D9D5EE] dark:border-[#322E5C]";
export const MUTE = "text-[#6C6890] dark:text-[#9C98C4]";
export const HEAD =
  "font-['Bricolage_Grotesque'] font-extrabold tracking-tight";
export const DOT = {
  todo: "bg-[#D9D5EE] dark:bg-[#322E5C]",
  running: "bg-violet-500 animate-pulse",
  done: "bg-emerald-500",
  error: "bg-rose-500",
  waiting: "bg-amber-300",
};
export const SEL = `rounded-lg px-1.5 py-1 text-[13px] ${PAPER}`;
