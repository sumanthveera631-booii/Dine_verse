const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public menus
router.get('/', getMenuItems);

// Admin menus CRUD
router.post('/', protect, restrictTo('admin'), addMenuItem);
router.put('/:id', protect, restrictTo('admin'), updateMenuItem);
router.delete('/:id', protect, restrictTo('admin'), deleteMenuItem);

module.exports = router;
