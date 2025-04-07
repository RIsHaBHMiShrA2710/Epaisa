import React, { useEffect, useState } from 'react';
import styles from './PageLoader.module.css';

const HomeLoader = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const images = Array.from(document.images);
    let loadedImages = 0;

    const onImageLoad = () => {
      loadedImages++;
      if (loadedImages === images.length) {
        setTimeout(() => setLoading(false), 500); // small delay for smoother UX
      }
    };

    if (images.length === 0) {
      setLoading(false);
    } else {
      images.forEach((img) => {
        if (img.complete) {
          onImageLoad();
        } else {
          img.addEventListener('load', onImageLoad);
          img.addEventListener('error', onImageLoad); // in case of broken image
        }
      });
    }

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', onImageLoad);
        img.removeEventListener('error', onImageLoad);
      });
    };
  }, []);

  return loading ? (
    <div className={styles.loaderWrapper}>
      <div className={styles.spinner}></div>
      <p>Loading Epaisa...</p>
    </div>
  ) : (
    children
  );
};

export default HomeLoader;
