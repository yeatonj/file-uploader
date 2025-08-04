const { Router } = require("express");
const signupController = require("../controllers/signupController");
const signupRouter = Router();

// const passport = require('passport');

signupRouter.get("/", signupController.signupGet);
signupRouter.post("/", signupController.signupPost);

module.exports = signupRouter;