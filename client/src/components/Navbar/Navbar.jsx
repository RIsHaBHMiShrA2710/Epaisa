import { useState } from 'react';
import { Container, Group } from '@mantine/core';
import classes from './Navbar.module.css';

const links = [
  { link: '/about', label: 'Features' },
  { link: '/pricing', label: 'Pricing' },
  { link: '/learn', label: 'Learn' },
  { link: '/community', label: 'Community' },
];

const Navbar = () => {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={`${classes.link} ${active === link.link ? classes.active : ''}`}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        setOpened(false); // Close the menu when a link is clicked
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={`${classes.header} ${opened ? classes.open : ''}`}>
      <Container size="lg" className={classes.inner}>
        <a href="/" className={classes.logoLink}>
          <img
            src="https://imgur.com/weEZnmD.jpg"
            className={classes.brandLogo}
            alt="Epaisa Logo"
          />
        </a>
        {/* Desktop Links */}
        <Group className={classes.group}>{items}</Group>
        {/* Burger Icon */}
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
