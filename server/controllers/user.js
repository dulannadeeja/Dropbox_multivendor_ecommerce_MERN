const { validationResult } = require('express-validator');
const User = require('../models/user');
const Address = require('../models/address');
const { clearImage } = require('../utils/imageCleaner');
const bcrypt = require('bcrypt');
const user = require('../models/user');

module.exports.putAddress = async (req, res, next) => {
    const userId = req.userId;

    try {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
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

        const address = await Address.create({
            houseNumber: req.body.houseNumber,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            zip: req.body.zip,
            addressNickname: req.body.addressNickname,
            contactName: req.body.contactName,
            phone: req.body.contactNumber
        });

        if (!address) {
            const error = new Error('Could not create address.');
            error.statusCode = 500;
            throw error;
        }

        user.addresses.push(address._id);

        // if user has no default shipping address, set this address as default
        if (!user.defaultShippingAddress) {
            user.defaultShippingAddress = address._id;
        }

        await user.save();

        res.status(201).json({
            message: 'Address added successfully!',
            address: address
        });



    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports.getAddresses = async (req, res, next) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).populate('addresses');

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 500;
            throw error;
        }

        res.status(200).json({
            message: 'Addresses fetched successfully!',
            addresses: user.addresses
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


module.exports.setDefaultShippingAddress = async (req, res, next) => {
    const userId = req.userId;
    const addressId = req.body.addressId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 500;
            throw error;
        }

        const address = await Address.findById(addressId);

        if (!address) {
            const error = new Error('Could not find address.');
            error.statusCode = 500;
            throw error;
        }

        user.defaultShippingAddress = addressId;

        await user.save();

        res.status(200).json({
            message: 'Default shipping address updated successfully!',
            address: address
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


module.exports.deleteAddress = async (req, res, next) => {
    const userId = req.userId;
    const addressId = req.body.addressId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 500;
            throw error;
        }

        const address = await Address.findById(addressId);

        if (!address) {
            const error = new Error('Could not find address.');
            error.statusCode = 500;
            throw error;
        }

        await Address.findByIdAndDelete(addressId);

        // delete address from user's addresses array
        user.addresses = user.addresses.filter(address => address.toString() !== addressId.toString());

        await user.save();

        res.status(200).json({
            message: 'Address deleted successfully!',
            address: address
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports.editName = async (req, res, next) => {
    const userId = req.userId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    try {
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 500;
            throw error;
        }

        user.firstName = firstName;
        user.lastName = lastName;

        await user.save();

        res.status(201).json({
            message: 'Name updated successfully!',
            user: user
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports.editPhone = async (req, res, next) => {
    const userId = req.userId;
    const phone = req.body.phone;

    try {
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 500;
            throw error;
        }

        user.phone = phone;

        await user.save();

        res.status(201).json({
            message: 'Phone updated successfully!',
            user: user
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports.editEmail = async (req, res, next) => {
    const userId = req.userId;
    const email = req.body.email;

    try {
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 500;
            throw error;
        }

        user.email = email;

        await user.save();

        res.status(201).json({
            message: 'Email updated successfully!',
            user: user
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports.editAvatar = async (req, res, next) => {
    const userId = req.userId;
    const avatar = req.file

    try {

        if (!avatar) {
            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }

        const updatedImageUrl = avatar.path.replace("\\", "/");

        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 500;
            throw error;
        }

        user.avatar = updatedImageUrl;

        await user.save();

        res.status(201).json({
            message: 'Avatar updated successfully!',
            user: user
        });

    } catch (err) {

        // if multer throws an error (e.g. file type is not supported), delete the file from the server
        if (req.file) {
            clearImage(req.file.path);
        }

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports.editPassword = async (req, res, next) => {
    const userId = req.userId;
    const password = req.body.newPassword;
    const currentPassword = req.body.oldPassword;

    try {
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 500;
            throw error;
        }

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordCorrect) {
            const error = new Error('Incorrect password.');
            error.statusCode = 401;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user.password = hashedPassword;
        await user.save();

        res.status(201).json({
            message: 'Password updated successfully!',
            user: user
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}