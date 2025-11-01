// CommentItem.jsx
import React, { useState } from 'react';
import { createComment } from '../service/commentService';
import { useAuth } from '../../authContext';
import './CommentSection.css';

function CommentItem({ comment, allComments, articleId, token, onReplyAdded }) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const replies = allComments.filter((c) => c.parent_comment_id === comment.id);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to reply.');
      return;
    }
    try {
      const result = await createComment({
        articleId,
        commentText: replyText,
        parentCommentId: comment.id,
        token
      });
      setReplyText('');
      setShowReplyForm(false);
      // Instead of reloading, call the callback
      if (onReplyAdded && result.updatedCount !== undefined) {
        onReplyAdded(result.updatedCount);
      }
    } catch (err) {
      console.error('Failed to post reply:', err);
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <strong>{comment.author_name || 'Unknown User'}</strong>
        <span>{new Date(comment.created_at).toLocaleString()}</span>
      </div>
      <p>{comment.comment_text}</p>
      <button onClick={() => setShowReplyForm(!showReplyForm)} className="reply-button">
        {showReplyForm ? 'Cancel' : 'Reply'}
      </button>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            required
          />
          <button type="submit" className="reply-button">Reply</button>
        </form>
      )}

      {/* Render nested replies */}
      {replies.length > 0 && (
        <div className="nested-replies">
          {replies.map((r) => (
            <CommentItem
              key={r.id}
              comment={r}
              allComments={allComments}
              articleId={articleId}
              token={token}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
