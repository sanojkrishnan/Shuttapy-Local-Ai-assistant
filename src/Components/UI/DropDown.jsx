import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { MODELS } from "../../Utils/UIElements";
import { Button } from "./Button";
import { dropDownDesign } from "../../TailwindElements/tailwindClass";

export default function Dropdown({
  align = "left",
  openUp = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null),
    btnRef = useRef(null),
    itemRefs = useRef([]);
  const id = useId();

  const selectable = MODELS.map(
    (
      it,
      i, //
    ) => (it.type || it.disabled ? null : i),
  ).filter((i) => i !== null);
  const focusItem = (i) => itemRefs.current[i]?.focus();

  const show = (which = "first") => {
    setOpen(true);
    requestAnimationFrame(() =>
      focusItem(
        which === "last" ? selectable[selectable.length - 1] : selectable[0],
      ),
    );
  };
  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) btnRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const away = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  const onButtonKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      show("first");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      show("last");
    }
  };

  const choose = (item) => {
    //choose the item and close the dropdown
    item.onSelect?.();
    close();
  };

  return (
    <>
      <div
        ref={rootRef}
        className={`relative inline-block text-left ${className}`}
      >
        <div
          id={`${id}-menu`}
          role="menu"
          aria-labelledby={`${id}-btn`}
          className={
            dropDownDesign +
            " " +
            (align === "right"
              ? "right-0 origin-top-right"
              : "left-0 origin-top-left") +
            " " +
            (openUp ? "bottom-full mb-2" : "top-full mt-2") +
            " " +
            (open
              ? "visible scale-100 opacity-100"
              : "invisible scale-95 opacity-0")
          }
        >
          {MODELS.map((item, i) => {
            return (
              <div
                onClick={() => choose(item)}
                key={i}
                className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-[#6C6890] dark:text-[#9C98C4]"
              >
                {item[1]}
              </div>
            );
          })}
        </div>

        <Button
          ref={btnRef}
          type="button"
          id={`${id}-btn`}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={`${id}-menu`}
          onClick={() => (open ? close(false) : show("first"))}
          onKeyDown={onButtonKey}
        >
          Auto
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </Button>
      </div>
    </>
  );
}
