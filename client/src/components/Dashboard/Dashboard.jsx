import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { useAuth } from '../../authContext';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import 'react-toastify/dist/ReactToastify.css';
import { IconEdit, IconTrash } from '@tabler/icons-react';

const UserDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [newBio, setNewBio] = useState(''); // Initialize as empty string, not null
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
  const [charCount, setCharCount] = useState(0); // Initialize with 0, update when data loads

  const DEFAULT_THUMBNAIL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png';
  const DEFAULT_AVATAR = 'https://whitedotpublishers.com/wp-content/uploads/2022/05/male-placeholder-image.jpeg';
  const BACKEND = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const ac = new AbortController();

    (async () => {
      try {
        const res = await fetch(`${BACKEND}/api/users/me/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: ac.signal,
        });

        if (!res.ok) {
          if (res.status === 401) {
            toast.error('Session expired. Please log in again.');
            setDashboardData(null);
            return;
          }
          throw new Error('Failed to load dashboard');
        }

        const data = await res.json();
        setDashboardData(data);
        
        // Initialize form values when data loads
        if (data?.user?.name) setNewName(data.user.name);
        if (data?.user?.bio) {
          setNewBio(data.user.bio);
          setCharCount(data.user.bio.length);
        } else {
          setNewBio('');
          setCharCount(0);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching dashboard:', err);
          toast.error('Could not load dashboard.');
          setDashboardData(null);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [token, BACKEND]);

  if (loading) return (<div><Loader /></div>);
  if (!dashboardData) return <div className={styles.ud_error}>Failed to load dashboard.</div>;
  
  const userInfo = dashboardData?.user || {};
  const articles = dashboardData?.articles || [];
  const upvotedArticles = dashboardData?.upvotedArticles || [];
  const downvotedArticles = dashboardData?.downvotedArticles || [];

  const handleProfileUpdate = async () => {
    // Fix comparison - use === for strict comparison
    if (newName === userInfo.name && newBio === (userInfo.bio || '') && !newAvatar) {
      toast.info("No changes made to profile.");
      return;
    }

    setProfileLoading(true);
    const formData = new FormData();
    formData.append('name', newName);
    formData.append('bio', newBio || ''); // Always append bio, even if empty

    if (newAvatar) formData.append('avatar', newAvatar);

    try {
      const res = await fetch(`${BACKEND}/api/users/update/me`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await res.json();
      setDashboardData(prev => ({
        ...prev,
        user: { ...prev.user, ...updatedUser }
      }));
      setEditMode(false);
      setNewAvatar(null);
      toast.success("Profile updated successfully.");
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error("Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleEditArticle = (id) => navigate(`/blog/${id}/edit`);

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      const res = await fetch(`${BACKEND}/api/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text() || 'Delete failed');

      setDashboardData(prev => prev
        ? { ...prev, articles: (prev.articles || []).filter(a => a.id !== id) }
        : prev
      );
      toast.success('Article deleted');
    } catch (e) {
      toast.error(e.message || 'Could not delete');
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
      const res = await fetch(`${BACKEND}/api/users/update/me/password`, {
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

  const handleEditClick = () => {
    setEditMode(true);
    setNewBio(userInfo?.bio || ''); // Initialize bio when entering edit mode
    setNewName(userInfo?.name || ''); // Initialize name when entering edit mode
    setCharCount((userInfo?.bio || '').length); // Initialize character count
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setNewBio(userInfo?.bio || ''); // Reset bio on cancel
    setNewName(userInfo?.name || ''); // Reset name on cancel
    setNewAvatar(null); // Reset avatar on cancel
    setCharCount((userInfo?.bio || '').length); // Reset character count
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
        {userInfo.bio && !editMode && <p className={styles.ud_bio}>{userInfo.bio}</p>}
        {!userInfo.bio && !editMode && <p className={styles.ud_noBio}>No bio added yet</p>}

        {editMode ? (
          <>
            <div className={styles.ud_formGroup}>
              <label className={styles.ud_label}>Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={styles.ud_input}
                placeholder="Enter your name"
              />
            </div>

            <div className={styles.ud_formGroup}>
              <label className={styles.ud_label}>Bio</label>
              <textarea
                value={newBio}
                onChange={(e) => {
                  setNewBio(e.target.value);
                  setCharCount(e.target.value.length);
                }}
                className={styles.ud_textarea}
                placeholder="Tell us about yourself..."
                maxLength="500"
                rows="4"
              />
              <div className={`${styles.ud_charCounter} ${charCount > 450 ? styles.warning : ''}`}>
                {charCount}/500 characters
              </div>
            </div>

            <div className={styles.ud_formGroup}>
              <label className={styles.ud_label}>Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewAvatar(e.target.files[0])}
                className={styles.ud_input}
              />
            </div>

            <div className={styles.ud_buttonGroup}>
              <button
                onClick={handleProfileUpdate}
                className={styles.ud_editBtn}
                disabled={profileLoading}
                type="button"
              >
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancelEdit}
                className={styles.ud_cancelBtn}
                type="button"
                disabled={profileLoading}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            className={styles.ud_editBtn}
            onClick={handleEditClick}
            type="button"
          >
            Edit Profile
          </button>
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
            articles.map(article => (
              <div
                key={article.id}
                className={styles.ud_card}
                onClick={() => navigate(`/blog/${article.id}`)}
              >
                <div className={styles.ud_card_actions}>
                  <button
                    className={styles.ud_actionBtn}
                    onClick={e => {
                      e.stopPropagation();
                      handleEditArticle(article.id);
                    }}
                    aria-label="Edit article"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'blue' }}
                  >
                    <IconEdit size={20} />
                  </button>

                  <button
                    className={styles.ud_actionBtnDanger}
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteArticle(article.id);
                    }}
                    aria-label="Delete article"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}
                  >
                    <IconTrash size={20} />
                  </button>
                </div>
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
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserDashboard;