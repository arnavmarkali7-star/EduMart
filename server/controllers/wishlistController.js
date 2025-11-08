const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Add to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID'
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      user: req.user.id,
      product: productId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    const wishlistItem = await Wishlist.create({
      user: req.user.id,
      product: productId
    });

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlistItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id })
      .populate('product')
      .sort('-createdAt');

    res.json({
      success: true,
      count: wishlist.length,
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found'
      });
    }

    await Wishlist.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove from wishlist by product ID
// @route   DELETE /api/wishlist/product/:productId
// @access  Private
exports.removeFromWishlistByProduct = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      product: req.params.productId,
      user: req.user.id
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not in wishlist'
      });
    }

    await Wishlist.findByIdAndDelete(wishlistItem._id);

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

