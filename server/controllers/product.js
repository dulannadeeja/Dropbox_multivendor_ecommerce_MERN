const { validationResult } = require('express-validator');
const User = require('../models/user');
const Product = require('../models/product');
const Shop = require('../models/shop');
const fs = require('fs');
const path = require('path');



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

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    console.log(filePath);
    fs.unlink(filePath, err => console.log(err));
}