import React, { useEffect, useRef, useState } from 'react';
import classes from './Slideshow.module.css';

const Slideshow = () => {
  // Current active slide index
  const [currentSlide, setCurrentSlide] = useState(0);

  // Touch positions to detect swipe direction
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  // Timer reference for clearing interval when unmounting
  const intervalRef = useRef(null);

  // Replace these with your own image URLs
  const slides = [
    'https://images.unsplash.com/photo-1587502536263-839da89d90b0',
    'https://images.unsplash.com/photo-1533622597524-a1215e3b19f3',
    'https://images.unsplash.com/photo-1516637090014-cb1abdb717af',
    'https://images.unsplash.com/photo-1494319265146-5f99f13b6960',
  ];

  // Go to the next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Go to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-cycle slides every 5 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    // Cleanup: clear interval on unmount
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [slides.length]);

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;

    // ~50px threshold to detect a "swipe"
    if (distance > 50) {
      // User swiped left => Next slide
      nextSlide();
    }

    if (distance < -50) {
      // User swiped right => Previous slide
      prevSlide();
    }

    // Reset touch positions
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className={classes.slideshowContainer}>
      {/* Slides */}
      {slides.map((slideUrl, index) => (
        <div
          key={index}
          className={
            index === currentSlide
              ? `${classes.slide} ${classes.active}`
              : classes.slide
          }
          // Attach touch handlers
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img src={slideUrl} alt={`Slide ${index + 1}`} />
        </div>
      ))}

      {/* Optional Prev/Next Buttons (desktop usage) */}
      <button className={classes.navButton} onClick={prevSlide}>
        ‹
      </button>
      <button className={classes.navButton} onClick={nextSlide}>
        ›
      </button>
    </div>
  );
};

export default Slideshow;
