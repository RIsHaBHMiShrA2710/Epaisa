import React, { useState } from 'react';
import styles from './AuthButton.module.css';

const AuthButton = () => {
  const [opened, setOpened] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ name, email, password });
    setOpened(false); // Close modal on submit
  };

  return (
    <>
      {/* Login/Register Button */}
      <button className={styles.authButton} onClick={() => setOpened(true)}>
        Login / Register
      </button>

      {/* Custom Modal */}
      {opened && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeButton}
              onClick={() => setOpened(false)}
            >
              &times;
            </button>
            <h2 className={styles.formHeading}>{isRegister ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit} className={styles.mainForm}>
              {isRegister && (
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.switchButton}
                  onClick={() => setIsRegister((prev) => !prev)}
                >
                  {isRegister ? 'Switch to Login' : 'Switch to Register'}
                </button>
                <button type="submit" className={styles.submitButton}>
                  {isRegister ? 'Register' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthButton;
