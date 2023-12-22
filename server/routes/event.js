const express = require('express');
const { body } = require('express-validator');
const Event = require('../models/event'); // Import the Event model
const isAuth = require('../middlewares/isAuth');
const upload = require('../multer');
const eventController = require('../controllers/event');

const router = express.Router();

// POST /events/create
router.post(
    '/create',
    upload.single('banner'), // Assuming 'banner' is the name attribute in the form for the banner image
    [
        body('title')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('Title is required.')
            .isLength({ min: 2, max: 20 })
            .withMessage('Title must be between 2 and 20 characters.'),
        body('description')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('Description is required.')
            .isLength({ min: 2 })
            .withMessage('Description must be at least 2 characters.'),
        body('eventType').trim().isString().notEmpty().withMessage('Event type is required.'),
        body('discountAmount')
            .isNumeric()
            .notEmpty()
            .withMessage('Discount amount is required and must be a number.')
            .custom((value, { req }) => {
                // Custom validation for discount amount based on event type
                if (req.body.eventType === 'Percentage Off') {
                    return value >= 0 && value <= 100;
                } else {
                    return value >= 0;
                }
            })
            .withMessage('Discount amount must be between 0 and 100 for Percentage Off event type.'),
        body('categories').notEmpty().withMessage('Categories are required and must be an array.'),
        body('startDate').isDate().withMessage("starting date is a must!").notEmpty().withMessage('Start date is required and must be a valid date.'),
        body('endDate')
            .isDate()
            .notEmpty()
            .withMessage('End date is required and must be a valid date.')
            .custom((value, { req }) => {
                // Custom validation for end date after start date
                return new Date(value) > new Date(req.body.startDate);
            })
            .withMessage('End date must be after the start date.'),
        body('couponCode')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('Coupon code is required!')
            .isLength({ min: 2, max: 20 })
            .withMessage('Coupon code must be between 2 and 20 characters.'),
        body('minPurchaseAmount')
            .isNumeric()
            .notEmpty()
            .withMessage('Minimum purchase amount is required and must be a number.')
            .isFloat({ min: 0 })
            .withMessage('Minimum purchase amount must be at least 0.'),
        body('termsAndConditions')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('Terms and conditions are required!')
            .isLength({ min: 2, max: 200 })
            .withMessage('Terms and conditions must be between 2 and 200 characters.'),
        body('visibility').trim().isString().notEmpty().withMessage('Visibility is required.'),
        body('termsAndConditions')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('Terms and conditions are required!')
            .isLength({ min: 2, max: 200 })
            .withMessage('Terms and conditions must be between 2 and 200 characters.'),
    ],
    isAuth, eventController.create
);

// GET /events/all/:shopId
router.get('/all/:shopId', isAuth, eventController.getAllByShop);

// GET /events/delete/:eventId
router.delete('/delete/:eventId', isAuth, eventController.delete);

module.exports = router;
