import { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import AuthButton from '../Auth/AuthButton';
import { Container, Group } from '@mantine/core';
import classes from './Navbar.module.css';
import AvatarDropdown from '../Auth/AvatarDropdown';
import { useAuth } from '../../authContext';

const links = [
  { link: '/', label: 'Home' },
  { link: '/#services', label: 'Services' },
  { link: '/#team', label: 'Team' },
  { link: '/#contact', label: 'Contact' },
  { link: '/blog', label: 'Blogs' },
];

const Navbar = () => {
  const [opened, setOpened] = useState(false);
  const location = useLocation(); // Get current route
  const { user } = useAuth();

  // Generate navigation links dynamically
  const items = links.map((linkObj) => (
    <a
      key={linkObj.label}
      href={linkObj.link}
      className={`${classes.link} ${location.pathname + location.hash === linkObj.link ? classes.active : ''}`}
      onClick={() => setOpened(false)}
    >
      {linkObj.label}
    </a>
  ));
  

  return (
    <header className={`${classes.header} ${opened ? classes.open : ''}`}>
      <Container size="lg" className={classes.inner}>
        <nav className={classes.navbar}>
          {/* Logo */}
          <Link to="/" className={classes.logoLink} aria-label="Home">
            <img
              src="https://imgur.com/weEZnmD.jpg"
              className={classes.brandLogo}
              alt="Epaisa Logo"
            />
          </Link>

          {/* Desktop Links */}
          <Group className={classes.group}>{items}</Group>

          {/* Authentication: Either user dropdown or login/register button */}
          {user ? <AvatarDropdown /> : <AuthButton />}

          {/* Burger Icon for Mobile Menu */}
          <button
            className={`${classes.burger} ${opened ? classes.burgerOpen : ''}`}
            onClick={() => setOpened((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={opened ? "true" : "false"}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      {opened && <div className={classes.mobileMenu}>{items}</div>}
    </header>
  );
};

export default Navbar;
