import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/orders');
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const createRazorpayOrder = createAsyncThunk(
  'orders/createRazorpayOrder',
  async ({ amount, shippingAddress }, { rejectWithValue }) => {
    try {
      const response = await API.post('/orders/create', { amount, shippingAddress });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to initialize payment';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const verifyAndSaveOrder = createAsyncThunk(
  'orders/verifyAndSaveOrder',
  async (orderPayload, { rejectWithValue }) => {
    try {
      const response = await API.post('/orders/verify', orderPayload);
      toast.success('Payment verified & order placed successfully!');
      return response.data.order;
    } catch (error) {
      const msg = error.response?.data?.message || 'Payment verification failed';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status, location, description }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/orders/${orderId}/status`, { status, location, description });
      toast.success(`Order status updated to ${status}`);
      return response.data.order;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update order status';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyAndSaveOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index > -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
