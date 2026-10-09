import { forwardRef } from "react";
import { cn } from "../../Utils/CN";

const variants = {
  primary:
    "border-[#D9D5EE] bg-[#F8F7FD] px-4 py-2 text-sm font-medium text-[#1D1A3B] hover:border-violet-500  focus-visible:outline-violet-500 dark:border-[#322E5C] dark:bg-[#1D1A3B] dark:text-[#EEEBFF]",
  secondary:
    "border-[0.5px] border-black/40 shadow-lg w-full rounded-lg text-center flex items-center justify-center gap-2",
};

export const Button = forwardRef(
  ({ children, className, disabled, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border transition shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2",
          variants[variant],
          disabled && "opacity-50 cursor-not-allowed hover:scale-100",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
