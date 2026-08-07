const jwt = require('jsonwebtoken');
const mockStore = require('../utils/mockStore');
const User = require('../models/User');
const { getDbState } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'hirepulse_super_secret_jwt_key_2026_production';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { useMock } = getDbState();
    let user = null;

    if (useMock) {
      user = mockStore.findUserById(decoded.id);
    } else {
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or session invalid' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by administrator' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired access token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Role '${req.user ? req.user.role : 'guest'}' is not authorized` 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
