const express = require('express');
const router = express.Router();
const {
  getSellerDashboard,
  getSellerProducts,
  getSellerOrders
} = require('../controllers/sellerController');
const { protect, isSeller } = require('../middleware/auth');

router.use(protect);
router.use(isSeller);

router.get('/dashboard', getSellerDashboard);
router.get('/products', getSellerProducts);
router.get('/orders', getSellerOrders);

module.exports = router;

