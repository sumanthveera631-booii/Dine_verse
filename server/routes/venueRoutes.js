const express = require('express');
const router = express.Router();
const { getVenues, createVenue, updateVenue, deleteVenue } = require('../controllers/venueController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public listing
router.get('/', getVenues);

// Admin CRUD
router.post('/', protect, restrictTo('admin'), createVenue);
router.put('/:id', protect, restrictTo('admin'), updateVenue);
router.delete('/:id', protect, restrictTo('admin'), deleteVenue);

module.exports = router;
