import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
  ShoppingBag,
  Heart,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Package,
  Users,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Store,
} from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistCount = wishlist?.products?.length || 0;

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Sales Person':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-indigo-300 bg-clip-text text-transparent tracking-tight">
                NEXUS<span className="text-indigo-400">MARKET</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-indigo-400 font-semibold -mt-1">
                Role E-Commerce
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors"
            >
              Products
            </Link>

            {/* Role specific shortcuts */}
            {user?.role === 'Admin' && (
              <div className="flex items-center gap-4 bg-amber-950/30 border border-amber-500/20 px-3 py-1.5 rounded-full">
                <Link
                  to="/admin/dashboard"
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Admin Portal
                </Link>
              </div>
            )}

            {user?.role === 'Sales Person' && (
              <div className="flex items-center gap-4 bg-purple-950/30 border border-purple-500/20 px-3 py-1.5 rounded-full">
                <Link
                  to="/seller/dashboard"
                  className="text-xs font-semibold text-purple-300 hover:text-purple-200 flex items-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5" /> Seller Hub
                </Link>
              </div>
            )}
          </nav>

          {/* Right Section / Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user && user.role === 'User' && (
              <>
                <Link
                  to="/wishlist"
                  className="relative p-2 rounded-xl text-gray-300 hover:text-pink-400 hover:bg-gray-800/60 transition-all"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="relative p-2 rounded-xl text-gray-300 hover:text-indigo-400 hover:bg-gray-800/60 transition-all"
                  title="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-indigo-500/50">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl border border-gray-700/60 bg-gray-900/60 hover:bg-gray-800/80 transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/50"
                  />
                  <div className="text-left hidden lg:block pr-1">
                    <span className="block text-xs font-semibold text-gray-200">
                      {user.name}
                    </span>
                    <span
                      className={`inline-block text-[9px] uppercase px-1.5 py-0.5 rounded border font-bold ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel py-2 shadow-2xl border border-gray-700/60 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2.5 border-b border-gray-800">
                      <p className="text-sm font-semibold text-gray-100">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      <span
                        className={`inline-block mt-1 text-[10px] uppercase px-2 py-0.5 rounded border font-bold ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        Role: {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-gray-800/80 hover:text-white"
                      >
                        <UserIcon className="w-4 h-4 text-indigo-400" /> My Profile
                      </Link>

                      {user.role === 'User' && (
                        <Link
                          to="/orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-gray-800/80 hover:text-white"
                        >
                          <Package className="w-4 h-4 text-emerald-400" /> Order History
                        </Link>
                      )}

                      {user.role === 'Sales Person' && (
                        <>
                          <Link
                            to="/seller/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-gray-800/80 hover:text-white"
                          >
                            <LayoutDashboard className="w-4 h-4 text-purple-400" /> Seller Dashboard
                          </Link>
                          <Link
                            to="/seller/products"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-gray-800/80 hover:text-white"
                          >
                            <Store className="w-4 h-4 text-purple-400" /> My Products
                          </Link>
                        </>
                      )}

                      {user.role === 'Admin' && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-gray-800/80 hover:text-white"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-400" /> Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/users"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-gray-800/80 hover:text-white"
                          >
                            <Users className="w-4 h-4 text-amber-400" /> Manage Users
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-1 border-t border-gray-800">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 px-4 py-2 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            {user && user.role === 'User' && (
              <Link to="/cart" className="relative p-2 text-gray-300">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-gray-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-300 hover:text-indigo-400 py-1.5"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-300 hover:text-indigo-400 py-1.5"
          >
            Products Catalog
          </Link>

          {user ? (
            <>
              {user.role === 'User' && (
                <>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-pink-400 py-1.5"
                  >
                    Wishlist ({wishlistCount})
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-indigo-400 py-1.5"
                  >
                    Cart ({cartCount})
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-emerald-400 py-1.5"
                  >
                    My Orders
                  </Link>
                </>
              )}
              {user.role === 'Sales Person' && (
                <Link
                  to="/seller/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-purple-400 font-semibold py-1.5"
                >
                  Seller Dashboard
                </Link>
              )}
              {user.role === 'Admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-amber-400 font-semibold py-1.5"
                >
                  Admin Portal
                </Link>
              )}
              <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-400">{user.name} ({user.role})</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-400 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-gray-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold border border-gray-700 rounded-xl text-gray-200"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
