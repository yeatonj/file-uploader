const passport = require('passport');

async function loginGet(req, res) {
    let errMsg = null;
    if (req.session.messages) {
        errMsg = req.session.messages[req.session.messages.length - 1];
    }
    res.render("login", {
        title: "Login Page",
        message: errMsg
    });
}

const loginPost = passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureMessage: true
      });

module.exports = {
    loginGet,
    loginPost
}