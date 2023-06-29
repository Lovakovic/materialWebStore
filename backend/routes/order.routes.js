const express = require('express');
const orderController = require('../controllers/order.controller');
const verifyJwt = require('../middlewares/verifyJwt.middleware');
const router = express.Router();

// Protected with JWT
router.post('', verifyJwt, orderController.postOrder);

module.exports = router;
