const asyncHandler = require('express-async-handler');
const { Cart, CartItem, Product, User } = require('../models');

const fetchCartForUser = async (userId) => {
  let cart = await Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            include: [{ model: User, as: 'seller', attributes: ['id', 'name'] }],
          },
        ],
      },
    ],
  });

  if (!cart) {
    cart = await Cart.create({ userId });
    cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              include: [{ model: User, as: 'seller', attributes: ['id', 'name'] }],
            },
          ],
        },
      ],
    });
  }

  return cart;
};

// @desc    Get current user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const cart = await fetchCartForUser(userId);

  res.json({
    success: true,
    cart,
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id || req.user._id;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  const product = await Product.findByPk(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const cart = await fetchCartForUser(userId);

  const existingItem = await CartItem.findOne({
    where: { cartId: cart.id, productId: product.id },
  });

  if (existingItem) {
    existingItem.quantity += Number(quantity);
    await existingItem.save();
  } else {
    await CartItem.create({
      cartId: cart.id,
      productId: product.id,
      quantity: Number(quantity),
    });
  }

  const updatedCart = await fetchCartForUser(userId);

  res.json({
    success: true,
    message: 'Added to cart',
    cart: updatedCart,
  });
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart
// @access  Private
const updateCartQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id || req.user._id;

  if (!productId || quantity === undefined) {
    res.status(400);
    throw new Error('Product ID and quantity are required');
  }

  const cart = await fetchCartForUser(userId);

  const existingItem = await CartItem.findOne({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    if (Number(quantity) <= 0) {
      await existingItem.destroy();
    } else {
      existingItem.quantity = Number(quantity);
      await existingItem.save();
    }
  }

  const updatedCart = await fetchCartForUser(userId);

  res.json({
    success: true,
    message: 'Cart updated',
    cart: updatedCart,
  });
});

// @desc    Remove item from cart or clear entire cart
// @route   DELETE /api/cart OR /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user.id || req.user._id;

  const cart = await fetchCartForUser(userId);

  if (cart) {
    if (productId) {
      await CartItem.destroy({
        where: { cartId: cart.id, productId },
      });
    } else {
      await CartItem.destroy({
        where: { cartId: cart.id },
      });
    }
  }

  const updatedCart = await fetchCartForUser(userId);

  res.json({
    success: true,
    message: productId ? 'Item removed from cart' : 'Cart cleared',
    cart: updatedCart,
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
};
