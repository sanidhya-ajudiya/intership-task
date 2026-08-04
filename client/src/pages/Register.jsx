import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';
import { ShoppingBag, Lock, Mail, User as UserIcon, Phone, UserCheck, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    const res = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(res)) {
      const role = res.payload.user.role;
      if (role === 'Admin') navigate('/admin/dashboard');
      else if (role === 'Sales Person') navigate('/seller/dashboard');
      else navigate('/products');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-gray-400">Join NEXUS MARKET as Customer, Seller, or Admin</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                {...register('name', { required: 'Name is required' })}
                className="w-full glass-input px-4 py-2.5 pl-10 rounded-xl text-xs"
              />
              <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
            {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="john@example.com"
                {...register('email', { required: 'Email is required' })}
                className="w-full glass-input px-4 py-2.5 pl-10 rounded-xl text-xs"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
            {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="text"
                placeholder="+1 800-555-0199"
                {...register('phone')}
                className="w-full glass-input px-4 py-2.5 pl-10 rounded-xl text-xs"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Select User Role</label>
            <div className="relative">
              <select
                {...register('role')}
                className="w-full glass-input px-4 py-2.5 pl-10 rounded-xl text-xs bg-gray-900 text-gray-200"
              >
                <option value="User">User (Customer)</option>
                <option value="Sales Person">Sales Person (Seller)</option>
              </select>
              <UserCheck className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Minimum 6 characters"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className="w-full glass-input px-4 py-2.5 pl-10 rounded-xl text-xs"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
            {errors.password && <p className="text-[11px] text-rose-400 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            {loading ? 'Registering Account...' : <>Register Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
