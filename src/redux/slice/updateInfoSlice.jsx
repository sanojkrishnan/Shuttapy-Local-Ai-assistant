import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../Utils/errorExtractor";
import { getErrorMessage } from "../../Utils/getErrorMessage";
import { systemResourceService } from "../../services/systemResourceService";

const initialState = {
  ollamaUpdate: null, // { currentVersion, latestVersion, updateAvailable, ... }
  ollamaUpdateLoading: false,
  ollamaUpdateError: null,
  modelUpdate: [], // [{ name, running, updateAvailable, ... }]
};

export const ollamaUpdateCheck = createAsyncThunk(
  "update/ollamaUpdateCheck",
  async (_, { rejectWithValue }) => {
    try {
      return await systemResourceService.checkOllamaUpdate();
    } catch (err) {
      return rejectWithValue(
        extractError(err, "Could not check for updates right now."),
      );
    }
  },
  {
    // skip duplicate calls (e.g. React StrictMode firing the effect twice)
    condition: (_, { getState }) => !getState().update.ollamaUpdateLoading,
  },
);

const updateSlice = createSlice({
  name: "update",
  initialState,

  reducers: {
    clearUpdateError(state) {
      state.ollamaUpdateError = null;
    },

    clearUpdateState(state) {
      state.ollamaUpdate = null;
      state.modelUpdate = [];
      state.ollamaUpdateLoading = false;
      state.ollamaUpdateError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(ollamaUpdateCheck.pending, (state) => {
        state.ollamaUpdateLoading = true;
        state.ollamaUpdateError = null;
      })
      .addCase(ollamaUpdateCheck.fulfilled, (state, action) => {
        const ollama = action.payload?.ollama ?? null;
        state.ollamaUpdateLoading = false;
        state.ollamaUpdate = ollama;
        state.modelUpdate = ollama?.models ?? [];
        state.ollamaUpdateError = null;
      })
      .addCase(ollamaUpdateCheck.rejected, (state, action) => {
        state.ollamaUpdateLoading = false;
        state.ollamaUpdate = null;
        state.modelUpdate = [];
        state.ollamaUpdateError = getErrorMessage(action.payload);
      });
  },
});

export const { clearUpdateError, clearUpdateState } = updateSlice.actions;

export default updateSlice.reducer;
