const { pool } = require('../app');
const { secret } = require('../config');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const sendUserData = async (req, res) => {
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
                return res.json('Unauthorized access!');
            }

            const userData = { ...rows[0] };

            console.log(`Sending user data (id: ${userData.id})`);
            res.json(userData);
        } catch (e) {
            console.log(e);
        }
    } else {
        res.status(401);
        return res.json('Unauthorized access!');
    }
};

module.exports = {
    sendUserData
}
