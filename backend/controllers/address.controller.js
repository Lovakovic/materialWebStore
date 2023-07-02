const { pool } = require('../app');

const getAddresses = async (req, res) => {
    try {
        let rows;
        const userId = req.userId;
        const limit = Number.parseInt(req.query.limit);

        let conn = await pool.getConnection();
        if(limit) {
            rows = await  conn.query(
                'SELECT id, name, addressNickname, companyName, street, city, zipCode, country, phone, ' +
                'deliveryInstructions, isPrimary FROM userAddress WHERE userId = ? ORDER BY lastModified DESC LIMIT ?',
                [userId, limit]);
        } else {
            rows = await  conn.query(
                'SELECT id, name, addressNickname, companyName, street, city, zipCode, country, phone, ' +
                'deliveryInstructions, isPrimary FROM userAddress WHERE userId = ? ORDER BY lastModified DESC', userId);
        }
        conn.release();

        // Convert `isPrimary` from numeric to boolean
        rows = rows.map(row => {
            return {...row, isPrimary: !!row.isPrimary};
        });

        return res.json(rows);
    } catch(err) {
        return res.status(500).json('Internal server error.');
    }
};

const postAddress = async (req, res) => {
    try {
        const userId = req.userId;
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
        query =  query + fields + `) VALUES (?, ?, ?, ?, ?, ?` + placeholders + `)`;

        // Add values, filter out the undefined
        const values = [
            userId,
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

        // Execute the INSERT query
        const insertResponse = await conn.query(query, values);

        // Modify the user table and set the new primary address id
        if(address.isPrimary) {
            const addressId = insertResponse.insertId;
            await conn.query('UPDATE user SET primaryAddressId = ? WHERE id = ?', [addressId, userId]);
            console.log(`Updated ${userId}'s primary address to ${addressId}`);
        }

        // Fetch the inserted address
        const [newAddress] = await conn.query('SELECT * FROM userAddress WHERE id = ?', [insertResponse.insertId]);

        conn.release();

        // Return the created address with a 201 status code
        return res.status(201).json(newAddress);
    } catch(err) {
        console.log(err);
        return res.status(500).json('Internal server error.');
    }
};

const deleteAddress = async (req, res) => {
    try {
        let conn = await pool.getConnection();
        conn.query('DELETE FROM address WHERE id = ?', req.params.id);
        conn.release();

        console.log(`Deleted address with id ${req.params.id}`);
        return res.status(204).json();
    } catch(err) {
        return res.status(500).json('Internal server error.');
    }
}

module.exports = {
    getAddresses,
    postAddress,
    deleteAddress
};

