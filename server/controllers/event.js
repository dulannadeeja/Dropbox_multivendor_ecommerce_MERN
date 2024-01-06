const { validationResult } = require('express-validator');
const User = require('../models/user');
const Product = require('../models/product');
const Coupon = require('../models/coupon');
const Shop = require('../models/shop');
const Event = require('../models/event');
const clearImage = require('../utils/imageCleaner');
const moment = require('moment');



module.exports.create = async (req, res, next) => {

    // authenticated user only can reach this point
    const userId = req.userId;

    const title = req.body.title;
    const description = req.body.description;
    const couponId = req.body.coupon;
    const banner = req.file;
    const termsAndConditions = req.body.termsAndConditions;
    const productId = req.body.product;

    let updatedImagePath;
    const validationErrors = validationResult(req);

    try {
        if (!banner) {
            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }


        const imagePath = banner.path;
        const updatedImagePath = imagePath.replace(/\\/g, '/');


        if (!validationErrors.isEmpty()) {

            clearImage(updatedImagePath);

            const error = new Error(validationErrors.array()[0].msg);
            error.statusCode = 422;
            error.data = validationErrors.array();
            throw error;
        }

        const user = await User.findById(userId);

        const shop = await Shop.findById(user.shop);

        if (!shop) {
            const error = new Error('Could not find shop.');
            error.statusCode = 500;
            throw error;
        }

        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            const error = new Error('Could not find coupon.');
            error.statusCode = 500;
            throw error;
        }

        const product = await Product.findById(productId);

        if (!product) {
            const error = new Error('Could not find product.');
            error.statusCode = 500;
            throw error;
        }

        console.log('shop', shop._id);

        const event = await Event.create({
            shop: shop._id,
            title: title,
            description: description,
            eventType: coupon.type,
            discountAmount: coupon.discountAmount,
            product: product,
            startDate: coupon.startDate,
            endDate: coupon.expirationDate,
            banner: updatedImagePath,
            termsAndConditions: termsAndConditions,
            couponCode: coupon.code,
        });

        if (!event) {
            const error = new Error('Could not create event.');
            error.statusCode = 500;
            throw error;
        }

        res.status(201).json({
            message: 'Event created successfully.',
            event: event
        });

    }
    catch (err) {

        if (updatedImagePath) {
            clearImage(updatedImagePath);
        }

        if (!err.message) {
            err.message = 'Internal server error.';
        }

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

module.exports.delete = async (req, res, next) => {
    const eventId = req.params.eventId;
    const userId = req.userId;

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            const error = new Error('Could not find event.');
            error.statusCode = 500;
            throw error;
        }

        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 500;
            throw error;
        }

        if (event.shop.toString() !== user.shop.toString()) {
            const error = new Error('Not authorized to delete this event.');
            error.statusCode = 401;
            throw error;
        }

        clearImage(event.banner);

        const deletedEvent = await Event.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            const error = new Error('Could not delete event.');
            error.statusCode = 500;
            throw error;
        }

        res.status(200).json({
            message: 'Event deleted successfully.',
            event: deletedEvent._id.toString()
        });



    } catch (err) {
        if (!err.message) {
            err.message = 'Internal server error.';
        }

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports.getAllByShop = async (req, res, next) => {
    const shopId = req.params.shopId;

    try {

        const events = await Event.find({ shop: shopId })
            .populate('product')

        if (!events) {
            const error = new Error('Could not get events.');
            error.statusCode = 500;
            throw error;
        }

        res.status(200).json({
            message: 'Events fetched successfully.',
            events: events
        });



    } catch (err) {
        if (!err.message) {
            err.message = 'Internal server error.';
        }

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports.getFeatured = async (req, res, next) => {
    try {
        const currentDate = moment();

        // 10 get best sold events

        const events = await Event.find({ startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }).limit(11)
            .populate('product')
            .sort({ 'product.sold': -1 });


        console.log('events', events);

        if (!events) {
            const error = new Error('Could not get events.');
            error.statusCode = 500;
            throw error;
        }

        res.status(200).json({
            message: 'Events fetched successfully.',
            events: events
        });
    } catch (err) {
        if (!err.message) {
            err.message = 'Internal server error.';
        }

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

module.exports.getEvent = async (req, res, next) => {
    const eventId = req.params.eventId;

    try {
        const event = await Event.findById(eventId).populate('product');

        if (!event) {
            const error = new Error('Could not find event.');
            error.statusCode = 500;
            throw error;
        }

        res.status(200).json({
            message: 'Event fetched successfully.',
            event: event
        });


    }
    catch (err) {
        if (!err.message) {
            err.message = 'Internal server error.';
        }

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports.getAll = async (req, res, next) => {
    try {

        // get 30 of events that are not expired and ending soon
        const currentDate = moment();
        const events = await Event.find({ startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }).limit(30)
            .populate('product')
            .sort({ 'product.sold_out': -1 });

        if (!events) {
            const error = new Error('Could not get events.');
            error.statusCode = 500;
            throw error;
        }

        res.status(200).json({
            message: 'Events fetched successfully.',
            events: events
        });
    }
    catch (err) {
        if (!err.message) {
            err.message = 'Internal server error.';
        }

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}