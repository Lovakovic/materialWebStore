const express = require('express');
const userControllers = require('../controllers/user.controller');
const router = express.Router();

// Protected with JWT
router.get('/me', userControllers.getProfile);
router.get('/address', userControllers.getAddresses);


module.exports = router;
