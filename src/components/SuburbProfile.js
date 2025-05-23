import React, { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Radar, Pie, Line, Bar } from 'react-chartjs-2';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './SuburbProfile.css';
import './PropertyCard.css'; // Import PropertyCard styles
import { FaInfoCircle, FaHome, FaMapMarkedAlt, FaBed, FaBath, FaCar, FaRulerCombined, 
         FaMapMarkerAlt, FaHeart, FaRegHeart, FaArrowLeft, FaTimes, FaArrowRight, 
         FaChartLine, FaChartBar, FaBoxes, FaUsers, FaSearch, FaPercentage, 
         FaCalendarAlt, FaBuilding, FaHandshake, FaArrowUp, FaArrowDown, FaExclamationTriangle } from 'react-icons/fa';
import PropertyDetails from './PropertyDetails';
import propertyData from '../data/propertyData';
import suburbData from '../data/suburbData';
import householdData from '../data/householdData';
import {
  irsadData,
  rentersToOwnersData,
  stockOnMarketData,
  inventoryLevelsData,
  buildingApprovalsData,
  daysOnMarketData,
  vacancyRateData,
  searchIndexData,
  auctionClearanceRateData
} from '../data/additionalMarketData';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SuburbProfile error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <FaExclamationTriangle className="error-icon" />
            <h2>Something went wrong</h2>
            <p>We're having trouble displaying this suburb profile.</p>
            <div className="error-actions">
              <button onClick={() => window.location.href = '/'}>
                Return to Home
              </button>
              <button onClick={() => this.setState({ hasError: false })}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Fallback UI for when suburb data is not found
