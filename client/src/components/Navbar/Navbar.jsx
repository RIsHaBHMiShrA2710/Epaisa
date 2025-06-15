// src/components/Navbar/Navbar.jsx
import { useState } from 'react';
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
  const location = useLocation();
  const { user } = useAuth();

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
        {label}
      </HashLink>
    ) : (
      <NavLink
        key={key}
        to={link}
        end={link === '/'}
        {...commonProps}
      >
        {label}
      </NavLink>
    );
  });

  return (
    <header className={`${classes.header} ${opened ? classes.open : ''}`}>
      <Container size="lg" className={classes.inner}>
        <nav className={classes.navbar}>
          {/* Logo */}
          <NavLink to="/" className={classes.logoLink} aria-label="Home">
            <img
              src="https://imgur.com/weEZnmD.jpg"
              className={classes.brandLogo}
              alt="Epaisa Logo"
            />
          </NavLink>

          {/* Desktop Links */}
          <Group className={classes.group}>{items}</Group>

          {/* Auth */}
          {user ? <AvatarDropdown /> : <AuthButton />}

          {/* Burger for mobile */}
          <button
            className={`${classes.burger} ${opened ? classes.burgerOpen : ''}`}
            onClick={() => setOpened(prev => !prev)}
            aria-label="Toggle menu"
            aria-expanded={opened}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>

        {/* Mobile Menu */}
        {opened && <div className={classes.mobileMenu}>{items}</div>}
      </Container>
    </header>
  );
};

export default Navbar;
