const { validationResult } = require('express-validator');
const Shop = require('../models/shop');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/authMailSender.js');

module.exports.createShop = async (req, res, next) => {

    console.log(req.file);

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


const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}
