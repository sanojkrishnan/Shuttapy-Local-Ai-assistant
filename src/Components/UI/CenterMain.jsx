import NewChat from "./NewChat";
import Header from "./Header";
import Messages from "./Messages";
import Composer from "./Composer";

function CenterMain({
  mode,
  setMode,
  DefaultMode,
  chat,
  addMessages,
  setShowConfirmation,
}) {
  return (
    <>
      <main
        className="
          flex min-h-0 min-w-0
          flex-col
        "
      >
        {/* HEADER */}
        <Header mode={mode} setMode={setMode} DefaultMode={DefaultMode} />

        {/* CONVERSATION */}
        <div
          className="
            flex-1 overflow-auto
            px-5 py-6
          "
        >
          <div
            className="
              mx-auto flex max-w-175
              flex-col gap-4
            "
          >
            {/* EMPTY STATE */}

            <NewChat chat={chat} DefaultMode={DefaultMode} mode={mode} />

            {/* MESSAGES */}

            <Messages chat={chat} setShowConfirmation={setShowConfirmation} />
          </div>
        </div>

        {/* COMPOSER */}

        <Composer DefaultMode={DefaultMode} addMessages={addMessages} />
      </main>
    </>
  );
}

export default CenterMain;
