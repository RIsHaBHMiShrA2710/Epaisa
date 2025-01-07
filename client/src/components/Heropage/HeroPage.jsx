import { IconCheck } from '@tabler/icons-react';
import { Button, Container, Flex, Group, Image, List, Text, ThemeIcon, Title } from '@mantine/core';
import classes from "./HeroPage.module.css";

const HeroPage = () => (
  <Container size="md">
    <div className={classes.inner}>
      <img src="https://imgur.com/hnpdsis.jpg" alt='Accounting' className={classes.backgroundImage }></img>
      <div className={classes.content}>
        <Title className={classes.title}>
          A <span className={classes.highlight}>modern</span> React <br /> components library
        </Title>
        <Text c="dimmed" mt="md">
          Build fully functional accessible web applications faster than ever – Mantine includes
          more than 120 customizable components and hooks to cover you in any situation
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
          <List.Item className={classes.flexItem}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
            <b>TypeScript based</b> – build type-safe applications, all components and hooks export
            types
          </List.Item>
          <List.Item className={classes.contentListItem}>
            <b>Free and open source</b> – all packages have MIT license, you can use Mantine in any
            project
          </List.Item>
          <List.Item className={classes.contentListItem}>
            <b>No annoying focus ring</b> – focus ring will appear only when user navigates with
            keyboard
          </List.Item>
        </List>
        <Group mt={30}>
          <Button radius="xl" size="md" className={classes.control}>
            Get started
          </Button>
          <Button variant="default" radius="xl" size="md" className={classes.control}>
            Source code
          </Button>
        </Group>
      </div>
      <Image src={"https://i.imgur.com/50340Rz.jpeg"} className={classes.image} />
    </div>
  </Container>
);

export default HeroPage;
