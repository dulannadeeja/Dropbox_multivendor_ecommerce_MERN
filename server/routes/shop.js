const express = require('express');
const { check } = require('express-validator');

const shopController = require('../controllers/shop');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

// GET /shop/products/:shopId
router.get('/products/:shopId', shopController.getProducts);

// GET /shop/:shopId
router.get('/:shopId', isAuth, shopController.getShop);

// GET /shop/get-shop-info/:shopId
router.get('/get-shop-info/:shopId', shopController.getShopInfo);

// GET /shop/reviews/:shopId
router.get('/reviews/:shopId', shopController.getReviews);

module.exports = router;