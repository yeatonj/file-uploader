const { getDirectoryOwnerId, getDirectorDetails } = require('../db/prismaQueries');

async function filesGet(req, res) {
    if (req.params.dirId) {
        const details = await getDirectorDetails(parseInt(req.params.dirId));
        if (details != null && details.user_id === req.user.id) {
            if (details.parent_dir === null) {
                res.redirect("/files");
                return;
            }
            res.render("files", {
                title: "Files with a directory",
            });
        } else {
            res.render("files", {
                title: "No access to directory",
            });
        }
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