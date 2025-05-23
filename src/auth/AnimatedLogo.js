import React from 'react';
import './AnimatedLogo.css';
import { FaBuilding } from 'react-icons/fa';

const AnimatedLogo = () => {
  return (
    <div className="animated-logo">
      <div className="logo-container">
        <FaBuilding className="logo-icon" />
        <h1 className="logo-text">J<span className="superscript">2</span>Prop Insights</h1>
      </div>
      <div className="logo-underline"></div>
    </div>
  );
};

export default AnimatedLogo;
