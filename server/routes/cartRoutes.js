const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/', updateCartQuantity);
router.delete('/', removeFromCart);
router.delete('/:productId', removeFromCart);

module.exports = router;
