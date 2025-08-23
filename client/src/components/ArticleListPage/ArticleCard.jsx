// ArticleCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ArticleCard.css'; // Import custom CSS
import { castVote } from '../service/voteService';
import { useAuth } from '../../authContext';
import CommentSection from './CommentSection';
import { IconArrowUp, IconArrowDown, IconMessage, IconShare, IconLoader2 } from '@tabler/icons-react';
import AuthorModal from './AuthorModal';

function ArticleCard({ article }) {
  const { token, user } = useAuth();
  const [upvotes, setUpvotes] = useState(article.upvote_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [downvotes, setDownvotes] = useState(article.downvote_count || 0);
  const [showModal, setShowModal] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState(null); // Track user's current vote

  const handleUpvote = async () => {
    if (!user) {
      alert('You need to log in to vote.');
      return;
    }
    
    if (isVoting) return; // Prevent multiple simultaneous requests

    // Optimistic update
    const previousUpvotes = upvotes;
    const previousDownvotes = downvotes;
    const previousUserVote = userVote;

    // Calculate optimistic values
    let newUpvotes = upvotes;
    let newDownvotes = downvotes;
    let newUserVote = userVote;

    if (userVote === 1) {
      // User is removing their upvote
      newUpvotes = upvotes - 1;
      newUserVote = null;
    } else if (userVote === -1) {
      // User is changing from downvote to upvote
      newUpvotes = upvotes + 1;
      newDownvotes = downvotes - 1;
      newUserVote = 1;
    } else {
      // User is adding an upvote
      newUpvotes = upvotes + 1;
      newUserVote = 1;
    }

    // Apply optimistic updates
    setUpvotes(newUpvotes);
    setDownvotes(newDownvotes);
    setUserVote(newUserVote);
    setIsVoting(true);

    try {
      const result = await castVote({ articleId: article.id, voteValue: 1, token });
      // Update with actual values from server
      setUpvotes(result.updatedArticle.upvote_count);
      setDownvotes(result.updatedArticle.downvote_count);
      // Update user vote based on successful response
      setUserVote(result.userVote || null);
    } catch (error) {
      console.error('Upvote error:', error);
      // Revert optimistic updates on error
      setUpvotes(previousUpvotes);
      setDownvotes(previousDownvotes);
      setUserVote(previousUserVote);
      alert('Failed to vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownvote = async () => {
    if (!user) {
      alert('You need to log in to vote.');
      return;
    }
    
    if (isVoting) return; // Prevent multiple simultaneous requests

    // Optimistic update
    const previousUpvotes = upvotes;
    const previousDownvotes = downvotes;
    const previousUserVote = userVote;

    // Calculate optimistic values
    let newUpvotes = upvotes;
    let newDownvotes = downvotes;
    let newUserVote = userVote;

    if (userVote === -1) {
      // User is removing their downvote
      newDownvotes = downvotes - 1;
      newUserVote = null;
    } else if (userVote === 1) {
      // User is changing from upvote to downvote
      newUpvotes = upvotes - 1;
      newDownvotes = downvotes + 1;
      newUserVote = -1;
    } else {
      // User is adding a downvote
      newDownvotes = downvotes + 1;
      newUserVote = -1;
    }

    // Apply optimistic updates
    setUpvotes(newUpvotes);
    setDownvotes(newDownvotes);
    setUserVote(newUserVote);
    setIsVoting(true);

    try {
      const result = await castVote({ articleId: article.id, voteValue: -1, token });
      // Update with actual values from server
      setUpvotes(result.updatedArticle.upvote_count);
      setDownvotes(result.updatedArticle.downvote_count);
      // Update user vote based on successful response
      setUserVote(result.userVote || null);
    } catch (error) {
      console.error('Downvote error:', error);
      // Revert optimistic updates on error
      setUpvotes(previousUpvotes);
      setDownvotes(previousDownvotes);
      setUserVote(previousUserVote);
      alert('Failed to vote. Please try again.');
    } finally {
      setIsVoting(false);
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
      <div className="article-card">
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
            <button 
              className={`adp-vote-btn adp-upvote-btn ${userVote === 1 ? 'active' : ''} ${isVoting ? 'loading' : ''}`}
              onClick={handleUpvote}
              disabled={isVoting}
            >
              {isVoting ? <IconLoader2 size={16} className="spin" /> : '↑'} {upvotes}
            </button>
            <button 
              className={`adp-vote-btn adp-downvote-btn ${userVote === -1 ? 'active' : ''} ${isVoting ? 'loading' : ''}`}
              onClick={handleDownvote}
              disabled={isVoting}
            >
              {isVoting ? <IconLoader2 size={16} className="spin" /> : '↓'} {downvotes}
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