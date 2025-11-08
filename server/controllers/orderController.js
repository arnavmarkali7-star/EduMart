const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { products, paymentMethod, shippingAddress, notes } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide products'
      });
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }

      if (!product.available || product.status === 'sold') {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      const price = item.price || product.price;
      totalAmount += price * (item.quantity || 1);

      orderProducts.push({
        product: product._id,
        quantity: item.quantity || 1,
        price
      });
    }

    const sellerId = (await Product.findById(products[0].product)).seller;

    const order = await Order.create({
      buyer: req.user.id,
      seller: sellerId,
      products: orderProducts,
      totalAmount,
      paymentMethod: paymentMethod || 'cash',
      shippingAddress,
      notes
    });

    // Update product status
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        status: 'sold',
        available: false
      });
    }

    // Create notification for seller
    await Notification.create({
      user: sellerId,
      type: 'order',
      title: 'New Order Received',
      message: `You have received a new order from ${req.user.name}`,
      link: `/orders/${order._id}`
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const { status, type } = req.query;
    const query = {};

    if (type === 'buyer') {
      query.buyer = req.user.id;
    } else if (type === 'seller') {
      query.seller = req.user.id;
    } else {
      // Get both buyer and seller orders
      query.$or = [
        { buyer: req.user.id },
        { seller: req.user.id }
      ];
    }

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('buyer', 'name email avatar')
      .populate('seller', 'name email avatar')
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email avatar phone college')
      .populate('seller', 'name email avatar phone college')
      .populate('products.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is buyer or seller or admin
    if (
      order.buyer._id.toString() !== req.user.id &&
      order.seller._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    const isSeller = order.seller.toString() === req.user.id;
    const isBuyer = order.buyer.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isSeller && !isBuyer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.status = status;
    order.updatedAt = Date.now();
    await order.save();

    // Create notification
    const notifyUser = isSeller ? order.buyer : order.seller;
    await Notification.create({
      user: notifyUser,
      type: 'order',
      title: 'Order Status Updated',
      message: `Your order status has been updated to ${status}`,
      link: `/orders/${order._id}`
    });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

