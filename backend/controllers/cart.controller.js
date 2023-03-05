const { pool } = require('../app');

const getCart = async (req, res) => {
    try {
        const userId = req.userId;

        let conn = await pool.getConnection();
        let rows = await conn.query('SELECT productId, name, quantity, price, image FROM cart ' +
            'WHERE userId = ?', [userId]);
        conn.release();

        return res.json(rows);
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}

const postCart = async (req, res) => {
    try {
        const cartItems = req.body.cart;

        let conn = await pool.getConnection();
        let query;
        for(let cartItem of cartItems) {
            query = 'CALL addToCart(?, ?, ?)';
            conn.query(query, [item.userId, item.id, item.quantity])
        }

        conn.query(query, cartItems);

        return res.status(200).send();
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}

module.exports = {
    getCart,
    postCart
};

