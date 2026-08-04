import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { Store, Package, DollarSign, Plus, ArrowRight, TrendingUp } from 'lucide-react';

const SalesDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerStats = async () => {
      try {
        const response = await API.get('/dashboard/seller');
        setStats(response.data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
        <div className="h-8 bg-gray-800 animate-pulse rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-800 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Store className="w-7 h-7 text-purple-400" /> Sales Hub & Seller Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage your inventory, monitor order performance, and list new products
          </p>
        </div>

        <Link
          to="/seller/products/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">My Listed Products</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-white mt-4 block">
            {stats?.myProductsCount || 0}
          </span>
          <Link to="/seller/products" className="text-xs font-semibold text-purple-400 hover:text-purple-300 mt-2 inline-flex items-center gap-1">
            Manage Catalog &rarr;
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Orders Received</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-white mt-4 block">
            {stats?.myOrdersCount || 0}
          </span>
          <Link to="/orders" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 mt-2 inline-flex items-center gap-1">
            View Orders &rarr;
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Seller Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-400 mt-4 block">
            ₹{(stats?.sellerRevenue || 0).toFixed(2)}
          </span>
          <span className="text-[11px] text-gray-500 mt-2 block">Total earnings from your products</span>
        </div>
      </div>

      {/* Recent Inventory Preview */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Your Active Products ({stats?.myProducts?.length || 0})
          </h2>
          <Link to="/seller/products" className="text-xs font-bold text-purple-400 hover:text-purple-300">
            View All My Products &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats?.myProducts?.map((product) => (
            <div key={product._id} className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 flex items-center gap-3">
              <img src={product.image} alt={product.title} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold text-white truncate">{product.title}</span>
                <span className="text-[11px] text-gray-400 block">Stock: {product.stock} units</span>
                <span className="text-xs font-extrabold text-indigo-400 block">₹{product.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
