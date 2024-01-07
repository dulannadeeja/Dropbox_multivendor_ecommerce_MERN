const Shop = require('../models/shop');
const Product = require('../models/product');
const Order = require('../models/order');
const STATUS = require('../constants/status');


module.exports.getShop = async (req, res, next) => {

    let shopId = req.shopId;

    try {

        const shop = await Shop.findOne({ _id: shopId });

        if (!shop) {
            const error = new Error('Could not find shop.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Shop fetched.',
            shop: shop
        });

    } catch (err) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


module.exports.getProducts = async (req, res, next) => {

    const shopId = req.params.shopId;

    try {

        const shop = await Shop.findById(shopId);

        if (!shop) {
            const error = new Error('Could not find shop.');
            error.statusCode = 404;
            throw error;
        }

        const products = await Product.find({ shop: shopId });

        if (!products) {
            const error = new Error('Could not find products.');
            error.statusCode = 404;
            throw error;
        }

        products.forEach(product => {
            product.ratings = calcProductRatings(product.reviews);
        });

        products.forEach(product => {
            product.images.forEach(image => {
                if (image.isDefault) {
                    product.defaultImage = image;
                }
            });
        });

        res.status(200).json({
            message: 'Products fetched.',
            products: products
        });

    } catch (err) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

module.exports.getShopInfo = async (req, res, next) => {
    const shopId = req.params.shopId;

    try {
        const shop = await Shop.findById(shopId);

        if (!shop) {
            const error = new Error('Could not find shop.');
            error.statusCode = 404;
            throw error;
        }

        let ratings = 0;

        // Get shop ratings
        const products = await Product.find({ shop: shopId });

        if (products) {
            ratings = calcShopTotalRatings(products);
        }

        // ShopInfo Object
        const shopInfo = {
            name: shop.name,
            country: shop.country,
            state: shop.state,
            city: shop.city,
            zip: shop.zip,
            street: shop.street,
            apartment: shop.apartment,
            contactName: shop.contactName,
            contactPhone: shop.contactPhone,
            contactEmail: shop.contactEmail,
            createdAt: shop.createdAt,
            ratings: ratings,
            shopAvatar: shop.shopAvatar,
            shopBanner: shop.shopBanner,
            totalProducts: products.length,
            description: shop.description
        };

        res.status(200).json({
            message: 'Shop fetched.',
            shop: shopInfo
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

module.exports.getReviews = async (req, res, next) => {
    const shopId = req.params.shopId;

    try {
        const products = await Product.find({ shop: shopId }).populate('reviews.user');

        let allReviews = [];

        products.forEach(product => {
            product.reviews.forEach(review => {
                allReviews.push(review);
            });
        });

        res.status(200).json({
            message: 'Reviews fetched.',
            reviews: allReviews
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const calcShopTotalRatings = products => {
    let totalNumberOfReviews = 0;
    let sumOfAllRatings = 0;
    products.forEach(product => {
        if (product.reviews) {
            totalNumberOfReviews += product.reviews.length;
            product.reviews.forEach(review => {
                sumOfAllRatings += review.rating;
            });
        }
    });
    const shopRatings = totalNumberOfReviews === 0 ? 0 : sumOfAllRatings / totalNumberOfReviews;
    return shopRatings || 0;
}

const calcProductRatings = reviews => {
    let totalNumberOfReviews = 0;
    let sumOfAllRatings = 0;
    reviews.forEach(review => {
        totalNumberOfReviews++;
        sumOfAllRatings += review.rating;
    });
    const productRatings = totalNumberOfReviews === 0 ? 0 : sumOfAllRatings / totalNumberOfReviews;
    return productRatings || 0;
}

module.exports.getStatistics = async (req, res, next) => {
    const shopId = req.params.shopId;

    let pendingOrders = 0;
    let totalNumberOfOrders = 0;
    let totalNumberOfProducts = 0;
    let outOfStockProducts = 0;
    let totalRevenue = 0;

    try {

        const shop = await Shop.findById(shopId);

        if (!shop) {
            const error = new Error('Could not find shop.');
            error.statusCode = 404;
            throw error;
        }

        const products = await Product.find({ shop: shopId });

        if (!products) {
            const error = new Error('Could not find products.');
            error.statusCode = 404;
            throw error;
        }

        totalNumberOfProducts = products.length;

        // get out of stock products
        products.forEach(product => {
            if (product.quantity === 0) {
                outOfStockProducts++;
            }
        });

        const orders = await Order.find({ shop: shopId });

        totalNumberOfOrders = orders.length;

        // get pending orders
        orders.forEach(order => {
            if (order.orderStatus === STATUS.PENDING || order.orderStatus === STATUS.PROCESSING) {
                pendingOrders++;
            }
        });

        // get total revenue by adding all orders total prices
        orders.forEach(order => {
            totalRevenue += order.cartTotal - order.couponDiscount;
        });

        // calculate total revenue by deducting the service fee
        const serviceFee = totalRevenue * 0.1;
        totalRevenue -= serviceFee;

        // shop statistics object
        const shopStatistics = {
            totalNumberOfProducts: totalNumberOfProducts,
            outOfStockProducts: outOfStockProducts,
            totalRevenue: totalRevenue,
            totalNumberOfOrders: totalNumberOfOrders,
            pendingOrders: pendingOrders
        };

        res.status(200).json({
            message: 'Shop statistics fetched.',
            shopStatistics: shopStatistics
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}



