const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mysql = require('promise-mysql');
const helmet = require('helmet');

const config = require('./config');
require('dotenv').config();

// Export the pool, so as not to pass it around as param
module.exports = { pool: mysql.createPool(config.pool) };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/media', express.static('media'));

app.use(helmet());
app.use(morgan('dev'));

// Set the appropriate headers to enable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type,Authorization ,Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Credentials",
        "true"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();

});

const productRouter = require('./routes/products.routes');
app.use('/products', productRouter);

const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);

const addressRouter = require('./routes/address.routes');
app.use('/address', addressRouter);

const cartRouter = require('./routes/cart.routes');
app.use('/cart', cartRouter);

const orderRouter = require('./routes/order.routes');
app.use('/order', orderRouter);

const userRouter = require('./routes/user.routes');
app.use('/user', userRouter);

module.exports = app;
