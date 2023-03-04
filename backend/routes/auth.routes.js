const express = require('express');
const authControllers = require('../controllers/auth.controller');
const verifyJwt = require('../middlewares/verifyJwt.middleware');
const router = express.Router();

// WARNING: There is ZERO SQLInjection protection here, use at your own risk

router.post('/register', authControllers.registerUser);
router.post('/email', authControllers.isEmailTaken);
router.post('/login', authControllers.attemptLogin);
router.get('/logout', authControllers.logout);

router.get('/me', verifyJwt, authControllers.getProfile);

module.exports = router;