const SuburbNotFound = ({ onClose }) => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };
  
  return (
    <div className="suburb-profile-container">
      <div className="suburb-profile-header">
        <button className="close-button" onClick={handleClose}>
          <FaTimes />
        </button>
        <h1>Suburb Not Found</h1>
      </div>
      
      <div className="suburb-not-found">
        <FaExclamationTriangle className="not-found-icon" />
        <h2>We couldn't find this suburb</h2>
        <p>The suburb you're looking for might not exist in our database or there might be an issue with the data.</p>
        
        <div className="not-found-actions">
          <button className="primary-button" onClick={handleClose}>
            Return to Home
          </button>
          
          <Link to="/" className="secondary-button">
            Browse All Suburbs
          </Link>
        </div>
        
        <div className="available-suburbs">
          <h3>Available Suburbs</h3>
          <div className="suburb-suggestions">
            {suburbData.slice(0, 4).map(suburb => (
              <Link 
                key={suburb.id} 
                to={`/suburb/${suburb.id}`} 
                className="suburb-suggestion"
              >
                {suburb.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading component
const LoadingState = () => (
  <div className="suburb-profile-container">
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <h2>Loading suburb data...</h2>
      <p>Please wait while we fetch the latest information.</p>
    </div>
  </div>
);

const SuburbProfile = ({ suburb: propSuburb, onClose }) => {
  const navigate = useNavigate();
  const { suburbId } = useParams();
  const [suburb, setSuburb] = useState(null);
  const [activeTab, setActiveTab] = useState('properties'); // Set properties as default active tab
  const [savedProperties, setSavedProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [error, setError] = useState(null);
  
  // Initialize suburb from either props or URL parameter
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      let suburbToUse;
      if (propSuburb) {
        suburbToUse = propSuburb;
      } else if (suburbId) {
        // Find suburb by ID from the imported data
        const parsedId = parseInt(suburbId);
        if (isNaN(parsedId)) {
          throw new Error(`Invalid suburb ID: ${suburbId}`);
        }
        
        // Check if suburbData is available
        if (!suburbData || !Array.isArray(suburbData) || suburbData.length === 0) {
          throw new Error("Suburb data is not available");
        }
        
        const foundSuburb = suburbData.find(s => s.id === parsedId);
        if (!foundSuburb) {
          throw new Error(`Suburb with ID ${parsedId} not found`);
        }
        
        suburbToUse = foundSuburb;
      }
      
      if (!suburbToUse) {
        throw new Error("No suburb data available");
      }
      
      setSuburb(suburbToUse);
    } catch (err) {
      console.error("Error loading suburb data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [propSuburb, suburbId]);
  
  const formatCurrency = useCallback((value) => {
    if (value === undefined || value === null) {
      return '$0';
    }
    return value.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })
      .replace(/\.00$/, '');
  }, []);

  const toggleSaveProperty = useCallback((propertyId) => {
    if (savedProperties.includes(propertyId)) {
      setSavedProperties(savedProperties.filter(id => id !== propertyId));
    } else {
      setSavedProperties([...savedProperties, propertyId]);
    }
  }, [savedProperties]);
  
  const handleViewDetails = useCallback((propertyId) => {
    const property = propertyData.find(p => p.id === propertyId);
    setSelectedProperty(property);
  }, []);
  
  const handleClosePropertyDetails = useCallback(() => {
    setSelectedProperty(null);
  }, []);
  
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      // Navigate back to the main page
      navigate('/');
    }
  }, [onClose, navigate]);

  // Add handler for tab navigation
  const handleTabClick = useCallback((tabName) => {
    setActiveTab(tabName);
  }, []);

  // Get properties for the current suburb with fallback
  const getPropertiesForSuburb = useCallback(() => {
    if (!suburb) return [];
    
    // Try exact match first
    let matchingProperties = propertyData.filter(property => property.suburb === suburb.name);
    
    // If no exact matches, try case-insensitive match
    if (matchingProperties.length === 0) {
      matchingProperties = propertyData.filter(property => 
        property.suburb && property.suburb.toLowerCase() === suburb.name.toLowerCase()
      );
    }
    
    // If still no matches, try address contains suburb name
    if (matchingProperties.length === 0) {
      matchingProperties = propertyData.filter(property => 
        property.address && property.address.includes(suburb.name)
      );
    }
    
    // If still no matches, show all properties as fallback
    if (matchingProperties.length === 0) {
      return propertyData.slice(0, 6); // Show first 6 properties as fallback
    }
    
    return matchingProperties;
  }, [suburb]);

  // If loading, show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // If error or no suburb data, show not found state
  if (error || !suburb) {
    return <SuburbNotFound onClose={handleClose} />;
  }

  // If selected property, show property details
  if (selectedProperty) {
    return (
      <PropertyDetails 
        property={selectedProperty} 
        onClose={handleClosePropertyDetails} 
        isSaved={savedProperties.includes(selectedProperty.id)}
        onToggleSave={() => toggleSaveProperty(selectedProperty.id)}
      />
    );
  }

  // Market Balance Analysis data with fallback values
  const marketBalanceData = {
    supply: {
      level: "LOW",
      description: "Limited new supply and low inventory"
    },
    demand: {
      level: "HIGH",
      description: "Strong buyer interest and rental demand"
    },
    verdict: {
      recommendation: "BUY",
      description: "Favorable conditions for investment"
    },
    insights: [
      "Low building approvals and inventory levels indicate limited future supply",
      "Strong search interest and low days on market show high buyer demand",
      "Low vacancy rates suggest strong rental demand and potential for rental growth",
      "High auction clearance rates indicate competitive buying environment",
      "Consistent price growth history suggests good capital growth potential"
    ]
  };

  // Main render for suburb profile
  return (
    <ErrorBoundary>
      <div className="suburb-profile-container">
        <div className="suburb-profile-header">
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
          
          <h1>{suburb.name || "Unknown Suburb"}</h1>
          <p>{suburb.postcode || "Unknown"}, {suburb.region || "Unknown Region"}, NSW</p>
          
          <div className="suburb-stats">
            <div className="stat-box">
              <h2>{formatCurrency(suburb.medianHousePrice || 0)} ↑</h2>
              <p>Median House Price</p>
            </div>
            
            <div className="stat-box">
              <h2>{suburb.rentalYield || 0}% →</h2>
              <p>Gross Rental Yield</p>
            </div>
            
            <div className="stat-box">
              <h2>{suburb.capitalGrowth || 5.8}%</h2>
              <p>5yr Capital Growth</p>
            </div>
            
            <div className="stat-box">
              <h2>{suburb.investmentScore || 8.5}/10</h2>
              <p>Investment Score</p>
            </div>
          </div>
        </div>

        <div className="suburb-tabs">
          <button 
            className={`tab ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => handleTabClick('properties')}
          >
            <FaHome /> Properties
          </button>
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabClick('overview')}
          >
            <FaInfoCircle /> Overview
          </button>
          <button 
            className={`tab ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => handleTabClick('map')}
          >
            <FaMapMarkedAlt /> Map
          </button>
        </div>

        <div className="suburb-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* Market Balance Analysis Section - Enhanced with subtle animations */}
              <div className="market-balance-container animate-fade-in">
                <h2>Investment Potential Assessment</h2>
                
                <div className="market-balance-analysis">
                  <h3 className="animate-slide-up">Market Balance Analysis</h3>
                  
                  <div className="market-balance-grid">
                    <div className="market-balance-column supply animate-scale-in" style={{animationDelay: '0.1s'}}>
                      <h4>Supply</h4>
                      <div className="market-balance-value">{marketBalanceData.supply.level}</div>
                      <div className="market-balance-indicator">
                        <FaArrowDown className="indicator-icon" />
                      </div>
                      <p>{marketBalanceData.supply.description}</p>
                    </div>
                    
                    <div className="market-balance-column demand animate-scale-in" style={{animationDelay: '0.3s'}}>
                      <h4>Demand</h4>
                      <div className="market-balance-value">{marketBalanceData.demand.level}</div>
                      <div className="market-balance-indicator">
                        <FaArrowUp className="indicator-icon" />
                      </div>
                      <p>{marketBalanceData.demand.description}</p>
                    </div>
                    
                    <div className="market-balance-column verdict animate-scale-in" style={{animationDelay: '0.5s'}}>
                      <h4>Verdict</h4>
                      <div className="market-balance-value verdict-pulse">{marketBalanceData.verdict.recommendation}</div>
                      <p>{marketBalanceData.verdict.description}</p>
                    </div>
                  </div>
                  
                  <div className="key-insights animate-slide-up" style={{animationDelay: '0.7s'}}>
                    <h4>Key Investment Insights</h4>
                    <ul>
                      {marketBalanceData.insights.map((insight, index) => (
                        <li key={index} className="insight-item" style={{animationDelay: `${0.8 + index * 0.1}s`}}>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Investment Potential Section */}
                <div className="investment-potential animate-fade-in" style={{animationDelay: '1s'}}>
                  <h3>Investment Potential</h3>
                  
                  <div className="chart-row">
                    <div className="chart-column">
                      <div className="chart-wrapper">
                        <h4>Investment Potential Radar</h4>
                        <div className="radar-chart-container">
                          <Radar 
                            data={{
                              labels: ['Capital Growth', 'Rental Yield', 'Affordability', 'Infrastructure', 'Amenities', 'Transport'],
                              datasets: [
                                {
                                  label: 'This Suburb',
                                  data: [suburb.investmentPotential?.capitalGrowth || 8, 
                                        suburb.investmentPotential?.rentalYield || 7, 
                                        suburb.investmentPotential?.affordability || 6, 
                                        suburb.investmentPotential?.infrastructure || 7, 
                                        suburb.investmentPotential?.amenities || 8, 
                                        suburb.investmentPotential?.transport || 6],
                                  backgroundColor: 'rgba(52, 152, 219, 0.2)',
                                  borderColor: 'rgba(52, 152, 219, 1)',
                                  borderWidth: 2,
                                },
                                {
                                  label: 'Regional Average',
                                  data: [6, 5, 5, 6, 5, 7],
                                  backgroundColor: 'rgba(231, 76, 60, 0.2)',
                                  borderColor: 'rgba(231, 76, 60, 1)',
                                  borderWidth: 2,
                                },
                              ],
                            }}
                            options={{
                              scales: {
                                r: {
                                  angleLines: { display: true },
                                  suggestedMin: 0,
                                  suggestedMax: 10,
                                },
                              },
                              plugins: { legend: { position: 'top' } },
                              maintainAspectRatio: true,
                              responsive: true,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="chart-column">
                      <div className="chart-wrapper">
                        <h4>Household Composition</h4>
                        <div className="pie-chart-container">
                          <Pie 
                            data={{
                              labels: householdData.map(item => item.name),
                              datasets: [
                                {
                                  data: householdData.map(item => item.value),
                                  backgroundColor: householdData.map(item => item.color || '#ccc'),
                                  borderColor: householdData.map(item => item.color || '#ccc'),
                                  borderWidth: 1,
                                },
                              ],
                            }}
                            options={{
                              plugins: { legend: { position: 'right' } },
                              maintainAspectRatio: true,
                              responsive: true,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                
              {/* Supply Indicators Section */}
              <div className="supply-indicators animate-fade-in" style={{animationDelay: '1.2s'}}>
                <h3 className="section-header">
                  <FaBoxes className="section-icon" />
                  Supply Indicators
                  <span className="section-description">Factors affecting property supply in the market</span>
                </h3>
                
                <div className="indicators-grid">
                  <div className="indicator-card">
                    <div className="indicator-header supply">
                      <h4>Building Approvals</h4>
                      <div className="indicator-tag">Supply</div>
                    </div>
                    <div className="chart-container">
                      <div className="bar-chart-container">
                        <Bar 
                          data={{
                            labels: buildingApprovalsData.history.map(item => item.year),
                            datasets: [
                              {
                                label: 'Houses',
                                data: buildingApprovalsData.history.map(item => item.houses),
                                backgroundColor: 'rgba(46, 204, 113, 0.8)',
                                borderColor: 'rgba(46, 204, 113, 1)',
                                borderWidth: 1,
                                borderRadius: 4
                              },
                              {
                                label: 'Units',
                                data: buildingApprovalsData.history.map(item => item.units),
                                backgroundColor: 'rgba(155, 89, 182, 0.8)',
                                borderColor: 'rgba(155, 89, 182, 1)',
                                borderWidth: 1,
                                borderRadius: 4
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                grid: {
                                  color: 'rgba(200, 200, 200, 0.2)'
                                },
                                stacked: false
                              },
                              x: {
                                grid: {
                                  display: false
                                },
                                stacked: false
                              }
                            },
                            plugins: {
                              legend: {
                                position: 'top'
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="indicator-footer">
                      <div className="indicator-status positive">
                        <span className="status-icon">✓</span>
                        <span className="status-text">Positive for Investment</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="indicator-card">
                    <div className="indicator-header supply">
                      <h4>Inventory Levels</h4>
                      <div className="indicator-tag">Supply</div>
                    </div>
                    <div className="chart-container">
                      <div className="bar-chart-container">
                        <Bar 
                          data={{
                            labels: inventoryLevelsData.history.map(item => `${item.month} ${item.year}`),
                            datasets: [
                              {
                                label: 'Inventory (Months)',
                                data: inventoryLevelsData.history.map(item => item.value),
                                backgroundColor: 'rgba(52, 152, 219, 0.8)',
                                borderColor: 'rgba(52, 152, 219, 1)',
                                borderWidth: 1,
                                borderRadius: 4
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: false,
                                grid: {
                                  color: 'rgba(200, 200, 200, 0.2)'
                                }
                              },
                              x: {
                                grid: {
                                  display: false
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                position: 'top'
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="indicator-footer">
                      <div className="indicator-status positive">
                        <span className="status-icon">✓</span>
                        <span className="status-text">Positive for Investment</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="indicator-card">
                    <div className="indicator-header supply">
                      <h4>Stock on Market</h4>
                      <div className="indicator-tag">Supply</div>
                    </div>
                    <div className="chart-container">
                      <div className="line-chart-container">
                        <Line 
                          data={{
                            labels: stockOnMarketData.history.map(item => `${item.month} ${item.year}`),
                            datasets: [
                              {
                                label: 'Unsold Listings',
                                data: stockOnMarketData.history.map(item => item.value),
                                borderColor: 'rgba(231, 76, 60, 1)',
                                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: 'rgba(231, 76, 60, 1)',
                                pointBorderColor: '#fff',
                                pointRadius: 4,
                                pointHoverRadius: 6
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: false,
                                grid: {
                                  color: 'rgba(200, 200, 200, 0.2)'
                                }
                              },
                              x: {
                                grid: {
                                  display: false
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                position: 'top'
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="indicator-footer">
                      <div className="indicator-status positive">
                        <span className="status-icon">✓</span>
                        <span className="status-text">Positive for Investment</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="indicator-card">
                    <div className="indicator-header supply">
                      <h4>IRSAD Score</h4>
                      <div className="indicator-tag">Supply</div>
                    </div>
                    <div className="chart-container">
                      <div className="gauge-chart-container">
                        <div className="gauge-chart">
                          <Pie 
                            data={{
                              labels: ['IRSAD Score'],
                              datasets: [
                                {
                                  data: [irsadData.currentValue, irsadData.maxValue - irsadData.currentValue],
                                  backgroundColor: [
                                    'rgba(52, 152, 219, 0.8)',
                                    'rgba(220, 220, 220, 0.5)'
                                  ],
                                  borderWidth: 0,
                                  circumference: 180,
                                  rotation: 270,
                                }
                              ]
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              cutout: '70%',
                              plugins: {
                                legend: {
                                  display: false
                                },
                                tooltip: {
                                  enabled: false
                                }
                              }
                            }}
                          />
                          <div className="gauge-value">{irsadData.currentValue}</div>
                          <div className="gauge-label">IRSAD Score</div>
                          <div className="gauge-percentile">{irsadData.percentile}th percentile</div>
                        </div>
                      </div>
                    </div>
                    <div className="indicator-footer">
                      <div className="indicator-status neutral">
                        <span className="status-icon">○</span>
                        <span className="status-text">Neutral for Investment</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="indicator-card">
                    <div className="indicator-header supply">
                      <h4>Renters to Owners</h4>
                      <div className="indicator-tag">Supply</div>
                    </div>
                    <div className="chart-container">
                      <div className="donut-chart-container">
                        <Pie 
                          data={{
                            labels: ['Owners', 'Renters'],
                            datasets: [
                              {
                                data: [rentersToOwnersData.owners, rentersToOwnersData.renters],
                                backgroundColor: [
                                  'rgba(46, 204, 113, 0.8)',
                                  'rgba(52, 152, 219, 0.8)'
                                ],
                                borderWidth: 2,
                                borderColor: '#ffffff'
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '60%',
                            plugins: {
                              legend: {
                                position: 'bottom'
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    return context.label + ': ' + context.raw + '%';
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="indicator-footer">
                      <div className="indicator-status positive">
                        <span className="status-icon">✓</span>
                        <span className="status-text">Positive for Investment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Demand Indicators Section */}
              <div className="demand-indicators animate-fade-in" style={{animationDelay: '1.4s'}}>
                <h3 className="section-header">
                  <FaUsers className="section-icon" />
                  Demand Indicators
                  <span className="section-description">Factors affecting buyer and renter demand</span>
                </h3>
                
                <div className="indicators-grid">
                  <div className="indicator-card">
                    <div className="indicator-header demand">
                      <h4>Days on Market</h4>
                      <div className="indicator-tag">Demand</div>
                    </div>
                    <div className="chart-container">
                      <div className="line-chart-container">
                        <Line 
                          data={{
                            labels: daysOnMarketData.history.map(item => `${item.month} ${item.year}`),
                            datasets: [
                              {
                                label: 'Days on Market',
                                data: daysOnMarketData.history.map(item => item.value),
                                borderColor: 'rgba(243, 156, 18, 1)',
                                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.3,
                                pointBackgroundColor: 'rgba(243, 156, 18, 1)',
                                pointBorderColor: '#fff',
                                pointRadius: 5,
                                pointHoverRadius: 7
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: false,
                                grid: {
                                  color: 'rgba(200, 200, 200, 0.2)'
                                }
                              },
                              x: {
                                grid: {
                                  display: false
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                position: 'top'
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="indicator-footer">
                      <div className="indicator-status positive">
                        <span className="status-icon">✓</span>
                        <span className="status-text">Positive for Investment</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="indicator-card">
                    <div className="indicator-header demand">
                      <h4>Vacancy Rate</h4>
                      <div className="indicator-tag">Demand</div>
                    </div>
                    <div className="chart-container">
                      <div className="line-chart-container">
                        <Line 
                          data={{
                            labels: vacancyRateData.history.map(item => `${item.month} ${item.year}`),
                            datasets: [
                              {
                                label: 'Vacancy Rate',
                                data: vacancyRateData.history.map(item => item.value),
                                borderColor: 'rgba(41, 128, 185, 1)',
                                backgroundColor: 'rgba(41, 128, 185, 0.2)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: 'rgba(41, 128, 185, 1)',
                                pointBorderColor: '#fff',
                                pointRadius: 4,
                                pointHoverRadius: 6
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                grid: {
                                  color: 'rgba(200, 200, 200, 0.2)'
                                },
                                ticks: {
                                  callback: function(value) {
                                    return value + '%';
                                  }
                                }
                              },
                              x: {
                                grid: {
                                  display: false
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                position: 'top'
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    return context.dataset.label + ': ' + context.raw + '%';
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="indicator-footer">
                      <div className="indicator-status positive">
                        <span className="status-icon">✓</span>
                        <span className="status-text">Positive for Investment</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="indicator-card">
                    <div className="indicator-header demand">
                      <h4>Search Index</h4>
                      <div className="indicator-tag">Demand</div>
                    </div>
                    <div className="chart-container">
                      <div className="line-chart-container">
                        <Line 
                          data={{
                            labels: searchIndexData.history.map(item => `${item.month} ${item.year}`),
                            datasets: [
                              {
                                label: 'Search Index',
                                data: searchIndexData.history.map(item => item.value),
                                borderColor: 'rgba(155, 89, 182, 1)',
                                backgroundColor: 'rgba(155, 89, 182, 0.2)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: 'rgba(155, 89, 182, 1)',
                                pointBorderColor: '#fff',
                                pointRadius: 4,
                                pointHoverRadius: 6
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: false,
                                grid: {
                                  color: 'rgba(200, 200, 200, 0.2)'
                                }
                              },
                              x: {
                                grid: {
                                  display: false
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                position: 'top'
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="indicator-footer">
                      <div className="indicator-status positive">
                        <span className="status-icon">✓</span>
                        <span className="status-text">Positive for Investment</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="indicator-card">
                    <div className="indicator-header demand">
                      <h4>Auction Clearance Rate</h4>
                      <div className="indicator-tag">Demand</div>
                    </div>
                    <div className="chart-container">
                      <div className="line-chart-container">
                        <Line 
                          data={{
                            labels: auctionClearanceRateData.history.map(item => `${item.month} ${item.year}`),
                            datasets: [
                              {
                                label: 'Clearance Rate',
                                data: auctionClearanceRateData.history.map(item => item.value),
                                borderColor: 'rgba(39, 174, 96, 1)',
                                backgroundColor: 'rgba(39, 174, 96, 0.2)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.3,
                                pointBackgroundColor: 'rgba(39, 174, 96, 1)',
                                pointBorderColor: '#fff',
                                pointRadius: 4,
                                pointHoverRadius: 6
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: false,
                                grid: {
                                  color: 'rgba(200, 200, 200, 0.2)'
                                },
                                ticks: {
                                  callback: function(value) {
                                    return value + '%';
                                  }
                                }
                              },
                              x: {
                                grid: {
                                  display: false
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                position: 'top'
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    return context.dataset.label + ': ' + context.raw + '%';
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="indicator-footer">
                      <div className="indicator-status positive">
                        <span className="status-icon">✓</span>
                        <span className="status-text">Positive for Investment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'properties' && (
            <div className="properties-tab">
              <h3 className="section-title">Properties in {suburb.name}</h3>
              
              <div className="properties-controls">
                <div className="view-options">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    Grid View
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    List View
                  </button>
                </div>
                
                <div className="filter-options">
                  <button className="sort-btn">
                    Sort By: Price (High-Low)
                  </button>
                  <button className="filter-btn">
                    Filter
                  </button>
                </div>
              </div>
              
              <p className="properties-count">
                {getPropertiesForSuburb().length} properties found in {suburb.name}
              </p>
              
              <div className="properties-grid">
                {getPropertiesForSuburb().map(property => (
                  <div className="property-card" key={property.id}>
                    <div 
                      className="property-image"
                      style={{
                        backgroundImage: `url(${property.image || '/images/property-1.jpg'})`,
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover',
                        height: '200px',
                        position: 'relative',
                        boxShadow: 'none',
                        filter: 'none',
                        opacity: '1'
                      }}
                    >
                      <div className="property-type">{property.type || 'House'}</div>
                      <div className="property-price" style={{top: 'auto', height: 'auto', backgroundColor: 'rgba(42, 82, 152, 0.9)'}}>{formatCurrency(property.price || 0)}</div>
                    </div>                
                    <div className="property-details">
                      <h3>{property.title || `${property.bedrooms || 3} Bedroom ${property.type || 'House'}`}</h3>
                      
                      <div className="property-address">
                        <FaMapMarkerAlt /> {property.address || `${suburb.name}, NSW ${suburb.postcode || '2000'}`}
                      </div>
                      
                      <div className="property-features">
                        <div className="feature">
                          <FaBed />
                          <span>{property.bedrooms || 3}</span>
                          <p>Beds</p>
                        </div>
                        
                        <div className="feature">
                          <FaBath />
                          <span>{property.bathrooms || 2}</span>
                          <p>Baths</p>
                        </div>
                        
                        <div className="feature">
                          <FaCar />
                          <span>{property.parking || 1}</span>
                          <p>Parking</p>
                        </div>
                        
                        <div className="feature">
                          <FaRulerCombined />
                          <span>{property.landSize || 450}m²</span>
                          <p>Land</p>
                        </div>
                      </div>
                      
                      <div className="property-metrics">
                        <div className="metric rental-yield">
                          <span>{property.rentalYield || 3.5}%</span>
                          <p>Rental Yield</p>
                        </div>
                        
                        <div className="metric capital-growth">
                          <span>{property.capitalGrowth || 5.2}%</span>
                          <p>Capital Growth</p>
                        </div>
                        
                        <div className="metric cashflow">
                          <span>{formatCurrency(property.cashflow || -2500)}</span>
                          <p>Cashflow p.a.</p>
                        </div>
                      </div>
                      
                      <div className="property-agent">
                        <img 
                          src={property.agentPhoto || "https://via.placeholder.com/40"} 
                          alt="Agent" 
                          className="agent-photo" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/40";
                          }}
                        />
                        <div>
                          {property.agentName || "Real Estate Agent"}
                        </div>
                        <div className="listing-date">
                          Listed {property.listedDate || "2 weeks ago"}
                        </div>
                      </div>
                      
                      <div className="property-actions">
                        <button 
                          className="view-details-btn"
                          onClick={() => handleViewDetails(property.id)}
                        >
                          View Details
                        </button>
                        
                        <button 
                          className="save-property-btn"
                          onClick={() => toggleSaveProperty(property.id)}
                        >
                          {savedProperties.includes(property.id) ? <FaHeart /> : <FaRegHeart />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'map' && (
            <div className="map-tab">
              <div className="map-container">
                <div 
                  className="map-placeholder"
                  style={{ backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?center=${suburb.name},NSW,Australia&zoom=14&size=1200x500&key=YOUR_API_KEY)` }}
                >
                  <div className="map-overlay">
                    <h3>{suburb.name}</h3>
                    <p>Explore the neighborhood and discover local amenities, schools, transport options, and more.</p>
                  </div>
                  
                  <div className="map-controls">
                    <div className="property-type-filter">
                      <label>
                        <input type="checkbox" defaultChecked /> Show Houses
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked /> Show Units
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked /> Show Land
                      </label>
                    </div>
                  </div>
                  
                  <div className="map-navigation-controls">
                    <button className="map-control-btn">+</button>
                    <button className="map-control-btn">-</button>
                  </div>
                </div>
              </div>
              
              <div className="location-insights">
                <h3>Location Insights</h3>
                
                <p>
                  {suburb.name} is located in the {suburb.region || "Sydney"} region of NSW, approximately {suburb.distanceToCBD || 15} km from the Sydney CBD. The suburb offers {suburb.description || "a mix of residential properties with good access to amenities and transport options."}
                </p>
                
                <p>
                  The area is well-served by public transport, with {suburb.transport || "regular bus services and train connections to the city center"}. Local amenities include {suburb.amenities || "shopping centers, schools, parks, and recreational facilities"}.
                </p>
                
                <p>
                  {suburb.name} has seen {suburb.recentDevelopment || "significant development in recent years, with new residential projects and infrastructure improvements"} which has contributed to its growing popularity among both homeowners and investors.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SuburbProfile;
