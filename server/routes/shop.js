const express = require('express');
const { check } = require('express-validator');

const shopController = require('../controllers/shop');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

// PUT /shop/shop-create
router.put('/shop-create', [
    check('email').isEmail().withMessage('Please provide a valid email address.'),
    check('name').notEmpty().withMessage('Name is required.'),
    check('mobile').isMobilePhone().withMessage('Please provide a valid phone number.'),
    check('address').notEmpty().withMessage('Address is required.'),
    check('zipCode').isPostalCode('any').withMessage('Please provide a valid postal code.'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must match!');
        }
        return true;
    })
], shopController.createShop);

module.exports = router;