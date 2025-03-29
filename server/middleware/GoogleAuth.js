const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../config/db');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, rows[0]);
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
        const email = profile.emails?.[0]?.value || `no-email-${profile.id}@example.com`;
        const name = profile.displayName || 'Unknown User';
        const avatar = profile.photos?.[0]?.value || null;

        // 1️⃣ **Check if the user already exists (by email)**
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = rows[0];

        if (user) {
          // ✅ User exists, update their Google ID if missing
          if (!user.google_id) {
            await pool.query('UPDATE users SET google_id = $1, avatar_url = $3 WHERE email = $2', [profile.id, email, avatar]);
          }
        } else {
          // ❌ User does NOT exist, insert a new record
          const insertResult = await pool.query(
            `INSERT INTO users (name, email, google_id, auth_provider, password, avatar_url)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, auth_provider`,
            [name, email, profile.id, 'google', null, avatar]
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
