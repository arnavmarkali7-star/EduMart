const Order = require('../models/Order');
const Product = require('../models/Product');
const Rating = require('../models/Rating');

// @desc    Get seller dashboard stats
// @route   GET /api/seller/dashboard
// @access  Private/Seller
exports.getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Get all seller's products
    const products = await Product.find({ seller: sellerId });
    const activeListings = products.filter(p => p.status === 'active' && p.available).length;

    // Get all seller's orders
    const orders = await Order.find({ seller: sellerId });
    const totalSells = orders.filter(o => o.status === 'delivered').length;
    
    // Calculate total revenue
    const deliveredOrders = orders.filter(o => o.status === 'delivered' && o.paymentStatus === 'paid');
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get product IDs
    const productIds = products.map(p => p._id);

    // Calculate average rating
    const ratings = await Rating.find({ product: { $in: productIds } });
    const averageRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
      : 0;

    // Sales overview (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentOrders = orders.filter(
      o => o.status === 'delivered' && new Date(o.createdAt) >= sixMonthsAgo
    );

    // Group by month
    const salesOverview = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      const monthOrders = recentOrders.filter(
        o => new Date(o.createdAt).getMonth() === date.getMonth() &&
        new Date(o.createdAt).getFullYear() === date.getFullYear()
      );

      salesOverview.push({
        month: monthName,
        sales: monthOrders.length,
        revenue: monthOrders.reduce((sum, o) => sum + o.totalAmount, 0)
      });
    }

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalSells,
        activeListings,
        averageRating: parseFloat(averageRating),
        totalProducts: products.length,
        totalOrders: orders.length,
        salesOverview
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

// @desc    Get seller's products
// @route   GET /api/seller/products
// @access  Private/Seller
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .sort('-createdAt');

    res.json({
      success: true,
      count: products.length,
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

// @desc    Get seller's orders
// @route   GET /api/seller/orders
// @access  Private/Seller
exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user.id })
      .populate('buyer', 'name email avatar')
      .populate('products.product')
      .sort('-createdAt');

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

