const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { validPassword } = require('../lib/passwordUtils');

const customFields = {
    usernameField: 'uname',
    passwordField: 'pw'
};

async function verifyCallback(username, password, done) {
    try {
      // !! NEED A METHOD HERE TO GET THE USER ROW BASED ON THE USERNAME WE ENTERED
      const rows = undefined;
      const user = rows[0];

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
    // !! NEED A METHOD HERE TO GET THE USER ROW BASED ON THE USER ID
    const rows = undefined;
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});