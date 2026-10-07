import { useState } from "react";
import { MODES } from "../Utils/Modes";

export default function useMode() {
  const [mode, setMode] = useState("chat"); //the current mode of the app, default is "chat"
  const DefaultMode = MODES[mode];
  return { DefaultMode, mode, setMode }; //return the current mode and the function to change it
}
