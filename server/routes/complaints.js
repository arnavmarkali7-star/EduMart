const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getComplaint,
  updateComplaintStatus
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createComplaint);
router.get('/my-complaints', protect, getMyComplaints);
router.get('/:id', protect, getComplaint);
router.put('/:id/status', protect, authorize('admin'), updateComplaintStatus);

module.exports = router;

