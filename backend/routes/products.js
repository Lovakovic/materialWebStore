module.exports = (express, pool, jwt, secret) => {
    const productRouter = express.Router();

    productRouter.route('/').get(async (req, res) => {
        try {
            const sort = (req.query.sort || 'desc');
            const limit = req.query.limit;

            let conn = await pool.getConnection();

            if(limit) {
                rows = await conn.query(`SELECT * FROM complete_products ORDER BY price ${sort} LIMIT ${limit}`);
            } else {
                rows = await conn.query(`SELECT * FROM complete_products ORDER BY price ${sort}`);
            }

            conn.release();
            res.json(rows);

        } catch(e) {
            console.log(e);
            return res.json({ 'code': 500, 'status': 'Error with query' })
        }
    })

    // https://localhost:8081/products?sort=desc&limit=3

    return productRouter;
}
