async function indexGet(req, res) {
    // Get message data if we have a user
    res.render("index", {
        title: "Main Page",
        user: req.user,
    });
}

module.exports = {
    indexGet
}