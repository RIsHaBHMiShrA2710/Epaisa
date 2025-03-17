
const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/ArticleController');
const authMiddleware = require('../middleware/authMiddleware'); // ensure routes are protected

// Create a new article
router.post('/', authMiddleware, ArticleController.createArticle);
// Get list of all articles
router.get('/', ArticleController.getAllArticles);
// Get a specific article by id
router.get('/:id', ArticleController.getArticleById);
// Update an article
router.put('/:id', authMiddleware, ArticleController.updateArticle);
// Delete an article
router.delete('/:id', authMiddleware, ArticleController.deleteArticle);

module.exports = router;
