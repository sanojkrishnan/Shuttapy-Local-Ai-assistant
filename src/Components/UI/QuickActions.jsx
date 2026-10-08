import { LINE, PANEL } from "../../Utils/UIElements";

function QuickActions({ DefaultMode, setText }) {
  return (
    <>
      <div
        className="
                flex gap-2
                overflow-x-auto
                pb-2.5
                mb-1.5
                custom-scrollbar
              "
      >
        {DefaultMode.actions.map((action) => (
          <button
            key={action}
            onClick={() => setText(action)}
            className={`
                    shrink-0 rounded-full
                    border px-3.5 py-1.5
                    text-[13.5px]
                    hover:border-violet-500
                    ${PANEL}
                    ${LINE}
                    ${focus}
                  `}
          >
            {action}
          </button>
        ))}
      </div>
    </>
  );
}

export default QuickActions;
