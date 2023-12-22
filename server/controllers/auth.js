const { validationResult } = require('express-validator');
const User = require('../models/user');
const Shop = require('../models/shop');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/authMailSender.js');
const { type } = require('os');

module.exports.signup = async (req, res, next) => {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    let updatedImagePath;

    if (req.file) {
        const imagePath = req.file.path;
        updatedImagePath = imagePath.replace(/\\/g, '/');
    }

    const validationErrors = validationResult(req);

    try {
        if (!validationErrors.isEmpty()) {

            if (req.file) {
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

        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            avatar: updatedImagePath,
            isActivated: false,
            isSeller: false,
            isAdmin: false,
            shop: null,
            addresses: []
        });

        if (!user) {
            const error = new Error('Could not create user.');
            error.statusCode = 500;
            throw error;
        }

        // redirect user to verify email page
        res.status(201).json({
            message: 'User created successfully!',
            userId: user._id.toString()
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

module.exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        let user = await User.findOne({ email: email });

        if (!user) {
            const error = new Error("There was a problem logging in. Check your email and password or create an account.");
            error.statusCode = 401;
            throw error;
        }

        if (!user.isActivated) {
            const error = new Error('This account is not activated. Please check your email and activate your account.');
            error.statusCode = 401;
            error.data = { userId: user._id.toString() };
            throw error;
        }

        const isMatchPasswords = await bcrypt.compare(password, user.password);

        if (!isMatchPasswords) {
            const error = new Error('There was a problem logging in. Check your email and password or create an account.');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({
            email: user.email,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,
            userId: user._id.toString()
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        const cookieExpiresIn = new Date(Date.now() + 360000)

        // Options for cookies
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Set to expire 90 days from now
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV === 'production',
        };

        const userObj = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            isActivated: user.isActivated,
            isSeller: user.isSeller,
            isAdmin: user.isAdmin,
            shop: user.shop,
            addresses: user.addresses,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: token
        };

        res.status(200).cookie("token", token, options).json({
            message: 'Login successful.',
            user: userObj,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


module.exports.accountActivation = async (req, res, next) => {
    const token = req.body.token;
    const role = req.body.role;
    let userOrShop;

    try {
        if (!token) {
            const error = new Error('activation Token not found. Please try again.');
            error.statusCode = 401;
            throw error;
        }

        if (!role) {
            const error = new Error('role not found. Please try again.');
            error.statusCode = 401;
            throw error;
        }

        const decodedToken = await jwt.verify(token, process.env.ACTIVATION_SECRET);

        if (!decodedToken) {
            const error = new Error('Token is invalid. Please try again.');
            error.statusCode = 401;
            throw error;
        }

        const id = decodedToken.userId;

        if (role === 'shop') {
            const shop = await Shop.findById(id);
            userOrShop = shop;
        } else if (role === 'user') {
            const user = await User.findById(id);
            userOrShop = user;
        }

        if (!userOrShop) {
            const error = new Error('Could not activate, data not found.');
            error.statusCode = 500;
            throw error;
        }

        if (userOrShop.isActivated) {
            const error = new Error('This account is already activated.');
            error.statusCode = 401;
            throw error;
        }

        userOrShop.isActivated = true;

        const result = await userOrShop.save();

        if (!result) {
            const error = new Error('Could not activate account.');
            error.statusCode = 500;
            throw error;
        }

        res.status(200).json({
            message: 'User activated.',
            userId: id
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

module.exports.verificationEmailSender = async (req, res, next) => {
    const id = req.body.id;
    const role = req.body.role;

    try {
        if (!id) {
            const error = new Error('id not found in request. Please try again.');
            error.statusCode = 401;
            throw error;
        }

        if (!role) {
            const error = new Error('role not found in request. Please try again.');
            error.statusCode = 401;
            throw error;
        }

        let userOrShop;

        if (role === 'shop') {
            const shop = await Shop.findById(id);
            userOrShop = shop;
        } else if (role === 'user') {
            const user = await User.findById(id);
            userOrShop = user;
        } else {
            const error = new Error('Invalid role. Please try again.');
            error.statusCode = 401;
            throw error;
        }



        if (!userOrShop) {
            const error = new Error('Invalid id. System could not find data.');
            error.statusCode = 401;
            throw error;
        }

        if (userOrShop.isActivated) {
            const error = new Error('This account is already activated.');
            error.statusCode = 401;
            throw error;
        }

        // Generate verification token
        const verificationToken = jwt.sign({
            email: userOrShop.email,
            userId: userOrShop._id.toString()
        }, process.env.ACTIVATION_SECRET, { expiresIn: process.env.ACTIVATION_EXPIRES_IN });

        const activationUrl = `${process.env.CLIENT_URL}/activate/${role}/${verificationToken}`;

        // Send verification email
        const error = await sendVerificationEmail(userOrShop.name, userOrShop.email, activationUrl);

        if (error) {
            const error = new Error('Could not send verification email.');
            error.statusCode = 500;
            throw error;
        }

        // Send the response here, after successful email sending
        res.status(200).json({
            message: 'Verification email sent.',
            userId: id
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

module.exports.passwordReset = async (req, res, next) => {
    const email = req.body.email;

    try {
        if (!email) {
            const error = new Error('Email not found. Please try again.');
            error.statusCode = 401;
            throw error;
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }

        // Generate password reset token
        const passwordResetToken = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        }, process.env.PASSWORD_RESET_SECRET, { expiresIn: process.env.PASSWORD_RESET_EXPIRES_IN });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`;

        // Send password reset email
        const info = await sendPasswordResetEmail(user.email, resetUrl);

        if (info) {
            const error = new Error('Could not send password reset email.');
            error.statusCode = 500;
            throw error;
        }

        // Send the response here, after successful email sending
        res.status(200).json({
            message: 'Password reset email sent.',
            userId: user._id.toString()
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports.setPassword = async (req, res, next) => {
    const token = req.body.token;
    const password = req.body.password;

    const validationErrors = validationResult(req);

    try {
        if (!validationErrors.isEmpty()) {
            const error = new Error(validationErrors.array()[0].msg);
            error.statusCode = 422;
            error.data = validationErrors.array();
            throw error;
        }

        let decodedToken;

        try {
            decodedToken = jwt.verify(token, process.env.PASSWORD_RESET_SECRET);
        } catch (err) {
            const error = new Error('Token verification failed. Please try again.');
            error.statusCode = 500;
            throw error;
        }

        if (!decodedToken) {
            const error = new Error('Token is invalid. Please try again.');
            error.statusCode = 401;
            throw error;
        }

        const userId = decodedToken.userId;

        const hashedPassword = await bcrypt.hash(password, 12);

        if (!hashedPassword) {
            const error = new Error('Could not set password.');
            error.statusCode = 500;
            throw error;
        }

        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('A user with this id could not be found.');
            error.statusCode = 401;
            throw error;
        }

        user.password = hashedPassword;

        const result = await user.save();

        if (!result) {
            const error = new Error('Could not set password.');
            error.statusCode = 500;
            throw error;
        }

        res.status(200).json({
            message: 'Password reset successful.',
            userId: userId
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// load user profile
module.exports.loadUser = async (req, res, next) => {
    const userId = req.userId;

    console.log("user id from loaduser" + userId);

    try {
        if (!userId) {
            const error = new Error('User id not found.');
            error.statusCode = 401;
            throw error;
        }

        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        const userObj = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            isActivated: user.isActivated,
            isSeller: user.isSeller,
            isAdmin: user.isAdmin,
            shop: user.shop,
            addresses: user.addresses,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: req.token
        };

        res.status(200).json({
            message: 'User loaded.',
            user: userObj,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

// logout user's session
module.exports.logout = (req, res, next) => {

    const userId = req.userId;

    try {
        if (!userId) {
            const error = new Error('User id not found.');
            error.statusCode = 401;
            throw error;
        }

        res.status(200).clearCookie("token").json({
            message: 'Logout successful.'
        });
    } catch (err) {
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
