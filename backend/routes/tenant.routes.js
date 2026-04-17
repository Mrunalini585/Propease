// routes/tenant.routes.js

const express = require('express');
const router  = express.Router();

const {
  getTenants, getAllTenantUsers, getMyHome
} = require('../controllers/tenant.controller');

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// GET /api/tenants          → Owner gets their tenants
router.get('/', authorize('owner'), getTenants);

// GET /api/tenants/all-users → All tenant-role users (for assign dropdown)
router.get('/all-users', authorize('owner'), getAllTenantUsers);

// GET /api/tenants/my-home  → Tenant gets their assigned property
router.get('/my-home', authorize('tenant'), getMyHome);

module.exports = router;
