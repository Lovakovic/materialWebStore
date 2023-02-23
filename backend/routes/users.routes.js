const express = require('express');
const usersControllers = require('../controllers/users.controller')
const router = express.Router();

// WARNING: There is ZERO SQLInjection protection here, use at your own risk

router.post('/register', usersControllers.registerUser);
router.post('/email', usersControllers.isEmailTaken);
router.post('/login', usersControllers.attemptLogin);

// Protect this route with JWT token
router.get('/usr', usersControllers.isLoggedIn);

module.exports = router;
