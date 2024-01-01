const { validationResult } = require('express-validator');
const Shop = require('../models/shop');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const Product = require('../models/product');


module.exports.createShop = async (req, res, next) => {

    const name = req.body.name;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const address = req.body.address;
    const zipCode = req.body.zipCode;
    const password = req.body.password;
    const shopAvatar = req.file;

    let updatedImagePath;

    if (shopAvatar) {
        const imagePath = req.file.path;
        updatedImagePath = imagePath.replace(/\\/g, '/');
    }

    const validationErrors = validationResult(req);

    try {
        if (!validationErrors.isEmpty()) {

            if (shopAvatar) {
                clearImage(updatedImagePath);
            }

            const error = new Error(validationErrors.array()[0].msg);
            error.statusCode = 422;
            error.data = validationErrors.array();
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 12)


        if (!hashedPassword) {

            const error = new Error('Could not create user.');
            error.statusCode = 500;
            throw error;
        }

        const shop = await Shop.create({
            name: name,
            mobile: mobile,
            email: email,
            address: address,
            zipCode: zipCode,
            password: hashedPassword,
            shopAvatar: updatedImagePath
        });

        if (!shop) {
            const error = new Error('Could not create user.');
            error.statusCode = 500;
            throw error;
        }

        // redirect user to verify email page
        res.status(201).json({
            message: 'User created successfully!',
            shopId: shop._id.toString()
        });

    }
    catch (err) {
        if (req.file) {
            clearImage(updatedImagePath);
        }

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

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


const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}
