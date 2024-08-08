import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { differenceInMinutes } from 'date-fns';

const initialState = {
  completedTasks: [],
  averageCompletionTime: 0,
  loading: false,
  error: null,
};

// Async thunk to fetch completed tasks
export const fetchCompletedTasks = createAsyncThunk(
  'analytics/fetchCompletedTasks',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      const completedTasks = response.data.filter(task => task.completed);

      // Calculate average completion time
      const totalCompletionTime = completedTasks.reduce((total, task) => {
        const createdAt = new Date(task.createdAt);
        const completedAt = new Date(task.completedAt);
        return total + differenceInMinutes(completedAt, createdAt);
      }, 0);

      const averageCompletionTime = completedTasks.length > 0 
        ? totalCompletionTime / completedTasks.length 
        : 0;

      return { completedTasks, averageCompletionTime };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompletedTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedTasks.fulfilled, (state, action) => {
        state.completedTasks = action.payload.completedTasks;
        state.averageCompletionTime = action.payload.averageCompletionTime;
        state.loading = false;
      })
      .addCase(fetchCompletedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch completed tasks';
      });
  },
});

export default analyticsSlice.reducer;
