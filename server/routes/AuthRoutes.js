const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, logout } = require('../controllers/AuthController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}?error=googleAuth`,
  }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}`);
  }
);
module.exports = router;
