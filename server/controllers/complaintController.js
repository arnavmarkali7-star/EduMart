const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

// @desc    Create complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
  try {
    const { type, subject, description, relatedOrder, relatedProduct, priority } = req.body;

    const complaint = await Complaint.create({
      user: req.user.id,
      type,
      subject,
      description,
      relatedOrder,
      relatedProduct,
      priority: priority || 'medium'
    });

    // Create notification for admin
    const adminUsers = await require('../models/User').find({ role: 'admin' });
    for (const admin of adminUsers) {
      await Notification.create({
        user: admin._id,
        type: 'complaint',
        title: 'New Complaint',
        message: `New complaint from ${req.user.name}: ${subject}`,
        link: `/admin/complaints/${complaint._id}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's complaints
// @route   GET /api/complaints/my-complaints
// @access  Private
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .populate('relatedOrder')
      .populate('relatedProduct')
      .sort('-createdAt');

    res.json({
      success: true,
      count: complaints.length,
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

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('relatedOrder')
      .populate('relatedProduct');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check authorization
    if (complaint.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint'
      });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update complaint status (Admin only)
// @route   PUT /api/complaints/:id/status
// @access  Private/Admin
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.status = status || complaint.status;
    if (adminResponse) {
      complaint.adminResponse = adminResponse;
    }
    complaint.updatedAt = Date.now();

    await complaint.save();

    // Create notification for user
    await Notification.create({
      user: complaint.user,
      type: 'complaint',
      title: 'Complaint Status Updated',
      message: `Your complaint "${complaint.subject}" status has been updated to ${status}`,
      link: `/complaints/${complaint._id}`
    });

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

