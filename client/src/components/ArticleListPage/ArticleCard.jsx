// ArticleCard.jsx
import React, { useState } from 'react';
import './ArticleCard.css'; // Import custom CSS
import { castVote } from '../service/voteService';
import { useAuth } from '../../AuthContext';
import CommentSection from './CommentSection';
import { IconArrowUp, IconArrowDown, IconMessage, IconShare } from '@tabler/icons-react';
import AuthorModal from './AuthorModal';

function ArticleCard({ article }) {
  const { token, user } = useAuth();
  const [upvotes, setUpvotes] = useState(article.upvote_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [downvotes, setDownvotes] = useState(article.downvote_count || 0);
  const [showModal, setShowModal] = useState(false);

  const handleUpvote = async () => {
    if (!user) {
      alert('You need to log in to vote.');
      return;
    }
    try {
      const result = await castVote({ articleId: article.id, voteValue: 1, token });
      setUpvotes(result.updatedArticle.upvote_count);
      setDownvotes(result.updatedArticle.downvote_count);
    } catch (error) {
      console.error('Upvote error:', error);
    }
  };

  const handleDownvote = async () => {
    if (!user) {
      alert('You need to log in to vote.');
      return;
    }
    try {
      const result = await castVote({ articleId: article.id, voteValue: -1, token });
      setUpvotes(result.updatedArticle.upvote_count);
      setDownvotes(result.updatedArticle.downvote_count);
    } catch (error) {
      console.error('Downvote error:', error);
    }
  };


  const openAuthorModal = () => {
    setShowModal(true);
  };

  const closeAuthorModal = () => {
    setShowModal(false);
  };
  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };
  const thumbnailUrl = article.thumbnail_url || 'placeholder.jpg';
  const authorAvatar = article.authorAvatar || 'https://imgur.com/0tepHqb.jpg';

  return (
    <>
      <div className="article-card">
        {/* Thumbnail on the left */}
        <div className="article-card-without-comment-section">
          <img
            className="article-card-image"
            src={thumbnailUrl}
            alt={article.title}
          />

          {/* Middle section with title/abstract/author */}
          <div className="article-card-content">
            <h2 className="article-card-header">{article.title}</h2>
            <p className="article-card-abstract">{article.abstract}</p>

            <div className="article-card-author" onClick={openAuthorModal}>
              <img
                className="article-card-author-avatar"
                src={authorAvatar}
                alt="Author"
              />
              <span className="article-card-author-name">
                {article.authorName || 'Unknown Author'}
              </span>
            </div>
          </div>

          {/* Right side with up/down vote & counts */}
          <div className="article-card-actions">
            <div className="article-card-action-item" onClick={handleUpvote}>
              <IconArrowUp size={18} className="article-card-action-icon" />
              <span className="article-card-action-count">{upvotes}</span>
            </div>
            <div className="article-card-action-item" onClick={handleDownvote}>
              <IconArrowDown size={18} className="article-card-action-icon" />
              <span className="article-card-action-count">{downvotes}</span>
            </div>
            <div className="article-card-action-item">
              <div
                className="action-item"
                onClick={toggleComments}
              >
                <IconMessage size={18} className="article-card-action-icon" />
                <span className="article-card-action-count">{article.comments_count || 0}</span>
              </div>
            </div>
            <div className="article-card-action-item">
              <IconShare size={18} className="article-card-action-icon" />
              <span className="article-card-action-count">
                {article.share_count || 0}
              </span>
            </div>
          </div>
        </div>
        {showComments && (
          <CommentSection articleId={article.id} />
        )}
      </div>

      {/* Author Modal */}
      {showModal && (
        <AuthorModal
          opened={showModal}
          onClose={closeAuthorModal}
          authorId={article.user_id}
          authorName={article.authorName}
          authorAvatar={authorAvatar}
        />
      )}
    </>
  );
}

export default ArticleCard;
