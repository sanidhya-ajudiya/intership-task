import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  Layers,
  Headphones,
  Laptop,
  ShoppingBag,
  Watch,
} from 'lucide-react';

const categories = [
  { name: 'Electronics', icon: Laptop, color: 'from-blue-500 to-indigo-600' },
  { name: 'Gadgets', icon: Watch, color: 'from-purple-500 to-pink-600' },
  { name: 'Fashion', icon: ShoppingBag, color: 'from-amber-500 to-rose-600' },
  { name: 'Home & Living', icon: Layers, color: 'from-emerald-500 to-teal-600' },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
  }, [dispatch]);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 rounded-3xl glass-panel border border-gray-800/80 my-4">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Role-Based Enterprise E-Commerce Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Next-Generation Shopping & <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Multi-Role Management
            </span>
          </h1>

          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Experience complete customer workflows, seller inventory controls, and real-time administrative metrics built with modern MERN architecture, Razorpay test mode, and Cloudinary uploads.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/products"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:opacity-95 transition-all hover:scale-105"
            >
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gray-900/80 border border-gray-700 text-gray-200 hover:text-white font-bold text-sm hover:bg-gray-800/80 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Shop by Category</h2>
            <p className="text-xs text-gray-400">Discover handpicked items across curated departments</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                className="group glass-panel p-5 rounded-2xl border border-gray-800/80 hover:border-indigo-500/40 text-left transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-gray-100 group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-gray-400">Browse Catalog &rarr;</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">
              <TrendingUp className="w-4 h-4" /> Trending Selection
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Featured Products</h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
