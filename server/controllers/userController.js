const asyncHandler = require('express-async-handler');
const { User } = require('../models');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    order: [['createdAt', 'DESC']],
  });
  
  res.json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const allowedRoles = ['Admin', 'Sales Person', 'User'];
  if (!allowedRoles.includes(role)) {
    res.status(400);
    throw new Error('Invalid role specified');
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: `User role updated to ${user.role}`,
    user: {
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = {
  getUsers,
  updateUserRole,
};
