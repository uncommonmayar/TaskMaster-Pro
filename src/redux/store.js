import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import analyticsReducer from './analyticsSlice';
// Import any additional slices here
// import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    analytics: analyticsReducer,
    // Add other reducers here
    // auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Customize middleware if needed
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development mode
});

export default store;
