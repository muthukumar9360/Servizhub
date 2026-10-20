import { createSlice } from "@reduxjs/toolkit";

const initialUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;
const initialToken = localStorage.getItem("accessToken") || null;

const initialState = {
  user: initialUser,
  accessToken: initialToken,
  isAuthenticated: !!initialUser,
  loading: false,
  error: null,
  tempRegistrationId: null,
  registrationStep: "IDLE", // IDLE, EMAIL_VERIFICATION_PENDING, PHONE_VERIFICATION_PENDING, COMPLETED
  devOtpInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setTempRegistration: (state, action) => {
      state.tempRegistrationId = action.payload.tempRegistrationId;
      state.registrationStep = action.payload.step || "EMAIL_VERIFICATION_PENDING";
      state.devOtpInfo = action.payload.devEmailOtp || action.payload.devPhoneOtp || null;
      state.loading = false;
    },
    setPhoneVerificationStep: (state, action) => {
      state.registrationStep = "PHONE_VERIFICATION_PENDING";
      state.devOtpInfo = action.payload.devPhoneOtp || null;
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.tempRegistrationId = null;
      state.registrationStep = "IDLE";
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
});

export const {
  setAuthLoading,
  setAuthError,
  clearAuthError,
  setTempRegistration,
  setPhoneVerificationStep,
  loginSuccess,
  updateUserProfile,
  logoutUser,
} = authSlice.actions;

export default authSlice.reducer;
