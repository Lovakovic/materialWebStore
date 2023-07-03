const config = require("../config");
const url = require('url');

// Modifies the image path property, so it points to the correct location
module.exports = (rows) => {
    return rows.map(row => {
        // Check if image is a URL
        const isURL = url.parse(row.image).protocol !== null;
        return {
            ...row,
            // If it's a URL, leave it as is, otherwise, modify it
            image: isURL ? row.image : `${config.api_url}/${config.mediaPath}/${row.image}`}
    });
}
