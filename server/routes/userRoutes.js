const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', authorize('Admin'), getUsers);
router.put('/:id/role', authorize('Admin'), updateUserRole);

module.exports = router;
