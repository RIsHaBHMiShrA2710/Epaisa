import { useState } from 'react';
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import AuthButton from '../Auth/AuthButton';
import { Container, Group } from '@mantine/core';
import classes from './Navbar.module.css';
import AvatarDropdown from '../Auth/AvatarDropdown';
import { useAuth } from '../../authContext';

const links = [
  { link: '/', label: 'Home' },
  { link: '/blog', label: 'Blogs' },
];


const Navbar = () => {
  const [opened, setOpened] = useState(false);
  const location = useLocation(); // Get current route
  const {user} = useAuth();

  // Generate navigation links dynamically
  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={`${classes.link} ${location.pathname === link.link ? classes.active : ''}`} // Use location.pathname
      onClick={() => setOpened(false)} // Close menu on click
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={`${classes.header} ${opened ? classes.open : ''}`}>
      <Container size="lg" className={classes.inner}>
        {/* Logo */}
        <Link to="/" className={classes.logoLink}>
          <img
            src="https://imgur.com/weEZnmD.jpg"
            className={classes.brandLogo}
            alt="Epaisa Logo"
          />
        </Link>

        {/* Desktop Links */}
        <Group className={classes.group}>{items}</Group>

        {/* Login/Register Button */}
        {user ? <AvatarDropdown /> : <AuthButton />}


        {/* Burger Icon for Mobile Menu */}
        <div
          className={`${classes.burger} ${opened ? classes.burgerOpen : ''}`}
          onClick={() => setOpened((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </Container>

      {/* Mobile Links */}
      {opened && <div className={classes.mobileMenu}>{items}</div>}
    </header>
  );
};

export default Navbar;
