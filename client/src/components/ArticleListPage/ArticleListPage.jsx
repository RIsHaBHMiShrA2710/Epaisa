// ArticleListPage.jsx
import React from 'react';
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

// 1. Fetch one page of articles
async function fetchArticlesPage({ pageParam = 1 }) {
  const res = await fetch(
    `${BACKEND}/api/articles?page=${pageParam}&limit=5`
  );
  if (!res.ok) throw new Error('Failed to load articles');
  return res.json(); // returns an array (≤5 items)
}

export default function ArticleListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 2. useInfiniteQuery in object form (v5+)
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['articles'],
    queryFn: fetchArticlesPage,
    //  ─── Don’t refetch for 5 minutes ───────────────────
    staleTime: 1000 * 60 * 5,    // keep data “fresh” for 5m
    cacheTime: 1000 * 60 * 10,   // keep it in memory for 10m
    refetchOnMount: false,       // don’t kick off a fetch on remount
    refetchOnWindowFocus: false, // don’t refetch if user switches tabs
    getNextPageParam: (last, pages) =>
      last.length === 5 ? pages.length + 1 : undefined,
  });

  // 3. Flatten pages into one array
  const articles = data?.pages.flat() ?? [];

  // 4. Update a single article's comment count in cache
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

  // 5. Loading / error UI
  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading articles</div>;

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

      {hasNextPage && (
        <button
          className="load-more-button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? <LoadingSpinner /> : 'Load More'}
        </button>
      )}

      <CreateArticleButton onClick={() => navigate('/create-article')} />
    </div>
  );
}
