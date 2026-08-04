import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartQuantity, removeFromCart } from '../redux/slices/cartSlice';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingBag,
  Store,
  ShieldCheck,
} from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const items = cart?.items || [];

  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? (subtotal > 150 ? 0 : 15) : 0;
  const total = subtotal + shipping;

  const handleQuantityChange = (productId, newQuantity) => {
    dispatch(updateCartQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(removeFromCart(null));
  };

  if (loading && items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-4">
        <div className="h-8 bg-gray-800 animate-pulse rounded w-1/4"></div>
        <div className="h-48 bg-gray-800 animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-indigo-400" /> Shopping Cart
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {items.length} unique item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-gray-800">
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto" />
          <h2 className="text-xl font-bold text-gray-200">Your Cart is Empty</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Looks like you haven't added any products to your cart yet. Explore our catalog and discover amazing items!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={product._id}
                  className="glass-panel p-4 rounded-2xl border border-gray-800 flex items-center gap-4 hover:border-gray-700 transition-all"
                >
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300'}
                    alt={product.title}
                    className="w-20 h-20 rounded-xl object-cover bg-gray-900"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      to={`/products/${product._id}`}
                      className="text-sm font-bold text-white hover:text-indigo-400 truncate block"
                    >
                      {product.title}
                    </Link>

                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Store className="w-3 h-3 text-indigo-400" />
                      <span>Seller: {product.seller?.name || 'Verified Merchant'}</span>
                    </div>

                    <span className="text-sm font-extrabold text-indigo-400 block pt-1">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity modifier */}
                  <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl p-1">
                    <button
                      onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Total & Remove */}
                  <div className="text-right pl-2">
                    <span className="block text-sm font-black text-white">
                      ₹{(product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="text-xs text-rose-400 hover:text-rose-300 mt-1"
                    >
                      <Trash2 className="w-4 h-4 ml-auto" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-6">
            <h2 className="text-lg font-extrabold text-white tracking-tight border-b border-gray-800 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span className="font-semibold text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-emerald-400">
                  {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-800 pt-3 flex justify-between text-sm font-bold text-white">
                <span>Total Amount</span>
                <span className="text-base font-extrabold text-indigo-400">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[10px] text-gray-400 justify-center pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Razorpay Test Mode Secured Payment</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
