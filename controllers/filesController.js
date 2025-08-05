const { getDirectoryDetails, getRootDirectoryDetails, getDirectoryContents, addDirectory, renameDirectory, deleteDirectory } = require('../db/prismaQueries');

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
    res.render("files", {
        title: "Files in directory " + details.name,
        root: isRoot,
        parent: parentDir,
        id: details.id,
        contents: dirContents
    });
}


async function filesDirPost(req, res) {
    // Make sure we own the parent directory
    const details = await getDirectoryDetails(parseInt(req.body.parDir));
    if (details.user_id !== req.user.id) {
        res.redirect("/files");
    }
    // Now add the directory
    await addDirectory(req.user.id, req.body.dirName, parseInt(req.body.parDir));
    res.redirect("/files/" + req.body.parDir);
}

async function filesDirRenamePost(req, res) {
    // Make sure we own the parent directory
    const details = await getDirectoryDetails(parseInt(req.body.dirId));
    if (details.user_id !== req.user.id) {
        res.redirect("/files");
    }
    // Now, rename
    await renameDirectory(parseInt(req.body.dirId), req.body.newName);
    res.redirect("/files/" + req.body.dirId);
}

async function filesDirDelete(req, res) {
    // Make sure we own this directory
    const details = await getDirectoryDetails(parseInt(req.body.deleteId));
    if (details.user_id !== req.user.id) {
        res.redirect("/files");
    }
    // Now, go ahead and delete.
    await deleteDirectory(parseInt(req.body.deleteId));
    res.redirect("/files");
}


module.exports = {
    filesGet,
    filesDirPost,
    filesDirRenamePost,
    filesDirDelete
}