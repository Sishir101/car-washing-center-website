const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEventById } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', protect, authorize('ORGANIZER', 'ADMIN'), createEvent);

module.exports = router;
