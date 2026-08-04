const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyAndSaveOrder,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/create', createRazorpayOrder);
router.post('/verify', verifyAndSaveOrder);
router.get('/', getOrders);
router.put('/:id/status', authorize('Admin', 'Sales Person'), updateOrderStatus);

module.exports = router;
