const express = require('express');
const passport = require('passport');
const { register, login, logout } = require('../controllers/AuthController');

const router = express.Router();

// ✅ Email/Password Auth Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// ✅ Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}?error=googleAuth`,
  }),
  (req, res) => {
    console.log("✅ Google Auth Successful!", req.user); // Debugging
    res.redirect(`${process.env.CLIENT_URL}`);
  }
);

// ✅ Fetch Logged-in User (Now inside `/api/auth`)
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json(req.user);
});

module.exports = router;
