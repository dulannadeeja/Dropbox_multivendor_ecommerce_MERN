const { validationResult } = require('express-validator');
const User = require('../models/user');
const Shop = require('../models/shop');
const Address = require('../models/address');

module.exports.signup = async (req, res, next) => {

    const userId = req.userId;

    console.log(userId);

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const houseNumber = req.body.houseNumber;
    const street = req.body.street;
    const zip = req.body.zip;
    const country = req.body.country;
    const state = req.body.state;
    const city = req.body.city;
    const phone = req.body.phone;
    const businessName = req.body.businessName;
    const businessCountry = req.body.businessCountry;
    const businessState = req.body.businessState;
    const businessCity = req.body.businessCity;
    const businessZip = req.body.businessZip;
    const businessStreet = req.body.businessStreet;
    const businessApartment = req.body.businessApartment;
    const contactName = req.body.contactName;
    const contactEmail = req.body.contactEmail;
    const contactPhone = req.body.contactPhone;

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

        const shop = await Shop.create(
            {
                name: businessName,
                country: businessCountry,
                state: businessState,
                city: businessCity,
                zip: businessZip,
                street: businessStreet,
                apartment: businessApartment,
                contactName: contactName,
                contactEmail: contactEmail,
                contactPhone: contactPhone
            }
        )

        console.log(shop);

        if (!shop) {
            const error = new Error('Could not create shop.');
            error.statusCode = 500;
            throw error;
        }

        const addressDoc = await Address.create(
            {
                houseNumber: houseNumber,
                street: street,
                zip: zip,
                country: country,
                state: state,
                city: city,
                phone: phone
            }
        );

        if (!addressDoc) {
            const error = new Error('Could not create address.');
            error.statusCode = 500;
            throw error;
        }

        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 500;
            throw error;
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.addresses = [addressDoc._id]
        user.phone = phone;
        user.isSeller = true;
        user.shop = shop._id;

        await user.save();

        if (!user) {
            const error = new Error('Could not update user.');
            error.statusCode = 500;
            throw error;
        }

        // redirect user to verify email page
        res.status(201).json({
            message: 'Seller and shop created successfully!',
            userId: user._id.toString(),
            shopId: shop._id.toString()
        });

    }
    catch (err) {
        if (req.file) {
            clearImage(updatedImagePath);
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