import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaHome, FaBuilding, FaPercentage, FaCheck, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import './CardStyles.css';

const SuburbCard = ({ suburb, onClick }) => {
  const { 
    id, 
    name, 
    postcode, 
    region, 
    rating, 
    medianPrice, 
    unitPrice, 
    rentalYield, 
    highlights,
    image
  } = suburb;

  const [imgSrc, setImgSrc] = useState(image);
  const [imgError, setImgError] = useState(false);

  // Handle image loading errors
  const handleImageError = () => {
    if (!imgError) {
      // Set a fallback image if the original fails to load
      setImgSrc('/images/sydney-skyline.jpeg');
      setImgError(true);
    }
  };

  // Format price with commas
  const formatPrice = (price) => {
    return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
  };

  return (
    <div className="suburb-card">
      <div className="suburb-image">
        <div className="rating-badge">{rating}</div>
        <img 
          src={imgSrc} 
          alt={name} 
          onError={handleImageError}
        />
      </div>
      <div className="suburb-content">
        <h3 className="suburb-title">{name}</h3>
        <div className="suburb-location">
          <FaMapMarkerAlt className="address-icon" />
          {postcode}, {region}
        </div>
        
        <div className="price-section">
          <div className="price-column">
            <FaHome className="price-icon" />
            <div className="price-label">House Price</div>
            <div className="price-value">${formatPrice(medianPrice)}</div>
          </div>
          <div className="price-column">
            <FaBuilding className="price-icon" />
            <div className="price-label">Unit price</div>
            <div className="price-value">${formatPrice(unitPrice)}</div>
          </div>
        </div>
        
        <div className="yield-section">
          <div className="yield-row">
            <div className="yield-icon">
              <FaPercentage />
            </div>
            <div className="yield-label">Rental Yield</div>
            <div className="yield-value">
              {rentalYield}
              <div className="trend-indicator up"></div>
            </div>
          </div>
        </div>
        
        <div className="highlights">
          {highlights && highlights.map((highlight, index) => (
            <div className="highlight-item" key={index}>
              <div className="highlight-icon">
                <FaCheck className="check-icon" />
              </div>
              <div className="highlight-text">{highlight}</div>
            </div>
          ))}
        </div>
        
        <button className="view-profile-btn" onClick={() => onClick(id)}>
          View Suburb Profile <i className="fas fa-arrow-right" style={{marginLeft: '5px'}}></i>
        </button>
      </div>
    </div>
  );
};

export default SuburbCard;
