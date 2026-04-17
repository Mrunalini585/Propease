// ============================================================
// models/Property.js — Schema for rental properties
// ============================================================

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    // RELATIONSHIP: Which owner does this property belong to?
    // ObjectId is a MongoDB unique ID; ref: 'User' means it links to the User model
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',   // "populate" this to get full owner details
      required: true
    },

    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true
    },

    description: { type: String, default: '' },

    address: {
      street: String,
      city:   String,
      state:  String,
      zip:    String
    },

    type: {
      type: String,
      enum: ['apartment', 'house', 'studio', 'villa', 'commercial'],
      default: 'apartment'
    },

    rent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: 0
    },

    deposit: { type: Number, default: 0 },

    bedrooms:  { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    area:      { type: Number, default: 0 }, // in sq ft

    amenities: [String], // e.g. ['WiFi', 'Parking', 'AC']

    images: [String], // array of image URLs

    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance'],
      default: 'available'
    },

    // RELATIONSHIP: Which tenant is currently in this property?
    currentTenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
