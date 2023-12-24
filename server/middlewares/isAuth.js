const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    let token = req.cookies.token;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    console.log(token);

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
        req.userId = decodedToken.userId;
        req.token = token;
        req.shopId = req.params.shopId;

        next();


    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    }

};