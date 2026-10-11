import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startShuttapy } from "../redux/slice/shuttapySlice";

const RETRY_MS = 5000; // while offline
const RECHECK_MS = 15000; // while online, to catch Ollama stopping

export default function useShuttapyConnection() {
  const dispatch = useDispatch();
  const { started, starting, startingError } = useSelector((s) => s.shuttapy);

  // first check
  useEffect(() => {
    dispatch(startShuttapy());
  }, [dispatch]);

  // keep checking
  useEffect(() => {
    const id = setInterval(
      () => dispatch(startShuttapy()),
      started ? RECHECK_MS : RETRY_MS,
    );
    return () => clearInterval(id);
  }, [started, dispatch]);

  return { started, starting, startingError };
}