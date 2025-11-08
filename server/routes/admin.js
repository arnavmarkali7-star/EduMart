const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserDetails,
  updateUserStatus,
  getProducts,
  getComplaints,
  getRatings,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/status', updateUserStatus);
router.get('/products', getProducts);
router.get('/complaints', getComplaints);
router.get('/ratings', getRatings);

module.exports = router;

