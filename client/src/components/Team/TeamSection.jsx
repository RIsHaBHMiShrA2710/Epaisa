import { useState, useEffect } from 'react';
import { Container, Title, Text, Group, Box, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { IconBrandTwitter, IconBrandPinterest, IconBrandInstagram, IconBrandVimeo, IconMail } from '@tabler/icons-react';
import classes from './TeamSection.module.css';

const teamMembers = [
  {
    name: 'Lorem Ipsum',
    role: 'Project Manager',
    image: 'https://i.ibb.co/JC4skS0/team-animate.jpg',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    name: 'Lorem Ipsum',
    role: 'App Developer',
    image: 'https://i.ibb.co/JC4skS0/team-animate.jpg',
    description: 'kING.',
  },
  {
    name: 'Lorem Ipsum',
    role: 'Web Designer',
    image: 'https://i.ibb.co/JC4skS0/team-animate.jpg',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
];

const TeamMemberCard = ({ member }) => {
  return (
    <div className={classes.singleItem}>
      <div className={classes.item}>
        <div className={classes.thumb}>
          <Image 
            src={member.image} 
            alt={member.name}
            className={classes.imgFluid}
          />
          <div className={classes.overlay}>
            <h4>{member.name}</h4>
            <p>{member.description}</p>
            <div className={classes.social}>
              <ul>
                <li>
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
                </li>
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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
          <Carousel
            slideSize="100%"
            height={500}
            align="start"
            slideGap="md"
            withControls
            withIndicators
          >
            {teamMembers.map((member, index) => (
              <Carousel.Slide key={index}>
                <TeamMemberCard member={member} />
              </Carousel.Slide>
            ))}
          </Carousel>
        ) : (
          <div className={classes.teamItems}>
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        )}
      </Container>
    </Box>
  );
}

export default TeamSection;