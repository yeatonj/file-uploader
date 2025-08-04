async function signupGet(req, res) {
    res.render("signup", {
        title: "Signup Page",
        message: undefined
    });
}

async function signupPost(req, res) {    
    try {
        // !! NEED A SIGNUP FUNCTION HERE
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