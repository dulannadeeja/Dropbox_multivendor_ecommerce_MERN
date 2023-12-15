const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/authMailSender.js');

module.exports.signup = async (req, res, next) => {

    console.log(req.file);

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

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
            email: email,
            password: hashedPassword,
            name: name,
            avatar: updatedImagePath
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

module.exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;

    User.findOne({ email: email })
        .then(user => {

            if (!user) {
                const error = new Error("There was a problem logging in. Check your email and password or create an account.");
                error.statusCode = 401;
                throw error;
            }

            loadedUser = user;

            if (!user.isActivated) {
                const error = new Error('This account is not activated. Please check your email and activate your account.');
                error.statusCode = 401;
                error.data = { userId: user._id.toString() };
                throw error;
            }

            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {

            if (!isEqual) {
                const error = new Error('There was a problem logging in. Check your email and password or create an account.');
                error.statusCode = 401;
                throw error;
            }

            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            // Options for cookies
            const options = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                sameSite: "none",
                secure: true,
            };

            res.status(200).cookie("token", token, options).json({
                message: 'Login successful.',
                token: token,
                userId: loadedUser._id.toString()
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};


module.exports.accountActivation = (req, res, next) => {
    const token = req.body.token;

    if (!token) {
        const error = new Error('activation Token not found. Please try again.');
        error.statusCode = 401;
        throw error;
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.ACTIVATION_SECRET);
    } catch (err) {
        const error = new Error('Token verification failed. Please try again.');
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('Token is invalid. Please try again.');
        error.statusCode = 401;
        throw error;
    }

    const userId = decodedToken.userId;

    User.findById(userId)
        .then(user => {

            if (!user) {
                const error = new Error('A user with this id could not be found.');
                error.statusCode = 401;
                throw error;
            }

            if (user.isActivated) {
                const error = new Error('This account is already activated.');
                error.statusCode = 401;
                throw error;
            }

            user.isActivated = true;

            return user.save();
        })
        .then(result => {

            if (!result) {
                const error = new Error('Could not activate user.');
                error.statusCode = 500;
                throw error;
            }

            res.status(200).json({
                message: 'User activated.',
                userId: userId
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

module.exports.verificationEmailSender = async (req, res, next) => {
    const userId = req.body.userId;

    try {
        if (!userId) {
            const error = new Error('User id not found. Please try again.');
            error.statusCode = 401;
            throw error;
        }

        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('A user with this id could not be found.');
            error.statusCode = 401;
            throw error;
        }

        if (user.isActivated) {
            const error = new Error('This account is already activated.');
            error.statusCode = 401;
            throw error;
        }

        // Generate verification token
        const verificationToken = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        }, process.env.ACTIVATION_SECRET, { expiresIn: process.env.ACTIVATION_EXPIRES_IN });

        const activationUrl = `${process.env.CLIENT_URL}/activate/${verificationToken}`;

        // Send verification email
        const error = await sendVerificationEmail(user.name, user.email, activationUrl);

        if (error) {
            const error = new Error('Could not send verification email.');
            error.statusCode = 500;
            throw error;
        }

        // Send the response here, after successful email sending
        res.status(200).json({
            message: 'Verification email sent.',
            userId: userId
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
module.exports.loadUser = (req, res, next) => {
    const userId = req.userId;

    console.log(userId);

    User.findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error('Could not find user.');
                error.statusCode = 404;
                throw error;
            }

            const userObj = {
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                isActivated: user.isActivated,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };

            res.status(200).json({
                message: 'User loaded.',
                user: userObj,
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    console.log(filePath);
    fs.unlink(filePath, err => console.log(err));
}
