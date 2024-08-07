// components/LottieLoader.js
import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../animations/loadingAnimation.json';

const LottieLoader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="lottie-loader">
      <Lottie options={defaultOptions} height={150} width={150} />
    </div>
  );
};

export default LottieLoader;
