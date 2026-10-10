import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../Utils/errorExtractor";
import { getErrorMessage } from "../../Utils/getErrorMessage";
import { shuttapyService } from "../../services/shuttapyService";

const initialState = {
  started: false,
  starting: false,
  startingError: null,
};

export const startShuttapy = createAsyncThunk(
  "shuttapy/start",
  async (_, { rejectWithValue }) => {
    try {
      return await shuttapyService.checkBackend();
    } catch (err) {
      return rejectWithValue(
        extractError(err, "Failed to connect to Shuttapy backend"),
      );
    }
  },
);

const shuttapySlice = createSlice({
  name: "shuttapy",
  initialState,

  reducers: {
    clearStartError(state) {
      state.startingError = null;
    },

    clearStartState(state) {
      state.started = false;
      state.starting = false;
      state.startingError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(startShuttapy.pending, (state) => {
        state.starting = true;
        state.startingError = null;
      })
      .addCase(startShuttapy.fulfilled, (state) => {
        state.starting = false;
        state.started = true;
      })
      .addCase(startShuttapy.rejected, (state, action) => {
        state.starting = false;
        state.started = false;
        state.startingError = getErrorMessage(action.payload);
      });
  },
});

export const { clearStartError, clearStartState } = shuttapySlice.actions;

export default shuttapySlice.reducer;
