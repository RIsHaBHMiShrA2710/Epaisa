import { Container, Text, Group, Anchor, ActionIcon } from '@mantine/core';
import { IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconPhone, IconMail, IconMapPin } from '@tabler/icons-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <Container size="lg" className={styles.footerContent}>
        <Text size="sm" color="dimmed" className={styles.footerAbout}>
          We are a customer-focused company dedicated to providing top-quality services and solutions. Your satisfaction is our priority.
        </Text>
        
        <Group spacing="md" mt="md" className={styles.footerSocialIcons}>
          <ActionIcon component="a" href="#" size="lg" variant="subtle" aria-label="Facebook">
            <IconBrandFacebook size={20} />
          </ActionIcon>
          <ActionIcon component="a" href="#" size="lg" variant="subtle" aria-label="Twitter">
            <IconBrandTwitter size={20} />
          </ActionIcon>
          <ActionIcon component="a" href="#" size="lg" variant="subtle" aria-label="Instagram">
            <IconBrandInstagram size={20} />
          </ActionIcon>
        </Group>
        
        <Group spacing="md" mt="md" className={styles.footerContactInfo}>
          <Text size="sm" color="dimmed"><IconMapPin size={16} /> 123 Main St, City, Country</Text>
          <Text size="sm" color="dimmed"><IconPhone size={16} /> +123 456 7890</Text>
          <Text size="sm" color="dimmed"><IconMail size={16} /> info@yourcompany.com</Text>
        </Group>
        
        <Group spacing="md" mt="md" className={styles.footerLinks}>
          <Anchor href="/privacy" size="sm" color="dimmed">Privacy Policy</Anchor>
          <Anchor href="/terms" size="sm" color="dimmed">Terms of Service</Anchor>
          <Anchor href="/contact" size="sm" color="dimmed">Contact</Anchor>
        </Group>
        
        <Text size="sm" color="dimmed" mt="md" className={styles.footerCopyright}>
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}
