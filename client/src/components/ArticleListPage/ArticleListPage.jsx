// ArticleListPage.jsx
import React, { useState, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import ArticleCard from './ArticleCard';
import { CreateArticleButton } from '../WritingArticle/CreateArticleButton';
import Loader from '../Loader/Loader';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import FadeInUp from '../../animations/FadeInUp';
import Breadcrumbs from '../BreadCrumbs/BreadCrumbs';
import './ArticleListPage.css';

const BACKEND =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : import.meta.env.VITE_BACKEND_URL;

// Fetch one page of articles
async function fetchArticlesPage({ pageParam = 1 }) {
  const res = await fetch(
    `${BACKEND}/api/articles?page=${pageParam}&limit=5`
  );
  if (!res.ok) throw new Error('Failed to load articles');
  return res.json();
}

export default function ArticleListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // useInfiniteQuery
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['articles'],
    queryFn: fetchArticlesPage,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (last, pages) =>
      last.length === 5 ? pages.length + 1 : undefined,
  });

  // Flatten pages into one array
  const allArticles = data?.pages.flat() ?? [];

  // Filter and search articles
  const filteredArticles = useMemo(() => {
    let filtered = allArticles;

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(search) ||
        article.abstract?.toLowerCase().includes(search) ||
        article.author_name?.toLowerCase().includes(search) ||
        article.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Apply category filter
    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'recent':
          filtered = filtered.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
          break;
        case 'popular':
          filtered = filtered.sort((a, b) => (b.upvote_count || 0) - (a.upvote_count || 0));
          break;
        case 'discussed':
          filtered = filtered.sort((a, b) => (b.comments_count || 0) - (a.comments_count || 0));
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [allArticles, searchTerm, activeFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalArticles = allArticles.length;
    const totalUpvotes = allArticles.reduce((sum, article) => sum + (article.upvote_count || 0), 0);
    const totalComments = allArticles.reduce((sum, article) => sum + (article.comments_count || 0), 0);
    const totalAuthors = new Set(allArticles.map(article => article.author_name)).size;

    return { totalArticles, totalUpvotes, totalComments, totalAuthors };
  }, [allArticles]);

  // Update a single article's comment count in cache
  const handleUpdateCommentCount = (articleId, newCount) => {
    queryClient.setQueryData(['articles'], old => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map(page =>
          page.map(a =>
            a.id === articleId
              ? { ...a, comments_count: newCount }
              : a
          )
        ),
      };
    });
  };

  // Filter buttons configuration
  const filterButtons = [
    { key: 'all', label: 'All Articles', icon: '📚' },
    { key: 'recent', label: 'Recent', icon: '🕒' },
    { key: 'popular', label: 'Popular', icon: '🔥' },
    { key: 'discussed', label: 'Most Discussed', icon: '💬' }
  ];

  // Loading state
  if (isLoading) return <Loader />;

  // Error state
  if (isError) {
    return (
      <div className="article-list-container">
        <div className="article-list-content">
          <div className="article-list-error">
            <div className="article-list-error-icon">⚠️</div>
            <h2 className="article-list-error-title">Oops! Something went wrong</h2>
            <p className="article-list-error-subtitle">
              {error?.message || 'Failed to load articles. Please try again.'}
            </p>
            <button className="article-list-error-retry" onClick={() => refetch()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-list-container">
      {/* Hero Section */}
      <div className="article-list-hero">
        <div className="article-list-hero-content">
          <h1 className="article-list-title">Discover Amazing Articles</h1>
          <p className="article-list-subtitle">
            Explore insightful stories, tutorials, and thoughts from our community of writers
          </p>
          
          {/* Stats Section */}
          <div className="article-list-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.totalArticles}</span>
              <span className="stat-label">Articles</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.totalAuthors}</span>
              <span className="stat-label">Authors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.totalUpvotes}</span>
              <span className="stat-label">Upvotes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.totalComments}</span>
              <span className="stat-label">Comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="article-list-breadcrumbs">
        <Breadcrumbs />
      </div>

      {/* Content Area */}
      <div className="article-list-content">
        {/* Filters and Search */}
        <div className="article-list-filters">
          <input
            type="text"
            className="search-input"
            placeholder="Search articles, authors, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {filterButtons.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`filter-button ${activeFilter === key ? 'active' : ''}`}
              onClick={() => setActiveFilter(key)}
            >
              <span style={{ marginRight: '6px' }}>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Articles List */}
        {filteredArticles.length === 0 ? (
          <div className="article-list-empty">
            <div className="article-list-empty-icon">📝</div>
            <h2 className="article-list-empty-title">
              {searchTerm ? 'No articles found' : 'No articles yet'}
            </h2>
            <p className="article-list-empty-subtitle">
              {searchTerm 
                ? `No articles match "${searchTerm}". Try different keywords.`
                : 'Be the first to share your thoughts with the community!'
              }
            </p>
            {!searchTerm && (
              <button 
                className="article-list-empty-cta"
                onClick={() => navigate('/create-article')}
              >
                Write Your First Article
              </button>
            )}
          </div>
        ) : (
          <>
            {filteredArticles.map((article, index) => (
              <FadeInUp key={article.id} delay={index * 0.1}>
                <ArticleCard
                  article={article}
                  onUpdateCommentCount={handleUpdateCommentCount}
                />
              </FadeInUp>
            ))}

            {/* Load More Button */}
            {hasNextPage && !searchTerm && (
              <button
                className="load-more-button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <div className="load-more-spinner"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    📚 Load More Articles
                  </>
                )}
              </button>
            )}

            {/* End of results message */}
            {!hasNextPage && filteredArticles.length >= 5 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 0', 
                color: 'var(--text-secondary)',
                fontSize: '1rem'
              }}>
                🎉 You've reached the end! Thanks for reading.
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Create Article Button */}
      <CreateArticleButton 
        className="create-article-button"
        onClick={() => navigate('/create-article')}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 1000
        }}
      />
    </div>
  );
}