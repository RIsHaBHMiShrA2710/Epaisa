// src/services/voteService.js
import axios from 'axios';

export const castVote = async ({ articleId, voteValue, token }) => {
  const response = await axios.post(
    'https://epaise-backend.onrender.com/api/votes',
    { article_id: articleId, vote_value: voteValue },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
