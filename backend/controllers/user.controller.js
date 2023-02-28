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
                    'SELECT id, name, addressNickname, companyName, street, city, zipCode, country, phone, ' +
                    'deliveryInstructions, main FROM address WHERE userId = ? ORDER BY lastModified DESC LIMIT ?',
                    [decoded.id, limit]);
            } else {
                rows = await  conn.query(
                    'SELECT id, name, addressNickname, companyName, street, city, zipCode, country, phone, ' +
                    'deliveryInstructions, main FROM address WHERE userId = ? ORDER BY lastModified DESC', decoded.id);
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

const postAddress = async (req, res) => {
    if (req.cookies.loginToken) {
        try {
            console.log(req.body);
            const decoded = await promisify(jwt.verify)(req.cookies.loginToken, secret);
            const address = req.body;

            let conn = await pool.getConnection();

            // Build a query according to entered fields
            const mandatoryFields = [`userId`, `name`, `street`, `city`, `country`, `phone`];
            let query = `INSERT INTO address (${mandatoryFields.join(', ')}`;
            let fields = ``;
            let placeholders = ``;

            if(address.addressNickname) {
                fields += `, addressNickname`;
                placeholders += `, ?`;
            }
            if(address.company) {
                fields += `, companyName`;
                placeholders += `, ?`;
            }
            if(address.zipCode) {
                fields += `, zipCode`;
                placeholders += `, ?`;
            }
            if(address.deliveryInstructions) {
                fields += `, deliveryInstructions`;
                placeholders += `, ?`;
            }
            if(address.main) {
                fields += `, main`;
                placeholders += `, ?`;
            }
            query =  query + fields + `) VALUE (?, ?, ?, ?, ?, ?` + placeholders + `)`;

            // Add values, filter out the undefined
            const values = [
                decoded.id,
                address['name'],
                address['street'],
                address['city'],
                address['country'],
                address['phone'],
                address['addressNickname'],
                address['company'],
                address['zipCode'],
                address['deliveryInstructions'],
                address['main']
            ].filter(Boolean);

            conn.query(query, values);
            console.log(`Added address ${JSON.stringify(address)}`)
            return res.json('Success');
        } catch (e) {
            console.log(e);
            res.status(401);
            return res.json('Invalid user.');
        }
    } else {
        res.status(401);
        return res.json('Missing token.')
    }
};

const deleteAddress = async (req, res) => {
    if(req.cookies.loginToken) {
        try {
            // Verify token
            await promisify(jwt.verify)(req.cookies.loginToken, secret);

            // Check if the user still exists
            let conn = await pool.getConnection();
            conn.query('DELETE FROM address WHERE id = ?', req.params.id);

            console.log(`Deleted address with id ${req.params.id}`);
            res.json('Success');
        } catch (e) {
            console.log(e);
            res.status(401);
            return res.json('Bad token.');
        }
    } else {
        res.status(401);
        return res.json('Missing token.');
    }
}

module.exports = {
    getProfile,
    getAddresses,
    postAddress,
    deleteAddress
};

