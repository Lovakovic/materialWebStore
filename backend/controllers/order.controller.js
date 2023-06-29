const { pool } = require('../app');
const insertMediaPath = require("../utils/insertMediaPath");

const postOrder =  async (req, res) => {
    try {
        const userId = req.userId;

        let conn = await pool.getConnection();
        let rows = await conn.query("query");
        conn.release();

        return res.status(200).json();
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
}

module.exports = {
    postOrder
}
