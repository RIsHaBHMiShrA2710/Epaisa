// routes/voteRoutes.js
const express = require('express');
const router = express.Router();
const VoteController = require('../controllers/voteController');
const authMiddleware = require('../middleware/authMiddleware'); 
router.post('/', authMiddleware, VoteController.castVote);

module.exports = router;
