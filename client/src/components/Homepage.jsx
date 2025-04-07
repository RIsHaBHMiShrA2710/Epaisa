import React from "react";
import Navbar from "./Navbar/Navbar";
import HeroPage from "./Heropage/HeroPage";
import Services from "./Services/Services";
import Slideshow from "./Slideshow/Slideshow";
import ContactForm from "./ContactForm/ContactForm";
import TeamSection from "./Team/TeamSection";
import Footer from "./Footer/Footer";
import PageLoader from "./LoadingSpinner/PageLoader/PageLoader"
const Homepage = () => {
  return (
    <>
      <PageLoader>
        <HeroPage />
        <Services />
        <TeamSection />
        <ContactForm />
        <Footer />
      </PageLoader>

    </>
  );
};

export default Homepage;
