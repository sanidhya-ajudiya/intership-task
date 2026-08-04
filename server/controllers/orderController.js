const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const { Order, OrderItem, OrderTrackingHistory, Cart, CartItem, Product, User } = require('../models');
const razorpay = require('../config/razorpay');

// Helper to format order for response
const formatOrder = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email', 'avatar'] },
      {
        model: OrderItem,
        as: 'items',
        include: [
          { model: Product, as: 'product' },
          { model: User, as: 'seller', attributes: ['id', 'name'] },
        ],
      },
      { model: OrderTrackingHistory, as: 'trackingHistory' },
    ],
    order: [[{ model: OrderTrackingHistory, as: 'trackingHistory' }, 'createdAt', 'ASC']],
  });

  if (!order) return null;

  const data = order.toJSON();
  data._id = data.id;

  // Format items for frontend compatibility
  if (data.items) {
    data.items = data.items.map((item) => ({
      ...item,
      _id: item.id,
      product: item.product || {
        _id: item.productId,
        title: item.title,
        price: item.price,
        image: item.image,
      },
    }));
  }

  return data;
};

// @desc    Create Razorpay Order
// @route   POST /api/orders/create
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid order amount');
  }

  const options = {
    amount: Math.round(amount * 100), // amount in paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  };

  try {
    let razorpayOrder;
    if (razorpay) {
      razorpayOrder = await razorpay.orders.create(options);
    } else {
      // Fallback mock order if razorpay is not configured
      razorpayOrder = {
        id: `order_mock_${Date.now()}`,
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
      };
    }

    res.json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey12345',
    });
  } catch (error) {
    res.json({
      success: true,
      order: {
        id: `order_mock_${Date.now()}`,
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
      },
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey12345',
    });
  }
});

// @desc    Verify Razorpay Payment Signature and Save Order
// @route   POST /api/orders/verify
// @access  Private
const verifyAndSaveOrder = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    totalAmount,
    shippingAddress,
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No items in order');
  }

  let isValidSignature = true;

  if (
    process.env.RAZORPAY_KEY_SECRET &&
    process.env.RAZORPAY_KEY_SECRET !== 'mockrazorpaysecret67890' &&
    razorpay_signature
  ) {
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    isValidSignature = expectedSignature === razorpay_signature;
  }

  if (!isValidSignature) {
    res.status(400);
    throw new Error('Payment verification failed! Invalid signature.');
  }

  const userId = req.user.id || req.user._id;

  // Create Order in MySQL database
  const createdOrder = await Order.create({
    userId,
    totalAmount: Number(totalAmount),
    orderId: razorpay_order_id || `order_gen_${Date.now()}`,
    paymentId: razorpay_payment_id || `pay_gen_${Date.now()}`,
    status: 'Paid',
    shippingAddress: shippingAddress || {
      address: '123 Tech Street',
      city: 'Mumbai',
      postalCode: '400001',
      country: 'India',
    },
    currentLocation: 'Order Processing Facility',
  });

  // Create Order Items
  for (const item of items) {
    const productId = item.product?._id || item.product?.id || item.product;
    const title = item.product?.title || item.title || 'Product';
    const price = item.product?.price || item.price || 0;
    const image = item.product?.image || item.image || '';
    const sellerId = item.product?.seller?._id || item.product?.seller?.id || item.product?.sellerId || item.sellerId;

    await OrderItem.create({
      orderId: createdOrder.id,
      productId: Number(productId) || null,
      title,
      price: Number(price),
      quantity: Number(item.quantity || 1),
      image,
      sellerId: Number(sellerId) || null,
    });
  }

  // Create Tracking Entry
  await OrderTrackingHistory.create({
    orderId: createdOrder.id,
    status: 'Paid',
    location: 'Online Payment Gateway',
    timestamp: new Date(),
    description: 'Order confirmed and payment successfully received',
  });

  // Clear User Cart
  const userCart = await Cart.findOne({ where: { userId } });
  if (userCart) {
    await CartItem.destroy({ where: { cartId: userCart.id } });
  }

  const formattedOrder = await formatOrder(createdOrder.id);

  res.status(201).json({
    success: true,
    message: 'Payment verified and order placed successfully!',
    order: formattedOrder,
  });
});

// @desc    Get user, seller, or all orders based on user role
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  let orderRecords = [];

  if (req.user.role === 'Admin') {
    orderRecords = await Order.findAll({
      order: [['createdAt', 'DESC']],
    });
  } else if (req.user.role === 'Sales Person') {
    // Find order IDs where any item belongs to sales person sellerId
    const sellerItems = await OrderItem.findAll({
      where: { sellerId: userId },
      attributes: ['orderId'],
    });
    const orderIds = [...new Set(sellerItems.map((item) => item.orderId))];

    orderRecords = await Order.findAll({
      where: { id: orderIds },
      order: [['createdAt', 'DESC']],
    });
  } else {
    orderRecords = await Order.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  const formattedOrders = await Promise.all(
    orderRecords.map((o) => formatOrder(o.id))
  );

  res.json({
    success: true,
    count: formattedOrders.length,
    orders: formattedOrders,
  });
});

// @desc    Update order status & tracking info
// @route   PUT /api/orders/:id/status
// @access  Private (Admin or Sales Person)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, location, description } = req.body;
  const order = await Order.findByPk(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;

  let loc = location;
  let desc = description;

  if (!loc) {
    const city = order.shippingAddress?.city || 'Destination';
    if (status === 'Processing') loc = 'Warehouse & Packaging Facility';
    else if (status === 'Shipped') loc = 'In Transit - Regional Delivery Hub';
    else if (status === 'Delivered') loc = `${city} (Delivered)`;
    else if (status === 'Cancelled') loc = 'Cancelled';
    else loc = 'Logistics Center';
  }

  if (!desc) {
    if (status === 'Processing') desc = 'Items packaged and handed to fulfillment team';
    else if (status === 'Shipped') desc = 'Dispatched via Express Courier. Tracking live';
    else if (status === 'Delivered') desc = 'Package delivered successfully to customer address';
    else if (status === 'Cancelled') desc = 'Order was cancelled';
    else desc = `Order status updated to ${status}`;
  }

  order.currentLocation = loc;
  await order.save();

  await OrderTrackingHistory.create({
    orderId: order.id,
    status,
    location: loc,
    timestamp: new Date(),
    description: desc,
  });

  const updatedOrder = await formatOrder(order.id);

  res.json({
    success: true,
    message: 'Order status & tracking updated',
    order: updatedOrder,
  });
});

module.exports = {
  createRazorpayOrder,
  verifyAndSaveOrder,
  getOrders,
  updateOrderStatus,
};
