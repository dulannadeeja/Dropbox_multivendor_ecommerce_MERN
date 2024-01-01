const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {

    let token = req.cookies.token;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    let decodedToken;

    try {
        if (!token) {
            const error = new Error('No authenticated. Please login.');
            error.statusCode = 401;
            throw error;
        }

        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            const error = new Error('No authenticated.');
            error.statusCode = 401;
            throw error;
        }

        // check if user exists
        if (!decodedToken.userId) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        // check if user exists in db
        const user = User.findById(decodedToken.userId);

        if (!user) {
            const error = new Error('User not found in the system.');
            error.statusCode = 404;
            throw error;
        }

        req.userId = decodedToken.userId;
        req.token = token;
        req.shopId = req.params.shopId;

        next();


    }
    catch (err) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    }

};