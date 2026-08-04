import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryStr = new URLSearchParams(params).toString();
      const response = await API.get(`/products?${queryStr}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/${id}`);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Product created successfully!');
      return response.data.product;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create product';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Product updated successfully!');
      return response.data.product;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update product';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      return id;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete product';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
    page: 1,
    pages: 1,
    totalProducts: 0,
  },
  reducers: {
    clearProductDetails: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearProductDetails } = productSlice.actions;
export default productSlice.reducer;
