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
    upload.single('eventBanner'), // Assuming 'banner' is the name attribute in the form for the banner image
    [
        body('title')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('Title is required.')
            .isLength({ min: 10, max: 95 })
            .withMessage('Title must be between 10 and 95 characters.'),
        body('description')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('Description is required.')
            .isLength({ min: 20, max: 1000 })
            .withMessage('Description must be between 20 and 1000 characters.'),
        body('coupon')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('Coupon code is required!'),
        body('termsAndConditions')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('Terms and conditions are required!')
            .isLength({ min: 2, max: 200 })
            .withMessage('Terms and conditions must be between 2 and 200 characters.'),
        body('product')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('Product is required!'),
    ],
    isAuth, eventController.create
);

// GET /event/all
router.get('/all', eventController.getAll);

// GET /event/all/:shopId
router.get('/all/:shopId', eventController.getAllByShop);

// GET /event/delete/:eventId
router.delete('/delete/:eventId', isAuth, eventController.delete);

// GET /event/featured
router.get('/featured', eventController.getFeatured);

// GET /event/:eventId
router.get('/:eventId', eventController.getEvent);



module.exports = router;
