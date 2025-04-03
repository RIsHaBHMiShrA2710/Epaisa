const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
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
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `no-email-${profile.id}@example.com`;
        const name = profile.displayName || 'Unknown User';
        const avatar = profile.photos?.[0]?.value;

        // Upload avatar to Cloudinary
        let avatarUrl = null;
        if (avatar) {
          const response = await axios.get(avatar, { responseType: 'arraybuffer' });
          const stream = require('stream');
          const bufferStream = new stream.PassThrough();
          bufferStream.end(Buffer.from(response.data, 'binary'));
        
          const uploadPromise = new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
              { resource_type: 'image', public_id: `avatars/${uuidv4()}` },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );
            bufferStream.pipe(upload);
          });
        
          const result = await uploadPromise;
          avatarUrl = result.secure_url;
          
        }
        


        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = rows[0];

        if (user) {
          if (!user.google_id || !user.avatar_url) {
            await pool.query(
              'UPDATE users SET google_id = $1, avatar_url = $2 WHERE email = $3',
              [profile.id, avatarUrl, email]
            );
          }
        } else {
          const insertResult = await pool.query(
            `INSERT INTO users (name, email, google_id, auth_provider, password, avatar_url)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, auth_provider`,
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
