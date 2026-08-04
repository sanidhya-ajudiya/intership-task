import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Shield, Truck, RefreshCw, Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-800 bg-gray-950/80 text-gray-400">
      {/* Value Badges */}
      <div className="border-b border-gray-800/60 py-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Truck className="w-6 h-6 text-indigo-400 mb-2" />
            <span className="text-xs font-semibold text-gray-200">Express Delivery</span>
            <span className="text-[11px] text-gray-500">Fast nationwide shipping</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="w-6 h-6 text-purple-400 mb-2" />
            <span className="text-xs font-semibold text-gray-200">Quality Guarantee</span>
            <span className="text-[11px] text-gray-500">100% Verified Sellers</span>
          </div>
          <div className="flex flex-col items-center">
            <Lock className="w-6 h-6 text-emerald-400 mb-2" />
            <span className="text-xs font-semibold text-gray-200">Razorpay Secured</span>
            <span className="text-[11px] text-gray-500">Encrypted payment gateway</span>
          </div>
          <div className="flex flex-col items-center">
            <RefreshCw className="w-6 h-6 text-pink-400 mb-2" />
            <span className="text-xs font-semibold text-gray-200">Easy Returns</span>
            <span className="text-[11px] text-gray-500">Hassle-free 30-day policy</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white">NEXUS MARKET</span>
          </div>
          <p className="text-xs leading-relaxed text-gray-400">
            A state-of-the-art role-based e-commerce platform built for Admins, Sales Persons, and Customers with secure JWT auth & Razorpay checkout.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-3">Quick Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home Page</Link></li>
            <li><Link to="/products" className="hover:text-indigo-400 transition-colors">Product Catalog</Link></li>
            <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Customer Login</Link></li>
            <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Create Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-3">User Dashboards</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/orders" className="hover:text-indigo-400 transition-colors">User Order History</Link></li>
            <li><Link to="/seller/dashboard" className="hover:text-indigo-400 transition-colors">Sales Person Dashboard</Link></li>
            <li><Link to="/admin/dashboard" className="hover:text-indigo-400 transition-colors">Admin Portal & Stats</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-3">Technology Stack</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            React.js, Vite, Tailwind CSS, Redux Toolkit, Node.js, Express, MongoDB, Cloudinary & Razorpay.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800/80 py-6 text-center text-xs text-gray-500">
        © 2026 NEXUS MARKET. Built for Full Stack MERN Internship Task.
      </div>
    </footer>
  );
};

export default Footer;
