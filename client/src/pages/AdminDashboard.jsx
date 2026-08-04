import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { ShieldCheck, Users, Package, ShoppingBag, DollarSign, TrendingUp, ArrowRight, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await API.get('/dashboard/admin');
        setStats(response.data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
        <div className="h-8 bg-gray-800 animate-pulse rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-800 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-amber-400" /> Admin Master Portal
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Global system metrics, user role permissions, products oversight & revenue analytics
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Users</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-white mt-4 block">{stats?.totalUsers || 0}</span>
          <Link to="/admin/users" className="text-xs font-semibold text-amber-400 hover:text-amber-300 mt-2 inline-flex items-center gap-1">
            Manage Roles &rarr;
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Products</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-white mt-4 block">{stats?.totalProducts || 0}</span>
          <Link to="/admin/products" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 mt-2 inline-flex items-center gap-1">
            Manage Products &rarr;
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-white mt-4 block">{stats?.totalOrders || 0}</span>
          <Link to="/admin/orders" className="text-xs font-semibold text-purple-400 hover:text-purple-300 mt-2 inline-flex items-center gap-1">
            Manage Orders &rarr;
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-400 mt-4 block">
            ₹{(stats?.totalRevenue || 0).toFixed(2)}
          </span>
          <span className="text-[11px] text-gray-500 mt-2 block">Platform Gross Sales</span>
        </div>
      </div>

      {/* Analytics & Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Visual Category Distribution Bar */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" /> Category Statistics Breakdown
            </h2>
          </div>

          <div className="space-y-3">
            {stats?.salesByCategory?.map((cat) => {
              const percentage = Math.min(100, Math.round((cat.count / (stats.totalProducts || 1)) * 100));
              return (
                <div key={cat._id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-300">{cat._id}</span>
                    <span className="text-indigo-400">{cat.count} items ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Recent System Orders
            </h2>
            <Link to="/admin/orders" className="text-xs font-bold text-amber-400 hover:text-amber-300">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentOrders?.map((order) => (
              <div key={order._id} className="bg-gray-900/60 p-3 rounded-2xl border border-gray-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{order.orderId}</span>
                  <span className="text-[11px] text-gray-400">User: {order.user?.name || 'Customer'}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-400 block">₹{order.totalAmount.toFixed(2)}</span>
                  <span className="text-[10px] text-indigo-300">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
