import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/users');
      return response.data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/users/${userId}/role`, { role });
      toast.success(response.data.message);
      return response.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update user role';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index > -1) {
          state.users[index].role = action.payload.role;
        }
      });
  },
});

export default userSlice.reducer;
