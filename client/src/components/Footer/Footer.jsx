import { Container, Text, Group, Anchor, ActionIcon, Divider } from '@mantine/core';
import { 
  IconBrandFacebook, 
  IconBrandTwitter, 
  IconBrandInstagram, 
  IconBrandLinkedin,
  IconPhone, 
  IconMail, 
  IconMapPin,
  IconArrowUp,
  IconHeart
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footerContainer}>
      {/* Scroll to top button */}
      <button 
        className={`${styles.scrollToTop} ${showScrollTop ? styles.visible : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <IconArrowUp size={20} />
      </button>

      {/* Top gradient accent */}
      <div className={styles.footerAccent}></div>
      
      <Container size="lg" className={styles.footerContent}>
        {/* Main Footer Content */}
        <div className={styles.footerGrid}>
          {/* Company Info */}
          <div className={styles.footerSection}>
            <div className={styles.logoSection}>
              <img 
                src="https://imgur.com/weEZnmD.jpg" 
                alt="Epaisa Logo" 
                className={styles.footerLogo}
              />
              <h3 className={styles.companyName}>Epaisa Consultancy</h3>
            </div>
            <Text className={styles.footerDescription}>
              Empowering businesses with innovative solutions and expert consultancy. 
              Your success is our mission.
            </Text>
            <div className={styles.socialIcons}>
              <ActionIcon 
                component="a" 
                href="#" 
                className={styles.socialIcon}
                aria-label="Facebook"
              >
                <IconBrandFacebook size={20} />
              </ActionIcon>
              <ActionIcon 
                component="a" 
                href="#" 
                className={styles.socialIcon}
                aria-label="Twitter"
              >
                <IconBrandTwitter size={20} />
              </ActionIcon>
              <ActionIcon 
                component="a" 
                href="#" 
                className={styles.socialIcon}
                aria-label="Instagram"
              >
                <IconBrandInstagram size={20} />
              </ActionIcon>
              <ActionIcon 
                component="a" 
                href="#" 
                className={styles.socialIcon}
                aria-label="LinkedIn"
              >
                <IconBrandLinkedin size={20} />
              </ActionIcon>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <div className={styles.linksList}>
              <Anchor href="/" className={styles.footerLink}>Home</Anchor>
              <Anchor href="/#services" className={styles.footerLink}>Services</Anchor>
              <Anchor href="/#team" className={styles.footerLink}>Team</Anchor>
              <Anchor href="/blog" className={styles.footerLink}>Blogs</Anchor>
            </div>
          </div>

          {/* Legal Links */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Legal</h4>
            <div className={styles.linksList}>
              <Anchor href="/privacy" className={styles.footerLink}>Privacy Policy</Anchor>
              <Anchor href="/terms" className={styles.footerLink}>Terms of Service</Anchor>
              <Anchor href="/contact" className={styles.footerLink}>Contact Us</Anchor>
              <Anchor href="/support" className={styles.footerLink}>Support</Anchor>
            </div>
          </div>

          {/* Contact Info */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Get In Touch</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <IconMapPin size={18} className={styles.contactIcon} />
                <Text className={styles.contactText}>
                  7 MM Feeder Road<br />
                  Kolkata, West Bengal
                </Text>
              </div>
              <div className={styles.contactItem}>
                <IconPhone size={18} className={styles.contactIcon} />
                <Anchor 
                  href="tel:+919903373388" 
                  className={`${styles.contactText} ${styles.contactLink}`}
                >
                  +91 9903373388
                </Anchor>
              </div>
              <div className={styles.contactItem}>
                <IconMail size={18} className={styles.contactIcon} />
                <Anchor 
                  href="mailto:mshubham.work@gmail.com" 
                  className={`${styles.contactText} ${styles.contactLink}`}
                >
                  mshubham.work@gmail.com
                </Anchor>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Divider className={styles.footerDivider} />

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <Text className={styles.copyright}>
            © {currentYear} Epaisa Consultancy. All rights reserved.
          </Text>
          <Text className={styles.madeWith}>
            Made with <IconHeart size={14} className={styles.heartIcon} /> in India
          </Text>
        </div>
      </Container>
    </footer>
  );
}