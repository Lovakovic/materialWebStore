const app = require('./backend/app');
const config = require("./backend/config");

app.listen(config.port);
console.log(`Running on port ${config.port}`);
