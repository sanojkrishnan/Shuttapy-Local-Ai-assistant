import { useState } from "react";
import ShuttapyMascot from "./ShuttapyMascot";


function MascotTest() {
  const [state, setState] = useState("idle");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#14122B",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "30px",
      }}
    >
      <ShuttapyMascot state={state} />

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button onClick={() => setState("idle")}>Idle</button>

        <button onClick={() => setState("wake")}>Wake</button>

        <button onClick={() => setState("thinking")}>Thinking</button>

        <button onClick={() => setState("processing")}>Processing</button>

        <button onClick={() => setState("responding")}>Responding</button>

        <button onClick={() => setState("success")}>Success</button>

        <button onClick={() => setState("error")}>Error</button>
      </div>
    </div>
  );
}

export default MascotTest;
