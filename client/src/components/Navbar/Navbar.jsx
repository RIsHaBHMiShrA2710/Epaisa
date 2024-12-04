import React from 'react';
import styles from './Navbar.module.css';

const links = [
  { link: '/about', label: 'Features' },
  {
    link: '#1',
    label: 'Learn',
    links: [
      { link: '/docs', label: 'Documentation' },
      { link: '/resources', label: 'Resources' },
      { link: '/community', label: 'Community' },
      { link: '/blog', label: 'Blog' },
    ],
  },
  { link: '/about', label: 'About' },
  { link: '/pricing', label: 'Pricing' },
  {
    link: '#2',
    label: 'Support',
    links: [
      { link: '/faq', label: 'FAQ' },
      { link: '/demo', label: 'Book a demo' },
      { link: '/forums', label: 'Forums' },
    ],
  },
];

const Navbar = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {links.map((link) => (
          <a key={link.label} href={link.link} className={styles.link}>
            <span className={styles.linkLabel}>{link.label}</span>
          </a>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
