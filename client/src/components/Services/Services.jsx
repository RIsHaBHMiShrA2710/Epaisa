import { IconArrowRight } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import styles from './Services.module.css';

const Services = () => {
  const cardRefs = useRef([]);

  useEffect(() => {
    // Only apply the scroll-triggered effect on small screens
    if (window.innerWidth < 768) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // With the following rootMargin, the card is considered "in view"
            // only when its center is approximately in the center of the viewport.
            if (entry.isIntersecting) {
              entry.target.classList.add(styles.inView);
            } else {
              entry.target.classList.remove(styles.inView);
            }
          });
        },
        {
          // Adjust these values to control when the effect triggers.
          rootMargin: '-40% 0px -40% 0px',
          threshold: 0
        }
      );
      cardRefs.current.forEach((card) => {
        if (card) observer.observe(card);
      });
      return () => observer.disconnect();
    }
  }, []);

  return (
    <section className={styles.servicesContainer}>
      <span className={styles.servicesHeadingLabel}>
        what we're offering
        <IconArrowRight className={styles.servicesArrowIcon} />
      </span>
      
      <h5 className={styles.servicesMainTitle}>Services Offered</h5>
      
      <div className={styles.servicesGrid}>
        <div className={styles.card} ref={(el) => (cardRefs.current[0] = el)}>
          <div className={styles.circle}></div>
          <div className={styles.cardContentRight}>
            <h2 className={styles.cardTitle}>
              UI/UX <br /> creative design
            </h2>
            <p className={styles.cardDescription}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames.
            </p>
          </div>
        </div>

        <div className={styles.card} ref={(el) => (cardRefs.current[1] = el)}>
          <div className={styles.circle}></div>
          <div className={styles.cardContentLeft}>
            <h2 className={styles.cardTitle}>
              visual <br /> graphic design
            </h2>
            <p className={styles.cardDescription}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames.
            </p>
          </div>
        </div>

        <div className={styles.card} ref={(el) => (cardRefs.current[2] = el)}>
          <div className={styles.circle}></div>
          <div className={styles.cardContentRight}>
            <h2 className={styles.cardTitle}>
              strategy & <br /> digital marketing
            </h2>
            <p className={styles.cardDescription}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames.
            </p>
          </div>
        </div>

        <div className={styles.card} ref={(el) => (cardRefs.current[3] = el)}>
          <div className={styles.circle}></div>
          <div className={styles.cardContentLeft}>
            <h2 className={styles.cardTitle}>
              effective<br /> business growth
            </h2>
            <p className={styles.cardDescription}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
