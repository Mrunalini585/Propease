// ============================================================
// models/User.js — MongoDB Schema for Users (Owner & Tenant)
// A "Schema" is like a blueprint/template for data in MongoDB
// ============================================================

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// Define what a User document looks like in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true  // removes extra spaces
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,   // no two users can have the same email
      lowercase: true // always store emails in lowercase
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false  // never return password in queries by default (security!)
    },
    role: {
      type: String,
      enum: ['owner', 'tenant'], // only these two values are allowed
      required: true
    },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' }
  },
  {
    timestamps: true  // auto-adds createdAt and updatedAt fields
  }
);

// -------------------------------------------------------
// MIDDLEWARE: Hash password BEFORE saving to database
// This runs automatically every time a user is saved
// -------------------------------------------------------
userSchema.pre('save', async function (next) {
  // Only hash if the password field was changed (avoid re-hashing on other updates)
  if (!this.isModified('password')) return next();

  // "salt" adds random characters before hashing (makes it more secure)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// -------------------------------------------------------
// METHOD: Compare entered password with stored hash
// Used during login to verify the password
// -------------------------------------------------------
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model so other files can use it
module.exports = mongoose.model('User', userSchema);
