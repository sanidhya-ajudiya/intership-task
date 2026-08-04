import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../redux/slices/orderSlice';
import { Package, ShieldCheck } from 'lucide-react';

const ManageOrders = () => {
  const dispatch = useDispatch();

  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Package className="w-7 h-7 text-purple-400" /> Admin Global Order Control
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor all platform transactions & update order processing statuses
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
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">
                      {order.orderId}
                      <span className="block text-[10px] text-gray-500 font-normal">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-200 block">{order.user?.name || 'Customer'}</span>
                      <span className="text-[10px] text-gray-400 block">{order.user?.email}</span>
                    </td>
                    <td className="p-4 text-gray-300 font-semibold">{order.items.length} items</td>
                    <td className="p-4 font-black text-emerald-400">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-gray-900 border border-gray-700 text-xs font-semibold text-gray-200 rounded-xl px-3 py-1 focus:border-purple-500"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
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

export default ManageOrders;
