const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { findUserByEmail, findUserById } = require('../models/user.model');

// LocalStrategy — authenticates with email + password
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await findUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Never pass password_hash beyond this point
        return done(null, { id: user.id, name: user.name, email: user.email });
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize: store only user ID in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize: look up user from DB on each request
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user || false);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
