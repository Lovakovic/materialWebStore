const { pool } = require('../app');

const postOrder =  async (req, res) => {
    try {
        const userId = req.userId;
        const order = req.body;
        const addressId = order.shippingAddress.id;

        let conn = await pool.getConnection();
        let rows = await conn.query('SELECT createOrder(?, ?) AS orderId', [userId, addressId]);
        conn.release();

        if (rows[0] === 0) {
            return res.status(400).json({ error: 'No items in the cart.' });
        }

        order.id = rows[0].orderId;

        // Fetch the new order details
        conn = await pool.getConnection();
        let newOrder = await conn.query('SELECT * FROM `order` WHERE id = ?', [order.id]);
        conn.release();

        return res.status(200).json(newOrder);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: 'Error while creating order.' });
    }
}


module.exports = {
    postOrder
}
