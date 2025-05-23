import React, { useState, useEffect } from 'react';
import './FilterSection.css';
import { 
  FaDollarSign, 
  FaHome, 
  FaBuilding, 
  FaCity, 
  FaChartLine, 
  FaMoneyBillWave, 
  FaBalanceScale, 
  FaPercentage, 
  FaUndo, 
  FaFilter,
  FaBed,
  FaBath,
  FaCar,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const FilterSection = () => {
  // Basic filters (existing)
  const [activeStrategy, setActiveStrategy] = useState('all');
  const [priceRange, setPriceRange] = useState([100000, 1000000]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [rentalYield, setRentalYield] = useState('any');
  
  // Advanced filters (new)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [parking, setParking] = useState('any');
  const [minLandSize, setMinLandSize] = useState(0);
  const [maxLandSize, setMaxLandSize] = useState(2000);
  const [suburb, setSuburb] = useState('');
  const [suggestedSuburbs, setSuggestedSuburbs] = useState([]);
  const [selectedSuburbs, setSelectedSuburbs] = useState([]);
  const [builtAfter, setBuiltAfter] = useState(1900);
  const [sortBy, setSortBy] = useState('recommended');
  const [capitalGrowth, setCapitalGrowth] = useState([0, 15]);
  const [cashflow, setCashflow] = useState('any');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Dummy suburb data for suggestions
  const allSuburbs = [
    'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 
    'Gold Coast', 'Newcastle', 'Canberra', 'Wollongong', 'Hobart',
    'Geelong', 'Townsville', 'Cairns', 'Toowoomba', 'Darwin',
    'Ballarat', 'Bendigo', 'Launceston', 'Mackay', 'Rockhampton',
    'Bunbury', 'Bundaberg', 'Hervey Bay', 'Wagga Wagga', 'Coffs Harbour',
    'Gladstone', 'Mildura', 'Shepparton', 'Geraldton', 'Port Macquarie'
  ];
  
  // Filter suburbs based on search input
  useEffect(() => {
    if (suburb.length > 1) {
      const filtered = allSuburbs.filter(s => 
        s.toLowerCase().includes(suburb.toLowerCase()) && 
        !selectedSuburbs.includes(s)
      ).slice(0, 5);
      setSuggestedSuburbs(filtered);
    } else {
      setSuggestedSuburbs([]);
    }
  }, [suburb, selectedSuburbs]);

  const handleStrategyClick = (strategy) => {
    setActiveStrategy(strategy);
  };

  const handlePropertyTypeClick = (type) => {
    if (selectedPropertyTypes.includes(type)) {
      setSelectedPropertyTypes(selectedPropertyTypes.filter(t => t !== type));
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, type]);
    }
  };
  
  const handlePriceRangeChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = value;
    
    // Ensure min <= max
    if (index === 0 && value > newRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < newRange[0]) {
      newRange[0] = value;
    }
    
    setPriceRange(newRange);
  };
  
  const handleCapitalGrowthChange = (index, value) => {
    const newRange = [...capitalGrowth];
    newRange[index] = value;
    
    // Ensure min <= max
    if (index === 0 && value > newRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < newRange[0]) {
      newRange[0] = value;
    }
    
    setCapitalGrowth(newRange);
  };
  
  const handleLandSizeChange = (index, value) => {
    if (index === 0) {
      setMinLandSize(value);
      if (value > maxLandSize) {
        setMaxLandSize(value);
      }
    } else {
      setMaxLandSize(value);
      if (value < minLandSize) {
        setMinLandSize(value);
      }
    }
  };
  
  const handleAddSuburb = (s) => {
    setSelectedSuburbs([...selectedSuburbs, s]);
    setSuburb('');
    setSuggestedSuburbs([]);
  };
  
  const handleRemoveSuburb = (s) => {
    setSelectedSuburbs(selectedSuburbs.filter(suburb => suburb !== s));
  };

  const handleReset = () => {
    // Reset basic filters
    setActiveStrategy('all');
    setPriceRange([100000, 1000000]);
    setSelectedPropertyTypes([]);
    setRentalYield('any');
    
    // Reset advanced filters
    setBedrooms('any');
    setBathrooms('any');
    setParking('any');
    setMinLandSize(0);
    setMaxLandSize(2000);
    setSuburb('');
    setSelectedSuburbs([]);
    setBuiltAfter(1900);
    setSortBy('recommended');
    setCapitalGrowth([0, 15]);
    setCashflow('any');
  };
  
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };
  
  const formatLandSize = (size) => {
    return `${size}m²`;
  };

  return (
    <div className="filter-section card-animated">
      <div className="filter-header">
        <FaFilter className="filter-title-icon" />
        <h2>Investment Strategy</h2>
        <button 
          className="advanced-toggle"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? (
            <>
              <span>Basic Filters</span>
              <FaChevronUp className="toggle-icon" />
            </>
          ) : (
            <>
              <span>Advanced Filters</span>
              <FaChevronDown className="toggle-icon" />
            </>
          )}
        </button>
      </div>
      
      <div className="filter-grid">
        {/* Left column */}
        <div className="filter-column">
          <div className="filter-group">
            <div className="filter-label">
              <FaChartLine className="filter-icon" />
              <span>Strategy</span>
            </div>
            <div className="compact-options">
              <button 
                className={`compact-option ${activeStrategy === 'all' ? 'active' : ''}`}
                onClick={() => handleStrategyClick('all')}
              >
                <FaFilter className="option-icon" />
                <span>All</span>
              </button>
              <button 
                className={`compact-option ${activeStrategy === 'cashflow' ? 'active' : ''}`}
                onClick={() => handleStrategyClick('cashflow')}
              >
                <FaMoneyBillWave className="option-icon" />
                <span>Cashflow</span>
              </button>
              <button 
                className={`compact-option ${activeStrategy === 'growth' ? 'active' : ''}`}
                onClick={() => handleStrategyClick('growth')}
              >
                <FaChartLine className="option-icon" />
                <span>Growth</span>
              </button>
              <button 
                className={`compact-option ${activeStrategy === 'balanced' ? 'active' : ''}`}
                onClick={() => handleStrategyClick('balanced')}
              >
                <FaBalanceScale className="option-icon" />
                <span>Balanced</span>
              </button>
            </div>
          </div>
          
          <div className="filter-group">
            <div className="filter-label">
              <FaBuilding className="filter-icon" />
              <span>Property Type</span>
            </div>
            <div className="compact-options">
              <button 
                className={`compact-option ${selectedPropertyTypes.includes('house') ? 'active' : ''}`}
                onClick={() => handlePropertyTypeClick('house')}
              >
                <FaHome className="option-icon" />
                <span>House</span>
              </button>
              <button 
                className={`compact-option ${selectedPropertyTypes.includes('apartment') ? 'active' : ''}`}
                onClick={() => handlePropertyTypeClick('apartment')}
              >
                <FaBuilding className="option-icon" />
                <span>Apartment</span>
              </button>
              <button 
                className={`compact-option ${selectedPropertyTypes.includes('townhouse') ? 'active' : ''}`}
                onClick={() => handlePropertyTypeClick('townhouse')}
              >
                <FaCity className="option-icon" />
                <span>Townhouse</span>
              </button>
            </div>
          </div>
          
          {showAdvancedFilters && (
            <>
              <div className="filter-group">
                <div className="filter-label">
                  <FaBed className="filter-icon" />
                  <span>Bedrooms</span>
                </div>
                <div className="compact-options">
                  <button 
                    className={`compact-option ${bedrooms === 'any' ? 'active' : ''}`}
                    onClick={() => setBedrooms('any')}
                  >
                    <span>Any</span>
                  </button>
                  {[1, 2, 3, 4, 5].map(num => (
                    <button 
                      key={`bed-${num}`}
                      className={`compact-option ${bedrooms === num ? 'active' : ''}`}
                      onClick={() => setBedrooms(num)}
                    >
                      <span>{num}+</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="filter-group">
                <div className="filter-label">
                  <FaBath className="filter-icon" />
                  <span>Bathrooms</span>
                </div>
                <div className="compact-options">
                  <button 
                    className={`compact-option ${bathrooms === 'any' ? 'active' : ''}`}
                    onClick={() => setBathrooms('any')}
                  >
                    <span>Any</span>
                  </button>
                  {[1, 2, 3, 4].map(num => (
                    <button 
                      key={`bath-${num}`}
                      className={`compact-option ${bathrooms === num ? 'active' : ''}`}
                      onClick={() => setBathrooms(num)}
                    >
                      <span>{num}+</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="filter-group">
                <div className="filter-label">
                  <FaCar className="filter-icon" />
                  <span>Parking</span>
                </div>
                <div className="compact-options">
                  <button 
                    className={`compact-option ${parking === 'any' ? 'active' : ''}`}
                    onClick={() => setParking('any')}
                  >
                    <span>Any</span>
                  </button>
                  {[1, 2, 3].map(num => (
                    <button 
                      key={`park-${num}`}
                      className={`compact-option ${parking === num ? 'active' : ''}`}
                      onClick={() => setParking(num)}
                    >
                      <span>{num}+</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="filter-group">
                <div className="filter-label">
                  <FaRulerCombined className="filter-icon" />
                  <span>Land Size</span>
                </div>
                <div className="dual-slider-container">
                  <div className="dual-slider">
                    <input 
                      type="range" 
                      min="0" 
                      max="2000" 
                      step="50" 
                      value={minLandSize} 
                      onChange={(e) => handleLandSizeChange(0, parseInt(e.target.value))}
                      className="range-slider min-slider"
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="2000" 
                      step="50" 
                      value={maxLandSize} 
                      onChange={(e) => handleLandSizeChange(1, parseInt(e.target.value))}
                      className="range-slider max-slider"
                    />
                    <div className="slider-track"></div>
                  </div>
                  <div className="range-labels">
                    <span>{formatLandSize(minLandSize)}</span>
                    <span>{formatLandSize(maxLandSize)}</span>
                  </div>
                </div>
              </div>
              
              <div className="filter-group">
                <div className="filter-label">
                  <FaCalendarAlt className="filter-icon" />
                  <span>Built After</span>
                </div>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="1900" 
                    max="2025" 
                    step="5" 
                    value={builtAfter} 
                    onChange={(e) => setBuiltAfter(parseInt(e.target.value))}
                    className="range-slider"
                  />
                  <div className="range-labels">
                    <span>1900</span>
                    <span className="current-value">{builtAfter}</span>
                    <span>2025</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Right column */}
        <div className="filter-column">
          <div className="filter-group">
            <div className="filter-label">
              <FaDollarSign className="filter-icon" />
              <span>Price Range</span>
            </div>
            <div className="dual-slider-container">
              <div className="dual-slider">
                <input 
                  type="range" 
                  min="100000" 
                  max="2000000" 
                  step="50000" 
                  value={priceRange[0]} 
                  onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value))}
                  className="range-slider min-slider"
                />
                <input 
                  type="range" 
                  min="100000" 
                  max="2000000" 
                  step="50000" 
                  value={priceRange[1]} 
                  onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value))}
                  className="range-slider max-slider"
                />
                <div className="slider-track"></div>
              </div>
              <div className="range-labels">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>
          
          <div className="filter-group">
            <div className="filter-label">
              <FaPercentage className="filter-icon" />
              <span>Rental Yield %</span>
            </div>
            <div className="compact-options">
              <button 
                className={`compact-option ${rentalYield === 'any' ? 'active' : ''}`}
                onClick={() => setRentalYield('any')}
              >
                <span>Any</span>
              </button>
              <button 
                className={`compact-option ${rentalYield === 'low' ? 'active' : ''}`}
                onClick={() => setRentalYield('low')}
              >
                <span>Low</span>
              </button>
              <button 
                className={`compact-option ${rentalYield === 'medium' ? 'active' : ''}`}
                onClick={() => setRentalYield('medium')}
              >
                <span>Medium</span>
              </button>
              <button 
                className={`compact-option ${rentalYield === 'high' ? 'active' : ''}`}
                onClick={() => setRentalYield('high')}
              >
                <span>High</span>
              </button>
            </div>
          </div>
          
          {showAdvancedFilters && (
            <>
              <div className="filter-group">
                <div className="filter-label">
                  <FaChartLine className="filter-icon" />
                  <span>Capital Growth %</span>
                </div>
                <div className="dual-slider-container">
                  <div className="dual-slider">
                    <input 
                      type="range" 
                      min="0" 
                      max="15" 
                      step="0.5" 
                      value={capitalGrowth[0]} 
                      onChange={(e) => handleCapitalGrowthChange(0, parseFloat(e.target.value))}
                      className="range-slider min-slider"
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="15" 
                      step="0.5" 
                      value={capitalGrowth[1]} 
                      onChange={(e) => handleCapitalGrowthChange(1, parseFloat(e.target.value))}
                      className="range-slider max-slider"
                    />
                    <div className="slider-track"></div>
                  </div>
                  <div className="range-labels">
                    <span>{capitalGrowth[0]}%</span>
                    <span>{capitalGrowth[1]}%</span>
                  </div>
                </div>
              </div>
              
              <div className="filter-group">
                <div className="filter-label">
                  <FaMoneyBillWave className="filter-icon" />
                  <span>Weekly Cashflow</span>
                </div>
                <div className="compact-options">
                  <button 
                    className={`compact-option ${cashflow === 'any' ? 'active' : ''}`}
                    onClick={() => setCashflow('any')}
                  >
                    <span>Any</span>
                  </button>
                  <button 
                    className={`compact-option ${cashflow === 'positive' ? 'active' : ''}`}
                    onClick={() => setCashflow('positive')}
                  >
                    <span>Positive</span>
                  </button>
                  <button 
                    className={`compact-option ${cashflow === 'neutral' ? 'active' : ''}`}
                    onClick={() => setCashflow('neutral')}
                  >
                    <span>Neutral</span>
                  </button>
                  <button 
                    className={`compact-option ${cashflow === 'negative' ? 'active' : ''}`}
                    onClick={() => setCashflow('negative')}
                  >
                    <span>Negative</span>
                  </button>
                </div>
              </div>
              
              <div className="filter-group">
                <div className="filter-label">
                  <FaMapMarkerAlt className="filter-icon" />
                  <span>Suburbs</span>
                </div>
                <div className="suburb-search-container">
                  <div className="suburb-search">
                    <FaSearch className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search suburbs..." 
                      value={suburb}
                      onChange={(e) => setSuburb(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    />
                  </div>
                  
                  {isSearchFocused && suggestedSuburbs.length > 0 && (
                    <div className="suburb-suggestions">
                      {suggestedSuburbs.map(s => (
                        <div 
                          key={s} 
                          className="suburb-suggestion"
                          onClick={() => handleAddSuburb(s)}
                        >
                          <FaMapMarkerAlt className="suggestion-icon" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedSuburbs.length > 0 && (
                    <div className="selected-suburbs">
                      {selectedSuburbs.map(s => (
                        <div key={s} className="selected-suburb">
                          <span>{s}</span>
                          <FaTimes 
                            className="remove-suburb" 
                            onClick={() => handleRemoveSuburb(s)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="filter-group">
                <div className="filter-label">
                  <FaSortAmountDown className="filter-icon" />
                  <span>Sort By</span>
                </div>
                <div className="sort-options">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price_low">Price (Low to High)</option>
                    <option value="price_high">Price (High to Low)</option>
                    <option value="yield_high">Rental Yield (High to Low)</option>
                    <option value="growth_high">Capital Growth (High to Low)</option>
                    <option value="cashflow_high">Cashflow (High to Low)</option>
                    <option value="newest">Newest Listed</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="filter-actions">
        <button className="reset-btn" onClick={handleReset}>
          <FaUndo className="button-icon" />
          <span>Reset</span>
        </button>
        
        <button className="apply-btn">
          <span>Apply Filters</span>
          <FaFilter className="button-icon" />
        </button>
      </div>
      
      {showAdvancedFilters && (
        <div className="active-filters">
          <div className="active-filters-header">
            <span>Active Filters:</span>
          </div>
          <div className="active-filters-list">
            {activeStrategy !== 'all' && (
              <div className="active-filter">
                <span>Strategy: {activeStrategy}</span>
                <FaTimes 
                  className="remove-filter" 
                  onClick={() => setActiveStrategy('all')}
                />
              </div>
            )}
            
            {selectedPropertyTypes.length > 0 && (
              <div className="active-filter">
                <span>Property Types: {selectedPropertyTypes.join(', ')}</span>
                <FaTimes 
                  className="remove-filter" 
                  onClick={() => setSelectedPropertyTypes([])}
                />
              </div>
            )}
            
            {(priceRange[0] > 100000 || priceRange[1] < 2000000) && (
              <div className="active-filter">
                <span>Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
                <FaTimes 
                  className="remove-filter" 
                  onClick={() => setPriceRange([100000, 2000000])}
                />
              </div>
            )}
            
            {rentalYield !== 'any' && (
              <div className="active-filter">
                <span>Rental Yield: {rentalYield}</span>
                <FaTimes 
                  className="remove-filter" 
                  onClick={() => setRentalYield('any')}
                />
              </div>
            )}
            
            {bedrooms !== 'any' && (
              <div className="active-filter">
                <span>Bedrooms: {bedrooms}+</span>
                <FaTimes 
                  className="remove-filter" 
                  onClick={() => setBedrooms('any')}
                />
              </div>
            )}
            
            {bathrooms !== 'any' && (
              <div className="active-filter">
                <span>Bathrooms: {bathrooms}+</span>
                <FaTimes 
                  className="remove-filter" 
                  onClick={() => setBathrooms('any')}
                />
              </div>
            )}
            
            {parking !== 'any' && (
              <div className="active-filter">
                <span>Parking: {parking}+</span>
                <FaTimes 
                  className="remove-filter" 
                  onClick={() => setParking('any')}
                />
              </div>
            )}
            
            {(minLandSize > 0 || maxLandSize < 2000) && (
              <div className="active-filter">
                <span>Land Size: {formatLandSize(minLandSize)} - {formatLandSize(maxLandSize)}</span>
                <FaTimes 
                  className="remove-filter" 
                  onClick={() => { setMinLandSize(0); setMaxLandSize(2000); }}
                />
              </div>
            )}
            
            {builtAfter > 1900 && (
              <div className="active-filter">
                <span>Built After: {builtAfter}</span>
                <FaTimes 
                  className="remove-filter" 
                  onClick={() => setBuiltAfter(1900)}
                />
              </div>
            )}
            
            {(capitalGrowth[0] > 0 || capitalGrowth[1] < 15) && (
              <div className="active-filter">
                <span>Capital Growth: {capitalGrowth[0]}% - {capitalGrowth[1]}%</span>
                <FaTimes 
                  className="remove-filter" 
                  onClick={() => setCapitalGrowth([0, 15])}
                />
              </div>
            )}
            
            {cashflow !== 'any' && (
              <div className="active-filter">
                <span>Cashflow: {cashflow}</span>
                <FaTimes 
                  className="remove-filter" 
                  onClick={() => setCashflow('any')}
                />
              </div>
            )}
            
            {selectedSuburbs.length > 0 && (
              <div className="active-filter">
                <span>Suburbs: {selectedSuburbs.join(', ')}</span>
                <FaTimes 
                  className="remove-filter" 
                  onClick={() => setSelectedSuburbs([])}
                />
              </div>
            )}
            
            {sortBy !== 'recommended' && (
              <div className="active-filter">
                <span>Sort By: {sortBy.replace('_', ' ')}</span>
                <FaTimes 
                  className="remove-filter" 
                  onClick={() => setSortBy('recommended')}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
