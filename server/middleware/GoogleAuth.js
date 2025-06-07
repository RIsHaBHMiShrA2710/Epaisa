// middleware/GoogleAuth.js

const cloudinary = require('../config/cloudinaryConfig');
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
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${process.env.SERVER_URL}/api/auth/google/callback`,
      // disable sessions if you’re using JWT only:
      // passReqToCallback: false,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email   = profile.emails?.[0]?.value || `no-email-${profile.id}@example.com`;
        const name    = profile.displayName || 'Unknown User';
        const avatar  = profile.photos?.[0]?.value;  // URL from Google

        // Upsert avatar via Cloudinary remote fetch
        let avatarUrl = null;
        if (avatar) {
          const uploadResult = await cloudinary.uploader.upload(avatar, {
            folder: 'Epaisa-Article-Thumbnails',
            resource_type: 'image',
          });
          avatarUrl = uploadResult.secure_url;
        }

        // Find or create the user
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = rows[0];

        if (user) {
          // Update google_id or avatar_url if missing
          if (!user.google_id || !user.avatar_url) {
            await pool.query(
              'UPDATE users SET google_id = $1, avatar_url = $2 WHERE email = $3',
              [profile.id, avatarUrl, email]
            );
          }
        } else {
          // Insert new user
          const insertResult = await pool.query(
            `INSERT INTO users
               (name, email, google_id, auth_provider, password, avatar_url)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, name, email, auth_provider`,
            [name, email, profile.id, 'google', null, avatarUrl]
          );
          user = insertResult.rows[0];
        }

        done(null, user);
      } catch (error) {
        console.error('Google Auth Error:', error);
        done(error, null);
      }
    }
  )
);

module.exports = passport;
