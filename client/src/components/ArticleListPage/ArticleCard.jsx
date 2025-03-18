// ArticleCard.jsx
import React, { useState } from 'react';
import './ArticleCard.css'; // Import custom CSS
import { IconArrowUp, IconArrowDown, IconMessage, IconShare } from '@tabler/icons-react';
import AuthorModal from './AuthorModal';

function ArticleCard({ article }) {
  const [upvotes, setUpvotes] = useState(article.upvote_count || 0);
  const [downvotes, setDownvotes] = useState(article.downvote_count || 0);
  const [showModal, setShowModal] = useState(false);

  const handleUpvote = () => {
    // TODO: Call your API to increment upvote
    setUpvotes(upvotes + 1);
  };

  const handleDownvote = () => {
    // TODO: Call your API to increment downvote
    setDownvotes(downvotes + 1);
  };

  const openAuthorModal = () => {
    setShowModal(true);
  };

  const closeAuthorModal = () => {
    setShowModal(false);
  };

  const thumbnailUrl = article.thumbnail_url || 'placeholder.jpg';
  const authorAvatar = article.authorAvatar || 'avatar_placeholder.jpg';

  return (
    <>
      <div className="article-card">
        {/* Thumbnail on the left */}
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
            <IconMessage size={18} className="article-card-action-icon" />
            <span className="article-card-action-count">
              {article.comments_count || 0}
            </span>
          </div>
          <div className="article-card-action-item">
            <IconShare size={18} className="article-card-action-icon" />
            <span className="article-card-action-count">
              {article.share_count || 0}
            </span>
          </div>
        </div>
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
