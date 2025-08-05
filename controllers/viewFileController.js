const { } = require('../db/prismaQueries');

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

async function viewFileUploadPost(req, res) {    
    
}

async function viewFileDeletePost(req, res) {

}


module.exports = {
    viewFileGetNoFile,
    viewFileGet,
    viewFileUploadPost,
    viewFileDeletePost
}