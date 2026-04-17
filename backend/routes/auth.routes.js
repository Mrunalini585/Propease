// ============================================================
// routes/auth.routes.js
//
// Routes define the URL paths and which controller handles them.
// Think of routes as a "menu" and controllers as the "kitchen".
// ============================================================

const express = require('express');
const router  = express.Router();

const { signup, login, getMe } = require('../controllers/auth.controller');
const { protect }              = require('../middleware/auth');

// POST /api/auth/signup  → Register new user
router.post('/signup', signup);

// POST /api/auth/login   → Login
router.post('/login', login);

// GET  /api/auth/me      → Get my profile (requires login token)
router.get('/me', protect, getMe);

module.exports = router;
