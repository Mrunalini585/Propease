// ============================================================
// controllers/maintenance.controller.js
// ============================================================

const Maintenance = require('../models/Maintenance');
const Property    = require('../models/Property');

// GET maintenance requests
exports.getMaintenance = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'owner')  filter.owner  = req.user._id;
    if (req.user.role === 'tenant') filter.tenant = req.user._id;

    const requests = await Maintenance.find(filter)
      .populate('property', 'title address')
      .populate('tenant',   'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE a maintenance request (Tenant only)
exports.createMaintenance = async (req, res) => {
  try {
    // Find the tenant's property to get the owner
    const property = await Property.findById(req.body.property);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

    req.body.tenant = req.user._id;
    req.body.owner  = property.owner;

    const request = await Maintenance.create(req.body);
    res.status(201).json({ success: true, message: 'Maintenance request submitted!', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE a maintenance request (Owner can update status/note)
exports.updateMaintenance = async (req, res) => {
  try {
    const request = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Request updated!', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
