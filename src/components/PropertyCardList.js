import React, { useState, useRef, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import PropertyCard from './PropertyCard';
import './CardStyles.css';

const PropertyCardList = ({ properties, onCardClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 4;
  const containerRef = useRef(null);

  const handleNext = () => {
    if (currentIndex + cardsPerView < properties.length) {
      setCurrentIndex(currentIndex + cardsPerView);
    }
  };

  const handlePrev = () => {
    if (currentIndex - cardsPerView >= 0) {
      setCurrentIndex(currentIndex - cardsPerView);
    }
  };

  const visibleProperties = properties.slice(currentIndex, currentIndex + cardsPerView);

  return (
    <div className="card-container" ref={containerRef}>
      {currentIndex > 0 && (
        <div className="scroll-arrow left" onClick={handlePrev}>
          <FaArrowLeft className="scroll-arrow-icon" />
        </div>
      )}
      
      <div className="cards-wrapper" style={{ display: 'grid', gridTemplateColumns: `repeat(${cardsPerView}, 1fr)`, gap: '20px' }}>
        {visibleProperties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            onClick={onCardClick} 
          />
        ))}
      </div>
      
      {currentIndex + cardsPerView < properties.length && (
        <div className="scroll-arrow right" onClick={handleNext}>
          <FaArrowRight className="scroll-arrow-icon" />
        </div>
      )}
    </div>
  );
};

export default PropertyCardList;
