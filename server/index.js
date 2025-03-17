const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./middleware/GoogleAuth'); // Ensure Google Auth is loaded
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const app = express();

// ✅ Use CORS only once
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));

app.use(express.json());

// ✅ Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }, 
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Use authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
