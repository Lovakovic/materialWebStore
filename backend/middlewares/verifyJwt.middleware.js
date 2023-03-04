const { secret } = require('../config');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.loginToken;
        if(!token) {
            return res.status(401).json('Missing token.');
        }

        const decoded = await promisify(jwt.verify)(token, secret);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json('Bad token.');
    }
}
