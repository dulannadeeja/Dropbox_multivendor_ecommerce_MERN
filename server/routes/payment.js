const express = require('express');
const isAuth = require('../middlewares/isAuth');

const paymentController = require('../controllers/payment');

const router = express.Router();


// POST /payment/process
router.post("/process", isAuth, paymentController.processPayment);

// GET /payment/stripe-key
router.get("/stripe-key", isAuth, paymentController.getStripeKey);

module.exports = router;