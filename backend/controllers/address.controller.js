const { pool } = require('../app');
const { secret } = require('../config');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

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
                    'deliveryInstructions FROM address WHERE userId = ? ORDER BY lastModified DESC LIMIT ?',
                    [decoded.id, limit]);
            } else {
                rows = await  conn.query(
                    'SELECT id, name, addressNickname, companyName, street, city, zipCode, country, phone, ' +
                    'deliveryInstructions FROM address WHERE userId = ? ORDER BY lastModified DESC', decoded.id);
            }

            conn.release();

            // Convert MYSQL-s representation of true/false to avoid any bugs
            rows.forEach(row => {
                row.main = row.primary === 1;
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
            const address = req.body.address;

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
                address['deliveryInstructions']
            ].filter(Boolean);

            conn.query(query, values);
            console.log(`Added address ${JSON.stringify(address)}`)

            // Modify the user table and set the new primary address id
            if(req.body.newPrimary) {
                const addressId = await conn.query('SELECT LAST_INSERT_ID() AS addressId');
                await conn.query('UPDATE user SET primaryAddressId = ? WHERE id = ?',
                    [addressId[0].addressId, decoded.id]);

                console.log(`Updated ${decoded.id}'s primary address to ${addressId}`);
            }

            conn.release();

            return res.status(200).send();
        } catch (e) {
            console.log(e);
            res.status(500);
            return res.json('Internal error');
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
            conn.release();

            console.log(`Deleted address with id ${req.params.id}`);
            return res.status(200).json();
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
    getAddresses,
    postAddress,
    deleteAddress
};

