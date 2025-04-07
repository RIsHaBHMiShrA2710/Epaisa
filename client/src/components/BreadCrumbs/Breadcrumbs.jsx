import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = () => {
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className={styles.breadcrumbs}>
      <Link to="/" className={styles.link}>Home</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <span key={name} className={styles.current}>
            {' > '}{decodeURIComponent(name)}
          </span>
        ) : (
          <span key={name}>
            {' > '}
            <Link to={routeTo} className={styles.link}>
              {decodeURIComponent(name)}
            </Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
