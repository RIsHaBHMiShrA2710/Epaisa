import { useState, useEffect, useRef } from 'react';
import { Container, Title, Text, Box, Image, Button } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import { useMediaQuery } from '@mantine/hooks';
import Autoplay from 'embla-carousel-autoplay';
import {
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandInstagram,
  IconBrandGithub,
  IconMail,
  IconPhone,
  IconMapPin,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import classes from './TeamSection.module.css';

const teamMembers = [
  {
    id: 1,
    name: 'Rakesh Mishra',
    role: 'Senior Accountant',
    image: '/images/team_left.jpg',
    description: '25+ years of industry expertise in accounting and taxation. Specializes in corporate finance and regulatory compliance.',
    email: 'rakesh@epaisaconsultancy.com',
    phone: '+91 98765 43210',
    location: 'Kolkata, WB',
    expertise: ['Corporate Taxation', 'Financial Planning', 'Compliance'],
    social: {
      linkedin: '#',
      twitter: '#',
      instagram: '#',
    }
  },
  {
    id: 2,
    name: 'CA Shubham Mishra',
    role: 'Chartered Accountant',
    image: '/images/team_middle.gif',
    description: 'CA (May 24) | B.Com(H) SAJC 21 | Options Strategist | Technical Analyst | Proprietor â€" Shubham Mishra & Co',
    email: 'shubham@epaisaconsultancy.com',
    phone: '+91 98765 43211',
    location: 'Kolkata, WB',
    expertise: ['Options Trading', 'Technical Analysis', 'Investment Advisory'],
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#',
    }
  },
  {
    id: 3,
    name: 'Rishabh Mishra',
    role: 'Technology Lead',
    image: '/images/profile_placeholder.jpg',
    description: 'Full-stack developer and tech architect. Created Epaisa Consultancy platform and manages all technical operations.',
    email: 'rishabh@epaisaconsultancy.com',
    phone: '+91 98765 43212',
    location: 'Kolkata, WB',
    expertise: ['React Development', 'System Architecture', 'DevOps'],
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#',
    }
  },
];

const TeamMemberCard = ({ member, isMobile, isTablet }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleCardInteraction = (e) => {
    e.stopPropagation();
    
    // Allow flipping on all devices, not just mobile/tablet
    setIsFlipped(prev => !prev);
    
    // Only show ripple animation on mobile/tablet
    if (isMobile || isTablet) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 600);
    }
  };

  const handleFlipButtonClick = (e) => {
    e.stopPropagation();
    handleCardInteraction(e);
  };

  useEffect(() => {
    if (!isMobile && !isTablet) return;

    const handleClickOutside = (event) => {
      if (isFlipped) {
        setIsFlipped(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isFlipped, isMobile, isTablet]);

  return (
    <div className={classes.cardContainer}>
      <div 
        className={`${classes.card} ${isFlipped ? classes.flipped : ''}`}
        onClick={isMobile || isTablet ? handleCardInteraction : undefined}
      >
        {/* Touch Animation */}
        {(isMobile || isTablet) && showAnimation && (
          <div className={classes.touchAnimation}>
            <div className={classes.ripple}></div>
          </div>
        )}

        {/* Front of Card */}
        <div className={classes.cardFront}>
          <div className={classes.imageContainer}>
            <Image
              src={member.image}
              alt={member.name}
              className={classes.memberImage}
              fallbackSrc="/images/profile_placeholder.jpg"
            />
            <div className={classes.imageOverlay}>
              <Button 
                variant="light" 
                size="sm" 
                className={classes.flipButton}
                onClick={handleFlipButtonClick}
              >
                View Details
              </Button>
            </div>
          </div>
          
          <div className={classes.cardContent}>
            <div className={classes.memberInfo}>
              <h3 className={classes.memberName}>{member.name}</h3>
              <p className={classes.memberRole}>{member.role}</p>
              <p className={classes.memberDescription}>{member.description}</p>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className={classes.cardBack}>
          <div className={classes.backContent}>
            <h3 className={classes.backTitle}>{member.name}</h3>
            <p className={classes.backRole}>{member.role}</p>
            
            <div className={classes.contactInfo}>
              <div className={classes.contactItem}>
                <IconMail size={16} />
                <span>{member.email}</span>
              </div>
              <div className={classes.contactItem}>
                <IconPhone size={16} />
                <span>{member.phone}</span>
              </div>
              <div className={classes.contactItem}>
                <IconMapPin size={16} />
                <span>{member.location}</span>
              </div>
            </div>

            <div className={classes.expertise}>
              <h4>Expertise</h4>
              <div className={classes.expertiseTags}>
                {member.expertise.map((skill, index) => (
                  <span key={index} className={classes.expertiseTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className={classes.socialLinks}>
              {member.social.linkedin && (
                <a href={member.social.linkedin} className={classes.socialLink}>
                  <IconBrandLinkedin size={20} />
                </a>
              )}
              {member.social.twitter && (
                <a href={member.social.twitter} className={classes.socialLink}>
                  <IconBrandTwitter size={20} />
                </a>
              )}
              {member.social.instagram && (
                <a href={member.social.instagram} className={classes.socialLink}>
                  <IconBrandInstagram size={20} />
                </a>
              )}
              {member.social.github && (
                <a href={member.social.github} className={classes.socialLink}>
                  <IconBrandGithub size={20} />
                </a>
              )}
            </div>

            {/* Add a button to flip back on desktop */}
            {!isMobile && !isTablet && (
              <Button 
                variant="outline" 
                size="sm" 
                className={classes.backButton}
                onClick={handleFlipButtonClick}
              >
                Back to Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function TeamSection() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const autoplay = useRef(Autoplay({ delay: 4000 }));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Box component="section" id="team" className={classes.teamSection}>
      <Container size="xl" className={classes.container}>
        <div className={classes.sectionHeader}>
          <Title order={2} className={classes.sectionTitle}>
            Meet Our <Text span className={classes.titleAccent}>Expert Team</Text>
          </Title>
          <Text size="lg" className={classes.sectionSubtitle}>
            Dedicated professionals committed to your financial success
          </Text>
          <div className={classes.titleUnderline}></div>
        </div>

        {isMobile ? (
          <Box className={classes.carouselWrapper}>
            <Carousel
              slideSize="100%"
              slideGap="md"
              loop
              align="center"
              withControls
              withIndicators
              plugins={[autoplay.current]}
              onMouseEnter={autoplay.current.stop}
              onMouseLeave={autoplay.current.reset}
              nextControlIcon={<IconChevronRight size={20} />}
              previousControlIcon={<IconChevronLeft size={20} />}
              classNames={{
                root: classes.carousel,
                slide: classes.slide,
                control: classes.carouselControl,
                indicator: classes.carouselIndicator,
                indicators: classes.carouselIndicators,
              }}
            >
              {teamMembers.map((member) => (
                <Carousel.Slide key={member.id}>
                  <TeamMemberCard 
                    member={member} 
                    isMobile={isMobile} 
                    isTablet={isTablet} 
                  />
                </Carousel.Slide>
              ))}
            </Carousel>
          </Box>
        ) : (
          <div className={classes.teamGrid}>
            {teamMembers.map((member) => (
              <TeamMemberCard 
                key={member.id} 
                member={member} 
                isMobile={isMobile} 
                isTablet={isTablet} 
              />
            ))}
          </div>
        )}
      </Container>
    </Box>
  );
}
export default TeamSection;