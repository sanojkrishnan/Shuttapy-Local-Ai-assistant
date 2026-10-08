import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../Utils/errorExtractor";

const initialState = {
  chatMessage: null,
  logMessage: null,
  errorMessage: null,
  isChatMessageLoading: false,
};

// Fetch the cart for a specific user from backend
export const fetchCoupon = createAsyncThunk(
//   "coupon/fetch",
//   async ({ pagination }, { rejectWithValue }) => {
//     try {
//       const allCoupons = await messageAPI.fetchCoupons(pagination);
//       return allCoupons;
//     } catch (err) {
//       return rejectWithValue(extractError(err, "Failed to fetch Coupon"));
//     }
//   },
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
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch coupons
      .addCase(fetchCoupon.pending, (state) => {
        state.isCouponLoading = true;
        state.couponError = null;
      })
      .addCase(fetchCoupon.fulfilled, (state, action) => {
        state.isCouponLoading = false;
        state.coupon = action.payload?.data?.coupons;
      })
      .addCase(fetchCoupon.rejected, (state, action) => {
        state.isCouponLoading = false;
        state.couponError = action.payload;
      });
  },
});

export const { clearError, clearState } = messageSlice.actions;
export default messageSlice.reducer;
