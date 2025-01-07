import { IconArrowRight } from '@tabler/icons-react';
import styles from './Services.module.css';

const Services = () => {
  return (
    <section className={styles.servicesContainer}>
      <span className={styles.servicesHeadingLabel}>
        what we're offering
        <IconArrowRight className={styles.servicesArrowIcon} />
      </span>
      
      {/* <h1 className={styles.servicesMainTitle}>
        Services Built Specifically for your Business
      </h1> */}
      
      <div className={styles.servicesGrid}>
        <div className={styles.card}>
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

        <div className={styles.card}>
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

        <div className={styles.card}>
          <div className={styles.circle}></div>
          <div className={styles.cardContentRight}>
            <h2 className={styles.cardTitle}>
              strategy & <br />digital marketing
            </h2>
            <p className={styles.cardDescription}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames.
            </p>
          </div>
        </div>

        <div className={styles.card}>
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