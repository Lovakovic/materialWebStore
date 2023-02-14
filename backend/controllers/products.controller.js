const config = require("../config");
const { pool } = require('../app');

// Modifies the image path property, so it points to the correct location
const insertMediaPath = (rows) => {
    return rows.map(row => {
        return {
            ...row,
            image: `${config.api_url}/${config.mediaPath}/${row.image}`}
    });
}

const getAllProducts = async (req, res) => {
    try {
        let rows;
        const sort = (req.query.sort || 'desc');
        const limit = req.query.limit;

        let conn = await pool.getConnection();

        if(limit) {
            rows = await conn.query(`SELECT * FROM complete_products ORDER BY price ${sort} LIMIT ${limit}`);
        } else {
            rows = await conn.query(`SELECT * FROM complete_products ORDER BY price ${sort}`);
        }

        conn.release();

        rows = insertMediaPath(rows);
        res.json(rows);

    } catch(e) {
        console.log(e);
        return res.json({ 'code': 500, 'status': 'Error with query' });
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        let rows;
        const sort = (req.query.sort || 'desc');
        const limit = req.query.limit;

        let conn = await pool.getConnection();

        if(limit) {
            rows = await conn.query(`SELECT * FROM complete_products WHERE category = '${req.params.category}' 
                                ORDER BY price ${sort} LIMIT ${limit}`);
        } else {
            rows = await conn.query(`SELECT * FROM complete_products WHERE category = '${req.params.category}' 
                                ORDER BY price ${sort}`);
        }

        conn.release();

        rows = insertMediaPath(rows);
        res.json(rows);

    } catch (e) {
        console.log(e);
        return res.json({ 'code': 500, 'status': 'Error with query' });
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

    } catch(e) {
        console.log(e);
        return res.json({ 'code': 500, 'status': 'Error with query' });
    }
};

module.exports = {
    getAllProducts,
    getProductsByCategory,
    getCategories
};
