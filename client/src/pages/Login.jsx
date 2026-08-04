import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { ShoppingBag, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    const res = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(res)) {
      const role = res.payload.user.role;
      if (role === 'Admin') navigate('/admin/dashboard');
      else if (role === 'Sales Person') navigate('/seller/dashboard');
      else navigate('/products');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-gray-400">Sign in to your NEXUS MARKET role account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="user@ecommerce.com"
                {...register('email', { required: 'Email is required' })}
                className="w-full glass-input px-4 py-2.5 pl-10 rounded-xl text-xs"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
            {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
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
            {loading ? 'Authenticating...' : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
