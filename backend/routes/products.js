module.exports = (express, pool, jwt, secret) => {
    const productRouter = express.Router();

    productRouter.get('/', (req, res) => {
        res.json({ message: 'Welcome to the web store API.'});
    });

    productRouter.route('/all').get(async (req, res) => {
        try {
            let conn = await pool.getConnection();
            let rows = await conn.query('SELECT * FROM complete_products');
            conn.release();
            res.json(rows);

        } catch(e) {
            console.log(e);
            return res.json({ 'code': 500, 'status': 'Error with query' })
        }
    })

    return productRouter;
}
