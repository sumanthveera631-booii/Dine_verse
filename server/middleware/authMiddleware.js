const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dineverse_secret_luxury_token_key';

// @desc    Verify incoming token & attach user session
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Fetch user profile from DB (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized: user account no longer exists' });
      }

      next();
    } catch (error) {
      console.error('JWT Token Verification Error:', error.message);
      return res.status(401).json({ message: 'Session expired or token signature is invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied: missing authentication token credentials' });
  }
};

// @desc    Gate access based on system roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: your account role [${req.user?.role || 'Guest'}] does not have access permissions` 
      });
    }
    next();
  };
};
