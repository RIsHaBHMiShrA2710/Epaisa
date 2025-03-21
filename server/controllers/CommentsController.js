const pool = require('../config/db');

exports.createComment = async (req, res) => {
  try {
    const { article_id, comment_text, parent_comment_id } = req.body;
    const user_id = req.user.id;

    // 1. Insert the new comment
    const insertQuery = `
      INSERT INTO comments (article_id, user_id, comment_text, parent_comment_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [article_id, user_id, comment_text, parent_comment_id || null];
    const { rows } = await pool.query(insertQuery, values);
    const newComment = rows[0];

    // 2. Update the article's comments_count using COALESCE to handle NULLs
    const updateArticleQuery = `
      UPDATE articles
      SET comments_count = COALESCE(comments_count, 0) + 1
      WHERE id = $1
      RETURNING comments_count;
    `;
    const { rows: articleRows } = await pool.query(updateArticleQuery, [article_id]);
    const updatedCount = articleRows[0].comments_count;

    // 3. Return both the new comment and the updated comment count
    res.status(201).json({ newComment, updatedCount });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCommentsByArticle = async (req, res) => {
  try {
    // Expect articleId as a route parameter
    const { articleId } = req.params;

    const query = `
          WITH RECURSIVE comment_tree AS (
        SELECT
          c.id,
          c.comment_text,
          c.article_id,
          c.parent_comment_id,
          c.created_at,
          0 AS level,
          u.name AS author_name
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.article_id = $1
          AND c.parent_comment_id IS NULL

        UNION ALL

        SELECT
          c2.id,
          c2.comment_text,
          c2.article_id,
          c2.parent_comment_id,
          c2.created_at,
          comment_tree.level + 1 AS level,
          u2.name AS author_name
        FROM comments c2
        JOIN users u2 ON c2.user_id = u2.id
        INNER JOIN comment_tree ON c2.parent_comment_id = comment_tree.id
      )
      SELECT * FROM comment_tree ORDER BY created_at ASC;
        `;
    const values = [articleId];
    const { rows } = await pool.query(query, values);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};