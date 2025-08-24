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
    const { rows } = await pool.query(
      `
      SELECT
        a.*,
        u.name AS author_name,
        u.avatar_url AS author_avatar,
        COALESCE(t.tags, ARRAY[]::text[]) AS tags
      FROM articles a
      LEFT JOIN users u
        ON a.user_id = u.id
      /* sub-query that gathers all tag names for the article_id */
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
      WHERE a.id = $1;
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// If you use Cloudinary, ensure env vars are set or CLOUDINARY_URL is present
// cloudinary.config({ cloud_name: ..., api_key: ..., api_secret: ... });

exports.updateArticle = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    // 0) Load current row + ownership
    const cur = await client.query(
      'SELECT user_id, title, abstract, content, thumbnail_url FROM articles WHERE id=$1',
      [id]
    );
    if (!cur.rows.length) return res.status(404).json({ message: 'Article not found' });
    if (!req.user || cur.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // 1) Extract basic fields
    const { title, abstract, content } = req.body;

    // 2) Thumbnail (optional)
    let thumbnail_url = cur.rows[0].thumbnail_url;
    if (req.file) {
      if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME) {
        const uploadToCloudinary = (buffer, filename) =>
          new Promise((resolve, reject) => {
            const publicId =
              (filename || `article_${id}`).replace(/\.[^.]+$/, '') + '_' + Date.now();
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'articles', public_id: publicId, resource_type: 'image' },
              (err, result) => (err ? reject(err) : resolve(result.secure_url))
            );
            stream.end(buffer);
          });

        if (req.file.buffer) {
          thumbnail_url = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        } else if (req.file.path) {
          const up = await cloudinary.uploader.upload(req.file.path, {
            folder: 'articles',
            resource_type: 'image',
          });
          thumbnail_url = up.secure_url;
        }
      } else if (req.file.path) {
        thumbnail_url = req.file.path; // disk path
      }
    }

    // 3) Coalesce partial fields
    const newTitle = typeof title === 'string' ? title : cur.rows[0].title;
    const newAbstract = typeof abstract === 'string' ? abstract : cur.rows[0].abstract;
    const newContent = typeof content === 'string' ? content : cur.rows[0].content;

    await client.query('BEGIN');

    // 4) Update article main fields
    const { rows: updatedRows } = await client.query(
      `UPDATE articles
         SET title=$1,
             abstract=$2,
             content=$3,
             thumbnail_url=$4,
             updated_at=NOW()
       WHERE id=$5
       RETURNING *;`,
      [newTitle, newAbstract, newContent, thumbnail_url, id]
    );
    const updatedArticle = updatedRows[0];

    // 5) Tags: only update if client sent "tags" (keep existing otherwise)
    if (typeof req.body.tags !== 'undefined') {
      // Parse and normalize
      let incoming = [];
      try { incoming = JSON.parse(req.body.tags || '[]'); } catch { incoming = []; }
      let finalTags = (incoming || [])
        .map(t => String(t || '').trim())
        .filter(Boolean)
        .map(t => t.toLowerCase());

      // force "edited" on any update
      if (!finalTags.includes('edited')) finalTags.push('edited');

      // unique
      finalTags = Array.from(new Set(finalTags));

      if (finalTags.length === 0) {
        // If empty list explicitly sent → clear relations
        await client.query('DELETE FROM article_tags WHERE article_id = $1', [id]);
      } else {
        // Upsert tag names into `tags`, collect ids
        const tagIds = [];
        for (const name of finalTags) {
          const { rows: tagRow } = await client.query(
            `INSERT INTO tags (name)
               VALUES ($1)
               ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
             RETURNING id;`,
            [name]
          );
          tagIds.push(tagRow[0].id);
        }

        // Rewire relations: simplest is delete & bulk insert
        await client.query('DELETE FROM article_tags WHERE article_id = $1', [id]);

        // Bulk insert relations
        // Build VALUES ($1,$2),($1,$3),...
        const values = [];
        const params = [id];
        tagIds.forEach((tid, i) => {
          params.push(tid);
          values.push(`($1, $${i + 2})`);
        });
        const relSQL = `INSERT INTO article_tags (article_id, tag_id) VALUES ${values.join(',')}
                        ON CONFLICT DO NOTHING;`;
        await client.query(relSQL, params);
      }
    }

    await client.query('COMMIT');
    return res.json(updatedArticle);
  } catch (error) {
    try { await pool.query('ROLLBACK'); } catch { }
    console.error('Error updating article:', error, { body: req.body, file: !!req.file });
    return res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};


exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const art = await pool.query('SELECT user_id FROM articles WHERE id=$1', [id]);
    if (!art.rows.length) return res.status(404).json({ message: 'Article not found' });
    if (art.rows[0].user_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await pool.query('DELETE FROM articles WHERE id=$1', [id]);
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    console.error('deleteArticle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
