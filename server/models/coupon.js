const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    },
    discountAmount: {
        type: Number,
        required: true,
    },
    minOrderAmount: {
        type: Number,
        default: 0,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }]
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;

