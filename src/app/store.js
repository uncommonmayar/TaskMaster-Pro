import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import analyticsReducer from './analyticsSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    analytics: analyticsReducer,
  },
});

export default store;
