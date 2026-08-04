const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'supersecretjwtkey_role_based_ecommerce_2026',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Register new user
// @route   POST /api/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, avatar } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const userExists = await User.findOne({ where: { email: email.toLowerCase() } });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const allowedRoles = ['User', 'Sales Person', 'Admin'];
  const userRole = allowedRoles.includes(role) ? role : 'User';

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: userRole,
    phone: phone || '',
    avatar: avatar || undefined,
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter email and password');
  }

  const user = await User.findOne({ where: { email: email.toLowerCase() } });

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get logged in user profile
// @route   GET /api/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const user = await User.findByPk(userId);

  if (user) {
    res.json({
      success: true,
      user: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
