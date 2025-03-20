const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { register, login, logout } = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

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
    console.log("✅ Google Auth Successful!", req.user);
    // Generate a JWT token from req.user
    const token = jwt.sign(
      { id: req.user.id, name: req.user.name, email: req.user.email },
      process.env.SESSION_SECRET,
      { expiresIn: '1h' }
    );
    // Redirect to the frontend with the token appended in the query parameters
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

// ✅ Fetch Logged-in User (Now inside `/api/auth`)
router.get('/me', authMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json(req.user);
});

module.exports = router;
