const { validationResult } = require('express-validator');
const User = require('../models/user');
const Address = require('../models/address');

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
        });

        if (!address) {
            const error = new Error('Could not create address.');
            error.statusCode = 500;
            throw error;
        }

        user.addresses.push(address._id);

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

        user.addresses.pull(addressId);

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