import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/wishlist');
      return response.data.wishlist;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.post('/wishlist', { productId });
      toast.success('Saved to Wishlist!');
      return response.data.wishlist;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add to wishlist';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/wishlist/${productId}`);
      toast.success('Removed from Wishlist');
      return response.data.wishlist;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to remove from wishlist';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlist: { products: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload || { products: [] };
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
