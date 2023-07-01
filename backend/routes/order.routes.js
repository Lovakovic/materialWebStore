const express = require('express');
const orderController = require('../controllers/order.controller');
const verifyJwt = require('../middlewares/verifyJwt.middleware');
const router = express.Router();

// Protected with JWT
router.post('', verifyJwt, orderController.postOrder);

router.post('/create-paypal-order', verifyJwt, async (req, res, next) => {
    try {
        const order = await orderController.createOrder(req, res);
        res.json(order);
    } catch (error) {
        next(error);
    }
});

router.post('/capture-paypal-order', verifyJwt, async (req, res, next) => {
    try {
        const payment = await orderController.capturePayment(req, res);
        res.json(payment);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
