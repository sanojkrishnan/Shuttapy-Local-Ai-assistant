import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { tick } from "../redux/slice/gpuSlice.jsx";

export default function useGpuSimulation(interval = 2000) {
  const dispatch = useDispatch();
  useEffect(() => {
    const id = setInterval(() => dispatch(tick()), interval);
    return () => clearInterval(id);
  }, [dispatch, interval]);
}