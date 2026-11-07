const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getQueue,
  updateStatus,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/queue', protect, authorize('OWNER', 'ADMIN'), getQueue);
router.patch('/:id/status', protect, authorize('OWNER', 'ADMIN'), updateStatus);

module.exports = router;
