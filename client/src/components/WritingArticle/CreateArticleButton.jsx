import React, { useState } from 'react';
import './CreateArticleButton.css';

export const CreateArticleButton = ({ onClick }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick();
    
    // Reset animation state after a delay
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <button 
      className={`floating-button ${isClicked ? 'clicked' : ''}`} 
      onClick={handleClick}
      aria-label="Create new article"
    >
      <span className="button-icon">✨</span>
      <span className="button-text">Create Article</span>
    </button>
  );
};