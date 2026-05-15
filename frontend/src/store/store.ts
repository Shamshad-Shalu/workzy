import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import locationReducer from './slices/locationSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    location: locationReducer,
    notification: notificationReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
