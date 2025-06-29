// controllers/ArticleController.js
const pool = require('../config/db');
const cloudinary = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');
exports.createArticle = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1) Parse inputs
    const { title, abstract, content } = req.body;
    let tags = [];
    if (req.body.tags) {
      if (typeof req.body.tags === 'string') {
        // form-data path
        try { tags = JSON.parse(req.body.tags) } catch { }
      } else if (Array.isArray(req.body.tags)) {
        // raw-JSON path
        tags = req.body.tags.map(t => t.trim().toLowerCase());
      }
    }
    const userId = req.user.id;

    // 2) Handle thumbnail upload 
    let thumbnail_url = null;
    if (req.file) {
      const streamUpload = () => new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'Epaisa-Article-Thumbnails' },
          (error, result) => error ? reject(error) : resolve(result)
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      const result = await streamUpload();
      thumbnail_url = result.secure_url;
    }

    // 3) Insert article
    const insertArticleSQL = `
      INSERT INTO articles (user_id, title, abstract, content, thumbnail_url)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id, user_id, title, abstract, content, thumbnail_url;
    `;
    const { rows } = await client.query(insertArticleSQL, [
      userId, title, abstract, content, thumbnail_url
    ]);
    const article = rows[0];

    // 4) Upsert tags + link in join table
    for (let raw of tags) {
      const name = raw.trim().toLowerCase();
      if (!name) continue;
      // a) ensure tag exists
      await client.query(
        `INSERT INTO tags(name) VALUES($1) ON CONFLICT(name) DO NOTHING`,
        [name]
      );
      // b) fetch its id
      const { rows: tagRows } = await client.query(
        `SELECT id FROM tags WHERE name=$1`,
        [name]
      );
      const tagId = tagRows[0].id;
      // c) link to article
      await client.query(
        `INSERT INTO article_tags(article_id, tag_id)
         VALUES($1,$2) ON CONFLICT DO NOTHING`,
        [article.id, tagId]
      );
    }

    await client.query('COMMIT');

    // 5) Return article + tags
    article.tags = tags;
    res.status(201).json(article);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating article:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};


exports.getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const offset = (page - 1) * limit;

    const { rows } = await pool.query(
      `
      SELECT
        a.id,
        a.user_id,
        a.title,
        a.abstract,
        a.content,
        a.thumbnail_url,
        a.upvote_count,
        a.downvote_count,
        a.share_count,
        u.name           AS author_name,
        u.avatar_url     AS author_avatar,
        COALESCE(t.tags, ARRAY[]::text[]) AS tags
      FROM articles a
      LEFT JOIN users u
        ON a.user_id = u.id
      /* sub-query that gathers all tag names per article_id */
      LEFT JOIN (
        SELECT
          at.article_id,
          array_agg(t.name ORDER BY t.name) AS tags
        FROM article_tags at
        JOIN tags t
          ON at.tag_id = t.id
        GROUP BY at.article_id
      ) t
        ON t.article_id = a.id
      ORDER BY a.created_at DESC
      LIMIT $1
      OFFSET $2
      `,
      [limit, offset]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT articles.*, users.name AS author_name, users.avatar_url as author_avatar FROM articles LEFT JOIN users ON articles.user_id = users.id WHERE articles.id = $1;', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Article not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, abstract, content, thumbnail_url } = req.body;
    // Optionally check if req.user.id matches article's author
    const query = `
      UPDATE articles 
      SET title = $1, abstract = $2, content = $3, thumbnail_url = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *;
    `;
    const values = [title, abstract, content, thumbnail_url, id];
    const { rows } = await pool.query(query, values);
    if (!rows.length) return res.status(404).json({ message: 'Article not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    // Optionally check ownership before deletion
    const { rowCount } = await pool.query('DELETE FROM articles WHERE id = $1;', [id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
