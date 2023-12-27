const express = require('express');
const orderController = require('../controllers/order.js');
const router = express.Router();
const { body } = require('express-validator');
const isAuth = require('../middlewares/isAuth');

// POST /order/create
router.post("/create", isAuth, [
    body('cartTotal').isString(),
    body('couponDiscount'),
    body('coupon').isString(),
    body('isCouponApplied'),
    body('items'),
    body('paymentMethod').isString(),
    body('houseNumber').isString(),
    body('street').isString(),
    body('city').isString(),
    body('state').isString(),
    body('zip').isString(),
    body('country').isString(),
    body('contactNumber').isString(),
    body('contactName').isString(),

], orderController.createOrder);


// GET /order/all
router.get("/all", isAuth, orderController.getAllOrdersByUserId);

// GET /order/shop/all
router.get("/shop/all", isAuth, orderController.getAllOrdersByShopId);

// POST /order/status/update
router.post("/status/update/:orderId", isAuth, orderController.updateOrderStatus);

module.exports = router;
