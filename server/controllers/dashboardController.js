const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const { sequelize, User, Product, Order, OrderItem, Wishlist, WishlistItem, Cart, CartItem } = require('../models');

// @desc    Admin Dashboard Metrics
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminDashboard = asyncHandler(async (req, res) => {
  const totalUsers = await User.count();
  const totalProducts = await Product.count();
  const totalOrders = await Order.count();

  // Aggregate total revenue
  const totalRevenueSum = await Order.sum('totalAmount', {
    where: { status: { [Op.ne]: 'Cancelled' } },
  });
  const totalRevenue = totalRevenueSum || 0;

  // Recent 5 orders
  const recentOrdersRaw = await Order.findAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  const recentOrders = recentOrdersRaw.map((o) => {
    const data = o.toJSON();
    data._id = data.id;
    return data;
  });

  // Sales statistics breakdown by category
  const salesByCategoryRaw = await Product.findAll({
    attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['category'],
    raw: true,
  });

  const salesByCategory = salesByCategoryRaw.map((row) => ({
    _id: row.category,
    count: parseInt(row.count, 10),
  }));

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      salesByCategory,
    },
  });
});

// @desc    Sales Person Dashboard Metrics
// @route   GET /api/dashboard/seller
// @access  Private/Sales Person
const getSellerDashboard = asyncHandler(async (req, res) => {
  const sellerId = req.user.id || req.user._id;

  const myProductsCount = await Product.count({ where: { sellerId } });

  // Seller orders via OrderItem
  const sellerItems = await OrderItem.findAll({
    where: { sellerId },
    include: [
      {
        model: Order,
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      },
    ],
  });

  const orderIdMap = new Map();
  let sellerRevenue = 0;

  sellerItems.forEach((item) => {
    const order = item.Order;
    if (order && order.status !== 'Cancelled') {
      sellerRevenue += (item.price || 0) * (item.quantity || 1);
    }
    if (order && !orderIdMap.has(order.id)) {
      const orderData = order.toJSON();
      orderData._id = orderData.id;
      orderIdMap.set(order.id, orderData);
    }
  });

  const sellerOrders = Array.from(orderIdMap.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const myProductsRaw = await Product.findAll({
    where: { sellerId },
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  const myProducts = myProductsRaw.map((p) => {
    const data = p.toJSON();
    data._id = data.id;
    return data;
  });

  res.json({
    success: true,
    stats: {
      myProductsCount,
      myOrdersCount: sellerOrders.length,
      sellerRevenue,
      recentOrders: sellerOrders.slice(0, 5),
      myProducts,
    },
  });
});

// @desc    User Dashboard Metrics
// @route   GET /api/dashboard/user
// @access  Private
const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;

  const wishlist = await Wishlist.findOne({ where: { userId } });
  let wishlistCount = 0;
  if (wishlist) {
    wishlistCount = await WishlistItem.count({ where: { wishlistId: wishlist.id } });
  }

  const cart = await Cart.findOne({ where: { userId } });
  let cartCount = 0;
  if (cart) {
    const sumQuantity = await CartItem.sum('quantity', { where: { cartId: cart.id } });
    cartCount = sumQuantity || 0;
  }

  const userOrdersRaw = await Order.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });

  const userOrders = userOrdersRaw.map((o) => {
    const data = o.toJSON();
    data._id = data.id;
    return data;
  });

  res.json({
    success: true,
    stats: {
      wishlistCount,
      cartCount,
      orderHistoryCount: userOrders.length,
      recentOrders: userOrders.slice(0, 5),
    },
  });
});

module.exports = {
  getAdminDashboard,
  getSellerDashboard,
  getUserDashboard,
};
