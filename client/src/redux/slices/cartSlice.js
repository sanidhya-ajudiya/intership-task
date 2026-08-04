import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/cart');
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await API.post('/cart', { productId, quantity });
      toast.success('Added to Cart!');
      return response.data.cart;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await API.put('/cart', { productId, quantity });
      return response.data.cart;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update quantity';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const url = productId ? `/cart/${productId}` : '/cart';
      const response = await API.delete(url);
      toast.success(productId ? 'Item removed' : 'Cart cleared');
      return response.data.cart;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to remove item';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: { items: [] },
    loading: false,
    error: null,
  },
  reducers: {
    clearCartLocal: (state) => {
      state.cart = { items: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { items: [] };
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
