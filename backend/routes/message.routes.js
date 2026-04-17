// routes/message.routes.js

const express = require('express');
const router  = express.Router();

const {
  getMessages, getConversations, sendMessage, getUnreadCount
} = require('../controllers/message.controller');

const { protect } = require('../middleware/auth');

router.use(protect);

// GET  /api/messages/conversations → list of all chats
router.get('/conversations', getConversations);

// GET  /api/messages/unread        → unread message count
router.get('/unread', getUnreadCount);

// GET  /api/messages/:userId       → full chat with a specific user
router.get('/:userId', getMessages);

// POST /api/messages               → send a new message
router.post('/', sendMessage);

module.exports = router;
