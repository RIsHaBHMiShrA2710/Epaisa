import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { useAuth } from '../../AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [newName, setNewName] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const DEFAULT_THUMBNAIL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png';
  const DEFAULT_AVATAR = 'https://whitedotpublishers.com/wp-content/uploads/2022/05/male-placeholder-image.jpeg';



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
        setNewName(data.user.name);
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
  const handleProfileUpdate = async () => {
    if (newName === userInfo.name && !newAvatar) {
      toast.info("No changes made to profile.");
      return;
    }

    setProfileLoading(true);
    const formData = new FormData();
    formData.append('name', newName);
    if (newAvatar) formData.append('avatar', newAvatar);

    try {
      const res = await fetch('http://localhost:5000/api/users/update/me', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const updatedUser = await res.json();
      setDashboardData(prev => ({
        ...prev,
        user: { ...prev.user, ...updatedUser }
      }));
      setEditMode(false);
      setNewAvatar(null);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPwd !== confirmPwd) {
      setPwdMsg("New passwords do not match.");
      toast.warning("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/update/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: currentPwd,
          newPassword: newPwd
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setPwdMsg("Password updated successfully.");
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      toast.success("Password changed successfully.");
    } catch (err) {
      setPwdMsg(err.message);
      toast.error("Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };
  

  return (

    <div className={styles.ud_container}>
      {/* Sidebar */}
      <aside className={styles.ud_sidebar}>
        <div className={styles.ud_avatar}>
          <img

src={userInfo.avatar_url?.trim() ? userInfo.avatar_url : DEFAULT_AVATAR}

            alt={userInfo.name}
            className={styles.ud_avatar_image}
          />

        </div>

        <h2 className={styles.ud_name}>{userInfo.name}</h2>
        <p className={styles.ud_email}>{userInfo.email}</p>
        {userInfo.bio && <p className={styles.ud_bio}>{userInfo.bio}</p>}
        {editMode ? (
          <>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={styles.ud_input}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewAvatar(e.target.files[0])}
              className={styles.ud_input}
            />
            <button onClick={handleProfileUpdate} className={styles.ud_editBtn} disabled={profileLoading}>
              {profileLoading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditMode(false)} className={styles.ud_cancelBtn}>Cancel</button>
          </>
        ) : (
          <button className={styles.ud_editBtn} onClick={() => setEditMode(true)}>Edit Profile</button>
        )}
        <button onClick={() => setShowPwdForm((prev) => !prev)} className={styles.ud_editBtn}>
          {showPwdForm ? 'Cancel Password Update' : 'Change Password'}
        </button>

        {showPwdForm && (
          <div className={styles.ud_pwdBox}>
            <input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              placeholder="Current password"
              className={styles.ud_input}
            />
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="New password"
              className={styles.ud_input}
            />
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="Confirm new password"
              className={styles.ud_input}
            />
            <button onClick={handlePasswordUpdate} className={styles.ud_editBtn} disabled={passwordLoading}>
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>

            {pwdMsg && <p>{pwdMsg}</p>}
          </div>
        )}

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
                  src={article.thumbnail_url || DEFAULT_THUMBNAIL}
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
                  src={article.thumbnail_url || DEFAULT_THUMBNAIL}
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
                  src={article.thumbnail_url || DEFAULT_THUMBNAIL}
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserDashboard;
