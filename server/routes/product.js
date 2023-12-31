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

// DELETE /product/delete/:productId
router.delete('/delete/:productId', isAuth, productController.delete);

// GET /product/best-Deals
router.get('/best-selling', productController.getBestSellingProducts);

// GET /product/featured
router.get('/featured', productController.getFeaturedProducts);

// POST /product/review
router.post('/review', isAuth, [
    body('productId').trim().not().isEmpty().withMessage('Product id is required.'),
    body('rating').trim().not().isEmpty().withMessage('Rating is required.'),
    body('comment').trim()
], productController.createReview);

// GET /product/all
router.get('/all', productController.getAllProducts);

// GET /product/:productId
router.get('/:productId', productController.getProductById);

// GET /product/suggestions/:productId
router.get('/suggestions/:productId', productController.getSuggestedProducts);



module.exports = router;