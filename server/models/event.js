const mongoose = require('mongoose');

// Define the schema for the event
const eventSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 95,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 20,
        maxlength: 1000,
    },
    eventType: {
        type: String,
        required: true,
        trim: true,
    },
    discountAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                // Custom validation for end date after start date
                return value > this.startDate;
            },
            message: 'End date must be after start date',
        },
    },
    couponCode: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20,
    },
    banner: {
        type: String,
        required: true,
        trim: true,
    },
    termsAndConditions: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
});

// Create the Mongoose model for the event
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
