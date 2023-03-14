const express = require('express');
const cartController = require('../controllers/cart.controller');
const verifyJwt = require('../middlewares/verifyJwt.middleware');
const router = express.Router();

// Protected with JWT
router.get('', verifyJwt, cartController.getCart);
router.delete('/:productId?', verifyJwt, cartController.deleteCart);

module.exports = router;
