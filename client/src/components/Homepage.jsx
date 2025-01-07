import React from "react";
import Navbar from "./Navbar/Navbar";
import HeroPage from "./Heropage/HeroPage";
import Services from "./Services/Services";
import Slideshow from "./Slideshow/Slideshow";

const Homepage = () => {
  return (
    <>
      <Navbar />
      <HeroPage />
      <Services />
    </>
  );
};

export default Homepage;
