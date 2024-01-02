const { validationResult } = require('express-validator');
const User = require('../models/user');
const Product = require('../models/product');
const Shop = require('../models/shop');
const fs = require('fs');
const path = require('path');
const { getRatingsAddedProducts, getProductRatingByReviews } = require('../utils/ratingCalculator');
const mongoose = require('mongoose');
const SORT_OPTIONS = require('../constants/sortOptions')
const clearImage = require('../utils/imageCleaner');



module.exports.create = async (req, res, next) => {

    console.log(req.body);
    console.log(req.files);

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
        if (images) {
            images.forEach(image => {
                const imagePath = image.path;
                const updatedImagePath = imagePath.replace(/\\/g, '/');
                updatedImagePaths.push(updatedImagePath);
            });
        }



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

module.exports.getAllProducts = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchTerm = req.query.search || null;
    const sort = req.query.sort || 'Random';
    const category = req.query.category || null;
    const price = req.query.price || '';
    const rating = req.query.rating || 0;

    try {

        // get total count of products
        const totalProducts = await Product.find().countDocuments();
        const startingProductIndex = (page * limit) - limit + 1;

        const lastPage = Math.ceil(totalProducts / limit);

        let products = [];



        if (category && !searchTerm) {
            products = await Product.find({ category: category }).populate('shop', 'name shopAvatar').limit(limit).skip((page - 1) * limit);
        } else if (searchTerm && category) {
            const regex = new RegExp(searchTerm, 'i');
            products = await Product.find({ name: { $regex: regex }, category: category }).populate('shop', 'name shopAvatar').limit(limit).skip((page - 1) * limit);
        } else if (!category && searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            products = await Product.find({ name: { $regex: regex } }).populate('shop', 'name shopAvatar').limit(limit).skip((page - 1) * limit);
        } else if (!category && !searchTerm) {
            products = await Product.find().populate('shop', 'name shopAvatar').limit(limit).skip((page - 1) * limit);
        }



        // sort products
        if (sort === 'Random') {
            products = products.sort(() => Math.random() - 0.5);
        } else if (sort === SORT_OPTIONS.PRICE_LOW_TO_HIGH) {
            products = products.sort((a, b) => a.discountPrice - b.discountPrice);
        } else if (sort === SORT_OPTIONS.PRICE_HIGH_TO_LOW) {
            products = products.sort((a, b) => b.discountPrice - a.discountPrice);
        } else if (sort === SORT_OPTIONS.NEW_ARRIVALS) {
            products = products.sort((a, b) => b.createdAt - a.createdAt);
        } else if (sort === SORT_OPTIONS.BEST_SELLING) {
            products = products.sort((a, b) => b.sold_out - a.sold_out);
        } else if (sort === SORT_OPTIONS.TOP_RATED) {
            products = products.sort((a, b) => b.rating - a.rating);
        }

        // filter products by price
        if (price === '0-25') {
            products = products.filter(product => product.discountPrice >= 0 && product.discountPrice <= 25);
        } else if (price === '25-50') {
            products = products.filter(product => product.discountPrice >= 25 && product.discountPrice <= 50);
        } else if (price === '50-100') {
            products = products.filter(product => product.discountPrice >= 50 && product.discountPrice <= 100);
        } else if (price === '100-200') {
            products = products.filter(product => product.discountPrice >= 100 && product.discountPrice <= 200);
        } else if (price === '200-500') {
            products = products.filter(product => product.discountPrice >= 200 && product.discountPrice <= 500);
        } else if (price === '500-1000') {
            products = products.filter(product => product.discountPrice >= 500 && product.discountPrice <= 1000);
        } else if (price === '1000-2000') {
            products = products.filter(product => product.discountPrice >= 1000 && product.discountPrice <= 2000);
        } else if (price === '2000+') {
            products = products.filter(product => product.discountPrice >= 2000);
        }

        // filter products by rating
        if (rating === '4+') {
            products = products.filter(product => product.rating >= 4);
        } else if (rating === '3+') {
            products = products.filter(product => product.rating >= 3);
        } else if (rating === '2+') {
            products = products.filter(product => product.rating >= 2);
        } else if (rating === '1+') {
            products = products.filter(product => product.rating >= 1);
        }

        if (!products) {
            const error = new Error('Could not find products.');
            error.statusCode = 500;
            throw error;
        }

        const endProductIndex = products.length + startingProductIndex - 1;

        res.status(200).json({
            message: 'Products fetched successfully.',
            products: products,
            totalProducts: totalProducts,
            currentPage: page,
            lastPage: lastPage,
            startingProductIndex: startingProductIndex,
            endProductIndex: endProductIndex
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

module.exports.getBestSellingProducts = async (req, res, next) => {
    try {
        let products = await Product.find().populate('shop', 'name shopAvatar').sort({ 'sold': -1 }).limit(10);

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
        const products = await Product.find().populate('shop', 'name shopAvatar')

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

module.exports.getProductById = async (req, res, next) => {
    const productId = req.params.productId;

    try {

        // get object Id from product id
        const productObjectId = new mongoose.Types.ObjectId(productId);
        const product = await Product.findById(productObjectId)
            .populate('shop', 'name shopAvatar').populate('seller', 'name avatar')
            .populate('reviews.user', 'name avatar createdAt rating noOfProducts');

        if (!product) {
            const error = new Error('Could not find product.');
            error.statusCode = 500;
            throw error;
        }

        res.status(200).json({
            message: 'Product fetched successfully.',
            product: product
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

module.exports.getSuggestedProducts = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            const error = new Error('Could not find product.');
            error.statusCode = 500;
            throw error;
        }

        const products = await Product.find({ category: product.category }).populate('shop', 'name shopAvatar').limit(10);

        if (!products) {
            const error = new Error('Could not find products.');
            error.statusCode = 500;
            throw error;
        }


        res.status(200).json({
            message: 'Suggested products fetched successfully.',
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

module.exports.createReview = async (req, res, next) => {
    const productId = req.body.productId;
    const userId = req.userId;
    const rating = req.body.rating;
    const comment = req.body.comment;

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

        // check if user already reviewed this product
        const alreadyReviewed = product.reviews.find(review => review.user.toString() === userId.toString());

        if (!alreadyReviewed) {
            const review = {
                user: userId,
                rating: rating,
                comment: comment,
                createdAt: new Date()
            }

            product.reviews.push(review);

            // calculate rating by reviews
            product.rating = getProductRatingByReviews(product.reviews);

            await product.save();

            res.status(201).json({
                message: 'Review added successfully.',
                product: product
            });
        }
        else {
            // update review
            alreadyReviewed.rating = rating;
            alreadyReviewed.comment = comment;
            alreadyReviewed.createdAt = new Date();

            // calculate rating by reviews
            product.rating = getProductRatingByReviews(product.reviews);

            await product.save();

            res.status(201).json({
                message: 'Review updated successfully.',
                product: product
            });
        }



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