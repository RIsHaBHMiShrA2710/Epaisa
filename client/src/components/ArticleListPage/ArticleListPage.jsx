// ArticleListPage.jsx
import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
 // Optional: for overall page styling

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1); // current page number
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [page]);

  async function fetchArticles() {
    try {
      const response = await fetch(`http://localhost:5000/api/articles?page=${page}&limit=5`);
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
    }
  }

  const loadMore = () => {
    setPage(page + 1);
  };

  return (
    <div className="article-list-container">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}

      {hasMore && (
        <button className="load-more-button" onClick={loadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default ArticleListPage;
