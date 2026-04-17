// routes/payment.routes.js

const express = require('express');
const router  = express.Router();

const {
  getPayments, createPayment, updatePayment, deletePayment
} = require('../controllers/payment.controller');

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getPayments)
  .post(authorize('owner'), createPayment);

router.route('/:id')
  .put(authorize('owner'), updatePayment)
  .delete(authorize('owner'), deletePayment);

module.exports = router;
