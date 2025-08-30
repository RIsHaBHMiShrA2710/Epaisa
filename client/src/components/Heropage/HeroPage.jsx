import React, { useState, useEffect } from 'react';
import { Check, Calendar, BookOpen, TrendingUp, Users, Shield } from 'lucide-react';
import classes from './HeroPage.module.css';
import { useNavigate } from 'react-router-dom';
const HeroPage = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const typeTexts = [
    'Consult professionals online 💼',
    'Get help filing your ITR hassle-free 🧾',
    'Maximize deductions and savings ✅'
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const typewriter = () => {
      const current = typeTexts[currentIndex];
      
      if (isDeleting) {
        setCurrentText(current.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % typeTexts.length);
        }
      } else {
        setCurrentText(current.substring(0, currentText.length + 1));
        if (currentText === current) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    };

    const timer = setTimeout(typewriter, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [currentText, currentIndex, isDeleting, typeTexts]);

  const features = [
    {
      icon: <Users className={classes.featureIcon} />,
      title: "Expert Guidance",
      description: "Chat with certified tax consultants for all your queries"
    },
    {
      icon: <BookOpen className={classes.featureIcon} />,
      title: "Online Tax Filing",
      description: "File your income tax returns in minutes with confidence"
    },
    {
      icon: <TrendingUp className={classes.featureIcon} />,
      title: "Portfolio Management",
      description: "Strategic portfolio management to maximize returns while managing risk"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Returns Filed" },
    { number: "₹2Cr+", label: "Tax Saved" },
    { number: "98%", label: "Client Satisfaction" }
  ];

  return (
    <div className={classes.heroContainer}>
      {/* Animated background elements */}
      <div className={classes.backgroundElements}>
        <div className={`${classes.floatingOrb} ${classes.orb1}`}></div>
        <div className={`${classes.floatingOrb} ${classes.orb2}`}></div>
        <div className={`${classes.floatingOrb} ${classes.orb3}`}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className={classes.gridPattern}></div>

      <div className={classes.container}>
        <div className={classes.inner}>
          
          {/* Content Section */}
          <div className={`${classes.content} ${isVisible ? classes.visible : ''}`}>
            
            {/* Main Title */}
            <div className={classes.titleSection}>
              <h1 className={classes.title}>
                Simplifying{' '}
                <span className={classes.highlightText}>
                  Tax Filing
                  <div className={classes.underline}></div>
                </span>
              </h1>
              <p className={classes.subtitle}>
                for Individuals & Businesses
              </p>
            </div>

            {/* Typing Animation */}
            <div className={classes.typeContainer}>
              <div className={classes.typeText}>
                {currentText}
                <span className={classes.cursor}>|</span>
              </div>
            </div>

            {/* Mobile Visual Section - Only visible on smaller screens */}
            <div className={classes.mobileVisualSection}>
              {/* Floating cards */}
              <div className={`${classes.floatingCard} ${classes.card1}`}>
                <div className={classes.cardContent}>
                  <div className={classes.cardNumber}>₹50K+</div>
                  <div className={classes.cardLabel}>Saved</div>
                </div>
              </div>
              
              <div className={`${classes.floatingCard} ${classes.card2}`}>
                <div className={classes.cardContent}>
                  <div className={classes.cardNumber}>5★</div>
                  <div className={classes.cardLabel}>Rating</div>
                </div>
              </div>

              {/* Central illustration */}
              <div className={classes.centralIllustration}>
                <div className={classes.illustrationGlow}></div>
                <div className={classes.illustrationContainer}>
                  {/* Tax document icon */}
                  <div className={classes.documentIcon}>
                    <div className={classes.docLine1}></div>
                    <div className={classes.docLine2}></div>
                    <div className={classes.docLine3}></div>
                    <div className={classes.docSignature}></div>
                  </div>
                  <div className={classes.illustrationText}>
                    <div className={classes.illustrationTitle}>Tax Made Simple</div>
                    <div className={classes.illustrationSubtitle}>Professional • Fast • Secure</div>
                  </div>
                </div>
              </div>

              {/* Bottom floating element */}
              <div className={`${classes.floatingCard} ${classes.card3}`}>
                <div className={classes.cardContent}>
                  <div className={classes.cardNumber}>24/7</div>
                  <div className={classes.cardLabel}>Support</div>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className={classes.featuresList}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`${classes.featureCard} ${isVisible ? classes.featureVisible : ''}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className={classes.featureIconContainer}>
                    {feature.icon}
                  </div>
                  <div className={classes.featureContent}>
                    <h3 className={classes.featureTitle}>{feature.title}</h3>
                    <p className={classes.featureDescription}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className={classes.ctaContainer}>
              <button
                className={classes.primaryButton}
                onClick={() => window.open('https://calendly.com/1234mshubham', '_blank')}
              >
                <Calendar className={classes.buttonIcon} />
                Book Free Consultation
                <div className={classes.buttonOverlay}></div>
              </button>
              
              <button className={classes.secondaryButton} onClick={() => navigate("/blog")}>
                <BookOpen className={classes.buttonIcon} />
                Read Our Blogs
              </button>
            </div>

            {/* Trust Indicators */}
            <div className={classes.trustIndicators}>
              <div className={classes.trustItem}>
                <Shield className={classes.trustIcon} />
                <span>Certified Experts</span>
              </div>
              <div className={classes.trustItem}>
                <Check className={classes.trustIcon} />
                <span>100% Secure</span>
              </div>
              <div className={classes.trustItem}>
                <TrendingUp className={classes.trustIcon} />
                <span>Proven Results</span>
              </div>
            </div>
          </div>

          {/* Visual Section */}
          <div className={classes.visualSection}>
            {/* Floating cards */}
            <div className={`${classes.floatingCard} ${classes.card1}`}>
              <div className={classes.cardContent}>
                <div className={classes.cardNumber}>₹50K+</div>
                <div className={classes.cardLabel}>Saved</div>
              </div>
            </div>
            
            <div className={`${classes.floatingCard} ${classes.card2}`}>
              <div className={classes.cardContent}>
                <div className={classes.cardNumber}>5★</div>
                <div className={classes.cardLabel}>Rating</div>
              </div>
            </div>

            {/* Central illustration */}
            <div className={classes.centralIllustration}>
              <div className={classes.illustrationGlow}></div>
              <div className={classes.illustrationContainer}>
                {/* Tax document icon */}
                <div className={classes.documentIcon}>
                  <div className={classes.docLine1}></div>
                  <div className={classes.docLine2}></div>
                  <div className={classes.docLine3}></div>
                  <div className={classes.docSignature}></div>
                </div>
                <div className={classes.illustrationText}>
                  <div className={classes.illustrationTitle}>Tax Made Simple</div>
                  <div className={classes.illustrationSubtitle}>Professional • Fast • Secure</div>
                </div>
              </div>
            </div>

            {/* Bottom floating element */}
            <div className={`${classes.floatingCard} ${classes.card3}`}>
              <div className={classes.cardContent}>
                <div className={classes.cardNumber}>24/7</div>
                <div className={classes.cardLabel}>Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats section */}
        <div className={classes.statsSection}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${classes.statCard} ${isVisible ? classes.statVisible : ''}`}
              style={{ transitionDelay: `${index * 100 + 800}ms` }}
            >
              <div className={classes.statNumber}>{stat.number}</div>
              <div className={classes.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroPage;