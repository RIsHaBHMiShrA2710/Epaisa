import React from "react";
import Navbar from "./Navbar/Navbar";
import HeroPage from "./Heropage/HeroPage";
import Services from "./Services/Services";
import Slideshow from "./Slideshow/Slideshow";
import TeamSection from "./Team/TeamSection";
const Homepage = () => {
  return (
    <>
      <Navbar />
      <HeroPage />
      <Services />
      <TeamSection />
    </>
  );
};

export default Homepage;
