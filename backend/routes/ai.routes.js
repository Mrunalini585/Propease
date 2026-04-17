// ============================================================
// routes/ai.routes.js
// ============================================================

const express = require('express');
const router  = express.Router();

const { handleAiChat } = require('../controllers/ai.controller');
const { protect }      = require('../middleware/auth');

// POST /api/ai/chat
router.post('/chat', protect, handleAiChat);

module.exports = router;
