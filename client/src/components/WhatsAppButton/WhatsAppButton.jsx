import React from 'react';
import styles from './WhatsAppButton.module.css';

const WhatsAppButton = () => {
  const phoneNumber = '9903373388'; 

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappButton}
    >
      <img
        src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
        alt="WhatsApp"
      />
    </a>
  );
};

export default WhatsAppButton;
