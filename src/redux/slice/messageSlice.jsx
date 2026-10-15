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

export const fetchResponse = createAsyncThunk(
  "message/fetchResponse",
  async ({ message }, { rejectWithValue, dispatch }) => {
    try {
      return await messageAPI.fetchResponse(message, (chunk) => {
        dispatch(appendChatChunk(chunk));
      });
    } catch (err) {
      return rejectWithValue(extractError(err, "Connection lost"));
    }
  },
);

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    appendChatChunk(state, action) {
      state.chatMessage = (state.chatMessage || "") + action.payload;
    },

    clearError(state) {
      state.errorMessage = null;
      state.logMessage = null;
    },

    clearState(state) {
      state.chatMessage = null;
      state.logMessage = null;
      state.permissionMessage = null;
    },
    clearChatMessage(state) {
      state.chatMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponse.pending, (state) => {
        state.isChatMessageLoading = true;
        state.errorMessage = null;
        state.chatMessage = "";
      })
      .addCase(fetchResponse.fulfilled, (state, action) => {
        state.isChatMessageLoading = false;

        // Keep the final complete reply as a fallback.
        state.chatMessage =
          action.payload?.reply ??
          action.payload?.data?.reply ??
          state.chatMessage;

        state.permissionMessage = action.payload?.permission ?? null;
      })
      .addCase(fetchResponse.rejected, (state, action) => {
        state.isChatMessageLoading = false;
        state.errorMessage = getErrorMessage(action.payload);
      });
  },
});

export const { clearError, clearState, appendChatChunk, clearChatMessage } =
  messageSlice.actions;

export default messageSlice.reducer;
