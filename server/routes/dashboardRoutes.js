const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getSellerDashboard,
  getUserDashboard,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/admin', authorize('Admin'), getAdminDashboard);
router.get('/seller', authorize('Sales Person'), getSellerDashboard);
router.get('/user', getUserDashboard);

module.exports = router;
