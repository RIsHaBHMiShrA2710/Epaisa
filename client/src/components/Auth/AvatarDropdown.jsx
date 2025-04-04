// AvatarDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import styles from './AvatarDropdown.module.css';

const AvatarDropdown = () => {
  const { logout, token } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/me/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setAvatarUrl(data.user.avatar_url || 'https://whitedotpublishers.com/wp-content/uploads/2022/05/male-placeholder-image.jpeg');
      } catch (err) {
        console.error('Failed to load avatar:', err);
      }
    };

    if (token) fetchAvatar();
  }, [token]);

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  if (!token) return null;

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <img
        src={avatarUrl}
        className={styles.avatar}
        onClick={() => setOpen((prev) => !prev)}
        alt="Avatar"
      />
      {open && (
        <div className={styles.dropdownMenu}>
          <button onClick={() => navigate('/dashboard')}>Profile</button>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
