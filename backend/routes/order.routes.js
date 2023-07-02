const express = require('express');
const orderController = require('../controllers/order.controller');
const verifyJwt = require('../middlewares/verifyJwt.middleware');
const router = express.Router();

// Protected with JWT
router.post('', verifyJwt, orderController.postOrder);
router.get('', verifyJwt, orderController.getOrders);

// Admin-only should be implemented
router.get('/all', verifyJwt, orderController.getAllOrders);
router.put('/status', verifyJwt, orderController.updateOrderStatus);

router.post('/create-paypal-order', verifyJwt, async (req, res, next) => {
    try {
        const order = await orderController.createPaypalOrder(req, res);
        res.json(order);
    } catch (error) {
        next(error);
    }
});

router.post('/process-paypal-payment', verifyJwt, async (req, res, next) => {
    try {
        const payment = await orderController.processPaypalPayment(req, res);
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
