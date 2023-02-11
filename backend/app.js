const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mysql = require('promise-mysql');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const helmet = require('helmet');

const config = require('./config');

const pool = mysql.createPool(config.pool);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + ''));

// Set the appropriate headers to enable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type,Authorization ,Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();

});


app.use('/api/products', productsRouters);
app.use('/api/users', usersRouters);

module.exports = app;
