const passport = require('passport');

async function loginGet(req, res) {
    res.render("login", {
        title: "Login Page"
    });
}

const loginPost = passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
      });

module.exports = {
    loginGet,
    loginPost
}