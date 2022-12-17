const fs = require('fs');

 async function getFiles(dir){
    const files = fs.readdirSync(dir);
    return files
};

module.exports = { getFiles }