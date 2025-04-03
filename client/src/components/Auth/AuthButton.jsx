import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import styles from './AuthButton.module.css';

const AuthButton = () => {
  const { user, login, register, logout, googleSignIn, loading, error } = useAuth();
  const [opened, setOpened] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) await register(name, email, password);
    else await login(email, password);
    setOpened(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (user) {
    return (
      <div className={styles.userContainer} ref={dropdownRef}>
        <img
          src={user.avatar_url || '/avatar_placeholder.jpg'}
          alt="User"
          className={styles.userAvatar}
          onClick={() => setDropdownOpen(prev => !prev)}
        />
        {dropdownOpen && (
          <div className={styles.dropdownMenu}>
            <button onClick={() => navigate('/dashboard')}>Profile</button>
            <button onClick={logout} disabled={loading}>
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button className={styles.authButton} onClick={() => setOpened(true)}>
        Login / Register
      </button>

      {opened && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setOpened(false)}>&times;</button>
            <h2 className={styles.formHeading}>{isRegister ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit} className={styles.mainForm}>
              {isRegister && (
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.switchButton} onClick={() => setIsRegister(prev => !prev)}>
                  {isRegister ? 'Switch to Login' : 'Switch to Register'}
                </button>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
                </button>
              </div>
            </form>
            <div style={{ textAlign: 'center' }}>
              <button className={styles.googleSignIn} onClick={googleSignIn} disabled={loading}>
                Sign in with Google
              </button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default AuthButton;
