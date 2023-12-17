const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');

const feedController = require('../controllers/auth');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

// PUT /auth/signup
router.put('/signup', [
    body('firstName').trim().not().isEmpty().withMessage('First name is required.'),
    body('lastName').trim().not().isEmpty().withMessage('Last name is required.'),
    body('email').isEmail().withMessage('Please enter a valid email.')
        .normalizeEmail()
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email address already exists!');
                    }
                })
        }),
    body('password').trim().isLength({ min: 6 }),
    body('confirmPassword').trim().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must match!');
        }
        return true;
    })
], feedController.signup);

// POST /auth/login
router.post('/login', feedController.login);

// POST /auth/account-activation
router.post('/account-activation', feedController.accountActivation);

// POST /auth/verfication
router.post('/verification', feedController.verificationEmailSender);

// POST /auth/password-reset
router.post('/password-reset', feedController.passwordReset);

// POST /auth/set-password
router.post('/set-password', [
    body('token').trim().not().isEmpty().withMessage('Token is required.'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password should be at least 6 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password should include at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password should include at least one lowercase letter')
        .matches(/\d/)
        .withMessage('Password should include at least one number')
        .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
                throw new Error('Passwords must match!');
            }
            return true;
        }),
    body('confirmPassword').trim(),
], feedController.setPassword);

// GET /auth/load-user
router.get('/load-user', isAuth, feedController.loadUser);

// GET /auth/logout
router.get('/logout', isAuth, feedController.logout);

module.exports = router;