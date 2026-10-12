import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../Utils/errorExtractor";
import { messageAPI } from "../../services/messageServise";
import { getErrorMessage } from "../../Utils/getErrorMessage";

const initialState = {
  chatMessage: null,
  permissionMessage: null,
  logMessage: null,
  errorMessage: null,
  isChatMessageLoading: false,
};

// Fetch the cart for a specific user from backend
export const fetchResponse = createAsyncThunk(
  "response/fetch",
  async ({ message }, { rejectWithValue }) => {
    try {
      const response = await messageAPI.fetchResponse(message);
      return response;
    } catch (err) {
      return rejectWithValue(extractError(err, "Connection lost"));
    }
  },
);

const messageSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearError(state) {
      state.errorMessage = null;
      state.logMessage = null;
    },
    clearState(state) {
      state.chatMessage = null;
      state.logMessage = null;
      state.permissionMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponse.pending, (state) => {
        state.isChatMessageLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchResponse.fulfilled, (state, action) => {
        state.isChatMessageLoading = false;
        state.chatMessage = action.payload?.reply ?? action.payload;
        state.permissionMessage = action.payload?.reply ?? action.payload;
      })
      .addCase(fetchResponse.rejected, (state, action) => {
        state.isChatMessageLoading = false;
        state.errorMessage = getErrorMessage(action.payload);
      });
  },
});

export const { clearError, clearState } = messageSlice.actions;
export default messageSlice.reducer;
