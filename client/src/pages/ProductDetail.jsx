import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import {
  ShoppingBag,
  Heart,
  Store,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Minus,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  const [quantity, setQuantity] = useState(1);

  const isInWishlist = wishlist?.products?.some((p) => (p._id || p) === id);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading || !product) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-6">
        <div className="h-8 w-32 bg-gray-800 animate-pulse rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-800 animate-pulse rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-800 animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-gray-800 animate-pulse rounded w-1/2"></div>
            <div className="h-24 bg-gray-800 animate-pulse rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please log in to add items to your cart');
      return navigate('/login');
    }
    dispatch(addToCart({ productId: product._id, quantity }));
  };

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error('Please log in to manage your wishlist');
      return navigate('/login');
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Product Image */}
        <div className="glass-panel p-4 rounded-3xl border border-gray-800 relative overflow-hidden group">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'}
            alt={product.title}
            className="w-full h-auto aspect-square object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider bg-indigo-600/90 text-white px-3 py-1 rounded-full backdrop-blur-md">
            {product.category}
          </span>
        </div>

        {/* Details Column */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              {product.title}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-black text-indigo-400">
                ₹{product.price.toFixed(2)}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                  product.stock > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Product Overview
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Seller Card */}
          <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={product.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt={product.seller?.name || 'Seller'}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
              />
              <div>
                <span className="block text-xs font-bold text-gray-200">
                  Seller: {product.seller?.name || 'Verified Merchant'}
                </span>
                <span className="block text-[10px] text-gray-400">
                  Role: {product.seller?.role || 'Sales Person'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified Partner
            </span>
          </div>

          {/* Actions */}
          {user && user.role === 'User' && (
            <div className="space-y-4 pt-2">
              {/* Quantity Modifier */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-300">Quantity:</span>
                <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:opacity-95 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart (₹{(product.price * quantity).toFixed(2)})
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isInWishlist
                      ? 'bg-pink-600 text-white border-pink-500'
                      : 'bg-gray-900 border-gray-800 text-gray-300 hover:text-pink-400'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
