import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserRole } from '../redux/slices/userSlice';
import { Users, ShieldCheck, UserCheck } from 'lucide-react';

const ManageUsers = () => {
  const dispatch = useDispatch();

  const { users, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUserRole({ userId, role: newRole }));
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Users className="w-7 h-7 text-amber-400" /> User Role Management
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Admin feature: Promote users to Sales Persons or system Administrators
        </p>
      </div>

      {loading ? (
        <div className="h-64 bg-gray-800 animate-pulse rounded-3xl"></div>
      ) : (
        <div className="glass-panel rounded-3xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/80 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                        alt={u.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-700"
                      />
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[11px] text-gray-400 block">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold border ${getRoleBadge(
                          u.role
                        )}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-gray-900 border border-gray-700 text-xs font-semibold text-gray-200 rounded-xl px-3 py-1.5 focus:border-amber-500"
                      >
                        <option value="User">User</option>
                        <option value="Sales Person">Sales Person</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
