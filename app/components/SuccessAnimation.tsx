import React from 'react';
import styles from './SuccessAnimation.module.css'; // Import the CSS module

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
