const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', protect, authorize('Admin', 'Sales Person'), upload.single('image'), createProduct);
router.put('/:id', protect, authorize('Admin', 'Sales Person'), upload.single('image'), updateProduct);
router.delete('/:id', protect, authorize('Admin', 'Sales Person'), deleteProduct);

module.exports = router;
