const { addUser } = require('../db/prismaQueries');

async function signupGet(req, res) {
    res.render("signup", {
        title: "Signup Page",
        message: undefined
    });
}

async function signupPost(req, res) {    
    try {
        await addUser(req.body.mail, req.body.pass, req.body.fName, req.body.lName);
        res.redirect("/login");
    } catch {
        res.render("signup", {
            title: "Signup Page",
            message: "Username already exists, please try another."
        });
    }
    
}


module.exports = {
    signupGet,
    signupPost
}