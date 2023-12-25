const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const upload = require('./multer');

// configure dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({
        path: path.join(__dirname, 'config', '.env')
    });
}

// handling uncaught exceptions
process.on('uncaughtException', err => {
    console.log('Uncaught Exception! Shutting down...');
    console.log(err);
    process.exit(1);
});

// handling unhandled rejections
process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection! Shutting down...');
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});


// import multer and configure it
// const multer = require('multer');
// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/images'); // null for no error
//     },
//     filename: (req, file, cb) => {
//         cb(null, uuidv4() + '-' + file.originalname); // null for no error
//     }
// });

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true); // accept file
    } else {
        cb(null, false); // reject file
    }
};

// import mongoose and configure it
const mongoose = require('mongoose');
const username = encodeURIComponent(process.env.MONGO_USERNAME);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const cluster = process.env.MONGO_CLUSTER;
let uri = `mongodb+srv://${username}:${password}@${cluster}/node_project?retryWrites=true&w=majority`;


const app = express();

// middleware for enabling cross origin resource sharing (CORS)
// and setting headers for incoming requests
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // allow these methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // allow these headers
    res.setHeader('Access-Control-Allow-Credentials', true); // allow credentials
    // allow credentials
    next();
});

// serve static files
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

// multer middleware for parsing multipart/form-data
// app.use(upload.array('images', 5));

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());


// import routes
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const sellerRoutes = require('./routes/seller');
const productRoutes = require('./routes/product');
const eventRoutes = require('./routes/event');
const userRoutes = require('./routes/user');
const paymentRoutes = require('./routes/payment');
const Coupon = require('./routes/coupon');

// middleware for handling feed routes
app.use('/auth', authRoutes);
app.use('/shop', shopRoutes);
app.use('/seller', sellerRoutes);
app.use('/product', productRoutes);
app.use('/event', eventRoutes);
app.use('/user', userRoutes);
app.use('/payment', paymentRoutes);
app.use('/coupon', Coupon);

// error handling middleware
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500; // default to 500
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

let server = null;

// connect to mongodb and start server
mongoose.connect(uri)
    .then(result => {
        console.log('Connected to MongoDB...');
        server = app.listen(process.env.SERVER_PORT, () => {
            console.log('Server is running on port ' + process.env.SERVER_PORT + '...');
        })
    })
    .catch(err => console.log(err));