const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user.js');
const isAuth = require('../middlewares/isAuth');

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

// GET /user/get-addresses
router.get('/get-addresses', isAuth, userController.getAddresses);

// DELETE /user/delete-address
router.delete('/delete-address', isAuth, userController.deleteAddress);


module.exports = router;