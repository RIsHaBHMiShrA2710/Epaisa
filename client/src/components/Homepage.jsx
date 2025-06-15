// src/components/Homepage.jsx
import React from 'react';
import HeroPage from './Heropage/HeroPage';
import Services from './Services/Services';
import Slideshow from './Slideshow/Slideshow';
import ContactForm from './ContactForm/ContactForm';
import TeamSection from './Team/TeamSection';
import PageLoader from './LoadingSpinner/PageLoader/PageLoader';

export default function Homepage() {
  return (
    <PageLoader>
      <HeroPage />
      <section id="services"><Services /></section>
      <section id="team"><TeamSection /></section>
      <section id="contact"><ContactForm /></section>
    </PageLoader>
  );
}
