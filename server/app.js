const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

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
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL); // allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // allow these methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // allow these headers
    res.setHeader('Access-Control-Allow-Credentials', true); // allow credentials
    // allow credentials
    next();
});

// serve static files
app.use(express.static(path.join(__dirname, '/client/build')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

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
const order = require('./routes/order');

// middleware for handling feed routes
app.use('/auth', authRoutes);
app.use('/shop', shopRoutes);
app.use('/seller', sellerRoutes);
app.use('/product', productRoutes);
app.use('/event', eventRoutes);
app.use('/user', userRoutes);
app.use('/payment', paymentRoutes);
app.use('/coupon', Coupon);
app.use('/order', order);

// error handling middleware
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500; // default to 500
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

const PORT = process.env.SERVER_PORT || 8080;

const startServer = async () => {

    return new Promise((resolve, reject) => {
        const server = app.listen(11634, err => {
            if (err) {
                reject(err);
                return;
            }
            const port = server.address().port;
            console.log(`Server is running on port ${port}`);
            resolve(server);
        });
    });
};

const closeServer = server => {
    return new Promise((resolve, reject) => {
        if (!server) {
            reject(new Error('No server to close.'));
            return;
        }
        server.close(err => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Server closed.');
            resolve();
        });
    });
};

// connect to mongodb and start server
mongoose.connect(uri)
    .then(() => startServer(PORT))
    .then(server => {
        console.log('Connected to MongoDB...');
        let onlineUsers = [];

        // if user is already online, remove the previous socketId
        const removeUser = socketId => {
            onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
        };

        // add new user to onlineUsers array
        const addNewUser = (userId, socketId) => {
            !onlineUsers.some(user => user.userId === userId) &&
                onlineUsers.push({ userId, socketId });
        };

        const getUser = userId => {
            return onlineUsers.find(user => user.userId === userId);
        }

        const io = require('./socket').init(server);
        io.on('connection', socket => {
            console.log('Client connected...');

            // take userId and socketId from user
            socket.on('newUser', userId => {
                addNewUser(userId, socket.id);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected...');
                removeUser(socket.id);
            });


        });
    })
    .catch(err => console.log(err));

// export App for testing
module.exports = {
    app,
    closeServer,
    startServer
};
