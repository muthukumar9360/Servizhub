import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import equipmentReducer from "./slices/equipmentSlice";
import bookingReducer from "./slices/bookingSlice";
import notificationReducer from "./slices/notificationSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    equipment: equipmentReducer,
    booking: bookingReducer,
    notification: notificationReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
