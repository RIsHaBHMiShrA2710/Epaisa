// Breadcrumbs.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({ title }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav className={styles.breadcrumbs}>
      <Link to="/" className={styles.link}>Home</Link>
      {pathnames.map((seg, i) => {
        const isLast = i === pathnames.length - 1;
        const to = `/${pathnames.slice(0, i + 1).join('/')}`;
        const display = isLast && title ? title : decodeURIComponent(seg);

        return isLast ? (
          <span key={to} className={styles.current}>
            {' > '}{display}
          </span>
        ) : (
          <span key={to}>
            {' > '}
            <Link to={to} className={styles.link}>{display}</Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
