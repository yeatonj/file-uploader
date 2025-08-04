const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { validPassword } = require('../lib/passwordUtils');
const { getUserFromUsername, getUserFromId } = require('../db/prismaQueries');

const customFields = {
    usernameField: 'uname',
    passwordField: 'pw'
};

async function verifyCallback(username, password, done) {
    try {
      const user = await getUserFromUsername(username);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const isValid = await validPassword(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = getUserFromId(id);

    done(null, user);
  } catch(err) {
    done(err);
  }
});