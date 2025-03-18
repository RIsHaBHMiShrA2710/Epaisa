const pool = require('../config/db');

exports.createComment = async (req, res) => {
    try {
        const { article_id, comment_text, parent_comment_id } = req.body;
        const user_id = req.user.id;

        const query = `
        INSERT INTO comments (article_id, user_id, comment_text, parent_comment_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `;
        const values = [article_id, user_id, comment_text, parent_comment_id || null];
        const { rows } = await pool.query(query, values);

        res.status(201).json(rows[0]);
    }
    catch (error) {
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
            -- Base query: top-level comments
            SELECT
              id,
              comment_text,
              article_id,
              parent_comment_id,
              created_at,
              0 AS level
            FROM comments
            WHERE article_id = $1 AND parent_comment_id IS NULL
    
            UNION ALL
    
            -- Recursive part: get replies for each comment
            SELECT
              c.id,
              c.comment_text,
              c.article_id,
              c.parent_comment_id,
              c.created_at,
              ct.level + 1 AS level
            FROM comments c
            INNER JOIN comment_tree ct ON c.parent_comment_id = ct.id
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