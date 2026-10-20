import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: null,
  users: [],
  pendingDocuments: [],
  auditLogs: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAdminStats: (state, action) => {
      state.stats = action.payload;
      state.loading = false;
    },
    setAdminUsers: (state, action) => {
      state.users = action.payload;
      state.loading = false;
    },
    setPendingDocuments: (state, action) => {
      state.pendingDocuments = action.payload;
      state.loading = false;
    },
    setAuditLogs: (state, action) => {
      state.auditLogs = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setAdminLoading,
  setAdminStats,
  setAdminUsers,
  setPendingDocuments,
  setAuditLogs,
} = adminSlice.actions;

export default adminSlice.reducer;
