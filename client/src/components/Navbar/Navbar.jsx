// src/components/Navbar/Navbar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  const { user } = useAuth();

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (opened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [opened]);

  const items = links.map(({ link, label, hash }) => {
    const key = label;
    const isActive =
      hash
        ? location.pathname + location.hash === link
        : location.pathname === link;

    const commonProps = {
      className: `${classes.link} ${isActive ? classes.active : ''}`,
      onClick: () => setOpened(false),
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
              onClick={() => setOpened(prev => !prev)}
              aria-label="Toggle menu"
              aria-expanded={opened}
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
                <h3 className={classes.mobileMenuTitle}>Navigation</h3>
                <button 
                  className={classes.mobileMenuClose}
                  onClick={() => setOpened(false)}
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>
              <div className={classes.mobileMenuAuth}>
                {user ? <AvatarDropdown /> : <AuthButton />}
              </div>
              <div className={classes.mobileMenuItems}>
                {items}
              </div>
             
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Backdrop */}
      {opened && <div className={classes.backdrop} onClick={() => setOpened(false)}></div>}
    </>
  );
};

export default Navbar;