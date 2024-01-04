const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const upload = require('../multer');

const feedController = require('../controllers/seller.js');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

// PUT /seller/signup
router.post('/signup', upload.array('images', 2), [
    body('firstName').trim().not().isEmpty().withMessage('First name is required.'),
    body('lastName').trim().not().isEmpty().withMessage('Last name is required.'),
    body('email').isEmail().withMessage('Please enter a valid email.')
        .normalizeEmail()
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (!userDoc) {
                        return Promise.reject('This email is not available!');
                    }
                })
        }),
    body('houseNumber').trim().not().isEmpty().withMessage('House number is required.'),
    body('street').trim().not().isEmpty().withMessage('Street is required.'),
    body('zip').trim().not().isEmpty().withMessage('Zip code is required.'),
    body('country').trim().not().isEmpty().withMessage('Country is required.'),
    body('state').trim().not().isEmpty().withMessage('State is required.'),
    body('city').trim().not().isEmpty().withMessage('City is required.'),
    body('phone').trim().not().isEmpty().withMessage('Phone number is required.'),
    body('phone').trim().isLength({ min: 10, max: 13 }).withMessage('Phone number must be between 10 and 13 characters long.'),
    body('businessName').trim().not().isEmpty().withMessage('Business name is required.'),
    body('businessCountry').trim().not().isEmpty().withMessage('Country is required.'),
    body('businessState').trim().not().isEmpty().withMessage('State is required.'),
    body('businessCity').trim().not().isEmpty().withMessage('City is required.'),
    body('businessZip').trim().not().isEmpty().withMessage('Zip code is required.'),
    body('businessStreet').trim().not().isEmpty().withMessage('Street is required.'),
    body('businessApartment').trim().not().isEmpty().withMessage('Apartment is required.'),
    body('contactName').trim().not().isEmpty().withMessage('Contact name is required.'),
    body('contactEmail').isEmail().withMessage('Please enter a valid email.')
        .normalizeEmail(),
    body('contactPhone').trim().not().isEmpty().withMessage('Phone number is required.')
        .isLength({ min: 10, max: 13 }).withMessage('Phone number must be between 10 and 13 characters long.'),
    body('shopDescription').trim().not().isEmpty().withMessage('Shop description is required.'),
], isAuth, feedController.signup);

module.exports = router;