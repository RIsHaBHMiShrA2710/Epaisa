// src/services/voteService.js
import axios from 'axios';
const BACKEND = import.meta.env.MODE === 'development'
? 'http://localhost:5000'
: import.meta.env.VITE_BACKEND_URL;


export const castVote = async ({ articleId, voteValue, token }) => {
  const response = await axios.post(
    `${BACKEND}/api/votes`,
    { article_id: articleId, vote_value: voteValue },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
