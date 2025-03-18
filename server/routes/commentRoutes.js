const express = require('express');
const router = express.Router();
const CommentsController = require('../controllers/CommentsController')
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, CommentsController.createComment);

router.get('/:articleId', CommentsController.getCommentsByArticle);

module.exports = router;