const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/ArticleController');
const auth = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');
const authOptional = require('../middleware/authOptional')
// Validate numeric :id
router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(400).json({ message: 'Invalid id' });
  next();
});

// Create (multipart)
router.post('/', auth, upload.single('thumbnail'), ArticleController.createArticle);

// List (public)
router.get('/', ArticleController.getAllArticles);

// Get one (public, but controller should hide drafts unless owner)
router.get('/:id', ArticleController.getArticleById);

// Update (owner-only in controller; allow new thumbnail)
router.put('/:id', auth, upload.single('thumbnail'), ArticleController.updateArticle);

// Delete (owner-only in controller)
router.delete('/:id', auth, ArticleController.deleteArticle);

module.exports = router;
