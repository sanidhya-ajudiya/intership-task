const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const { Product, User } = require('../models');
const { uploadToCloudinary } = require('../config/cloudinary');

const sampleFallbackProducts = [
  {
    id: 1,
    _id: 1,
    title: 'Wireless Noise-Canceling Headphones',
    description: 'Immersive sound experience with active noise-canceling technology, 30-hour battery life, and crystal-clear microphone.',
    price: 199.99,
    category: 'Electronics',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    sellerId: 2,
    seller: { id: 2, _id: 2, name: 'Sarah Seller', email: 'seller@ecommerce.com', role: 'Sales Person', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' }
  },
  {
    id: 2,
    _id: 2,
    title: 'Minimalist Smart Watch Pro',
    description: 'Track health metrics, heart rate, sleep quality, and GPS tracking with a high-definition AMOLED glass display.',
    price: 149.50,
    category: 'Gadgets',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    sellerId: 2,
    seller: { id: 2, _id: 2, name: 'Sarah Seller', email: 'seller@ecommerce.com', role: 'Sales Person', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' }
  },
  {
    id: 3,
    _id: 3,
    title: 'Premium Ergonomic Leather Backpack',
    description: 'Crafted with genuine full-grain leather, padded laptop compartment, water-resistant interior, and RFID blocking security.',
    price: 89.00,
    category: 'Fashion',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    sellerId: 2,
    seller: { id: 2, _id: 2, name: 'Sarah Seller', email: 'seller@ecommerce.com', role: 'Sales Person', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' }
  },
  {
    id: 4,
    _id: 4,
    title: 'Mechanical RGB Gaming Keyboard',
    description: 'Tactile blue switches, customizable per-key RGB backlighting, durable aluminum top frame, and detachable wrist rest.',
    price: 119.00,
    category: 'Electronics',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
    sellerId: 2,
    seller: { id: 2, _id: 2, name: 'Sarah Seller', email: 'seller@ecommerce.com', role: 'Sales Person', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' }
  },
  {
    id: 5,
    _id: 5,
    title: 'Ultra-Fine Ceramic Drip Coffee Set',
    description: 'Handcrafted ceramic pour-over coffee dripper with heat-resistant borosilicate glass carafe and precision stainless steel mesh filter.',
    price: 45.99,
    category: 'Home & Living',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    sellerId: 2,
    seller: { id: 2, _id: 2, name: 'Sarah Seller', email: 'seller@ecommerce.com', role: 'Sales Person', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' }
  },
  {
    id: 6,
    _id: 6,
    title: 'Wireless Ergonomic Vertical Mouse',
    description: 'Promotes neutral wrist posture to decrease muscle strain with dual Bluetooth and 2.4G wireless connectivity.',
    price: 39.99,
    category: 'Gadgets',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600',
    sellerId: 2,
    seller: { id: 2, _id: 2, name: 'Sarah Seller', email: 'seller@ecommerce.com', role: 'Sales Person', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' }
  },
  {
    id: 7,
    _id: 7,
    title: 'Architectural Design Annual Monograph',
    description: 'Hardcover visual volume exploring contemporary global architecture, interior aesthetics, and sustainable engineering concepts.',
    price: 65.00,
    category: 'Books',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    sellerId: 2,
    seller: { id: 2, _id: 2, name: 'Sarah Seller', email: 'seller@ecommerce.com', role: 'Sales Person', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' }
  },
  {
    id: 8,
    _id: 8,
    title: 'Performance Studio Running Shoes',
    description: 'Lightweight breathable mesh knit upper with reactive foam cushioning for maximum energetic stride stability.',
    price: 129.99,
    category: 'Sports',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    sellerId: 2,
    seller: { id: 2, _id: 2, name: 'Sarah Seller', email: 'seller@ecommerce.com', role: 'Sales Person', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' }
  }
];

// @desc    Get all products with filtering, search, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 8;
  const page = Number(req.query.page) || 1;

  try {
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

    return res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize) || 1,
      totalProducts: count,
    });
  } catch (error) {
    console.error('Database query failed, returning fallback sample products:', error.message);
    
    // Filter fallback products based on query params if DB is unreachable
    let list = [...sampleFallbackProducts];

    if (req.query.category && req.query.category !== 'All') {
      list = list.filter(p => p.category === req.query.category);
    }

    if (req.query.search) {
      const q = req.query.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    const count = list.length;
    const startIndex = pageSize * (page - 1);
    const paginatedProducts = list.slice(startIndex, startIndex + pageSize);

    return res.json({
      success: true,
      products: paginatedProducts,
      page,
      pages: Math.ceil(count / pageSize) || 1,
      totalProducts: count,
      isFallback: true,
    });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email', 'role', 'avatar'] }],
    });

    if (product) {
      return res.json({
        success: true,
        product,
      });
    }
  } catch (error) {
    console.error('Database query failed for product by ID, checking fallback products:', error.message);
  }

  const fallback = sampleFallbackProducts.find(p => String(p.id) === String(req.params.id) || String(p._id) === String(req.params.id));
  if (fallback) {
    return res.json({
      success: true,
      product: fallback,
      isFallback: true,
    });
  }

  res.status(404);
  throw new Error('Product not found');
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
