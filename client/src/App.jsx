import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { fetchProfile } from './redux/slices/authSlice';
import { fetchCart } from './redux/slices/cartSlice';
import { fetchWishlist } from './redux/slices/wishlistSlice';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

// Sales Person Pages
import SalesDashboard from './pages/SalesDashboard';
import MyProducts from './pages/MyProducts';
import AddEditProduct from './pages/AddEditProduct';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageProducts from './pages/ManageProducts';
import ManageOrders from './pages/ManageOrders';

import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (user && user.role === 'User') {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 selection:bg-indigo-500 selection:text-white">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              fontSize: '12px',
            },
          }}
        />

        <Navbar />

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated User Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            {/* Sales Person (Seller) Routes */}
            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Sales Person']}>
                  <SalesDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/products"
              element={
                <ProtectedRoute allowedRoles={['Sales Person']}>
                  <MyProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/products/add"
              element={
                <ProtectedRoute allowedRoles={['Sales Person', 'Admin']}>
                  <AddEditProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/products/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['Sales Person', 'Admin']}>
                  <AddEditProduct />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <ManageProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <ManageOrders />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
