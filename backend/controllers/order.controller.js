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

const getOrders = async (req, res) => {
    try {
        const userId = req.userId;

        // Fetch user's orders
        let conn = await pool.getConnection();
        let result = await conn.query('SELECT * FROM orderWithItems WHERE userId = ?', [userId]);
        conn.release();

        const orders = completeOrderMapper(result);
        return res.status(200).json(orders);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: 'Error while fetching orders.' });
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
        const { transactionId, shippingAddressId } = req.body;
        const userId = req.userId;

        // Fetch transaction details from PayPal
        const transactionDetails = await fetchTransactionDetails(transactionId);
        if (transactionDetails.status !== 'COMPLETED') {
            throw new Error('Transaction not completed');
        }

        // Store the transaction in the database if it is approved
        let conn = await pool.getConnection();
        await conn.query('INSERT INTO paypalTransaction (id, status) VALUES (?, ?)',
            [transactionId, transactionDetails.status]);

       // Grab the address info from PayPal transaction
        const { name: {
            full_name: name
        },
            address: {
                address_line_1: street,
                admin_area_2: city,
                country_code: countryCode
            }
        } = transactionDetails.purchase_units[0].shipping;

        // Check if billing address from PayPal transaction is already archived
        const [existingBillingAddress] = await conn.query('SELECT id FROM archivedAddress ' +
            'WHERE name = ? AND street = ? AND city = ?', [name, street, city]);
        let billingAddressId;
        if (existingBillingAddress?.id) {
            billingAddressId = existingBillingAddress.id;
        } else {
            // Archive it
            let result = await conn.query('INSERT INTO archivedAddress (userId, name, street, city, country) ' +
                'VALUES (?, ?, ?, ?, ?)', [userId, name, street, city, countryCode]);
            billingAddressId = result.insertId;
        }

        // Create a new order in DB
        const orderPaymentMethod = 'paypal';
        let rows = await conn.query('SELECT createOrder(?, ?, ?) AS orderId',
            [userId, shippingAddressId, orderPaymentMethod]);
        let orderId = rows[0].orderId;
        await conn.query('UPDATE `order` SET paypalTransactionId = ?, billingAddressId = ? WHERE id = ?',
            [transactionId, billingAddressId, orderId]);

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

const completeOrderMapper = (rows) => {
    let ordersMap = {};
    for (let row of rows) {
        if (!ordersMap[row.id]) {
            ordersMap[row.id] = {
                id: row.id,
                items: [],
                shippingStreet: row.shippingStreet,
                shippingCity: row.shippingCity,
                shippingCountry: row.shippingCountry,
                paymentMethod: row.paymentMethod,
                status: row.status,
                total: row.total,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                paypalTransactionId: row.paypalTransactionId,
                paypalStatus: row.paypalStatus
            };

            if (row.billingStreet) {
                ordersMap[row.id].billingStreet = row.billingStreet;
                ordersMap[row.id].billingCity = row.billingCity;
                ordersMap[row.id].billingCountry = row.billingCountry;
            }
        }

        ordersMap[row.id].items.push({
            productId: row.productId,
            name: row.productName,
            price: row.price,
            quantity: row.quantity
        });
    }

    return Object.values(ordersMap);
}

module.exports = {
    postOrder,
    getOrders,
    createPaypalOrder,
    processPaypalPayment
}
