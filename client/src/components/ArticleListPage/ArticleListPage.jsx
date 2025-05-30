// ArticleListPage.jsx
import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { CreateArticleButton } from '../WritingArticle/CreateArticleButton';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import FadeInUp from '../../animations/FadeInUp';
import StaggerContainer from '../../animations/StaggerContainer';
import Breadcrumbs from '../BreadCrumbs/BreadCrumbs';
// Optional: for overall page styling


const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1); // current page number
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const BACKEND = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000'
  : import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const handleUpdateCommentCount = (articleId, newCount) => {
    setArticles(prev =>
      prev.map(a =>
        a.id === articleId ? { ...a, comments_count: newCount } : a
      )
    );
  };
  async function fetchArticles() {
    try {
      const response = await fetch(`${BACKEND}/api/articles?page=${page}&limit=5`);
      const data = await response.json();

      if (data.length < 5) {
        setHasMore(false);
      }
      setArticles((prevArticles) => {
        const existingIds = new Set(prevArticles.map((a) => a.id));
        const newArticles = data.filter((article) => !existingIds.has(article.id));
        return [...prevArticles, ...newArticles];
      });

    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  }

  const loadMore = () => {
    setPage(page + 1);
  };
  if(loading){
    return (
      <Loader />
    );
  }
  return (
    
     <div className="article-list-container">
      <Breadcrumbs/>
      {articles.map((article) => (
        
          <FadeInUp delay={0.2}>
          <ArticleCard key={article.id} article={article} onUpdateCommentCount={handleUpdateCommentCount} />
          </FadeInUp>
        
      ))}

      {hasMore && (
        <button className="load-more-button" onClick={loadMore}>
          Load More
        </button>
      )}
      <CreateArticleButton onClick={() => navigate('/create-article')} />
    </div>
  );
};

export default ArticleListPage;
