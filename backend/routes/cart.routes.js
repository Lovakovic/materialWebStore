const express = require('express');
const cartController = require('../controllers/cart.controller');
const router = express.Router();

// Protected with JWT
router.get('', cartController.getCart);
router.post('', cartController.postCart);

module.exports = router;
