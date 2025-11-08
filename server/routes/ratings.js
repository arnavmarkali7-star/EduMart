const express = require('express');
const router = express.Router();
const {
  createRating,
  getProductRatings,
  getMyRatings,
  deleteRating
} = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createRating);
router.get('/product/:productId', getProductRatings);
router.get('/my-ratings', protect, getMyRatings);
router.delete('/:id', protect, deleteRating);

module.exports = router;

