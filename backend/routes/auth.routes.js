const express = require('express');
const authControllers = require('../controllers/auth.controller')
const router = express.Router();

// WARNING: There is ZERO SQLInjection protection here, use at your own risk

router.get('/me', authControllers.getProfile)
router.post('/register', authControllers.registerUser);
router.post('/email', authControllers.isEmailTaken);
router.post('/login', authControllers.attemptLogin);
router.get('/logout', authControllers.logout);

module.exports = router;
