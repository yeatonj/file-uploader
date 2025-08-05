// app.js
// initialize express
const express = require("express");
const app = express();

// Required for prisma session store
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('./generated/prisma');

// Initialize dotenv
require('dotenv').config();



// Routes
const indexRouter = require("./routes/indexRouter");
const loginRouter = require("./routes/loginRouter");
const signupRouter = require("./routes/signupRouter");
const filesRouter = require("./routes/filesRouter");
const viewFileRouter = require("./routes/viewFileRouter");


// Set up ejs
const path = require("node:path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// For uploading files
const fs = require('fs');
const uploadDir = 'uploads';
if (!fs.existsSync(path.join(__dirname, uploadDir))) {
  fs.mkdirSync(path.join(__dirname, uploadDir));
}

// This line allows express to parse the form data
app.use(express.urlencoded({ extended: true }));
// Set session data
const session = require("express-session");
const passport = require("passport");

app.use(session({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  }
));

// Authenticate passport
app.use(passport.session());
require('./authentication/passport');

// Set routes
app.use("/login", loginRouter);
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.use("/signup", signupRouter);
app.use("/files", filesRouter);
app.use("/viewfile", viewFileRouter);
app.use("/", indexRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App started - listening on port ${PORT}!`);
});