import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myBookings: [],
  providerBookings: [],
  currentBooking: null,
  handover: null,
  loading: false,
  error: null,
  availabilityCheck: {
    loading: false,
    available: null,
    message: "",
  },
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBookingError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setMyBookings: (state, action) => {
      state.myBookings = action.payload;
      state.loading = false;
    },
    setProviderBookings: (state, action) => {
      state.providerBookings = action.payload;
      state.loading = false;
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload.booking;
      state.handover = action.payload.handover || null;
      state.loading = false;
    },
    setAvailabilityResult: (state, action) => {
      state.availabilityCheck = {
        loading: false,
        available: action.payload.available,
        message: action.payload.message,
      };
    },
    resetAvailabilityCheck: (state) => {
      state.availabilityCheck = initialState.availabilityCheck;
    },
  },
});

export const {
  setBookingLoading,
  setBookingError,
  setMyBookings,
  setProviderBookings,
  setCurrentBooking,
  setAvailabilityResult,
  resetAvailabilityCheck,
} = bookingSlice.actions;

export default bookingSlice.reducer;
