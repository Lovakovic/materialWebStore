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
        const paymentMethod = order.paymentMethod;
        const addressId = order.shippingAddress.id;

        let conn = await pool.getConnection();
        let rows = await conn.query('SELECT createOrder(?, ?, ?) AS orderId', [userId, addressId, paymentMethod]);
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

const createPaypalOrder = async (req) => {
    try {
        const cartItems = req.body.cartItems;

        const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

        const purchase_units = [
            {
                amount: {
                    currency_code: 'EUR',
                    value: totalAmount,
                },
            }
        ];

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
    } catch (error) {
        console.log('Error creating PayPal order:', error.message);
        throw error;
    }
}


const processPaypalPayment = async (req) => {
    try {
        const transactionId = req.body.transactionId;
        const userId = req.userId;

        // Fetch transaction details from PayPal
        const transactionDetails = await fetchTransactionDetails(transactionId);
        if (transactionDetails.status !== 'COMPLETED') {
            throw new Error('Transaction not completed');
        }

        // Store the transaction in the database if it is approved
        let conn = await pool.getConnection();
        await conn.query('INSERT INTO paypalTransaction (id, status) VALUES (?, ?)', [transactionId, transactionDetails.status]);

        // Check if the address already exists in DB
        const shipping = transactionDetails.purchase_units[0].shipping;
        const [existingAddress] = await conn.query('SELECT id FROM archivedAddress WHERE name = ? AND street = ? AND city = ?', [shipping.name.full_name, shipping.address.address_line_1, shipping.address.admin_area_2]);
        let addressId;
        if (existingAddress?.length) {
            // If address exists, grab its id
            addressId = existingAddress[0].id;
        } else {
            // If address does not exist, insert a new one and grab its id
            let result = await conn.query('INSERT INTO archivedAddress (userId, name, street, city, country) VALUES (?, ?, ?, ?, ?)', [userId, shipping.name.full_name, shipping.address.address_line_1, shipping.address.admin_area_2, shipping.address.country_code]);
            addressId = result.insertId;
        }

        // Create a new order in DB
        const orderPaymentMethod = 'paypal';
        let rows = await conn.query('SELECT createOrder(?, ?, ?) AS orderId', [userId, addressId, orderPaymentMethod]);
        let orderId = rows[0].orderId;
        await conn.query('UPDATE `order` SET paypalTransactionId = ? WHERE id = ?', [transactionId, orderId])

        // Fetch the new order details
        let newOrder = await conn.query('SELECT * FROM `order` WHERE id = ?', [orderId]);

        // Close the database connection
        conn.release();

        return newOrder[0];
    } catch (err) {
        console.log(err);
        throw new Error('Error while processing transaction.');
    }
}

async function fetchTransactionDetails(transactionId) {
    const accessToken = await generateAccessToken();
    const url = `${baseURL.sandbox}/v2/checkout/orders/${transactionId}`;
    const response = await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
}

async function generateAccessToken() {
    try {
        const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
        const response = await axios.post(`${baseURL.sandbox}/v1/oauth2/token`, "grant_type=client_credentials", {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error generating access token:', error.message);
        throw error;
    }
}

module.exports = {
    postOrder,
    createPaypalOrder,
    processPaypalPayment
}
