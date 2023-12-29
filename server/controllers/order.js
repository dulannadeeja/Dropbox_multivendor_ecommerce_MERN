const Order = require('../models/order');
const Product = require('../models/product');
const Address = require('../models/address');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const Coupon = require('../models/coupon');
const io = require('../socket');

const STATUS = {
    IDLE: 'IDLE',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    DELIVERED: 'DELIVERED',
    SHIPPED: 'SHIPPED',
    REFUNDED: 'REFUNDED',
}


module.exports.createOrder = async (req, res, next) => {
    const { cartTotal, isCouponApplied, coupon, couponDiscount, items, totalAmount, paymentMethod, houseNumber, street, city, state, zip, country, contactNumber, contactName, } = req.body;
    const userId = req.userId;

    // array of items from object
    if (!items) {
        const error = new Error('Items not found');
        error.statusCode = 404;
        throw error;
    }

    const itemsArray = JSON.parse(items);

    console.log('itemsArray', itemsArray);

    try {

        //check validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const productIds = itemsArray.map(item => item._id);

        const products = await Product.find({ _id: { $in: productIds } });

        if (!products) {
            const error = new Error('Products not found');
            error.statusCode = 404;
            throw error;
        }

        // add quantity to each product in products array
        const productsWithQuantity = products.map(product => {
            const item = itemsArray.find(item => item._id.toString() === product._id.toString());
            return { ...product._doc, quantity: item.quantity };
        }
        );

        // check if all products are in stock
        const productsOutOfStock = productsWithQuantity.filter(product => {
            console.log('product.quantity', product.quantity);
            console.log('product.stock', product.stock);
            return product.quantity > product.stock
        });

        if (productsOutOfStock.length > 0) {
            const error = new Error('Some products are out of stock');
            error.statusCode = 400;
            error.data = productsOutOfStock;
            throw error;
        }

        console.log('out of stock', productsOutOfStock);

        // reduce quantity of each product in products array
        products.forEach(product => {
            const item = itemsArray.find(item => item._id.toString() === product._id.toString());
            product.stock -= item.quantity;
        });

        // save products
        await Promise.all(products.map(product => product.save()));


        // group products by the seller
        const productsByShop = {};

        productsWithQuantity.forEach(product => {
            if (!productsByShop[product.shop.toString()]) {
                productsByShop[product.shop.toString()] = [];
            }
            productsByShop[product.shop.toString()].push(product);
        });

        const shippingAddress = new Address({
            houseNumber,
            street,
            city,
            state,
            zip,
            country,
            phone: contactNumber,
            contactName
        });

        const savedAddress = await shippingAddress.save();

        if (!savedAddress) {
            const error = new Error('Error in saving address');
            error.statusCode = 500;
            throw error;
        }


        // check if coupon is applied
        let couponDoc;

        if (isCouponApplied === true || isCouponApplied === 'true') {
            couponDoc = await Coupon.findOne({ code: coupon });

            if (!couponDoc) {
                const error = new Error('Coupon not found');
                error.statusCode = 404;
                throw error;
            }
        }

        // create orders for each seller
        for (const shop in productsByShop) {

            let thisIsCouponApplied = false;
            let thisCoupon = null;
            let thisCouponDiscount = 0;

            // check if the coupon is applied for the current shop

            console.log('shop', shop);
            console.log('couponDoc?.shop', couponDoc?.shop);

            if (couponDoc?.shop.toString() === shop.toString()) {
                thisIsCouponApplied = true;
                thisCoupon = couponDoc._id;
                thisCouponDiscount = couponDiscount;
            }

            // ready the products array of objects for the current shop
            const productsArray = productsByShop[shop].map(product => {
                return {
                    product: product._id,
                    quantity: product.quantity
                }
            }
            );

            // calculate the total for the current shop by adding the discountPrice of each product
            // if `isCouponApplied` is true, then deduct the couponDiscount from the total

            let thisShopTotal = productsByShop[shop].reduce((acc, product) => {
                return acc + product.discountPrice * product.quantity;
            }, 0);

            if (thisIsCouponApplied) {
                thisShopTotal -= thisCouponDiscount;
            }


            const newOrder = new Order({
                user: userId,
                shop: shop,
                products: productsArray,
                cartTotal: thisShopTotal,
                paymentMethod,
                orderStatus: STATUS.PENDING,
                shippingAddress: savedAddress._id,
                isCouponApplied: thisIsCouponApplied,
                coupon: thisCoupon,
                couponDiscount: thisCouponDiscount,
            });

            const savedOrder = await newOrder.save();

            if (!savedOrder) {
                const error = new Error('Error in saving order');
                error.statusCode = 500;
                throw error;
            }

            // send socket notification to the seller
            const io = require('../socket').getIO();

            //get receiverId from shop
            const user = await User.findOne({ shop: shop.toString() });

            const receiverId = user._id.toString();
            const messageId = savedOrder._id.toString();
            const message = 'You made a new sale of ' + savedOrder.cartTotal + ' from ' + savedOrder.products.length + ' products';


            console.log('receiverId', receiverId);
            console.log('messageId', messageId);
            console.log('message', message);

            console.log("order event emitted from server");
            io.emit('order', { receiverId, messageId, message });


        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully'
        });



        console.log(coupon);

    } catch (error) {

        console.log(error);

        if (!error.statusCode) {
            error.statusCode = 500;
        }

        if (error.statusCode === 500) {
            error.message = 'Internal server error';
        }

        next(error);
    }
}


module.exports.getAllOrdersByUserId = async (req, res, next) => {
    const userId = req.userId;

    try {

        const orders = await Order.find({ user: userId }).populate('user', 'firstName lastName email avatar').populate('products.product').populate('shippingAddress');

        if (!orders) {
            const error = new Error('Orders not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            orders
        });
    } catch (error) {

        console.log(error);

        if (!error.statusCode) {
            error.statusCode = 500;
        }

        if (error.statusCode === 500) {
            error.message = 'Internal server error';
        }

        next(error);
    }
}


module.exports.getAllOrdersByShopId = async (req, res, next) => {
    const userId = req.userId;

    try {

        const user = await User.findById(userId);

        const shopId = user.shop;

        const orders = await Order.find({ shop: shopId }).populate('user', 'firstName lastName email avatar').populate('products.product').populate('shippingAddress');

        if (!orders) {
            const error = new Error('Orders not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            orders
        });
    } catch (error) {

        console.log(error);

        if (!error.statusCode) {
            error.statusCode = 500;
        }

        if (error.statusCode === 500) {
            error.message = 'Internal server error';
        }

        next(error);
    }
}


module.exports.updateOrderStatus = async (req, res, next) => {
    const orderId = req.params.orderId;
    const orderStatus = req.body.orderStatus;

    try {

        const order = await Order.findById(orderId);

        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }

        order.orderStatus = orderStatus;

        const savedOrder = await order.save();

        if (!savedOrder) {
            const error = new Error('Error in saving order');
            error.statusCode = 500;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'Order status ' + orderStatus.toString().toLowerCase() + ' successfully',
            order: savedOrder
        });

    } catch (error) {

        console.log(error);

        if (!error.statusCode) {
            error.statusCode = 500;
        }

        if (error.statusCode === 500) {
            error.message = 'Internal server error';
        }

        next(error);
    }
}