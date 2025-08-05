const path = require("node:path");
const uploadDir = '../uploads';
const fs = require('fs');

async function deleteFile(dbpath) {
    const filePath = path.join(__dirname, uploadDir) + "/" + dbpath;
    await fs.unlink(filePath, function (err) {
        if (err === null) {
            console.log(`File deleted successfully: ${filePath}`);
            return;
        }
        else if (err.code === 'ENOENT') {
            console.log(`File not found: ${filePath}`);
        } else {
            console.error(`Error deleting file: ${err}`);
        }
    });
}

module.exports = {
    deleteFile
}