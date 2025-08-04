async function filesGet(req, res) {
    if (req.params.dirId) {
        res.render("files", {
            title: "Files with a directory",
        });
    } else {
        res.render("files", {
            title: "Files with root directory",
        });
    }
 
}

async function filesPost(req, res) {    
    res.redirect("/files");
}


module.exports = {
    filesGet,
    filesPost
}