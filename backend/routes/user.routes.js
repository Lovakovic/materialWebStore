const express = require('express');
const userController = require('../controllers/user.controller');
const verifyJwt = require('../middlewares/verifyJwt.middleware');
const router = express.Router();

router.get('/users', verifyJwt,  userController.getAllUsers);
router.get('/users/:id', verifyJwt, userController.getUserById);
router.put('/users/:id', verifyJwt, userController.updateUser);
router.delete('/users/:id', verifyJwt, userController.deleteUser);


module.exports = router;
