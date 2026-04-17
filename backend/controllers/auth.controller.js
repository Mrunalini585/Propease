// ============================================================
// controllers/auth.controller.js
//
// Controllers contain the actual LOGIC for each API endpoint.
// Routes just define the URL; controllers do the work.
// ============================================================

const User = require('../models/User');
const jwt  = require('jsonwebtoken');

// -------------------------------------------------------
// Helper: Generate a JWT token for a user
// -------------------------------------------------------
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                  // payload stored in the token
    process.env.JWT_SECRET,          // secret key to sign with
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// -------------------------------------------------------
// @route   POST /api/auth/signup
// @desc    Register a new user (owner or tenant)
// @access  Public (no login needed)
// -------------------------------------------------------
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Create new user (password is auto-hashed by the model's pre-save hook)
    const user = await User.create({ name, email, password, role, phone });

    // Generate login token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------------------
// @route   POST /api/auth/login
// @desc    Log in an existing user
// @access  Public
// -------------------------------------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // Find user (we need password for comparison, so use .select('+password'))
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------------------
// @route   GET /api/auth/me
// @desc    Get currently logged-in user's profile
// @access  Private (requires JWT token)
// -------------------------------------------------------
exports.getMe = async (req, res) => {
  try {
    // req.user is set by the 'protect' middleware
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
