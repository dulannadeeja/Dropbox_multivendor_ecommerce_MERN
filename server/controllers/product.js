const { validationResult } = require('express-validator');
const User = require('../models/user');
const Product = require('../models/product');
const Shop = require('../models/shop');
const fs = require('fs');
const path = require('path');
const { getRatingByReviews, getRatingsAddedProducts } = require('../utils/ratingCalculator');



module.exports.create = async (req, res, next) => {

    // authenticated user only can reach this point
    const userId = req.userId;

    const name = req.body.name;
    const description = req.body.description;
    const category = req.body.category;
    const originalPrice = req.body.originalPrice;
    const discountPrice = req.body.discountPrice;
    const stock = req.body.stock;
    const tags = req.body.tags;
    const images = req.files

    let updatedImagePaths = [];
    const validationErrors = validationResult(req);

    try {
        if (!images) {
            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }

        images.forEach(image => {
            const imagePath = image.path;
            const updatedImagePath = imagePath.replace(/\\/g, '/');
            updatedImagePaths.push(updatedImagePath);
        });

        if (!validationErrors.isEmpty()) {

            if (updatedImagePaths) {
                updatedImagePaths.forEach(imagePath => {
                    clearImage(imagePath);
                });
            }

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

        const imagesObj = [];

        updatedImagePaths.forEach((imagePath, index) => {
            const imageObj = {
                url: imagePath,
                isDefault: index === 0 ? true : false
            }
            imagesObj.push(imageObj);
        });

        const product = await Product.create({
            name: name,
            description: description,
            category: category,
            tags: tags,
            originalPrice: originalPrice,
            discountPrice: discountPrice,
            stock: stock,
            images: imagesObj,
            shop: shop._id,
            seller: user._id
        });

        if (!product) {
            const error = new Error('Could not create product.');
            error.statusCode = 500;
            throw error;
        }

        res.status(201).json({
            message: 'Product created successfully.',
            product: product
        });

    }
    catch (err) {
        if (updatedImagePaths) {
            updatedImagePaths.forEach(imagePath => {
                clearImage(imagePath);
            });
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
    const productId = req.params.productId;
    const userId = req.userId;

    console.log(productId);
    console.log(userId);

    try {
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 500;
            throw error;
        }

        const product = await Product.findById(productId);

        if (!product) {
            const error = new Error('Could not find product.');
            error.statusCode = 500;
            throw error;
        }

        if (product.seller.toString() !== userId.toString()) {
            const error = new Error('Not authorized to delete this product.');
            error.statusCode = 401;
            throw error;
        }

        // delete images from server
        // product.images.forEach(image => {
        //     clearImage(image.url);
        // });

        await Product.findByIdAndDelete(productId);

        if (!product) {
            const error = new Error('Could not delete product.');
            error.statusCode = 500;
            throw error;
        }

        res.status(200).json({
            message: 'Product deleted successfully.'
        });

        console.log('Product deleted successfully.');

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

module.exports.getBestSellingProducts = async (req, res, next) => {
    try {
        let products = await Product.find().sort({ 'sold': -1 }).limit(10);

        if (!products) {
            const error = new Error('Could not find products.');
            error.statusCode = 500;
            throw error;
        }

        // calculate ratings by reviews
        products = getRatingsAddedProducts(products);

        res.status(200).json({
            message: 'Best selling products fetched successfully.',
            products: products
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

module.exports.getFeaturedProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        if (!products) {
            const error = new Error('Could not find products.');
            error.statusCode = 500;
            throw error;
        }
        const calculateFeaturedScore = (product) => {
            return product.rating * 0.5 + (new Date() - product.createdAt) * 0.1;
        };

        products.forEach(product => {
            product.featuredScore = calculateFeaturedScore(product);
        });

        let featuredProducts = products
            .sort((a, b) => b.featuredScore - a.featuredScore)
            .slice(0, 10);

        // calculate ratings by reviews
        featuredProducts = getRatingsAddedProducts(featuredProducts);

        res.status(200).json({
            message: 'Featured products fetched successfully.',
            products: featuredProducts
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
    console.log(filePath);
    fs.unlink(filePath, err => console.log(err));
}