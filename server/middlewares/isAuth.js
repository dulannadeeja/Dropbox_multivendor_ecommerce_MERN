const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        const error = new Error('No authenticated.');
        error.statusCode = 401;
        next(error);
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('No authenticated.');
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    next();
};