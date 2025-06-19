import { IconCheck } from '@tabler/icons-react';
import { Button, Container, Flex, Group, Image, List, Text, ThemeIcon, Title } from '@mantine/core';
import classes from "./HeroPage.module.css";
import FadeInLeft from '../../animations/FadeInLeft';
import StaggerContainer from '../../animations/StaggerContainer';
import { TypeAnimation } from 'react-type-animation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
      <img src="/images/heropage_background.jpg" alt='Accounting' className={classes.backgroundImage}></img>
      <div className={classes.content}>
        <FadeInLeft delay={0.2}>
          <Title className={classes.title}>
            Simplifying <span className={classes.highlight}>Tax Filing</span><br /> for Individuals & Businesses
          </Title>

        </FadeInLeft>

        <Text c="dimmed" mt="md" className={classes.typeEffectContainer}>
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
              <b>Portfolio Management</b> –  Benefit from strategic portfolio management designed to maximize returns while rigorously managing risk.
            </MotionListItem>

          </StaggerContainer>

        </List>
        <Group mt={30} spacing="md" display="flex" direction="column" position="center">
          <Button
            component="a"
            href="https://calendly.com/1234mshubham"
            target="_blank"
            rel="noopener noreferrer"
            variant="default"
            radius="xl"
            size="md"
            className={classes.control}
          >
            Book Free Consultation
          </Button>

          <Button
            component={Link}
            to="/blog"
            variant="default"
            radius="xl"
            size="md"
            className={classes.control}
          >
            Read our blogs
          </Button>
        </Group>

      </div>
      <DotLottieReact
        src="/images/heropage_animated.lottie"
        loop
        autoplay
        className={classes.hpLottie}
      />
    </div>
  </Container>
);

export default HeroPage;
