import { IconCheck } from '@tabler/icons-react';
import { Button, Container, Flex, Group, Image, List, Text, ThemeIcon, Title } from '@mantine/core';
import classes from "./HeroPage.module.css";
import FadeInLeft from '../../animations/FadeInLeft';
import StaggerContainer from '../../animations/StaggerContainer';
import { TypeAnimation } from 'react-type-animation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 4,
      duration: 1,
      ease: 'easeOut',
    },
  }),
};

const MotionListItem = motion(List.Item);

const HeroPage = () => (
  <Container size="md" className={classes.hero_container}>
    <div className={classes.inner}>
      <img src="https://imgur.com/hnpdsis.jpg" alt='Accounting' className={classes.backgroundImage}></img>
      <div className={classes.content}>
        <FadeInLeft delay={0.2}>
          <Title className={classes.title}>
            Simplifying <span className={classes.highlight}>Tax Filing</span><br /> for Individuals & Businesses
          </Title>

        </FadeInLeft>

        <Text c="dimmed" mt="md" >
          <TypeAnimation
            sequence={[
              'Consult professionals online 💼',
              1000,
              'Get help filing your ITR hassle-free 🧾',
              1000,
              'Maximize deductions and savings ✅',
              1000,
            ]}
            wrapper="span"
            speed={70}
            repeat={Infinity}
            className={classes.hpTypeEffect}
          />


        </Text>

        <List
          mt={30}
          spacing="md"
          size="md"
          icon={
            <ThemeIcon size={24}
              radius="xl"
              color="teal"
              className={classes.contentListIcon}
            >
              <IconCheck size={20} stroke={1.5} />

            </ThemeIcon>

          }

          className={classes.contentList}
        >
          <StaggerContainer>
            <MotionListItem variants={fadeUp} className={classes.contentListItem}>
              <b>Expert Guidance</b> – Chat with certified tax consultants for all your queries.
            </MotionListItem>
            <MotionListItem variants={fadeUp} className={classes.contentListItem}>
              <b>Online Tax Filing</b> – File your income tax returns in minutes with confidence.
            </MotionListItem>
            <MotionListItem variants={fadeUp} className={classes.contentListItem}>
              <b>Secure & Compliant</b> – Your data is protected with bank-grade security and compliant with all regulations.
            </MotionListItem>

          </StaggerContainer>

        </List>
        <Group mt={30}>
          <Button radius="xl" size="md" className={classes.control}>
            Book Free Consultation
          </Button>
          <Button variant="default" radius="xl" size="md" className={classes.control}>
            Learn More
          </Button>
        </Group>
      </div>
      <DotLottieReact
        src="https://lottie.host/df1e4342-5e4b-4fba-8ac6-8be2bad91e7d/lJKP9KbzbX.lottie"
        loop
        autoplay
        className={classes.hpLottie}
      />
    </div>
  </Container>
);

export default HeroPage;
