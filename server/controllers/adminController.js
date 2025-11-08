const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Complaint = require('../models/Complaint');
const Rating = require('../models/Rating');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's products, orders, complaints
    const [products, orders, complaints, ratings] = await Promise.all([
      Product.find({ seller: user._id }),
      Order.find({ $or: [{ buyer: user._id }, { seller: user._id }] }),
      Complaint.find({ user: user._id }),
      Rating.find({ user: user._id })
    ]);

    res.json({
      success: true,
      data: {
        user,
        stats: {
          products: products.length,
          orders: orders.length,
          complaints: complaints.length,
          ratings: ratings.length
        },
        products,
        orders,
        complaints,
        ratings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (role) user.role = role;
    user.updatedAt = Date.now();

    await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getProducts = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('seller', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all complaints
// @route   GET /api/admin/complaints
// @access  Private/Admin
exports.getComplaints = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(query)
      .populate('user', 'name email avatar')
      .populate('relatedOrder')
      .populate('relatedProduct')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Complaint.countDocuments(query);

    res.json({
      success: true,
      count: complaints.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all ratings and feedback
// @route   GET /api/admin/ratings
// @access  Private/Admin
exports.getRatings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const ratings = await Rating.find()
      .populate('user', 'name email avatar')
      .populate('product', 'name images')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Rating.countDocuments();

    // Calculate overall statistics
    const allRatings = await Rating.find();
    const averageRating = allRatings.length > 0
      ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(2)
      : 0;

    res.json({
      success: true,
      count: ratings.length,
      total,
      averageRating,
      page: Number(page),
      pages: Math.ceil(total / limit),
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

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalComplaints,
      totalRatings,
      pendingComplaints,
      activeProducts,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Complaint.countDocuments(),
      Rating.countDocuments(),
      Complaint.countDocuments({ status: 'pending' }),
      Product.countDocuments({ status: 'active', available: true }),
      Order.aggregate([
        { $match: { status: 'delivered', paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    const ratings = await Rating.find();
    const averageRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalComplaints,
        totalRatings,
        pendingComplaints,
        activeProducts,
        totalRevenue: revenue,
        averageRating
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

