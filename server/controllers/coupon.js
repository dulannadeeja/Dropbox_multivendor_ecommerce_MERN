const Shop = require('../models/shop');
const Product = require('../models/product');
const Coupon = require('../models/coupon');
const User = require('../models/user');
const { validationResult } = require('express-validator');


module.exports.createCoupon = async (req, res, next) => {

    // this
    // should be changed to get the shopId from the user
    const userId = req.userId;
    const shopId = req.body.shopId;


    const { code, type, discountAmount, minOrderAmount, expirationDate, startDate, categories } = req.body;

    try {


        // validate request body
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        // check is the user is the owner of the shop
        const owner = await User.findOne({ shop: shopId, _id: userId })
        if (!owner) {
            const error = new Error('You are not authorized to create a coupon for this shop');
            error.statusCode = 403;
            throw error;
        }

        // get shop
        const shop = await Shop.findById(shopId);

        // Get list of applicable products
        const productsList = await Product.find({ shop: shopId, category: { $in: categories } });


        // map products to get only the ids
        const products = productsList.map(product => product._id);

        // create coupon

        const coupon = new Coupon({
            shop,
            code,
            type,
            discountAmount,
            minOrderAmount,
            expirationDate,
            startDate,
            products: productsList
        });


        // save coupon
        await coupon.save();

        // send response
        res.status(201).json({
            success: true,
            coupon,
        });
    }
    catch (error) {
        next(error);
    }
}


module.exports.getAllCoupons = async (req, res, next) => {
    const userId = req.userId;
    const shopId = req.params.shopId;

    // check is the user is the owner of the shop
    try {
        const owner = await User.findOne({ shop: shopId, _id: userId })
        if (!owner) {
            const error = new Error('You are not authorized to get coupons for this shop');
            error.statusCode = 403;
            throw error;
        }

        // get coupons
        const coupons = await Coupon.find({ shop: shopId });

        // check if there are coupons
        if (!coupons) {
            const error = new Error('No coupons found');
            error.statusCode = 404;
            throw error;
        }

        // send response
        res.status(200).json({
            success: true,
            coupons
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        if (!error.message) {
            error.message = 'Internal server error';
        }
        next(error);
    }

}

module.exports.deleteCoupon = async (req, res, next) => {
    const userId = req.userId;
    const shopId = req.body.shopId;
    const couponId = req.params.couponId;



    // check is the user is the owner of the shop
    try {
        const owner = await User.findOne({ shop: shopId, _id: userId })
        if (!owner) {
            const error = new Error('You are not authorized to delete coupons for this shop');
            error.statusCode = 403;
            throw error;
        }

        // get coupon
        const coupon = await Coupon.findById(couponId);

        // check if there are coupons
        if (!coupon) {
            const error = new Error('No coupon found');
            error.statusCode = 404;
            throw error;
        }

        // delete coupon
        await Coupon.findByIdAndDelete(couponId);

        // send response
        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        if (!error.message) {
            error.message = 'Internal server error';
        }
        next(error);
    }
}


module.exports.applyCoupon = async (req, res, next) => {
    const userId = req.userId;
    const cartItems = req.body.cartItems;
    const couponCode = req.params.couponCode;


    try {

        // if cart is empty
        if (!cartItems.length) {
            const error = new Error('Cart is empty');
            error.statusCode = 404;
            throw error;
        }


        // get all the products in the cart
        const products = await Product.find({ _id: { $in: cartItems.map(item => item._id) } });

        if (!products) {
            const error = new Error('No products found');
            error.statusCode = 404;
            throw error;
        }

        // get quantity of each product in the cart and add it to the product object
        products.forEach(product => {
            const cartItem = cartItems.find(item => item._id === product._id.toString());
            product.quantity = cartItem.quantity;
        });

        // get the coupon
        const coupon = await Coupon.findOne({ code: couponCode });

        // check if the coupon exists
        if (!coupon) {
            const error = new Error('Coupon does not exist');
            error.statusCode = 404;
            throw error;
        }

        // check if the coupon is valid
        const today = new Date();

        // check if the coupon start date is valid
        if (today <= coupon.startDate) {
            const error = new Error('Coupon is not valid yet');
            error.statusCode = 403;
            throw error;
        }

        // check if the coupon is expired
        if (today > coupon.expirationDate) {
            const error = new Error('Coupon is expired');
            error.statusCode = 403;
            throw error;
        }

        // get all the products that are applicable for the coupon
        const applicableProducts = products.filter(product => coupon.products.includes(product._id.toString()));



        if (!applicableProducts.length) {
            const error = new Error('No applicable products found');
            error.statusCode = 404;
            throw error;
        }

        // calculate total price of applicable products
        const totalPrice = applicableProducts.reduce((total, product) => total + (product.discountPrice * product.quantity), 0);

        // check if the coupon is applicable
        if (totalPrice < coupon.minOrderAmount) {
            const error = new Error('Coupon is not applicable for this order amount, minimum order amount is ' + coupon.minOrderAmount + " and your order amount is " + totalPrice);
            error.statusCode = 403;
            throw error;
        }



        // calculate discount
        let discount;
        if (coupon.type === 'percentage') {
            discount = totalPrice * coupon.discountAmount / 100;
        }
        else {
            discount = coupon.discountAmount;
        }

        // cap the discout if max discount is set
        // if (coupon.maxDiscountAmount) {
        //     discount = Math.min(discount, coupon.maxDiscountAmount);
        // }

        // send response
        res.status(200).json({
            success: true,
            discount,
            coupon: coupon.code
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        if (!error.message) {
            error.message = 'Internal server error';
        }
        next(error);
    }
}