const express = require('express');
const userControllers = require('../controllers/address.controller');
const router = express.Router();

// Protected with JWT
router.get('', userControllers.getAddresses);
router.post('', userControllers.postAddress);
router.delete('/:id', userControllers.deleteAddress)

module.exports = router;
