import React, { useState, useEffect } from 'react';
import PropertyCardList from '../components/PropertyCardList';
import SuburbCardList from '../components/SuburbCardList';
import propertyData from '../data/propertyData';
import suburbData from '../data/suburbData';
import './HomePage.css';

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [highPotentialSuburbs, setHighPotentialSuburbs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState(300000);
  const [rentalYield, setRentalYield] = useState('any');

  useEffect(() => {
    // Filter properties based on user selections
    let filteredProperties = [...propertyData];
    
    // Apply investment strategy filter
    if (activeFilter === 'cashflow') {
      filteredProperties = filteredProperties.filter(property => 
        property.investment && property.investment.weeklyCashflow > 0
      );
    } else if (activeFilter === 'growth') {
      filteredProperties = filteredProperties.filter(property => 
        property.investment && property.investment.capitalGrowth > 6
      );
    } else if (activeFilter === 'balanced') {
      filteredProperties = filteredProperties.filter(property => 
        property.investment && 
        property.investment.rentalYield > 3 && 
        property.investment.capitalGrowth > 5
      );
    }
    
    // Apply property type filter
    if (propertyType !== 'all') {
      if (propertyType === 'house') {
        filteredProperties = filteredProperties.filter(property => 
          property.title.toLowerCase().includes('home') || 
          property.title.toLowerCase().includes('house')
        );
      } else if (propertyType === 'apartment') {
        filteredProperties = filteredProperties.filter(property => 
          property.title.toLowerCase().includes('apartment') || 
          property.title.toLowerCase().includes('unit')
        );
      } else if (propertyType === 'townhouse') {
        filteredProperties = filteredProperties.filter(property => 
          property.title.toLowerCase().includes('townhouse')
        );
      }
    }
    
    // Apply price filter
    filteredProperties = filteredProperties.filter(property => 
      property.price <= priceRange
    );
    
    // Apply rental yield filter
    if (rentalYield !== 'any') {
      if (rentalYield === 'low') {
        filteredProperties = filteredProperties.filter(property => 
          property.investment && property.investment.rentalYield < 3
        );
      } else if (rentalYield === 'high') {
        filteredProperties = filteredProperties.filter(property => 
          property.investment && property.investment.rentalYield >= 3
        );
      }
    }
    
    setFeaturedProperties(filteredProperties);
    
    // Get high potential suburbs
    const topSuburbs = suburbData
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
    
    setHighPotentialSuburbs(topSuburbs);
  }, [activeFilter, propertyType, priceRange, rentalYield]);

  const handlePropertyClick = (propertyId) => {
    console.log(`Property ${propertyId} clicked`);
    // Navigate to property details page
  };

  const handleSuburbClick = (suburbId) => {
    console.log(`Suburb ${suburbId} clicked`);
    // Navigate to suburb profile page
  };

  const handleExploreClick = () => {
    const opportunitiesSection = document.getElementById('opportunities');
    if (opportunitiesSection) {
      opportunitiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyType(type);
  };

  const handlePriceRangeChange = (event) => {
    setPriceRange(parseInt(event.target.value));
  };

  const handleRentalYieldChange = (yield_) => {
    setRentalYield(yield_);
  };

  const handleReset = () => {
    setActiveFilter('all');
    setPropertyType('all');
    setPriceRange(300000);
    setRentalYield('any');
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Discover High-Yield Suburbs</h1>
          <p className="subtitle">Investment Opportunities</p>
          <p className="description">Uncover investment opportunities across Australia</p>
          <button className="explore-btn" onClick={handleExploreClick}>
            Explore Opportunities
          </button>
        </div>
      </div>

      <div className="filter-section" id="opportunities">
        <div className="filter-container">
          <div className="filter-group">
            <h3 className="filter-title">
              <i className="filter-icon strategy-icon"></i>
              Investment Strategy
            </h3>
            <div className="filter-options">
              <button 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'cashflow' ? 'active' : ''}`}
                onClick={() => handleFilterChange('cashflow')}
              >
                Cashflow
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'growth' ? 'active' : ''}`}
                onClick={() => handleFilterChange('growth')}
              >
                Growth
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'balanced' ? 'active' : ''}`}
                onClick={() => handleFilterChange('balanced')}
              >
                Balanced
              </button>
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">
              <i className="filter-icon property-icon"></i>
              Property Type
            </h3>
            <div className="filter-options">
              <button 
                className={`filter-btn ${propertyType === 'all' ? 'active' : ''}`}
                onClick={() => handlePropertyTypeChange('all')}
              >
                House
              </button>
              <button 
                className={`filter-btn ${propertyType === 'apartment' ? 'active' : ''}`}
                onClick={() => handlePropertyTypeChange('apartment')}
              >
                Apartment
              </button>
              <button 
                className={`filter-btn ${propertyType === 'townhouse' ? 'active' : ''}`}
                onClick={() => handlePropertyTypeChange('townhouse')}
              >
                Townhouse
              </button>
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">
              <i className="filter-icon price-icon"></i>
              Price Range
            </h3>
            <div className="price-slider">
              <input 
                type="range" 
                min="100000" 
                max="1000000" 
                step="50000" 
                value={priceRange} 
                onChange={handlePriceRangeChange} 
              />
              <div className="price-labels">
                <span>$100K</span>
                <span className="price-value">${(priceRange/1000).toFixed(0)}K</span>
                <span>$1M</span>
              </div>
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">
              <i className="filter-icon yield-icon"></i>
              Rental Yield %
            </h3>
            <div className="filter-options">
              <button 
                className={`filter-btn ${rentalYield === 'any' ? 'active' : ''}`}
                onClick={() => handleRentalYieldChange('any')}
              >
                Any
              </button>
              <button 
                className={`filter-btn ${rentalYield === 'low' ? 'active' : ''}`}
                onClick={() => handleRentalYieldChange('low')}
              >
                Low
              </button>
              <button 
                className={`filter-btn ${rentalYield === 'high' ? 'active' : ''}`}
                onClick={() => handleRentalYieldChange('high')}
              >
                High
              </button>
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button className="reset-btn" onClick={handleReset}>
            Reset
          </button>
          <button className="apply-btn" onClick={() => console.log('Filters applied')}>
            Apply Filters
          </button>
        </div>
      </div>

      <div className="content-section">
        <h2 className="section-title">
          <i className="section-icon star-icon"></i>
          Top Investment Opportunities
        </h2>
        
        <div className="suburbs-section">
          <SuburbCardList 
            suburbs={highPotentialSuburbs} 
            onCardClick={handleSuburbClick} 
          />
        </div>
        
        <div className="properties-section">
          <PropertyCardList 
            properties={featuredProperties} 
            onCardClick={handlePropertyClick} 
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
