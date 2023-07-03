const insertMediaPath = require('../utils/insertMediaPath');
const { pool } = require('../app');

const getAllProducts = async (req, res) => {
    try {
        let rows;
        const limit = Number.parseInt(req.query.limit);

        let conn = await pool.getConnection();
        const sort = (req.query.sort || 'desc');

        if(limit) {
            rows = await conn.query(`SELECT * FROM completeProducts ORDER BY price ${sort} LIMIT ?`, [limit]);
        } else {
            rows = await conn.query(`SELECT * FROM completeProducts ORDER BY price ${sort}`);
        }

        conn.release();

        rows = insertMediaPath(rows);
        res.json(rows);

    } catch(err) {
        console.log(err);
        return res.status(500).json('Internal server error.');
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        let rows;
        const sort = (req.query.sort || 'desc');
        const limit = Number.parseInt(req.query.limit);

        let conn = await pool.getConnection();

        if(limit) {
            rows = await conn.query(`SELECT * FROM completeProducts WHERE category = ? 
                                ORDER BY price ${sort} LIMIT ?`, [req.params.category, limit]);
        } else {
            rows = await conn.query(`SELECT * FROM completeProducts WHERE category = ? 
                                ORDER BY price ${sort}`, [req.params.category]);
        }

        conn.release();

        rows = insertMediaPath(rows);
        res.json(rows);

    } catch(err) {
        console.log(err);
        return res.status(500).json('Internal server error.');
    }
};

const addProduct = async (req, res) => {
    try {
        let { name, price, category, newCategory, description, image } = req.body;
        let conn = await pool.getConnection();

        if(newCategory) {
            let rows = await conn.query('INSERT INTO category(name) VALUES(?)', [newCategory]);
            category = rows.insertId;
        } else {
            let rows = await conn.query('SELECT id FROM category WHERE name = ?', [category]);
            category = rows[0].id;
        }

        let result = await conn.query(`INSERT INTO product(name, price, categoryId, description, image) 
                          VALUES(?, ?, ?, ?, ?)`, [name, price, category, description, image]);

        let [rows] = await conn.query(`SELECT * FROM completeProducts WHERE id = ?`, [result.insertId]);

        conn.release();
        res.json(rows[0]);

    } catch(err) {
        console.log(err);
        return res.status(500).json('Internal server error.');
    }
};


const updateProduct = async (req, res) => {
    try {
        let { id, name, price, category, newCategory, description, image } = req.body;
        let conn = await pool.getConnection();

        if(newCategory) {
            let rows = await conn.query('INSERT INTO category(name) VALUES(?)', [newCategory]);
            category = rows.insertId;
        } else {
            let rows = await conn.query('SELECT id FROM category WHERE name = ?', [category]);
            category = rows[0].id;
        }

        await conn.query(`UPDATE product SET name = ?, price = ?, categoryId = ?, description = ?, image = ? 
                          WHERE id = ?`, [name, price, category, description, image, id]);

        let [rows] = await conn.query(`SELECT * FROM completeProducts WHERE id = ?`, [id]);

        conn.release();
        res.json(rows[0]);

    } catch(err) {
        console.log(err);
        return res.status(500).json('Internal server error.');
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let conn = await pool.getConnection();

        await conn.query(`DELETE FROM product WHERE id = ?`, [id]);

        conn.release();
        res.json({ message: 'Product deleted successfully.' });

    } catch(err) {
        console.log(err);
        return res.status(500).json('Internal server error.');
    }
};

const getCategories = async (req, res) => {
    try {
        let conn = await pool.getConnection();
        let rows = await conn.query('SELECT name FROM category');

        conn.release();

        // Unpack the name attribute of an object
        rows = rows.map(row => row.name);

        res.json(rows);

    } catch(err) {
        console.log(err);
        return res.status(500).json('Internal server error.');
    }
};

module.exports = {
    getAllProducts,
    getProductsByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategories
};
