const express = require('express');
const couponController = require('../controllers/coupon');
const Coupon = require('../models/coupon');
const router = express.Router();
const { body } = require('express-validator');
const isAuth = require('../middlewares/isAuth');

// POST /coupon/create
router.post('/create', [
    body('shopId')
        .trim()
        .notEmpty()
        .withMessage('Shop ID is required'),

    body('code')
        .trim()
        .isLength({ min: 3, max: 10 })
        .withMessage('Coupon code must be between 3 and 10 characters')
        .matches(/^[a-zA-Z0-9]*$/)
        .withMessage('Coupon code must be alphanumeric')
        .custom(async (value, { req }) => {
            const coupon = await Coupon.findOne({ code: value, shop: req.body.shopId });
            if (coupon) {
                throw new Error('Coupon code already exists');
            }
            return true;
        }),

    body('type')
        .trim()
        .notEmpty()
        .withMessage('Coupon type is required'),

    body('discountAmount')
        .trim()
        .isNumeric()
        .withMessage('Discount amount must be a number')
        .notEmpty()
        .withMessage('Discount amount is required')
        .custom((value, { req }) => {
            if (req.body.type === 'percentage' && (value <= 0 || value > 100)) {
                throw new Error('Percentage discount must be between 1 and 100');
            }
            if (req.body.type === 'fixed' && value <= 0) {
                throw new Error('Fixed discount amount must be greater than 0');
            }
            return true;
        }),

    body('minOrderAmount')
        .trim()
        .isNumeric()
        .withMessage('Minimum order amount must be a number'),

    body('expirationDate')
        .trim()
        .isISO8601()
        .withMessage('Expiration date must be a valid date')
        .custom((value, { req }) => {
            if (value <= req.body.startDate) {
                throw new Error('Expiration date must be greater than the start date');
            }
            return true;
        }),

    body('startDate')
        .trim()
        .isISO8601()
        .withMessage('Start date must be a valid date'),

    body('categories')
        .trim()
        .notEmpty()
        .withMessage('Categories are required'),
], isAuth, couponController.createCoupon);

// GET /coupon/all/:shopId
router.get('/all/:shopId', isAuth, couponController.getAllCoupons);

// DELETE /coupon/delete/:couponId
router.post('/delete/:couponId', isAuth, couponController.deleteCoupon);

// POST /coupon/apply/:couponCode
router.post('/apply/:couponCode', isAuth, couponController.applyCoupon);


module.exports = router;
