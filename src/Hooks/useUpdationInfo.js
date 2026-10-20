import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ollamaUpdateCheck } from "../redux/slice/updateInfoSlice";

export default function useUpdationInfo() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ollamaUpdateCheck());
  }, [dispatch]);

  return;
}
