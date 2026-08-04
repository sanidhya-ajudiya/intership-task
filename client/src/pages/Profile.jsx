import React from 'react';
import { useSelector } from 'react-redux';
import { User as UserIcon, Mail, Phone, ShieldCheck, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6 relative overflow-hidden">
        <div className="flex items-center gap-6">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
            alt={user.name}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/40 shadow-xl"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{user.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <ShieldCheck className="w-4 h-4" /> Role: {user.role}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="glass-panel p-4 rounded-2xl border border-gray-800/80 space-y-1">
            <span className="text-gray-400 font-semibold flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-indigo-400" /> Account Email
            </span>
            <span className="text-sm font-bold text-white block">{user.email}</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-gray-800/80 space-y-1">
            <span className="text-gray-400 font-semibold flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-purple-400" /> Contact Phone
            </span>
            <span className="text-sm font-bold text-white block">
              {user.phone || 'Not provided'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
