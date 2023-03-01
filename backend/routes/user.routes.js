const express = require('express');
const userControllers = require('../controllers/user.controller');
const router = express.Router();

// Protected with JWT
router.get('/address', userControllers.getAddresses);
router.post('/address', userControllers.postAddress);
router.delete('/address/:id', userControllers.deleteAddress)

module.exports = router;
