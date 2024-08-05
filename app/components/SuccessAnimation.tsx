import React from 'react';
import styles from './SuccessAnimation.module.css'; // Create a CSS module for the animation styles

const SuccessAnimation: React.FC = () => {
  return (
    <div className={styles.animationContainer}>
      <div className={styles.successCheckmark}>
        <div className={styles.checkIcon}></div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
