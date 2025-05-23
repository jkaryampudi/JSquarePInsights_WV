import React, { useEffect, useState } from 'react';
import './HeroSection.css';
import { FaArrowRight, FaChartLine, FaHome, FaBuilding, FaMoneyBillWave, FaPercentage, FaCity, FaUsers, FaKey, FaSearch, FaLightbulb, FaDatabase, FaChartBar } from 'react-icons/fa';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Add scroll animation detection
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Set visible after a short delay for entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  // Calculate parallax movement
  const getParallaxStyle = (depth) => {
    return {
      transform: `translate(${mousePosition.x * depth * -30}px, ${mousePosition.y * depth * -30}px)`
    };
  };

  // Investment icons with animations - reduced number and adjusted positions
  const investmentIcons = [
    { icon: <FaHome />, top: '15%', left: '40%', animation: 'floatAnimation 8s ease-in-out infinite', delay: '0s' },
    { icon: <FaBuilding />, top: '75%', left: '65%', animation: 'floatAnimation 7s ease-in-out infinite', delay: '0.5s' },
    { icon: <FaChartLine />, top: '70%', left: '35%', animation: 'floatAnimation 9s ease-in-out infinite', delay: '1s' },
    { icon: <FaPercentage />, top: '20%', left: '70%', animation: 'floatAnimation 10s ease-in-out infinite', delay: '2s' }
  ];

  return (
    <div className="hero-section bg-animated">
      {/* Animated particles background - reduced number */}
      <div className="particles-container">
        {Array.from({ length: 12 }).map((_, index) => (
          <div 
            key={index} 
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Floating investment icons - reduced and repositioned */}
      {investmentIcons.map((item, index) => (
        <div 
          key={index}
          className={`floating-icon ${isVisible ? 'visible' : ''}`}
          style={{
            top: item.top,
            left: item.left,
            animation: item.animation,
            animationDelay: item.delay,
            ...getParallaxStyle(Math.random() * 0.5 + 0.5)
          }}
        >
          {item.icon}
        </div>
      ))}
      
      {/* Animated graph lines - simplified */}
      <div className="graph-container" style={getParallaxStyle(0.2)}>
        <div className="graph-line line1"></div>
        <div className="graph-line line3"></div>
        <div className="graph-dot dot1"></div>
        <div className="graph-dot dot3"></div>
      </div>
      
      {/* New animation: Couple researching data before buying property (LEFT SIDE) - adjusted timing */}
      <div className={`research-animation ${isVisible ? 'visible' : ''}`} style={getParallaxStyle(0.3)}>
        <div className="research-container">
          <div className="researcher-icon">
            <FaUsers size={40} />
          </div>
          <div className="data-icon">
            <FaDatabase size={30} />
          </div>
          <div className="chart-icon">
            <FaChartBar size={35} />
          </div>
          <div className="lightbulb-icon">
            <FaLightbulb size={25} />
          </div>
        </div>
      </div>
      
      {/* Animation: Couple buying property with money rolling (RIGHT SIDE) - adjusted timing */}
      <div className={`property-purchase-animation ${isVisible ? 'visible' : ''}`} style={getParallaxStyle(0.3)}>
        <div className="couple-container">
          <div className="house-icon">
            <FaHome size={60} />
          </div>
          <div className="couple-icon">
            <FaUsers size={50} />
          </div>
          <div className="money-icon money-1">
            <FaMoneyBillWave size={30} />
          </div>
          <div className="money-icon money-2">
            <FaMoneyBillWave size={30} />
          </div>
          <div className="money-icon money-3">
            <FaMoneyBillWave size={30} />
          </div>
          <div className="key-icon">
            <FaKey size={25} />
          </div>
        </div>
      </div>
      
      <div className="hero-content">
        <h1 className={`animate-fade-in ${isVisible ? 'visible' : ''}`}>
          Discover High-Yield Suburbs
          <span className="highlight-text">
            <span className="text-animated">Investment Opportunities</span>
          </span>
        </h1>
        <p className={`animate-fade-in delay-200 ${isVisible ? 'visible' : ''}`}>
          Uncover investment opportunities across Australia
        </p>
        <button className={`cta-button btn-animated animate-fade-in delay-400 animate-ripple ${isVisible ? 'visible' : ''}`}>
          <span className="btn-shine"></span>
          Explore Opportunities
          <FaArrowRight className="animate-float" />
        </button>
      </div>
      
      {/* Investment metrics removed as requested */}
      
      <div className="hero-illustration animate-fade-in delay-300">
        <svg width="100%" height="100%" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Network of connected dots representing property network - simplified */}
          <circle cx="200" cy="200" r="5" fill="white" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="600" cy="220" r="5" fill="white" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" begin="0.5s" />
            <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" begin="1s" />
          </circle>
          <circle cx="1000" cy="180" r="5" fill="white" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" begin="0.1s" />
            <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" begin="2s" />
          </circle>
          
          <line x1="200" y1="200" x2="600" y2="220" stroke="white" strokeWidth="1" opacity="0.2">
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite" />
            <animate attributeName="stroke-width" values="1;2;1" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="600" y1="220" x2="1000" y2="180" stroke="white" strokeWidth="1" opacity="0.2">
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite" begin="1s" />
            <animate attributeName="stroke-width" values="1;2;1" dur="3s" repeatCount="indefinite" begin="1s" />
          </line>
          
          {/* Animated investment graph - simplified */}
          <path d="M200,500 Q300,450 400,480 T600,430 T800,450 T1000,400" stroke="#0052FF" strokeWidth="3" fill="none" opacity="0.6">
            <animate attributeName="d" values="M200,500 Q300,450 400,480 T600,430 T800,450 T1000,400;M200,500 Q300,470 400,460 T600,410 T800,430 T1000,380;M200,500 Q300,450 400,480 T600,430 T800,450 T1000,400" dur="10s" repeatCount="indefinite" />
          </path>
          
          {/* Building silhouettes - reduced number */}
          <rect x="300" y="500" width="50" height="100" fill="white" opacity="0.15">
            <animate attributeName="height" values="0;100" dur="1.5s" fill="freeze" />
            <animate attributeName="y" values="600;500" dur="1.5s" fill="freeze" />
          </rect>
          <rect x="510" y="480" width="45" height="120" fill="white" opacity="0.13">
            <animate attributeName="height" values="0;120" dur="1.7s" fill="freeze" begin="0.2s" />
            <animate attributeName="y" values="600;480" dur="1.7s" fill="freeze" begin="0.2s" />
          </rect>
          <rect x="650" y="490" width="70" height="110" fill="white" opacity="0.14">
            <animate attributeName="height" values="0;110" dur="1.6s" fill="freeze" begin="0.1s" />
            <animate attributeName="y" values="600;490" dur="1.6s" fill="freeze" begin="0.1s" />
          </rect>
          <rect x="810" y="500" width="60" height="100" fill="white" opacity="0.12">
            <animate attributeName="height" values="0;100" dur="1.5s" fill="freeze" begin="0.3s" />
            <animate attributeName="y" values="600;500" dur="1.5s" fill="freeze" begin="0.3s" />
          </rect>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
