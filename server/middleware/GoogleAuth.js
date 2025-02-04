const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../config/db');
require('dotenv').config();

passport.serializeUser((user, done) => {
  if (!user || !user.id) {
    return done(new Error('Invalid user object'), null);
  }
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (!rows.length) {
      return done(new Error('User not found'), null);
    }
    const { id, name, email } = rows[0];
    done(null, { id, name, email }); // Return minimal user info
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { rows } = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
        let user = rows[0];
        if (!user) {
          const name = profile.displayName || 'Unknown User';
          const email = profile.emails?.[0]?.value || `no-email-${profile.id}@example.com`;
          const insertResult = await pool.query(
            `INSERT INTO users (name, email, google_id)
             VALUES ($1, $2, $3) RETURNING id, name, email`,
            [name, email, profile.id]
          );
          user = insertResult.rows[0];
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
