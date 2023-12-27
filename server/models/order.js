const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Define your order schema fields here
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
    }],
    cartTotal: {
        type: Number,
        required: true
    },
    couponDiscount: {
        type: Number,
        required: true
    },
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
    },
    isCouponApplied: {
        type: Boolean,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        required: true
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
