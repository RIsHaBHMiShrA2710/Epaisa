import { useState, useEffect, useRef } from 'react';
import { Container, Title, Text, Box, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import { useMediaQuery } from '@mantine/hooks';
import Autoplay from 'embla-carousel-autoplay';
import {
  IconBrandTwitter,
  IconBrandPinterest,
  IconBrandInstagram,
  IconBrandVimeo,
  IconMail,
} from '@tabler/icons-react';
import classes from './TeamSection.module.css';
import {DotLottieReact} from '@lottiefiles/dotlottie-react';

const teamMembers = [
  {
    name: 'Rakesh Mishra',
    role: 'Accountant',
    image: '/images/team_left.jpg',
    description: '25+ years of industry expertise in accounting and taxing',
  },
  {
    name: 'CA Shubham Mishra',
    role: 'Chartared Accountant',
    image: '/images/team_middle.gif',
    description: 'CA (May 24) | B.Com(H) SAJC 21 | Options Strategist | Technical Analyst | Proprietor – Shubham Mishra & Co ',
  },
  {
    name: 'Rishabh Mishra',
    role: 'Tech Lead',
    image: '/images/profile_placeholder.jpg',
    description: 'Created Epaisa Consultancy site and responsible for technical issues',
  },
];

const TeamMemberCard = ({ member, isMobile }) => {
  // For mobile: control whether the overlay is visible
  const [overlayVisible, setOverlayVisible] = useState(false);
  // For mobile: show the Lottie touch animation briefly when touched
  const [showAnimation, setShowAnimation] = useState(true);

  const handleTouch = (e) => {
    // Prevent the event from bubbling up (if needed)
    e.stopPropagation();

    // Only handle click toggling on mobile
    if (isMobile) {
      // Toggle overlay state when clicked
      setOverlayVisible((prev) => !prev);
      // Play Lottie animation for feedback (800ms duration)
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
      }, 800);
    }
  };

  // Optional: close the overlay if a click happens outside the card
  // (You can modify this logic as needed)
  useEffect(() => {
    if (!isMobile || !overlayVisible) return;

    const handleClickOutside = (event) => {
      // If clicking anywhere on the document (outside the card), close the overlay
      // (You might want to improve this by checking if the click is truly outside)
      setOverlayVisible(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [overlayVisible, isMobile]);

  return (
    <div className={classes.singleItem}>
      <div className={classes.item}>
        <div className={classes.thumb} onClick={handleTouch}>
          {/* On mobile, show Lottie animation when touched */}
          {isMobile && showAnimation && (
            <DotLottieReact
              src="https://lottie.host/e1dc2017-2da0-4b4d-a85a-6ba71a2abf4c/4K740tlKIU.lottie"
              loop
              autoplay
              style={{
                position: 'absolute',
                top: '40%',
                left: '25%',
                width: '50%',
                height: '50%',
                zIndex: 50,
                pointerEvents: 'none',
              }}
            />
          )}
          <Image
            src={member.image}
            alt={member.name}
            className={classes.imgFluid}
          />
          <div
            className={classes.overlay}
            /* For mobile, force the overlay open/closed based on state */
            style={isMobile ? { transform: overlayVisible ? 'translateY(0)' : 'translateY(100%)' } : {}}
          >
            <h4>{member.name}</h4>
            <p>{member.description}</p>
            <div className={classes.social}>
              <ul>
                {/* <li>
                  <a href="#" aria-label="Twitter">
                    <IconBrandTwitter size={16} />
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Pinterest">
                    <IconBrandPinterest size={16} />
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Instagram">
                    <IconBrandInstagram size={16} />
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Vimeo">
                    <IconBrandVimeo size={16} />
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
        <div className={classes.info}>
          <span className={classes.message}>
            <a href="#" aria-label="Send message">
              <IconMail size={16} />
            </a>
          </span>
          <h4>{member.name}</h4>
          <span>{member.role}</span>
        </div>
      </div>
    </div>
  );
};


export function TeamSection() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  // Auto-slide every 2 seconds for mobile carousel
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Box component="section" id="team" className={classes.teamArea}>
      <Container size="lg">
        <div className={classes.siteHeading}>
          <Title order={2}>
            Our <Text span className={classes.span}>Team</Text>
          </Title>
          <Text size="lg">Meet our awesome and expert team members</Text>
        </div>

        {isMobile ? (
          <Box className={classes.carouselWrapper}>
            <Carousel
              slideSize="100%"
              slideGap="sm"
              loop
              align="center"
              withControls
              withIndicators
              plugins={[autoplay.current]}
              onMouseEnter={autoplay.current.stop}
              onMouseLeave={autoplay.current.reset}
              classNames={{
                root: classes.carousel,
                slide: classes.slide,
                control: classes.carouselControl,
                indicator: classes.carouselIndicator,
                indicators: classes.carouselIndicatorsWrapper,
              }}
            >
              {teamMembers.map((member, index) => (
                <Carousel.Slide key={index}>
                  <TeamMemberCard member={member} isMobile={isMobile} />
                </Carousel.Slide>
              ))}
            </Carousel>
          </Box>
        ) : (
          <div className={classes.teamItems}>
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} isMobile={isMobile} />
            ))}
          </div>
        )}
      </Container>
    </Box>
  );
}

export default TeamSection;
