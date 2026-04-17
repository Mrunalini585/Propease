// ============================================================
// models/Maintenance.js — Schema for maintenance requests
// ============================================================

const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    title: {
      type: String,
      required: [true, 'Title is required']
    },

    description: { type: String, required: true },

    category: {
      type: String,
      enum: ['plumbing', 'electrical', 'appliance', 'structural', 'pest', 'other'],
      default: 'other'
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },

    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'rejected'],
      default: 'pending'
    },

    ownerNote: { type: String, default: '' } // owner's reply to the request
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
