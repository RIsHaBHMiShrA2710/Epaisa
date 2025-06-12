// ArticleListPage.jsx
import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { CreateArticleButton } from '../WritingArticle/CreateArticleButton';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import FadeInUp from '../../animations/FadeInUp';
import Breadcrumbs from '../BreadCrumbs/BreadCrumbs';
import './ArticleListPage.css';

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);                // current page number
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  const BACKEND =
    import.meta.env.MODE === 'development'
      ? 'http://localhost:5000'
      : import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleUpdateCommentCount = (articleId, newCount) => {
    setArticles(prev =>
      prev.map(a =>
        a.id === articleId ? { ...a, comments_count: newCount } : a
      )
    );
  };

  async function fetchArticles() {
    // distinguish initial vs pagination
    if (page === 1) {
      setLoadingInitial(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch(
        `${BACKEND}/api/articles?page=${page}&limit=5`
      );
      const data = await response.json();

      if (data.length < 5) {
        setHasMore(false);
      }

      setArticles(prevArticles => {
        const existingIds = new Set(prevArticles.map(a => a.id));
        const newArticles = data.filter(a => !existingIds.has(a.id));
        return [...prevArticles, ...newArticles];
      });
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoadingInitial(false);
      setLoadingMore(false);
    }
  }

  const loadMore = () => setPage(prev => prev + 1);

  // full‐screen loader on first load only
  if (loadingInitial) {
    return <Loader />;
  }

  return (
    <div className="article-list-container">
      <Breadcrumbs />

      {articles.map(article => (
        <FadeInUp key={article.id} delay={0.2}>
          <ArticleCard
            article={article}
            onUpdateCommentCount={handleUpdateCommentCount}
          />
        </FadeInUp>
      ))}

      {hasMore && (
        <button
          className="load-more-button"
          onClick={loadMore}
          disabled={loadingMore}
        >
          {loadingMore ? <LoadingSpinner /> : 'Load More'}
        </button>
      )}

      <CreateArticleButton onClick={() => navigate('/create-article')} />
    </div>
  );
};

export default ArticleListPage;
