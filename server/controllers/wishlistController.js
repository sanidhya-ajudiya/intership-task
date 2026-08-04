const asyncHandler = require('express-async-handler');
const { Wishlist, WishlistItem, Product, User } = require('../models');

const fetchWishlistForUser = async (userId) => {
  let wishlist = await Wishlist.findOne({
    where: { userId },
    include: [
      {
        model: WishlistItem,
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

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId });
    wishlist = await Wishlist.findOne({
      where: { userId },
      include: [
        {
          model: WishlistItem,
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

  const wishlistData = wishlist.toJSON();
  const products = (wishlist.items || [])
    .map((item) => item.product)
    .filter(Boolean);

  return {
    ...wishlistData,
    products,
  };
};

// @desc    Get current user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const wishlist = await fetchWishlistForUser(userId);

  res.json({
    success: true,
    wishlist,
  });
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id || req.user._id;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  const wishlist = await Wishlist.findOne({ where: { userId } }) || (await Wishlist.create({ userId }));

  const existingItem = await WishlistItem.findOne({
    where: { wishlistId: wishlist.id, productId },
  });

  if (!existingItem) {
    await WishlistItem.create({
      wishlistId: wishlist.id,
      productId,
    });
  }

  const updatedWishlist = await fetchWishlistForUser(userId);

  res.json({
    success: true,
    message: 'Added to wishlist',
    wishlist: updatedWishlist,
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id || req.user._id;

  const wishlist = await Wishlist.findOne({ where: { userId } });

  if (wishlist) {
    await WishlistItem.destroy({
      where: { wishlistId: wishlist.id, productId },
    });
  }

  const updatedWishlist = await fetchWishlistForUser(userId);

  res.json({
    success: true,
    message: 'Removed from wishlist',
    wishlist: updatedWishlist,
  });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
