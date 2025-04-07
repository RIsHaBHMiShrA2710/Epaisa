import React, { useRef, useState, useEffect } from 'react';
import CommentSection from '../ArticleListPage/CommentSection';
import { useAuth } from '../../AuthContext';
import { useParams } from 'react-router-dom';
import { castVote } from '../service/voteService';
import './ArticlesDetailsPage.css';
import DOMPurify from 'dompurify';
import Loader from '../Loader/Loader';
import Breadcrumbs from '../BreadCrumbs/BreadCrumbs';


const ArticleDetailPage = () => {
  const { id } = useParams(); 
  const { user, token } = useAuth();
  const commentSectionRef = useRef(null);
  const [article, setArticle] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`http://localhost:5000/api/articles/${id}`, {
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

  const scrollToComments = () => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!article) return <div><Loader/></div>;

  const sanitizedHTML = DOMPurify.sanitize(article.content);
  if(loading){
    return (
      <Loader />
    );
  }
  return (
    
    <div className="adp-container">
      <div className="adp-header">
        <div className="adp-header-left">
          <img
            className="adp-author-avatar"
            src={article.author_avatar || 'avatar_placeholder.jpg'}
            alt={article.author_name || 'Author'}
          />
          <span className="adp-author-name">{article.author_name || 'Unknown Author'}</span>
        </div>
        <div className="adp-header-right">
          <span className="adp-publish-date">
            {new Date(article.published_at).toLocaleDateString()}
          </span>
          <div className="adp-vote-buttons">
            <button className="adp-vote-btn adp-upvote-btn" onClick={handleUpvote}>
              ↑ {upvotes}
            </button>
            <button className="adp-vote-btn adp-downvote-btn" onClick={handleDownvote}>
              ↓ {downvotes}
            </button>
          </div>
          <button className="adp-comment-icon" onClick={scrollToComments}>
            💬 {article.comments_count || 0}
          </button>
        </div>
      </div>
      <Breadcrumbs/>
      <div className="adp-content">
        <h1 className="adp-title">{article.title}</h1>
        {article.thumbnail_url && (
          <img className="adp-thumbnail" src={article.thumbnail_url} alt={article.title} />
        )}
        
        <div className="adp-body" dangerouslySetInnerHTML={{ __html: sanitizedHTML }}/>
      </div>

      <div className="adp-footer-vote">
        <button className="adp-vote-btn adp-upvote-btn" onClick={handleUpvote}>
          ↑ {upvotes}
        </button>
        <button className="adp-vote-btn adp-downvote-btn" onClick={handleDownvote}>
          ↓ {downvotes}
        </button>
      </div>

      <div className="adp-comment-section" ref={commentSectionRef}>
        <CommentSection articleId={article.id}/>
      </div>
    </div>
  );

};

export default ArticleDetailPage;
