// ============================================================
// middleware/auth.js — JWT Token Verification Middleware
//
// This "guard" runs before any protected route.
// It checks: "Is this user logged in? Is their token valid?"
// ============================================================

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Tokens are sent in the request header like:
  // Authorization: Bearer eyJhbGciOiJIUz...
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // extract the token part
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
  }

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the logged-in user's data to req.user so routes can use it
    req.user = await User.findById(decoded.id);

    next(); // move to the actual route handler
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
  }
};

// Middleware to restrict routes to specific roles
// Usage: authorize('owner') or authorize('tenant')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${roles.join(', ')} can do this.`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
