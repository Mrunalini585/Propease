// ============================================================
// models/Message.js — Schema for owner-tenant messaging
// ============================================================

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    text: {
      type: String,
      required: [true, 'Message cannot be empty'],
      trim: true
    },

    read: {
      type: Boolean,
      default: false // false = unread
    }
  },
  { timestamps: true } // createdAt acts as message timestamp
);

module.exports = mongoose.model('Message', messageSchema);
