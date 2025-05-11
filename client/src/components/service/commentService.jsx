// src/services/commentService.js
import axios from 'axios';
const BACKEND = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000'
  : import.meta.env.VITE_BACKEND_URL;

export async function getCommentsByArticle(articleId) {
  const response = await axios.get(`${BACKEND}/api/comments/${articleId}`);
  return response.data;
}

export async function createComment({ articleId, commentText, parentCommentId, token }) {
  const response = await axios.post(
    `${BACKEND}/api/comments`,
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
