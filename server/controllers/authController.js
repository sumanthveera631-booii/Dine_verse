const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dineverse_secret_luxury_token_key';

// Helper to sign JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid user registration input' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user wishlist
// @route   GET /api/auth/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/auth/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res) => {
  const { menuItemId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.wishlist.indexOf(menuItemId);
    if (index > -1) {
      // Already inside wishlist, remove it
      user.wishlist.splice(index, 1);
    } else {
      // Not inside, push it
      user.wishlist.push(menuItemId);
    }

    await user.save();
    
    // Return the updated populated wishlist
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json(updatedUser.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
