import { configureStore } from "@reduxjs/toolkit";
import messageSlice from "./slice/messageSlice";
import gpuReducer from "./slice/gpuSlice";
import shuttapySlice from "./slice/shuttapySlice";

export const store = configureStore({
  reducer: {
    messages: messageSlice,
    gpu: gpuReducer,
    shuttapy: shuttapySlice,
  },
});
