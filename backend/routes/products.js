const express = require('express');
const mysql = require('promise-mysql');
const bodyParser = require('body-parser');

// const checkAuth = require('../middleware/check-auth');

const router = express.Router();
router.use(bodyParser.json());

// Getting all posts
router.get('/', (req, res, next) => {

});
