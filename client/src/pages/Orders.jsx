import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../redux/slices/orderSlice';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  MapPin,
  ChevronDown,
  ChevronUp,
  Calendar,
  ShieldCheck,
  Navigation,
  Send,
} from 'lucide-react';

const deliverySteps = [
  { id: 'Paid', title: 'Order Confirmed', icon: CheckCircle2, desc: 'Payment received' },
  { id: 'Processing', title: 'Packed & Processing', icon: Package, desc: 'Ready for dispatch' },
  { id: 'Shipped', title: 'In Transit / Shipped', icon: Truck, desc: 'On the way' },
  { id: 'Delivered', title: 'Delivered', icon: MapPin, desc: 'Handed to customer' },
];

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  const [expandedTimeline, setExpandedTimeline] = useState({});
  const [updatingLocation, setUpdatingLocation] = useState({});

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const toggleTimeline = (orderId) => {
    setExpandedTimeline((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Processing':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Shipped':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Delivered':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Cancelled':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStepProgress = (status) => {
    switch (status) {
      case 'Paid':
        return 25;
      case 'Processing':
        return 50;
      case 'Shipped':
        return 75;
      case 'Delivered':
        return 100;
      case 'Cancelled':
        return 0;
      default:
        return 25;
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'Paid':
        return 0;
      case 'Processing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const handleStatusAndLocationChange = (orderId, newStatus, customLocation, customDesc) => {
    dispatch(
      updateOrderStatus({
        orderId,
        status: newStatus,
        location: customLocation,
        description: customDesc,
      })
    );
  };

  if (loading && orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-4">
        <div className="h-8 bg-gray-800 animate-pulse rounded w-1/4"></div>
        <div className="h-40 bg-gray-800 animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Truck className="w-8 h-8 text-indigo-400" /> Real-Time Delivery Tracking
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {user?.role === 'Admin'
            ? 'Track delivery stages and update live order location across all customers'
            : user?.role === 'Sales Person'
            ? 'Update package status and tracking history for your store orders'
            : 'Check exactly where your package is and track estimated delivery dates'}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-gray-800">
          <Package className="w-16 h-16 text-gray-600 mx-auto" />
          <h2 className="text-xl font-bold text-gray-200">No Active Orders to Track</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Once you place an order, your package delivery status, current location, and live timeline will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            const currentStepIdx = getStepIndex(order.status);
            const progressPercent = getStepProgress(order.status);
            const isCancelled = order.status === 'Cancelled';
            const isExpanded = expandedTimeline[order._id];

            const trackingNumber =
              order.trackingNumber || `NEX-${order._id.slice(-6).toUpperCase()}`;

            const estDate = order.estimatedDeliveryDate
              ? new Date(order.estimatedDeliveryDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : new Date(new Date(order.createdAt).getTime() + 3 * 86400000).toLocaleDateString(
                  undefined,
                  { month: 'short', day: 'numeric', year: 'numeric' }
                );

            return (
              <div
                key={order._id}
                className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-6 hover:border-gray-700 transition-all shadow-xl"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                        Tracking #: {trackingNumber}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        Order ID: {order.orderId}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-300">
                      <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                      {user?.role !== 'User' && order.user && (
                        <span className="text-indigo-400 font-semibold">
                          Customer: {order.user.name || order.user.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
                        Est. Delivery Date
                      </span>
                      <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {estDate}
                      </span>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* VISUAL DELIVERY STEPPER TRACKER */}
                {!isCancelled ? (
                  <div className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
                        <Navigation className="w-4 h-4 text-indigo-400 animate-pulse" />
                        <span>Delivery Status:</span>
                        <span className="text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {order.status === 'Delivered'
                            ? 'Delivered to Customer'
                            : order.status === 'Shipped'
                            ? 'Package In Transit'
                            : order.status === 'Processing'
                            ? 'Package Packed & Dispatched'
                            : 'Payment Verified & Order Received'}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-extrabold text-indigo-400">
                        {progressPercent}% Complete
                      </span>
                    </div>

                    {/* Progress Bar Line */}
                    <div className="relative">
                      {/* Background Bar */}
                      <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-800 -translate-y-1/2 rounded-full"></div>
                      {/* Active Progress Bar */}
                      <div
                        className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 -translate-y-1/2 rounded-full transition-all duration-700"
                        style={{ width: `${progressPercent}%` }}
                      ></div>

                      {/* Stepper Nodes */}
                      <div className="relative flex justify-between">
                        {deliverySteps.map((step, idx) => {
                          const IconComponent = step.icon;
                          const isCompleted = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;

                          return (
                            <div key={step.id} className="flex flex-col items-center group">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                  isCurrent
                                    ? 'bg-indigo-600 border-indigo-300 text-white ring-4 ring-indigo-500/30 scale-110 shadow-lg shadow-indigo-500/50'
                                    : isCompleted
                                    ? 'bg-emerald-600 border-emerald-400 text-white'
                                    : 'bg-gray-900 border-gray-700 text-gray-500'
                                }`}
                              >
                                <IconComponent className="w-5 h-5" />
                              </div>

                              <div className="text-center mt-2 space-y-0.5">
                                <span
                                  className={`block text-[11px] font-bold ${
                                    isCompleted ? 'text-gray-200' : 'text-gray-500'
                                  }`}
                                >
                                  {step.title}
                                </span>
                                <span className="hidden sm:block text-[9px] text-gray-400">
                                  {step.desc}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Current Live Location Banner */}
                    <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4 text-pink-400 animate-bounce" />
                        <span className="font-semibold text-gray-400">Current Location:</span>
                        <span className="font-bold text-white bg-gray-900 px-2.5 py-1 rounded-lg border border-gray-800">
                          {order.currentLocation || 'Fulfillment Logistics Center'}
                        </span>
                      </div>

                      <div className="text-[11px] text-gray-400">
                        Destination: <strong className="text-gray-200">{order.shippingAddress?.city || 'India'}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-rose-950/30 border border-rose-500/30 p-4 rounded-2xl flex items-center gap-3 text-xs text-rose-300">
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    <div>
                      <strong className="block font-bold text-rose-200">Order Cancelled</strong>
                      <span>This order processing has been cancelled. If you have questions, please contact support.</span>
                    </div>
                  </div>
                )}

                {/* ADMIN / SELLER QUICK STATUS & LOCATION UPDATE CONTROL */}
                {(user?.role === 'Admin' || user?.role === 'Sales Person') && (
                  <div className="bg-gray-900/80 p-4 rounded-2xl border border-indigo-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      <span>Update Delivery Location & Stage (Seller / Admin Control)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1 font-semibold">Change Stage</label>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusAndLocationChange(
                              order._id,
                              e.target.value,
                              updatingLocation[order._id] || order.currentLocation
                            )
                          }
                          className="w-full bg-gray-950 border border-gray-700 text-xs font-semibold text-gray-200 rounded-xl px-3 py-2 focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="Paid">1. Order Confirmed (Paid)</option>
                          <option value="Processing">2. Packed & Processing</option>
                          <option value="Shipped">3. In Transit / Shipped</option>
                          <option value="Delivered">4. Delivered</option>
                          <option value="Cancelled">5. Cancelled</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-gray-400 mb-1 font-semibold">Current Physical Location</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="e.g. Sorting Center, Delhi Hub"
                            defaultValue={order.currentLocation || ''}
                            onChange={(e) =>
                              setUpdatingLocation({
                                ...updatingLocation,
                                [order._id]: e.target.value,
                              })
                            }
                            className="flex-1 bg-gray-950 border border-gray-700 text-xs text-gray-200 rounded-xl px-3 py-2 focus:border-indigo-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusAndLocationChange(
                                order._id,
                                order.status,
                                updatingLocation[order._id] || order.currentLocation,
                                `Location update: ${updatingLocation[order._id] || order.currentLocation}`
                              )
                            }
                            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-600/30"
                          >
                            <Send className="w-3.5 h-3.5" /> Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items Purchased */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-gray-300 block">Package Items ({order.items.length})</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs"
                      >
                        <img
                          src={
                            item.image ||
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300'
                          }
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-900 border border-gray-800"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="block font-bold text-gray-200 truncate">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                          </span>
                        </div>
                        <span className="font-extrabold text-white">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EXPANDABLE DETAILED TRACKING TIMELINE */}
                {order.trackingHistory && order.trackingHistory.length > 0 && (
                  <div className="border-t border-gray-800 pt-3">
                    <button
                      type="button"
                      onClick={() => toggleTimeline(order._id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-indigo-400 hover:text-indigo-300 py-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Detailed Tracking Timeline ({order.trackingHistory.length} Updates)
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 pl-4 border-l-2 border-indigo-500/40 space-y-4 py-2 animate-in fade-in duration-200">
                        {order.trackingHistory
                          .slice()
                          .reverse()
                          .map((hist, idx) => (
                            <div key={idx} className="relative space-y-1">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-gray-900"></div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-gray-200 flex items-center gap-2">
                                  {hist.status}
                                  <span className="text-[10px] text-gray-400 font-normal">
                                    • {hist.location}
                                  </span>
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  {new Date(hist.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-300 bg-gray-900/60 p-2 rounded-xl border border-gray-800">
                                {hist.description}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Total */}
                <div className="border-t border-gray-800 pt-3 flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    Payment ID: <code className="text-indigo-300">{order.paymentId}</code>
                  </span>
                  <div className="text-right">
                    <span className="text-gray-400 mr-2">Total Amount Paid:</span>
                    <span className="text-base font-extrabold text-emerald-400">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
