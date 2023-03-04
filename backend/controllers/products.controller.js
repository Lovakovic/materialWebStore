const config = require("../config");
const { pool } = require('../app');

// WARNING: There is ZERO SQLInjection protection here, use at your own risk

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
        const limit = req.query.limit;

        let conn = await pool.getConnection();

        if(limit) {
            rows = await conn.query(`SELECT * FROM completeProducts WHERE category = '${req.params.category}' 
                                ORDER BY price ${sort} LIMIT ${limit}`);
        } else {
            rows = await conn.query(`SELECT * FROM completeProducts WHERE category = '${req.params.category}' 
                                ORDER BY price ${sort}`);
        }

        conn.release();

        rows = insertMediaPath(rows);
        res.json(rows);

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
    getCategories
};
