// CommentSection.jsx
import React, { useState, useEffect } from 'react';
import { getCommentsByArticle, createComment } from '../service/commentService';
import CommentItem from './CommentItem';
import { useAuth } from '../../AuthContext';
import './CommentSection.css';

function CommentSection({ articleId, onCommentAdded, onClose }) {
  const { user, token } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const data = await getCommentsByArticle(articleId);
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to comment.');
      return;
    }
    try {
      const result = await createComment({
        articleId,
        commentText: commentText, // Use commentText here
        parentCommentId: null,
        token
      });
      setCommentText(''); // Clear commentText on success
      fetchComments(); 
      if (onCommentAdded && result.updatedCount !== undefined) {
        onCommentAdded(result.updatedCount);
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const topLevelComments = comments.filter((c) => c.parent_comment_id === null);

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          className="comment-input"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button type="submit" className="comment-submit">Post Comment</button>
      </form>

      <div className="comments-list">
        {topLevelComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            allComments={comments}
            articleId={articleId}
            token={token}
            onReplyAdded={(updatedCount) => {
              fetchComments();
              if (onCommentAdded && updatedCount !== undefined) {
                onCommentAdded(updatedCount);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
