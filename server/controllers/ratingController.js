const Rating = require('../models/Rating');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Create or update rating
// @route   POST /api/ratings
// @access  Private
exports.createRating = async (req, res) => {
  try {
    const { productId, rating, review, orderId } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID and rating'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if order exists and user is buyer
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order || order.buyer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to rate this product'
        });
      }
    }

    // Check if rating already exists
    let existingRating = await Rating.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review || existingRating.review;
      existingRating.order = orderId || existingRating.order;
      existingRating.updatedAt = Date.now();
      await existingRating.save();

      return res.json({
        success: true,
        message: 'Rating updated successfully',
        data: existingRating
      });
    }

    // Create new rating
    const newRating = await Rating.create({
      user: req.user.id,
      product: productId,
      rating,
      review,
      order: orderId
    });

    // Calculate average rating for product
    const ratings = await Rating.find({ product: productId });
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    res.status(201).json({
      success: true,
      message: 'Rating created successfully',
      data: newRating,
      averageRating: averageRating.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get product ratings
// @route   GET /api/ratings/product/:productId
// @access  Public
exports.getProductRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ product: req.params.productId })
      .populate('user', 'name email avatar')
      .sort('-createdAt');

    const averageRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
      : 0;

    res.json({
      success: true,
      count: ratings.length,
      averageRating,
      data: ratings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's ratings
// @route   GET /api/ratings/my-ratings
// @access  Private
exports.getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user.id })
      .populate('product')
      .sort('-createdAt');

    res.json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete rating
// @route   DELETE /api/ratings/:id
// @access  Private
exports.deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Check authorization
    if (rating.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this rating'
      });
    }

    await Rating.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

