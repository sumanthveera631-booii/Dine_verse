const express = require('express');
const router = express.Router();
const { register, login, getWishlist, toggleWishlist } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/toggle', protect, toggleWishlist);

module.exports = router;
