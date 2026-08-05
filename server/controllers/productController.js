const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const { Product, User } = require('../models');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Get all products with filtering, search, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 8;
  const page = Number(req.query.page) || 1;

  const whereClause = {};

  // Search keyword filter
  if (req.query.search) {
    whereClause[Op.or] = [
      { title: { [Op.like]: `%${req.query.search}%` } },
      { description: { [Op.like]: `%${req.query.search}%` } },
    ];
  }

  // Category filter
  if (req.query.category && req.query.category !== 'All') {
    whereClause.category = req.query.category;
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    whereClause.price = {};
    if (req.query.minPrice) whereClause.price[Op.gte] = Number(req.query.minPrice);
    if (req.query.maxPrice) whereClause.price[Op.lte] = Number(req.query.maxPrice);
  }

  // Seller filter
  if (req.query.seller) {
    whereClause.sellerId = req.query.seller;
  }

  const { count, rows: products } = await Product.findAndCountAll({
    where: whereClause,
    include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email', 'role', 'avatar'] }],
    order: [['createdAt', 'DESC']],
    limit: pageSize,
    offset: pageSize * (page - 1),
  });

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(count / pageSize),
    totalProducts: count,
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email', 'role', 'avatar'] }],
  });

  if (product) {
    res.json({
      success: true,
      product,
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin & Sales Person)
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, stock, image: imageBody } = req.body;

  let imageUrl = imageBody || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600';

  if (req.file) {
    imageUrl = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
  }

  const userId = req.user.id || req.user._id;

  const product = await Product.create({
    title,
    description,
    price: Number(price),
    category,
    stock: Number(stock),
    image: imageUrl,
    sellerId: userId,
  });

  const createdProduct = await Product.findByPk(product.id, {
    include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email', 'role', 'avatar'] }],
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product: createdProduct,
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin or Sales Person owner)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const userId = req.user.id || req.user._id;

  // Permission check: Admin or product's seller
  if (req.user.role !== 'Admin' && String(product.sellerId) !== String(userId)) {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  const { title, description, price, category, stock, image: imageBody } = req.body;

  if (title) product.title = title;
  if (description) product.description = description;
  if (price !== undefined) product.price = Number(price);
  if (category) product.category = category;
  if (stock !== undefined) product.stock = Number(stock);

  if (req.file) {
    product.image = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
  } else if (imageBody) {
    product.image = imageBody;
  }

  await product.save();

  const updatedProduct = await Product.findByPk(product.id, {
    include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email', 'role', 'avatar'] }],
  });

  res.json({
    success: true,
    message: 'Product updated successfully',
    product: updatedProduct,
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin or Sales Person owner)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const userId = req.user.id || req.user._id;

  // Permission check: Admin or product's seller
  if (req.user.role !== 'Admin' && String(product.sellerId) !== String(userId)) {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  await product.destroy();

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
