import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
      state.loading = false;
    },
    markRead: (state, action) => {
      const id = action.payload;
      state.notifications = state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n
      );
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
  },
});

export const { setNotifications, markRead } = notificationSlice.actions;
export default notificationSlice.reducer;
