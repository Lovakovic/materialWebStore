const express = require('express');
const productsControllers = require('../controllers/products.controller')
const verifyJwt = require('../middlewares/verifyJwt.middleware');
const router = express.Router();

router.get('', productsControllers.getAllProducts);
router.get('/category/:category', productsControllers.getProductsByCategory);
router.get('/categories', productsControllers.getCategories);

router.post('/new', verifyJwt, productsControllers.addProduct);
router.put('', verifyJwt, productsControllers.updateProduct);
router.delete('/:id', verifyJwt, productsControllers.deleteProduct);

module.exports = router;
