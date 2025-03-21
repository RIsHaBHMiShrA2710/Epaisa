// src/services/commentService.js
import axios from 'axios';

export async function getCommentsByArticle(articleId) {
  const response = await axios.get(`http://localhost:5000/api/comments/${articleId}`);
  return response.data;
}

export async function createComment({ articleId, commentText, parentCommentId, token }) {
  const response = await axios.post(
    'http://localhost:5000/api/comments',
    {
      article_id: articleId,
      comment_text: commentText,
      parent_comment_id: parentCommentId || null,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
