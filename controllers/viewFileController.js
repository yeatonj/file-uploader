const { getPathPrefix, addFile, getDirectoryDetails } = require('../db/prismaQueries');
const multer = require('multer');
const path = require("node:path");
const uploadDir = '../uploads';
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, uploadDir));
    },
});

const upload = multer({
    storage: storage
});


async function viewFileGetNoFile(req, res) {
        res.render("noFile", {
            title: "No File",
        });
}


async function viewFileGet(req, res) {
    res.render("viewFile", {
        title: "View File Page",
    });
}

const uploadMiddleware = upload.single('upFile');

async function viewFileUploadPost(req, res) {  
    // File uploaded and on disk. Now write to DB and adjust or delete
    // First, ensure we actually own this directory... If not, immediately reject
    // Make sure we own this directory
    const details = await getDirectoryDetails(parseInt(req.body.dirIdUpload));
    if (details.user_id !== req.user.id) {
        deleteFile(req.file.path);
        return;
    }

    const prefix = await getPathPrefix(parseInt(req.body.dirIdUpload));
    const suffix = req.file.originalname;
    const success = await addFile(req.user.id, parseInt(req.body.dirIdUpload), req.file.originalname, req.file.size, prefix + suffix);
    if (success) {
        renameFile(req.file.path, path.join(__dirname, uploadDir) + "/" + prefix + suffix);
    } else {
        // Delete file, already exists in DB
        deleteFile(req.file.path);
    }
    res.redirect("/files/");
}

async function deleteFile(filePath) {
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


async function renameFile(oldName, newName) {
    await fs.rename(oldName, newName, function (err) {
        if (err === null) {
            console.log(`File renamed successfully: ${oldName} to ${newName}`);
            return;
        }
        else if (err.code === 'ENOENT') {
            console.log(`File not found: ${oldName}`);
        } else {
            console.error(`Error renaming file: ${err}`);
        }
    });
}

async function viewFileDeletePost(req, res) {

}


module.exports = {
    viewFileGetNoFile,
    viewFileGet,
    viewFileUploadPost,
    viewFileDeletePost,
    uploadMiddleware,
}