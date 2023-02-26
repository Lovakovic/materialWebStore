const { pool } = require('../app');
const { secret } = require('../config');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const getProfile = async (req, res) => {
    if(req.cookies.loginToken) {
        try {
            // Verify token
            const decoded = await promisify(jwt.verify)(req.cookies.loginToken, secret);

            // Check if the user still exists
            let conn = await pool.getConnection();
            let rows = await  conn.query('SELECT id, username, email FROM user WHERE id = ?', decoded.id);
            const userFound = rows.length === 1;

            if(!userFound) {
                res.status(401);
                return res.json('Missing user.');
            }

            const userData = { ...rows[0] };

            console.log(`Sending user data (id: ${userData.id})`);
            res.json(userData);
        } catch (e) {
            console.log(e);
            res.status(401);
            return res.json('Bad token.');
        }
    } else {
        res.status(401);
        return res.json('Missing token.');
    }
};

const getAddresses = async (req, res) => {
    if(req.cookies.loginToken) {
        try {
            let rows;
            const decoded = await promisify(jwt.verify)(req.cookies.loginToken, secret);
            const limit = Number.parseInt(req.query.limit);

            let conn = await pool.getConnection();
            if(limit) {
                rows = await  conn.query(
                    'SELECT id, name, nickname, street, city, zip_code, country, phone, main FROM address ' +
                    'WHERE user_id = ? ORDER BY last_modified DESC LIMIT ?', [decoded.id, limit]);
            } else {
                rows = await  conn.query(
                    'SELECT id, name, nickname, street, city, zip_code, country, phone, main FROM address ' +
                    'WHERE user_id = ? ORDER BY last_modified DESC', decoded.id);
            }

            // Convert MYSQL-s representation of true/false to avoid any bugs
            rows.forEach(row => {
                row.main = row.main === 1;
            });

            return res.json(rows);
        } catch (e) {
            console.log(e);
            res.status(401);
            return res.json('Bad token.');
        }
    } else {
        res.status(401);
        return res.json('Missing token.')
    }
};

module.exports = {
    getProfile,
    getAddresses
};

