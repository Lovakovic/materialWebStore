const { pool } = require('../app');
const { secret } = require('../config');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const getCart = async (req, res) => {
    if(req.cookies.loginToken) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.loginToken, secret);

            let conn = await pool.getConnection();
            let rows = await conn.query('SELECT productId, name, quantity, price, image FROM cart ' +
                'WHERE userId = ?', [decoded.id]);
            conn.release();

            return res.json(rows);
        } catch(err) {
            if(err.name === 'JsonWebTokenError') {
                return res.status(401).json('Bad token.');
            } else {
                return res.status(500).send();
            }
        }
    } else {
        res.status(401).send();
    }
}

const postCart = async (req, res) => {
    if(req.cookies.loginToken) {
        try {
            await promisify(jwt.verify)(req.cookies.loginToken, secret);
            const cartItems = req.body.cart;

            let conn = await pool.getConnection();
            let query = `INSERT INTO cartItem (userId, productId, quantity) VALUES `;
            query += cartItems.map(() => `(?, ?, ?)`.join(', '));

            conn.query(query, cartItems);

            return res.status(200).send();
        } catch(err) {
            if(err.name === 'JsonWebTokenError') {
                return res.status(401).json('Bad token.');
            } else {
                return res.status(500).send();
            }
        }
    }
}

module.exports = {
    getCart,
    postCart
};

