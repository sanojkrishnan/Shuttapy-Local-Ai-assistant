import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../Utils/errorExtractor";
import { getErrorMessage } from "../../Utils/getErrorMessage";
import { systemResourceService } from "../../services/systemResourceService";

const HISTORY_LIMIT = 60; // ~2 min of samples at 2s interval

const initialState = {
  resources: {
    cpu: null, // { usage, cores, temp }
    memory: null, // { total, used, usedPercent }
    disk: null, // { total, used, usedPercent }
    gpu: null, // { name, usage, vramTotal, vramUsed, temp }
    network: null, // { rx, tx }
  },
  history: [],
  lastUpdated: null,
  loading: false,
  error: null,
};

export const fetchSystemResources = createAsyncThunk(
  "systemResources/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await systemResourceService.getResources();
    } catch (err) {
      return rejectWithValue(
        extractError(err, "Failed to load system resources"),
      );
    }
  },
  {
    // skip if the previous request is still running
    condition: (_, { getState }) => !getState().systemResources.loading,
  },
);

const systemResourcesSlice = createSlice({
  name: "systemResources",
  initialState,

  reducers: {
    clearResourcesError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload;
        state.lastUpdated = Date.now();

        const { cpu, memory, gpu, network } = action.payload;
        state.history.push({
          t: state.lastUpdated,
          cpu: cpu?.usage ?? 0,
          ram: memory?.usedPercent ?? 0,
          gpu: gpu?.usage ?? 0,
          down: (network?.rx ?? 0) / (1024 * 1024), // bytes/s -> MB/s
          up: (network?.tx ?? 0) / (1024 * 1024),
        });
        if (state.history.length > HISTORY_LIMIT) {
          state.history.splice(0, state.history.length - HISTORY_LIMIT);
        }
      })
      .addCase(fetchSystemResources.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          getErrorMessage(action.payload);
        ("Unable to connect to the backend");
      });
  },
});

export const { clearResourcesError } = systemResourcesSlice.actions;

export const selectResources = (s) => s.systemResources.resources;
export const selectResourceHistory = (s) => s.systemResources.history;
export const selectResourcesError = (s) => s.systemResources.error;
export const selectResourcesUpdatedAt = (s) => s.systemResources.lastUpdated;

export default systemResourcesSlice.reducer;
