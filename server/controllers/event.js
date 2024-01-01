const { validationResult } = require('express-validator');
const User = require('../models/user');
const Product = require('../models/product');
const Shop = require('../models/shop');
const fs = require('fs');
const path = require('path');
const Event = require('../models/event');



module.exports.create = async (req, res, next) => {

    // authenticated user only can reach this point
    const userId = req.userId;

    const title = req.body.title;
    const description = req.body.description;
    const eventType = req.body.eventType;
    const discountAmount = req.body.discountAmount;
    const categories = req.body.categories;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const couponCode = req.body.couponCode;
    const minPurchaseAmount = req.body.minPurchaseAmount;
    const banner = req.file;
    const termsAndConditions = req.body.termsAndConditions;
    const visibility = req.body.visibility;

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

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 500;
            throw error;
        }

        const shop = await Shop.findById(user.shop);

        if (!shop) {
            const error = new Error('Could not find shop.');
            error.statusCode = 500;
            throw error;
        }

        const event = await Event.create({
            shop: shop._id,
            title: title,
            description: description,
            eventType: eventType,
            discountAmount: discountAmount,
            categories: categories,
            startDate: startDate,
            endDate: endDate,
            couponCode: couponCode,
            minPurchaseAmount: minPurchaseAmount,
            banner: updatedImagePath,
            termsAndConditions: termsAndConditions,
            visibility: visibility
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
    const userId = req.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 500;
            throw error;
        }

        if (user.shop.toString() !== shopId.toString()) {
            const error = new Error('Not authorized to get events of this shop.');
            error.statusCode = 401;
            throw error;
        }

        const events = await Event.find({ shop: shopId });

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

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}