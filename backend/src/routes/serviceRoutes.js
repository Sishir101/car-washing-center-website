const express = require('express');
const router = express.Router();
const { getAllServices, createService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllServices);
router.post('/', protect, authorize('OWNER', 'ADMIN'), createService);

module.exports = router;
