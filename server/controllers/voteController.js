// controllers/VoteController.js
const pool = require('../config/db');

exports.castVote = async (req, res) => {
  const { article_id, vote_value } = req.body;
  const user_id = req.user.id; // Assumes JWT middleware set req.user

  // Validate vote_value
  if (![1, -1].includes(vote_value)) {
    return res.status(400).json({ message: 'Invalid vote value' });
  }

  try {
    // Check if a vote already exists for this user and article
    const checkVoteQuery = `
      SELECT * FROM votes WHERE article_id = $1 AND user_id = $2;
    `;
    const { rows: existingRows } = await pool.query(checkVoteQuery, [article_id, user_id]);

    let vote;
    if (existingRows.length > 0) {
      // Vote exists, update it
      const updateQuery = `
        UPDATE votes
        SET vote_value = $1, updated_at = NOW()
        WHERE article_id = $2 AND user_id = $3
        RETURNING *;
      `;
      const { rows } = await pool.query(updateQuery, [vote_value, article_id, user_id]);
      vote = rows[0];
    } else {
      // Insert a new vote
      const insertQuery = `
        INSERT INTO votes (article_id, user_id, vote_value)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const { rows } = await pool.query(insertQuery, [article_id, user_id, vote_value]);
      vote = rows[0];
    }

    // Recalculate vote totals for the article
    const updateArticleVotesQuery = `
      UPDATE articles
      SET 
        upvote_count = (SELECT COUNT(*) FROM votes WHERE article_id = $1 AND vote_value = 1),
        downvote_count = (SELECT COUNT(*) FROM votes WHERE article_id = $1 AND vote_value = -1)
      WHERE id = $1;
    `;
    await pool.query(updateArticleVotesQuery, [article_id]);

    // Optionally, you can fetch the updated article data to return
    const { rows: articleRows } = await pool.query('SELECT upvote_count, downvote_count FROM articles WHERE id = $1', [article_id]);
    const updatedArticle = articleRows[0];

    return res.status(200).json({ message: 'Vote recorded', vote, updatedArticle });
  } catch (error) {
    console.error('Error casting vote:', error);
    return res.status(500).json({ message: 'Server error while casting vote' });
  }
};
