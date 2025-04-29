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
              Audit & Assurance
            </h2>
            <p className={styles.cardDescription}>
            We provide comprehensive statutory and internal audit services tailored to ensure financial transparency and regulatory compliance. Our expert insights help you identify risks and optimize controls.
            </p>
          </div>
        </div>

        <div className={styles.card} ref={(el) => (cardRefs.current[1] = el)}>
          <div className={styles.circle}></div>
          <div className={styles.cardContentLeft}>
            <h2 className={styles.cardTitle}>
            GST <br /> Income Tax Filing
            </h2>
            <p className={styles.cardDescription}>
            From accurate GST return filings to income tax compliance for individuals and businesses, we manage everything—so you never miss a deadline or face unnecessary penalties.
            </p>
          </div>
        </div>

        <div className={styles.card} ref={(el) => (cardRefs.current[2] = el)}>
          <div className={styles.circle}></div>
          <div className={styles.cardContentRight}>
            <h2 className={styles.cardTitle}>
            Portfolio Management & <br />Bookkeeping
            </h2>
            <p className={styles.cardDescription}>
            Whether you're an individual investor or a business, our team manages your financial portfolio and maintains error-free books—so you stay focused on growth.
            </p>
          </div>
        </div>

        <div className={styles.card} ref={(el) => (cardRefs.current[3] = el)}>
          <div className={styles.circle}></div>
          <div className={styles.cardContentLeft}>
            <h2 className={styles.cardTitle}>
            Much More...
            </h2>
            <p className={styles.cardDescription}>
            Payroll management, company registration, business advisory, ROC compliance, financial forecasting, TDS filings, and many more customized services- Call or contanct us now to explore what else we offer. 
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
