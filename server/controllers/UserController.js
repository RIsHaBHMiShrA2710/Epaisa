const pool = require('../config/db');

exports.getUserDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    // User basic info
    const userQuery = await pool.query('SELECT id, name, email, bio, avatar_url FROM users WHERE id = $1', [userId]);
    const user = userQuery.rows[0];

    // Articles created by user
    const articlesQuery = await pool.query(
      'SELECT id, title, abstract, thumbnail_url, created_at FROM articles WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    // Upvoted articles
    const upvotesQuery = await pool.query(
      `SELECT a.id, a.title, a.abstract, a.thumbnail_url
       FROM votes v JOIN articles a ON v.article_id = a.id
       WHERE v.user_id = $1 AND v.vote_value = 1`,
      [userId]
    );

    // Downvoted articles
    const downvotesQuery = await pool.query(
      `SELECT a.id, a.title, a.abstract, a.thumbnail_url
       FROM votes v JOIN articles a ON v.article_id = a.id
       WHERE v.user_id = $1 AND v.vote_value = -1`,
      [userId]
    );

    res.json({
      user,
      articles: articlesQuery.rows,
      upvotedArticles: upvotesQuery.rows,
      downvotedArticles: downvotesQuery.rows
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};