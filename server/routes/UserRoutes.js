const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUserDashboard } = require('../controllers/UserController');

router.get('/me/dashboard', authMiddleware, getUserDashboard);
module.exports = router;