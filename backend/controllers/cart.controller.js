const { pool } = require('../app');
const insertMediaPath = require('../utils/insertMediaPath');

const getCart = async (req, res) => {
    try {
        const userId = req.userId;

        let conn = await pool.getConnection();
        let rows = await conn.query('SELECT productId, name, quantity, price, image FROM cart ' +
            'WHERE userId = ?', [userId]);
        conn.release();

        rows = insertMediaPath(rows);

        return res.json(rows);
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}

const postCart = async (req, res) => {
    try {
        const cartItems = req.body.items;
        const userId = req.userId;

        let conn = await pool.getConnection();
        let query;
        for(let cartItem of cartItems) {
            query = 'CALL addToCart(?, ?, ?)';
            await conn.query(query, [userId, cartItem.productId, cartItem.quantity])
        }

        return res.status(200).send();
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}

const deleteCart = async (req, res) => {
    try {
        const userId = req.userId;

        let conn = await pool.getConnection();
        await conn.query('DELETE FROM cartItem WHERE userId = ?', [userId]);

        return res.status(200).send();
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}


module.exports = {
    getCart,
    postCart,
    deleteCart
};

