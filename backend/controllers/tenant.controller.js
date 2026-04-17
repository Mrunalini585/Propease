// ============================================================
// controllers/tenant.controller.js
// ============================================================

const User     = require('../models/User');
const Property = require('../models/Property');

// GET all tenants (Owner only — gets tenants assigned to their properties)
exports.getTenants = async (req, res) => {
  try {
    // Find all properties owned by this owner that have a tenant
    const properties = await Property.find({
      owner: req.user._id,
      currentTenant: { $ne: null }
    }).populate('currentTenant', 'name email phone createdAt');

    const Payment = require('../models/Payment');

    // Safely filter out properties where the populated currentTenant ended up null 
    // (which can happen if the User was deleted but property retained the ID)
    const validProperties = properties.filter(p => p.currentTenant);

    const tenants = await Promise.all(validProperties.map(async prop => {
      // Aggregate total payments made by this tenant for this property
      const payments = await Payment.find({
        tenant: prop.currentTenant._id,
        property: prop._id,
        status: 'paid'
      });
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

      return {
        ...prop.currentTenant.toObject(),
        property: { 
          id: prop._id, 
          title: prop.title, 
          address: prop.address,
          rent: prop.rent 
        },
        totalPaid
      };
    }));

    res.json({ success: true, tenants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all users with role 'tenant' (for dropdown when assigning a tenant)
exports.getAllTenantUsers = async (req, res) => {
  try {
    const tenants = await User.find({ role: 'tenant' }).select('name email phone');
    res.json({ success: true, tenants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET tenant's home (the property they are assigned to)
exports.getMyHome = async (req, res) => {
  try {
    const property = await Property.findOne({ currentTenant: req.user._id })
      .populate('owner', 'name email phone');

    if (!property) {
      return res.json({ success: true, property: null, message: 'No property assigned yet.' });
    }

    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
