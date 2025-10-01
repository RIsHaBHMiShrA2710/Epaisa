import React, { useState, useEffect } from 'react';
import { Check, Calendar, BookOpen, TrendingUp, Users, Shield, DollarSign, FileText, Clock, Star } from 'lucide-react';
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
              {/* Abstract Tax Flow Illustration */}
              <div className={classes.abstractContainer}>
                {/* Central Hub */}
                <div className={classes.centralHub}>
                  <div className={classes.hubGlow}></div>
                  <div className={classes.hubCore}>
                    <div className={classes.coreSymbol}>₹</div>
                  </div>
                  <div className={classes.hubRings}>
                    <div className={classes.ring1}></div>
                    <div className={classes.ring2}></div>
                    <div className={classes.ring3}></div>
                  </div>
                </div>

                {/* Floating Abstract Elements */}
                <div className={`${classes.floatingElement} ${classes.element1}`}>
                  <div className={classes.docShape}>
                    <div className={classes.docLines}></div>
                  </div>
                </div>

                <div className={`${classes.floatingElement} ${classes.element2}`}>
                  <div className={classes.calculatorShape}>
                    <div className={classes.calcDisplay}></div>
                    <div className={classes.calcButtons}></div>
                  </div>
                </div>

                <div className={`${classes.floatingElement} ${classes.element3}`}>
                  <div className={classes.chartShape}>
                    <div className={classes.chartBars}>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>

                <div className={`${classes.floatingElement} ${classes.element4}`}>
                  <div className={classes.shieldShape}>
                    <div className={classes.shieldInner}>
                      <div className={classes.checkmark}>✓</div>
                    </div>
                  </div>
                </div>

                <div className={`${classes.floatingElement} ${classes.element5}`}>
                  <div className={classes.clockShape}>
                    <div className={classes.clockFace}>
                      <div className={classes.clockHand}></div>
                    </div>
                  </div>
                </div>

                <div className={`${classes.floatingElement} ${classes.element6}`}>
                  <div className={classes.coinShape}>
                    <div className={classes.coinInner}>₹</div>
                  </div>
                </div>

                {/* Connection Lines */}
                <div className={classes.connectionLines}>
                  <div className={`${classes.line} ${classes.line1}`}></div>
                  <div className={`${classes.line} ${classes.line2}`}></div>
                  <div className={`${classes.line} ${classes.line3}`}></div>
                  <div className={`${classes.line} ${classes.line4}`}></div>
                  <div className={`${classes.line} ${classes.line5}`}></div>
                  <div className={`${classes.line} ${classes.line6}`}></div>
                </div>

                {/* Particle Effects */}
                <div className={classes.particles}>
                  <div className={`${classes.particle} ${classes.particle1}`}></div>
                  <div className={`${classes.particle} ${classes.particle2}`}></div>
                  <div className={`${classes.particle} ${classes.particle3}`}></div>
                  <div className={`${classes.particle} ${classes.particle4}`}></div>
                  <div className={`${classes.particle} ${classes.particle5}`}></div>
                  <div className={`${classes.particle} ${classes.particle6}`}></div>
                  <div className={`${classes.particle} ${classes.particle7}`}></div>
                  <div className={`${classes.particle} ${classes.particle8}`}></div>
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

          {/* Visual Section - Desktop */}
          <div className={classes.visualSection}>
            {/* Abstract Tax Flow Illustration */}
            <div className={classes.abstractContainer}>
              {/* Central Hub */}
              <div className={classes.centralHub}>
                <div className={classes.hubGlow}></div>
                <div className={classes.hubCore}>
                  <div className={classes.coreSymbol}>₹</div>
                </div>
                <div className={classes.hubRings}>
                  <div className={classes.ring1}></div>
                  <div className={classes.ring2}></div>
                  <div className={classes.ring3}></div>
                </div>
              </div>

              {/* Floating Abstract Elements */}
              <div className={`${classes.floatingElement} ${classes.element1}`}>
                <div className={classes.docShape}>
                  <div className={classes.docLines}></div>
                </div>
              </div>

              <div className={`${classes.floatingElement} ${classes.element2}`}>
                <div className={classes.calculatorShape}>
                  <div className={classes.calcDisplay}></div>
                  <div className={classes.calcButtons}></div>
                </div>
              </div>

              <div className={`${classes.floatingElement} ${classes.element3}`}>
                <div className={classes.chartShape}>
                  <div className={classes.chartBars}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>

              <div className={`${classes.floatingElement} ${classes.element4}`}>
                <div className={classes.shieldShape}>
                  <div className={classes.shieldInner}>
                    <div className={classes.checkmark}>✓</div>
                  </div>
                </div>
              </div>

              <div className={`${classes.floatingElement} ${classes.element5}`}>
                <div className={classes.clockShape}>
                  <div className={classes.clockFace}>
                    <div className={classes.clockHand}></div>
                  </div>
                </div>
              </div>

              <div className={`${classes.floatingElement} ${classes.element6}`}>
                <div className={classes.coinShape}>
                  <div className={classes.coinInner}>₹</div>
                </div>
              </div>

              {/* Connection Lines */}
              <div className={classes.connectionLines}>
                <div className={`${classes.line} ${classes.line1}`}></div>
                <div className={`${classes.line} ${classes.line2}`}></div>
                <div className={`${classes.line} ${classes.line3}`}></div>
                <div className={`${classes.line} ${classes.line4}`}></div>
                <div className={`${classes.line} ${classes.line5}`}></div>
                <div className={`${classes.line} ${classes.line6}`}></div>
              </div>

              {/* Particle Effects */}
              <div className={classes.particles}>
                <div className={`${classes.particle} ${classes.particle1}`}></div>
                <div className={`${classes.particle} ${classes.particle2}`}></div>
                <div className={`${classes.particle} ${classes.particle3}`}></div>
                <div className={`${classes.particle} ${classes.particle4}`}></div>
                <div className={`${classes.particle} ${classes.particle5}`}></div>
                <div className={`${classes.particle} ${classes.particle6}`}></div>
                <div className={`${classes.particle} ${classes.particle7}`}></div>
                <div className={`${classes.particle} ${classes.particle8}`}></div>
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