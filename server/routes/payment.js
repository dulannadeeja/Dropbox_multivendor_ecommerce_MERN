const express = require('express');
const isAuth = require('../middlewares/isAuth');

const paymentController = require('../controllers/payment');

const router = express.Router();


// POST /payment/process
router.post("/process", isAuth, paymentController.processPayment);

// GET /payment/stripe-key
router.get("/stripe-key", isAuth, paymentController.getStripeKey);

// POST /payment/create-paypal-order
router.post("/create-paypal-order", isAuth, paymentController.createPaypalOrder);

// POST /payment/capture-paypal-payment
router.post("/capture-paypal-payment", isAuth, paymentController.capturePaypalPayment);

module.exports = router;