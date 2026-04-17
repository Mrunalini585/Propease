// routes/maintenance.routes.js

const express = require('express');
const router  = express.Router();

const {
  getMaintenance, createMaintenance, updateMaintenance
} = require('../controllers/maintenance.controller');

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getMaintenance)
  .post(authorize('tenant'), createMaintenance);

router.route('/:id')
  .put(authorize('owner'), updateMaintenance);

module.exports = router;
