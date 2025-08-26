// src/components/Navbar/Navbar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import AuthButton from '../Auth/AuthButton';
import { Container, Group } from '@mantine/core';
import classes from './Navbar.module.css';
import AvatarDropdown from '../Auth/AvatarDropdown';
import { useAuth } from '../../authContext';

const links = [
  { link: '/', label: 'Home', hash: false },
  { link: '/#services', label: 'Services', hash: true },
  { link: '/#team', label: 'Team', hash: true },
  { link: '/#contact', label: 'Contact', hash: true },
  { link: '/blog', label: 'Blogs', hash: false },
];

const Navbar = () => {
  const [opened, setOpened] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (opened && !event.target.closest(`.${classes.header}`)) {
        setOpened(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [opened]);

  // Prevent body scroll when mobile menu is open - UPDATED
  useEffect(() => {
    if (opened) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [opened]);

  // Close menu on route change
  useEffect(() => {
    setOpened(false);
  }, [location.pathname, location.hash]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && opened) {
        setOpened(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [opened]);

  const handleMenuToggle = () => {
    setOpened(prev => !prev);
  };

  const handleCloseMenu = () => {
    setOpened(false);
  };

  const items = links.map(({ link, label, hash }) => {
    const key = label;
    const isActive =
      hash
        ? location.pathname + location.hash === link
        : location.pathname === link;

    const commonProps = {
      className: `${classes.link} ${isActive ? classes.active : ''}`,
      onClick: handleCloseMenu,
    };

    return hash ? (
      <HashLink
        key={key}
        to={link}
        scroll={el => el.scrollIntoView({ behavior: 'smooth' })}
        {...commonProps}
      >
        <span className={classes.linkText}>{label}</span>
        <span className={classes.linkGlow}></span>
      </HashLink>
    ) : (
      <NavLink
        key={key}
        to={link}
        end={link === '/'}
        {...commonProps}
      >
        <span className={classes.linkText}>{label}</span>
        <span className={classes.linkGlow}></span>
      </NavLink>
    );
  });

  return (
    <>
      <header className={`${classes.header} ${scrolled ? classes.scrolled : ''} ${opened ? classes.open : ''}`}>
        <Container size="lg" className={classes.inner}>
          <nav className={classes.navbar}>
            {/* Logo */}
            <NavLink to="/" className={classes.logoLink} aria-label="Home">
              <div className={classes.logoContainer}>
                <img
                  src="https://imgur.com/weEZnmD.jpg"
                  className={classes.brandLogo}
                  alt="Epaisa Logo"
                />
                <div className={classes.logoGlow}></div>
              </div>
            </NavLink>

            {/* Desktop Links */}
            <Group className={classes.group}>{items}</Group>

            {/* Auth */}
            <div className={classes.authContainer}>
              {user ? <AvatarDropdown /> : <AuthButton />}
            </div>

            {/* Burger for mobile */}
            <button
              className={`${classes.burger} ${opened ? classes.burgerOpen : ''}`}
              onClick={handleMenuToggle}
              aria-label="Toggle menu"
              aria-expanded={opened}
              type="button"
            >
              <span className={classes.burgerLine}></span>
              <span className={classes.burgerLine}></span>
              <span className={classes.burgerLine}></span>
            </button>
          </nav>
        </Container>

        {/* Mobile Menu */}
        {opened && (
          <div className={classes.mobileMenu}>
            <div className={classes.mobileMenuContent}>
              <div className={classes.mobileMenuHeader}>
                <h3 className={classes.mobileMenuTitle}>Menu</h3>
                <button 
                  className={classes.mobileMenuClose}
                  onClick={handleCloseMenu}
                  aria-label="Close menu"
                  type="button"
                >
                  ×
                </button>
              </div>
              
              {/* User Profile Section - Only show if user is logged in */}
              {user && (
                <div className={classes.mobileUserSection}>
                  <div className={classes.mobileUserInfo}>
                    <img
                      src={user.avatar_url || 'https://whitedotpublishers.com/wp-content/uploads/2022/05/male-placeholder-image.jpeg'}
                      className={classes.mobileUserAvatar}
                      alt="User Avatar"
                    />
                    <div className={classes.mobileUserDetails}>
                      <span className={classes.mobileUserName}>Profile</span>
                      <span className={classes.mobileUserStatus}>Logged in</span>
                    </div>
                  </div>
                  <div className={classes.mobileUserActions}>
                    <button 
                      className={classes.mobileActionBtn}
                      onClick={() => {
                        navigate('/dashboard');
                        handleCloseMenu();
                      }}
                      type="button"
                    >
                      Dashboard
                    </button>
                    <button 
                      className={`${classes.mobileActionBtn} ${classes.mobileLogoutBtn}`}
                      onClick={() => {
                        logout();
                        handleCloseMenu();
                      }}
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
              
              <div className={classes.mobileMenuItems}>
                {items}
              </div>
              
              {/* Auth Button - Only show if user is NOT logged in */}
              {!user && (
                <div className={classes.mobileMenuAuth}>
                  <AuthButton />
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Backdrop */}
      {opened && (
        <div 
          className={classes.backdrop} 
          onClick={handleCloseMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;