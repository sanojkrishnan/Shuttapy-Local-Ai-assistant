import { configureStore } from "@reduxjs/toolkit";
import messageSlice from "./slice/messageSlice";

export const store = configureStore({
  reducer: {
    messages: messageSlice
  },
});

