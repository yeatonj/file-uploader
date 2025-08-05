const { getDirectoryDetails, getRootDirectoryDetails, getDirectoryContents } = require('../db/prismaQueries');

async function filesGet(req, res) {
    let isRoot;
    let details;
    let parentDir = null;
    if (req.params.dirId) {
        details = await getDirectoryDetails(parseInt(req.params.dirId));
        parentDir = details.parent_dir;
        if (details != null && details.user_id === req.user.id) {
            if (details.parent_dir === null) {
                res.redirect("/files");
                return;
            }
            isRoot = false;
        } else {
            // We do not have access (or it doesn't exist, but don't say that)
            res.render("files", {
                title: "No access to directory",
            });
        }
    } else {
        isRoot = true;
        details = await getRootDirectoryDetails(parseInt(req.user.id));
    }
    const dirContents = await getDirectoryContents(details.id);
    console.log(dirContents);
    res.render("files", {
        title: "Files in directory " + details.name,
        root: isRoot,
        parent: parentDir,
        contents: dirContents
    });
}

async function filesPost(req, res) {    
    res.redirect("/files");
}


module.exports = {
    filesGet,
    filesPost
}