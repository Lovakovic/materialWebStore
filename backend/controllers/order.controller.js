const { pool } = require('../app');
const axios = require('axios');
const { CLIENT_ID, APP_SECRET } = process.env;
const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
};


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

const createOrder = async (req) => {
    const cartItems = req.body.cartItems;
    const purchase_units = cartItems.map(item => {
        return {
            amount: {
                currency_code: 'EUR',
                value: (item.price * item.quantity).toFixed(2)
            },
            description: item.name,
            quantity: item.quantity.toString(),
        };
    });

    const accessToken = await generateAccessToken();
    const url = `${baseURL.sandbox}/v2/checkout/orders`;
    const response = await axios.post(url, {
        intent: "CAPTURE",
        purchase_units: purchase_units
    }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return response.data.id;
}


const capturePayment = async (req) => {
    const orderId = req.body.orderId;
    const accessToken = await generateAccessToken();
    const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`;
    const response = await axios.post(url, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    // TODO: store payment information such as the transaction ID

    return response.data;
}

async function generateAccessToken() {
    const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
    const response = await axios.post(`${baseURL.sandbox}/v1/oauth2/token`, "grant_type=client_credentials", {
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    return response.data.access_token;
}

module.exports = {
    postOrder,
    createOrder,
    capturePayment
}
