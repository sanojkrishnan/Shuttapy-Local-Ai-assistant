import { configureStore } from "@reduxjs/toolkit";
import messageSlice from "./slice/messageSlice";
import gpuReducer from "./slice/gpuSlice";
import shuttapySlice from "./slice/shuttapySlice";
import systemResourceSlice from "./slice/systemResourceSlice";
import notificationReducer from "./slice/notificationSlice";
import updateReducer from "./slice/updateInfoSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    messages: messageSlice,
    gpu: gpuReducer,
    shuttapy: shuttapySlice,
    systemResources: systemResourceSlice,
    update: updateReducer,
  },
});
