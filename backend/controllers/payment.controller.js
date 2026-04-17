// ============================================================
// controllers/payment.controller.js
// ============================================================

const Payment  = require('../models/Payment');
const Property = require('../models/Property');

// GET all payments (owner sees all theirs, tenant sees only theirs)
exports.getPayments = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'owner')  filter.owner  = req.user._id;
    if (req.user.role === 'tenant') filter.tenant = req.user._id;

    const payments = await Payment.find(filter)
      .populate('property', 'title address')
      .populate('tenant',   'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE a payment record (Owner only)
exports.createPayment = async (req, res) => {
  try {
    // Get the property to find its owner
    const property = await Property.findById(req.body.property);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

    req.body.owner = property.owner;

    const payment = await Payment.create(req.body);
    res.status(201).json({ success: true, message: 'Payment recorded!', payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE payment status (Owner only)
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Payment updated!', payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE a payment (Owner only)
exports.deletePayment = async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Payment deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
