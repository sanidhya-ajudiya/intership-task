import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { Heart, ShoppingBag, Eye, Store, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  const isInWishlist = wishlist?.products?.some((p) => (p._id || p) === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to cart');
      return navigate('/login');
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to use wishlist');
      return navigate('/login');
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  };

  return (
    <div className="group relative glass-panel rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Image Showcase */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-900/50">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600/80 text-white px-2.5 py-1 rounded-full backdrop-blur-md">
              {product.category}
            </span>
          </div>

          {/* Wishlist Button */}
          {user && user.role === 'User' && (
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg ${
                isInWishlist
                  ? 'bg-pink-600/90 text-white'
                  : 'bg-gray-900/70 text-gray-300 hover:text-pink-400 hover:bg-gray-800/90'
              }`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Quick View Button */}
          <Link
            to={`/products/${product._id}`}
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900/80 hover:bg-indigo-600 text-white p-2 rounded-xl backdrop-blur-md flex items-center gap-1 text-xs font-semibold"
          >
            <Eye className="w-4 h-4" /> View
          </Link>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <Link to={`/products/${product._id}`}>
            <h3 className="text-sm font-semibold text-gray-100 line-clamp-1 group-hover:text-indigo-400 transition-colors">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-1 text-[11px] text-gray-400 pt-1">
            <Store className="w-3.5 h-3.5 text-indigo-400" />
            <span>Seller: <strong className="text-gray-300">{product.seller?.name || 'Verified Partner'}</strong></span>
          </div>
        </div>
      </div>

      {/* Footer / Price & Add */}
      <div className="p-4 pt-0 flex items-center justify-between mt-2 border-t border-gray-800/50 pt-3">
        <div>
          <span className="block text-[10px] text-gray-500 uppercase font-semibold">Price</span>
          <span className="text-base font-extrabold text-white">
            ₹{product.price.toFixed(2)}
          </span>
        </div>

        {user && user.role !== 'User' ? (
          <Link
            to={`/products/${product._id}`}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20"
          >
            Inspect
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              product.stock > 0
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white shadow-indigo-600/20'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
