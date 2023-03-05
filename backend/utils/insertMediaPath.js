const config = require("../config");

// Modifies the image path property, so it points to the correct location
module.exports = (rows) => {
    return rows.map(row => {
        return {
            ...row,
            image: `${config.api_url}/${config.mediaPath}/${row.image}`}
    });
}
