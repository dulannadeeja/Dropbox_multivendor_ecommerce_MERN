const mongoose = require('mongoose');

// Define the schema for the event
const eventSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
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
    categories: {
        type: [String],
        required: true,
        trim: true,
        message: 'Categories are required and must be an array.',
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
    minPurchaseAmount: {
        type: Number,
        required: true,
        min: 0,
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
    visibility: {
        type: String,
        required: true,
        trim: true,
    },
});

// Create the Mongoose model for the event
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
