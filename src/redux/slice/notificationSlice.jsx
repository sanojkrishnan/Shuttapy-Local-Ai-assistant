
import { createSlice, nanoid } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",

  initialState: {
    items: [],
  },

  reducers: {
    addNotification: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(notification) {
        return {
          payload: {
            id: nanoid(),
            type: "info",
            needsAction: false,
            createdAt: Date.now(),
            ...notification,
          },
        };
      },
    },

    removeNotification(state, action) {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    clearNotifications(state) {
      state.items = [];
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
