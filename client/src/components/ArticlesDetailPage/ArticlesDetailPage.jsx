import React, { useRef, useState, useEffect } from 'react';
import CommentSection from '../ArticleListPage/CommentSection';
import { useAuth } from '../../authContext';
import { useParams } from 'react-router-dom';
import { castVote } from '../service/voteService';
import './ArticlesDetailsPage.css';
import DOMPurify from 'dompurify';
import Loader from '../Loader/Loader';
import Breadcrumbs from '../BreadCrumbs/Breadcrumbs';
import AuthorModal from '../ArticleListPage/AuthorModal';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const commentSectionRef = useRef(null);
  const [article, setArticle] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const BACKEND = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`${BACKEND}/api/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setArticle(data);
        setUpvotes(data.upvote_count || 0);
        setDownvotes(data.downvote_count || 0);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id, token]);

  const handleUpvote = async () => {
    if (!user) {
      alert('You need to log in to vote.');
      return;
    }
    
    if (voteLoading) return;
    
    try {
      setVoteLoading(true);
      const result = await castVote({ articleId: article.id, voteValue: 1, token });
      setUpvotes(result.updatedArticle.upvote_count);
      setDownvotes(result.updatedArticle.downvote_count);
    } catch (error) {
      console.error('Upvote error:', error);
      alert('Failed to cast vote. Please try again.');
    } finally {
      setVoteLoading(false);
    }
  };

  const handleDownvote = async () => {
    if (!user) {
      alert('You need to log in to vote.');
      return;
    }
    
    if (voteLoading) return;
    
    try {
      setVoteLoading(true);
      const result = await castVote({ articleId: article.id, voteValue: -1, token });
      setUpvotes(result.updatedArticle.upvote_count);
      setDownvotes(result.updatedArticle.downvote_count);
    } catch (error) {
      console.error('Downvote error:', error);
      alert('Failed to cast vote. Please try again.');
    } finally {
      setVoteLoading(false);
    }
  };

  const scrollToComments = () => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openAuthorModal = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const closeAuthorModal = () => {
    setShowModal(false);
  };

  // Loading state
  if (loading) {
    return <Loader />;
  }

  // Error state - if article is null after loading
  if (!article) {
    return (
      <div className="adp-container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '400px',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h2 style={{ color: '#4a5568', fontSize: '1.5rem' }}>Article not found</h2>
        <p style={{ color: '#718096' }}>The article you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const sanitizedHTML = DOMPurify.sanitize(article.content);
  const authorAvatar = article.author_avatar?.trim() 
    ? article.author_avatar 
    : '/images/profile_placeholder.jpg';

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <>
      <div className="adp-container">
        <div className="adp-header">
          <div className="adp-header-content">
            <div className="adp-header-left" onClick={openAuthorModal}>
              <img
                className="adp-author-avatar"
                src={article.author_avatar || '/images/profile_placeholder.jpg'}
                alt={article.author_name || 'Author'}
              />
              <span className="adp-author-name">{article.author_name || 'Unknown Author'}</span>
            </div>
            <div className="adp-header-right">
              <span className="adp-publish-date">
                {new Date(article.published_at).toLocaleDateString()}
              </span>
              <div className="adp-vote-buttons">
                <button className="adp-vote-btn adp-upvote-btn" onClick={handleUpvote} disabled={voteLoading}>
                  ↑ {upvotes}
                </button>
                <button className="adp-vote-btn adp-downvote-btn" onClick={handleDownvote} disabled={voteLoading}>
                  ↓ {downvotes}
                </button>
              </div>
              <button className="adp-comment-icon" onClick={scrollToComments}>
                💬 {article.comments_count || 0}
              </button>
            </div>
          </div>
        </div>
        
        <div className="adp-breadcrumbs-wrapper">
          <div className="adp-breadcrumbs">
            <Breadcrumbs title={article.title}/>
          </div>
        </div>
        
        <div className="adp-content">
          <h1 className="adp-title">{article.title}</h1>
          
          {/* Tags Section */}
          {article.tags && article.tags.length > 0 && (
            <div className="adp-tags-section">
              <div className="adp-tags-container">
                {article.tags.map((tag, index) => (
                  <span key={index} className="adp-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {article.thumbnail_url && (
            <img className="adp-thumbnail" src={article.thumbnail_url} alt={article.title} />
          )}

          <div className="adp-body" dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
        </div>

        <div className="adp-footer-vote">
          <div className="adp-footer-vote-content">
            <button className="adp-vote-btn adp-upvote-btn" onClick={handleUpvote} disabled={voteLoading}>
              ↑ {upvotes}
            </button>
            <button className="adp-vote-btn adp-downvote-btn" onClick={handleDownvote} disabled={voteLoading}>
              ↓ {downvotes}
            </button>
          </div>
        </div>

        <div className="adp-comment-section" ref={commentSectionRef}>
          <CommentSection articleId={article.id} />
        </div>
      </div>
      
      {showModal && (
        <AuthorModal
          opened={showModal}
          onClose={closeAuthorModal}
          authorId={article.user_id}
          authorName={article.author_name}
          authorAvatar={authorAvatar}
        />
      )}
    </>
  );
}
export default ArticleDetailPage;