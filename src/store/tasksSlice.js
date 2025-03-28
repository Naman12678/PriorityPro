import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://prioritypro.onrender.com/api/tasks';

// Thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
  }
});

export const addTask = createAsyncThunk('tasks/addTask', async (task, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.post(API_URL, task, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add task');
  }
});

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.patch(`${API_URL}/${id}`, updates, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
  }
});

// Initial State
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    removeTask: (state, action) => {
      // Local state removal
      state.items = state.items.filter((task) => task._id !== action.payload);
    },
    toggleTask: (state, action) => {
      // Toggle local state
      const task = state.items.find((task) => task._id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add task';
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update task';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete task';
      });
  },
});

export const { removeTask, toggleTask } = tasksSlice.actions;
export default tasksSlice.reducer;
