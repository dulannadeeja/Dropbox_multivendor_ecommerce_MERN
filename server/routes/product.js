const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const productController = require('../controllers/product.js');
const isAuth = require('../middlewares/isAuth');
const upload = require('../multer');

const router = express.Router();

// PUT /product/create
router.put('/create', upload.array('images', 5), [
    body('name').trim().not().isEmpty().withMessage('Product name is required.'),
    body('description').trim().not().isEmpty().withMessage('Product description is required.'),
    body('category').trim().not().isEmpty().withMessage('Product category is required.'),
    body('originalPrice').trim().not().isEmpty().withMessage('Product price is required.'),
    body('discountPrice').trim().not().isEmpty().withMessage('Product discount price is required.'),
    body('stock').trim().not().isEmpty().withMessage('Product quantity is required.'),
    body('tags').trim().not().isEmpty().withMessage('Product tags is required.')
], isAuth, productController.create);

module.exports = router;