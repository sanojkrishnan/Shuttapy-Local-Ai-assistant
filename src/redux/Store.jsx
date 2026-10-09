import { configureStore } from "@reduxjs/toolkit";
import messageSlice from "./slice/messageSlice";
import gpuReducer from "./slice/gpuSlice";

export const store = configureStore({
  reducer: {
    messages: messageSlice,
    gpu: gpuReducer,
  },
});
