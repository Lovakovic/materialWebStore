module.exports = {
    port: process.env.PORT || 8081,
    pool: {
        connectionLimit: 100,
        host: 'localhost',
        user: 'dev',
        password: 'devpass',
        database: 'webShop',
        debug: false
    },
    secret: 'https://youtu.be/dQw4w9WgXcQ'
}
