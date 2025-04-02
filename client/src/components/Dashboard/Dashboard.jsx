// UserDashboard.jsx
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { useAuth } from '../../AuthContext';

const UserDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/me/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboardData();
  }, [token]);

  if (loading) return <div className={styles.ud_loading}>Loading dashboard...</div>;
  if (!dashboardData) return <div className={styles.ud_error}>Failed to load dashboard.</div>;

  const { user: userInfo, articles, upvotedArticles, downvotedArticles } = dashboardData;

  return (
    <div className={styles.ud_container}>
      {/* Sidebar */}
      <aside className={styles.ud_sidebar}>
        <div className={styles.ud_avatar}>
          <img

            src={userInfo.avatar_url || '/avatar_placeholder.jpg'}
            alt={userInfo.name}
            className={styles.ud_avatar_image}
          />

        </div>

        <h2 className={styles.ud_name}>{userInfo.name}</h2>
        <p className={styles.ud_email}>{userInfo.email}</p>
        {userInfo.bio && <p className={styles.ud_bio}>{userInfo.bio}</p>}
        <button className={styles.ud_editBtn}>Edit Profile</button>
      </aside>

      {/* Main */}
      <main className={styles.ud_main}>
        <section className={styles.ud_section}>
          <h2>Your Articles</h2>
          {articles.length === 0 ? (
            <p>No articles published yet.</p>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                className={styles.ud_card}
                onClick={() => navigate(`/blog/${article.id}`)}
              >
                <img
                  src={article.thumbnail_url}
                  alt={article.title}
                  className={styles.ud_card_thumb}
                />
                <div className={styles.ud_card_info}>
                  <h3>{article.title}</h3>
                  <p>{article.abstract}</p>
                </div>
              </div>
            ))

          )}
        </section>

        <section className={styles.ud_section}>
          <h2>Upvoted Articles</h2>
          {upvotedArticles.length === 0 ? (
            <p>No upvoted articles.</p>
          ) : (
            upvotedArticles.map((article) => (
              <div
                key={article.id}
                className={styles.ud_card}
                onClick={() => navigate(`/blog/${article.id}`)}
              >
                <img
                  src={article.thumbnail_url}
                  alt={article.title}
                  className={styles.ud_card_thumb}
                />
                <div className={styles.ud_card_info}>
                  <h3>{article.title}</h3>
                  <p>{article.abstract}</p>
                </div>
              </div>
            ))
          )}
        </section>

        <section className={styles.ud_section}>
          <h2>Downvoted Articles</h2>
          {downvotedArticles.length === 0 ? (
            <p>No downvoted articles.</p>
          ) : (
            downvotedArticles.map((article) => (
              <div
                key={article.id}
                className={styles.ud_card}
                onClick={() => navigate(`/blog/${article.id}`)}
              >
                <img
                  src={article.thumbnail_url}
                  alt={article.title}
                  className={styles.ud_card_thumb}
                />
                <div className={styles.ud_card_info}>
                  <h3>{article.title}</h3>
                  <p>{article.abstract}</p>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;
