import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

const Wishlist = () => {
  const dispatch = useDispatch();

  const { wishlist, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const products = wishlist?.products || [];

  const handleMoveToCart = (product) => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    dispatch(removeFromWishlist(product._id));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  if (loading && products.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-4">
        <div className="h-8 bg-gray-800 animate-pulse rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-800 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Heart className="w-7 h-7 text-pink-400 fill-current" /> Saved Wishlist
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {products.length} product{products.length !== 1 ? 's' : ''} saved for later
        </p>
      </div>

      {products.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-gray-800">
          <Heart className="w-16 h-16 text-gray-600 mx-auto" />
          <h2 className="text-xl font-bold text-gray-200">Your Wishlist is Empty</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Save items you love by clicking the heart icon on any product card!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            if (!product) return null;
            return (
              <div
                key={product._id}
                className="glass-panel rounded-2xl overflow-hidden border border-gray-800 flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-3 right-3 p-2 bg-gray-900/80 text-rose-400 rounded-full hover:bg-rose-600 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-indigo-400">
                    {product.category}
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{product.title}</h3>
                  <span className="text-base font-black text-white block">
                    ₹{product.price?.toFixed(2)}
                  </span>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20"
                  >
                    <ShoppingBag className="w-4 h-4" /> Move to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
