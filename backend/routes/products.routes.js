const express = require('express');
const productsControllers = require('../controllers/products.controller')
const router = express.Router();

// WARNING: There is ZERO SQLInjection protection here, use at your own risk

router.get('/', productsControllers.getAllProducts);
router.get('/category/:category', productsControllers.getProductsByCategory);
router.get('/categories', productsControllers.getCategories);

module.exports = router;
