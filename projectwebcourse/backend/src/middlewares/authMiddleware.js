const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user and attach to request
      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      // Check if user is blocked
      if (req.user.status === 'blocked') {
        res.status(403);
        return next(new Error('Not authorized, account is blocked'));
      }

      next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    return next(new Error('Not authorized as an admin'));
  }
};

module.exports = { protect, admin };
