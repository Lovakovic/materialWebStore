module.exports = {
    port: process.env.PORT || 8081,
    pool: {
        connectionLimit: 100,
        host: 'localhost',
        user: 'dev',
        password: 'devpass',
        database: 'webShop', // Leave this as is, since DDL creates this DB
        debug: false
    },
    secret: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tokenExpiration: 43200, // 12 hours
    mediaPath: 'media',
    api_url: `http://localhost:8081`
}
