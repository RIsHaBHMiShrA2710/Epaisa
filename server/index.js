// server.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const passport = require('passport');
require('dotenv').config();

// load your DB Pool configured to use process.env.DATABASE_URL:
const pool = require('./db');

// load passport strategies
require('./middleware/GoogleAuth');

const authRoutes       = require('./routes/AuthRoutes');
const articleRoutes    = require('./routes/articleRoutes');
const commentRoutes    = require('./routes/commentRoutes');
const voteRoutes       = require('./routes/voteRoutes');
const uploadRoutes     = require('./routes/imageUploadRoutes');
const userRoutes       = require('./routes/UserRoutes');
const UpdateUserRoutes = require('./routes/UpdateUserRoutes');
const ContactRoutes    = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Use FRONTEND_URL env var for deployable CORS, fallback to your local dev URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Postgres-backed sessions instead of MemoryStore
app.use(session({
  store: new PgSession({
    pool,             // reuse your pg Pool
    tableName: 'session' 
  }),
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS in prod
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24  // 1 day
  }
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth',       authRoutes);
app.use('/api/articles',   articleRoutes);
app.use('/api/comments',   commentRoutes);
app.use('/api/votes',      voteRoutes);
app.use('/api',            uploadRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/users/update', UpdateUserRoutes);
app.use('/api/contact',    ContactRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
