const express = require('express');
const cartController = require('../controllers/cart.controller');
const verifyJwt = require('../middlewares/verifyJwt.middleware');
const router = express.Router();

// Protected with JWT
router.get('', verifyJwt, cartController.getCart);
router.post('', verifyJwt, cartController.postCart);
router.delete('', verifyJwt, cartController.deleteCart);

module.exports = router;
