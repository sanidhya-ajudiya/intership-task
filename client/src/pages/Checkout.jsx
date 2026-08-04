import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../redux/slices/cartSlice';
import { createRazorpayOrder, verifyAndSaveOrder } from '../redux/slices/orderSlice';
import { ShieldCheck, CreditCard, Truck, ArrowRight, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      address: '123 Tech Park Avenue',
      city: 'Mumbai',
      postalCode: '400001',
      country: 'India',
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [loadingPayment, setLoadingPayment] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const totalAmount = subtotal + shipping;

  const onCheckoutSubmit = async (shippingData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return navigate('/cart');
    }

    setLoadingPayment(true);

    try {
      const res = await dispatch(createRazorpayOrder({ amount: totalAmount, shippingAddress: shippingData }));

      if (createRazorpayOrder.fulfilled.match(res)) {
        const { order, key } = res.payload;

        const isScriptLoaded = await loadRazorpayScript();

        if (isScriptLoaded && window.Razorpay && !order.id.startsWith('order_mock_')) {
          const options = {
            key,
            amount: order.amount,
            currency: order.currency || 'INR',
            name: 'NEXUS MARKET Platform',
            description: 'Order Checkout',
            order_id: order.id,
            handler: async (response) => {
              const verifyRes = await dispatch(
                verifyAndSaveOrder({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  items,
                  totalAmount,
                  shippingAddress: shippingData,
                })
              );

              setLoadingPayment(false);
              if (verifyAndSaveOrder.fulfilled.match(verifyRes)) {
                navigate('/orders');
              }
            },
            prefill: {
              name: user?.name,
              email: user?.email,
              contact: user?.phone || '9999999999',
            },
            theme: {
              color: '#4f46e5',
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response) {
            toast.error(`Payment Failed: ${response.error.description}`);
            setLoadingPayment(false);
          });
          rzp.open();
        } else {
          // Instant test mode fallback execution for smooth dev workflow
          toast.success('Razorpay Test Mode Triggered! Simulating instant payment verification...');
          setTimeout(async () => {
            const verifyRes = await dispatch(
              verifyAndSaveOrder({
                razorpay_order_id: order.id || `order_test_${Date.now()}`,
                razorpay_payment_id: `pay_mock_${Date.now()}`,
                razorpay_signature: 'mock_signature_valid',
                items,
                totalAmount,
                shippingAddress: shippingData,
              })
            );

            setLoadingPayment(false);
            if (verifyAndSaveOrder.fulfilled.match(verifyRes)) {
              navigate('/orders');
            }
          }, 1000);
        }
      } else {
        setLoadingPayment(false);
      }
    } catch (err) {
      setLoadingPayment(false);
      toast.error('Payment checkout error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <CreditCard className="w-7 h-7 text-indigo-400" /> Razorpay Checkout
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Complete your shipping address and pay securely with Razorpay Test Mode
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Shipping Form */}
        <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2 border-b border-gray-800 pb-3">
            <Truck className="w-4 h-4 text-indigo-400" /> Shipping Destination
          </h2>

          <form onSubmit={handleSubmit(onCheckoutSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Street Address</label>
              <input
                type="text"
                {...register('address', { required: 'Address is required' })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
              />
              {errors.address && <p className="text-[11px] text-rose-400 mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">City</label>
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                />
                {errors.city && <p className="text-[11px] text-rose-400 mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Postal Code</label>
                <input
                  type="text"
                  {...register('postalCode', { required: 'Postal Code is required' })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                />
                {errors.postalCode && <p className="text-[11px] text-rose-400 mt-1">{errors.postalCode.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Country</label>
              <input
                type="text"
                {...register('country', { required: 'Country is required' })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loadingPayment}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 mt-4"
            >
              {loadingPayment ? (
                'Processing Razorpay SDK...'
              ) : (
                <>
                  Pay Now with Razorpay (₹{totalAmount.toFixed(2)}) <Lock className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Mini Summary */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 border-b border-gray-800 pb-2">
            Items in Order ({items.length})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
            {items.map((item) => (
              <div key={item.product?._id || Math.random()} className="flex items-center gap-3 text-xs">
                <img
                  src={item.product?.image}
                  alt={item.product?.title}
                  className="w-10 h-10 rounded-lg object-cover bg-gray-900"
                />
                <div className="flex-1 min-w-0">
                  <span className="block font-semibold text-gray-200 truncate">{item.product?.title}</span>
                  <span className="text-[10px] text-gray-400">Qty: {item.quantity}</span>
                </div>
                <span className="font-extrabold text-white">₹{((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="text-white">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span className="text-emerald-400">{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-gray-800">
              <span>Total</span>
              <span className="text-indigo-400 font-black">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
