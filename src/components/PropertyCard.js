import React, { useState } from 'react';
import { FaMapMarkerAlt, FaBed, FaBath, FaCar, FaRulerCombined, FaArrowRight } from 'react-icons/fa';
import './CardStyles.css';

const PropertyCard = ({ property, onClick }) => {
  const { 
    id, 
    title, 
    address, 
    suburb, 
    state, 
    postcode, 
    price, 
    beds, 
    baths, 
    parking, 
    area, 
    image, 
    rentalYield, 
    capitalGrowth, 
    weeklyCashflow, 
    agent, 
    listingDate 
  } = property;

  const [imgSrc, setImgSrc] = useState(image);
  const [imgError, setImgError] = useState(false);

  // Handle image loading errors
  const handleImageError = () => {
    if (!imgError) {
      // Set a fallback image if the original fails to load
      setImgSrc('/images/property-fallback.jpg');
      setImgError(true);
    }
  };

  // Format price with commas
  const formatPrice = (price) => {
    return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
  };

  // Format address
  const formatAddress = () => {
    const parts = [];
    if (address) parts.push(address);
    if (suburb) parts.push(suburb);
    if (state) parts.push(state);
    if (postcode) parts.push(postcode);
    return parts.join(', ');
  };

  // Extract agent name from agent object
  const getAgentName = () => {
    return agent && typeof agent === 'object' && agent.name ? agent.name : 'Agent information unavailable';
  };

  return (
    <div className="property-card">
      <div className="property-image">
        <div className="property-price">${formatPrice(price)}</div>
        <img 
          src={imgSrc} 
          alt={title} 
          onError={handleImageError}
        />
      </div>
      <div className="property-content">
        <h3 className="property-title">{title}</h3>
        <div className="property-address">
          <FaMapMarkerAlt className="address-icon" />
          {formatAddress()}
        </div>
        
        <div className="property-specs">
          <div className="spec-item">
            <FaBed className="spec-icon" />
            <div className="spec-value">{beds}</div>
            <div className="spec-label">Beds</div>
          </div>
          <div className="spec-item">
            <FaBath className="spec-icon" />
            <div className="spec-value">{baths}</div>
            <div className="spec-label">Baths</div>
          </div>
          <div className="spec-item">
            <FaCar className="spec-icon" />
            <div className="spec-value">{parking}</div>
            <div className="spec-label">Parking</div>
          </div>
          <div className="spec-item">
            <FaRulerCombined className="spec-icon" />
            <div className="spec-value">{area}m²</div>
            <div className="spec-label">Area</div>
          </div>
        </div>
        
        <div className="property-metrics">
          <div className="metric-item">
            <div className="metric-value">{rentalYield}%</div>
            <div className="metric-label">Rental Yield</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">{capitalGrowth}%</div>
            <div className="metric-label">Capital Growth</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">${weeklyCashflow}</div>
            <div className="metric-label">Weekly Cashflow</div>
          </div>
        </div>
        
        <div className="agent-section">
          <div className="agent-name">{getAgentName()}</div>
          <div className="listing-date">Listed {listingDate}</div>
        </div>
        
        <button className="view-details-btn" onClick={() => onClick(id)}>
          View Details <FaArrowRight style={{ marginLeft: '8px' }} />
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
