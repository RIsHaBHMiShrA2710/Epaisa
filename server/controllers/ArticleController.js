// controllers/ArticleController.js
const pool = require('../config/db');
const cloudinary = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');
exports.createArticle = async (req, res) => {
  try {
    const { title, abstract, content } = req.body;
    const userId = req.user.id;

    let thumbnail_url = null;

    // If thumbnail exists, upload to Cloudinary
    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'Epaisa-Article-Thumbnails' },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();
      thumbnail_url = result.secure_url;
    }

    const query = `
      INSERT INTO articles (user_id, title, abstract, content, thumbnail_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [userId, title, abstract, content, thumbnail_url];
    const { rows } = await pool.query(query, values);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM articles ORDER BY created_at DESC;');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM articles WHERE id = $1;', [id]);
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
