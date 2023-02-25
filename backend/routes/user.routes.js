const express = require('express');
const userControllers = require('../controllers/user.controller');
const router = express.Router();

// Protected with JWT
router.get('/me', userControllers.sendUserData);


module.exports = router;
