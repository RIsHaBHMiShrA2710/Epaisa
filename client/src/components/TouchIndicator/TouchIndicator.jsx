import React, { useState } from 'react';
import styles from './TouchIndicator.module.css';

export function TouchIndicator({ children, ...props }) {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;
    const newRipple = { x, y, size, key: Date.now() };

    setRipples((prev) => [...prev, newRipple]);

    // Remove the ripple after 600ms
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.key !== newRipple.key));
    }, 600);
  };

  return (
    <div
      className={styles.touchIndicatorContainer}
      onMouseDown={createRipple}
      onTouchStart={createRipple}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className={styles.ripple}
          style={{
            width: ripple.size,
            height: ripple.size,
            top: ripple.y,
            left: ripple.x,
          }}
        />
      ))}
    </div>
  );
}

export default TouchIndicator;
