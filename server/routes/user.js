const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user.js');
const isAuth = require('../middlewares/isAuth');
const upload = require('../multer');
const router = express.Router();

// PUT /user/add-address
router.put('/add-address', isAuth, [
    body('houseNumber').trim().not().isEmpty().withMessage('House number is required.'),
    body('street').trim().not().isEmpty().withMessage('Street is required.'),
    body('city').trim().isString().not().isEmpty().withMessage('City is required.'),
    body('state').trim().not().isEmpty().withMessage('State is required.'),
    body('country').trim().not().isEmpty().withMessage('Country is required.'),
    body('zip').trim().not().isEmpty().withMessage('Zip code is required.'),
    body('addressNickname').trim(),
], userController.putAddress);

// GET /user/addresses
router.get('/addresses', isAuth, userController.getAddresses);

// DELETE /user/delete-address
router.delete('/delete-address', isAuth, userController.deleteAddress);

// PUT /user/edit-name
router.put('/edit-name', isAuth, [
    body('firstName').trim().not().isEmpty().withMessage('First name is required.'),
    body('lastName').trim().not().isEmpty().withMessage('Last name is required.'),
], userController.editName);

// PUT /user/edit-email
router.put('/edit-email', isAuth, [
    body('email').trim().isEmail().withMessage('Please enter a valid email.'),
], userController.editEmail);

// PUT /user/edit-phone
router.put('/edit-phone', isAuth, [
    body('phone').trim().not().isEmpty().withMessage('Phone number is required.'),
], userController.editPhone);

// PUT /user/edit-avatar
router.put('/edit-avatar', upload.single('avatar'), isAuth, userController.editAvatar);

// PUT /user/edit-password
router.put('/edit-password', isAuth, [
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .matches(/[A-Z]/).withMessage('Password must include at least one uppercase letter.')
        .matches(/[a-z]/).withMessage('Password must include at least one lowercase letter.')
        .matches(/\d/).withMessage('Password must include at least one number.'),
    body('confirmPassword').trim().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must match.');
        }
        return true;
    })
], userController.editPassword);

// PUT /user/set-default-shipping-address
router.put('/edit-default-shipping-address', isAuth, userController.setDefaultShippingAddress);


module.exports = router;