// ArticleCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/blog/${article.id}`);
  };

  const openAuthorModal = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to the parent
    setShowModal(true);
  };


  const closeAuthorModal = () => {
    setShowModal(false);
  };
  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };
  const thumbnailUrl = article.thumbnail_url?.trim() ? article.thumbnail_url : 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png';

  const authorAvatar = article.author_avatar?.trim() ? article.author_avatar : '/images/profile_placeholder.jpg';
  console.log(thumbnailUrl);
  return (
    <>
      <div className="article-card" >
        {/* Thumbnail on the left */}
        <div className="article-card-without-comment-section">
          <img
            className="article-card-image"
            src={thumbnailUrl}
            alt={article.title}
            onClick={handleCardClick}
          />

          {/* Middle section with title/abstract/author */}
          <div className="article-card-content" onClick={handleCardClick}>
            <h2 className="article-card-header">{article.title}</h2>
            <p className="article-card-abstract">{article.abstract}</p>

            <div className="article-card-author" onClick={(e) => openAuthorModal(e)}>
              <img
                className="article-card-author-avatar"
                src={authorAvatar}
                alt="Author"
              />
              <span className="article-card-author-name">
                {article.author_name || 'Unknown Author'}
                
              </span>
              <div className="tag-list">
                  {(article.tags || []).map(tag => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
              </div>
            </div>
          </div>

          {/* Right side with up/down vote & counts */}
          <div className="article-card-actions">
            <button className="adp-vote-btn adp-upvote-btn" onClick={handleUpvote}>
              ↑ {upvotes}
            </button>
            <button className="adp-vote-btn adp-downvote-btn" onClick={handleDownvote}>
              ↓ {downvotes}
            </button>

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
