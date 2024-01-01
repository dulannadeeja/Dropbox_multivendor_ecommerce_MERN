const fs = require('fs');
const path = require('path');

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    console.log(filePath);
    fs.unlink(filePath, err => console.log(err));
}

module.exports = clearImage;