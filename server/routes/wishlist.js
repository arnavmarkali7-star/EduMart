const express = require('express');
const router = express.Router();
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  removeFromWishlistByProduct
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addToWishlist);
router.get('/', protect, getWishlist);
router.delete('/:id', protect, removeFromWishlist);
router.delete('/product/:productId', protect, removeFromWishlistByProduct);

module.exports = router;

