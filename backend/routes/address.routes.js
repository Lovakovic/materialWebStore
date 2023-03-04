const express = require('express');
const userControllers = require('../controllers/address.controller');
const verifyJwt = require('../middlewares/verifyJwt.middleware');
const router = express.Router();

// Protected with JWT
router.get('', verifyJwt, userControllers.getAddresses);
router.post('', verifyJwt, userControllers.postAddress);
router.delete('/:id', verifyJwt, userControllers.deleteAddress)

module.exports = router;
