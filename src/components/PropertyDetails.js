import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PropertyDetails.css';
import { FaBed, FaBath, FaCar, FaRulerCombined, FaCalendarAlt, FaChartLine, FaMapMarkerAlt, 
         FaTimes, FaHome, FaDollarSign, FaChartBar, FaPercentage, FaRegCalendarAlt, 
         FaWalking, FaShoppingCart, FaSchool, FaHospital, FaPlay, FaPause, FaRedo, FaCheck } from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker, useLoadScript } from '@react-google-maps/api';

// Create a separate Map component to handle Google Maps initialization
const PropertyMap = ({ property, amenities, onMapLoad, onMapError }) => {
  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  };
  
  // Map options with custom styling
  const mapOptions = {
    mapTypeControl: false,
    streetViewControl: true,
    fullscreenControl: true,
    styles: [
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#dedede" }, { "lightness": 21 }]
      }
    ]
  };

  // Use the useLoadScript hook to load Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBMz7S7x8vMoVzEtxnXBRj-c0hJrRbjKXE",
    libraries: ["places", "geometry", "drawing"]
  });

  // Handle map load error
  useEffect(() => {
    if (loadError) {
      console.error("Error loading Google Maps API:", loadError);
      onMapError(true);
    }
  }, [loadError, onMapError]);

  // Handle map load
  const handleMapLoad = useCallback((map) => {
    if (!map) {
      console.warn("Map object is undefined in handleMapLoad");
      onMapError(true);
      return;
    }
    
    onMapLoad(map);
  }, [onMapLoad]);

  if (loadError) {
    return (
      <div className="map-error">
        Sorry! There was an error loading the map.
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="map-loading">Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={property?.coordinates || { lat: -33.8688, lng: 151.2093 }} // Default to Sydney if coordinates not available
      zoom={15}
      options={mapOptions}
      onLoad={handleMapLoad}
    >
      {property?.coordinates && <Marker position={property.coordinates} />}
    </GoogleMap>
  );
};

const PropertyDetails = ({ property, onClose }) => {
  // Ensure property is defined with default values
  const safeProperty = property || {
    title: "Property Details",
    address: "Address not available",
    price: 0,
    description: "No description available",
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    landSize: "N/A",
    buildingSize: "N/A",
    yearBuilt: "N/A",
    capitalGrowth: 0,
    rentalYield: 0,
    vacancyRate: 0,
    weeklyRent: 0,
    annualGrowth: 0,
    daysOnMarket: 0,
    demandToSupply: 0,
    features: [],
    comparableSales: [],
    coordinates: { lat: -33.8688, lng: 151.2093 }, // Default to Sydney
    amenities: [],
    agent: {
      name: "Agent information not available",
      title: "",
      agency: "",
      phone: "",
      email: "",
      avatar: null
    },
    image: ""
  };
  
  const [mapError, setMapError] = useState(false);
  const [routeAnimations, setRouteAnimations] = useState({});
  const [allAnimationsPlaying, setAllAnimationsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(3);
  const [distanceMarkers, setDistanceMarkers] = useState({});
  const [visibleSections, setVisibleSections] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const mapRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const amenityMarkersRef = useRef({});
  const animationIdsRef = useRef({});
  const containerRef = useRef(null);
  const directionsRenderersRef = useRef({});
  
  // Define amenity data with custom icons and route colors
  const amenities = {
    station: { 
      id: 'station',
      name: safeProperty?.amenities?.find(a => a?.id === 'station')?.name || "Train Station",
      distance: safeProperty?.amenities?.find(a => a?.id === 'station')?.distance || "350m",
      coordinates: safeProperty?.amenities?.find(a => a?.id === 'station')?.coordinates || { lat: -33.891967, lng: 151.138269 },
      icon: "https://maps.google.com/mapfiles/kml/shapes/rail.png",
      routeColor: "#4285F4", // Google Blue
      transportMode: "WALKING"
    },
    shopping: { 
      id: 'shopping',
      name: safeProperty?.amenities?.find(a => a?.id === 'shopping')?.name || "Shopping Centre",
      distance: safeProperty?.amenities?.find(a => a?.id === 'shopping')?.distance || "500m",
      coordinates: safeProperty?.amenities?.find(a => a?.id === 'shopping')?.coordinates || { lat: -33.887967, lng: 151.139869 },
      icon: "https://maps.google.com/mapfiles/kml/shapes/shopping.png",
      routeColor: "#EA4335", // Google Red
      transportMode: "WALKING"
    },
    school: { 
      id: 'school',
      name: safeProperty?.amenities?.find(a => a?.id === 'school')?.name || "Public School",
      distance: safeProperty?.amenities?.find(a => a?.id === 'school')?.distance || "750m",
      coordinates: safeProperty?.amenities?.find(a => a?.id === 'school')?.coordinates || { lat: -33.892967, lng: 151.141869 },
      icon: "https://maps.google.com/mapfiles/kml/shapes/schools.png",
      routeColor: "#FBBC05", // Google Yellow
      transportMode: "WALKING"
    },
    medical: { 
      id: 'medical',
      name: safeProperty?.amenities?.find(a => a?.id === 'medical')?.name || "Medical Centre",
      distance: safeProperty?.amenities?.find(a => a?.id === 'medical')?.distance || "1.1km",
      coordinates: safeProperty?.amenities?.find(a => a?.id === 'medical')?.coordinates || { lat: -33.885967, lng: 151.142869 },
      icon: "https://maps.google.com/mapfiles/kml/shapes/hospitals.png",
      routeColor: "#34A853", // Google Green
      transportMode: "WALKING"
    }
  };

  // Handle map load
  const onMapLoad = useCallback((map) => {
    try {
      if (!map) {
        console.warn("Map object is undefined in onMapLoad");
        setMapError(true);
        return;
      }
      
      mapRef.current = map;
      
      // Check if DirectionsService is available
      if (window.google && window.google.maps && window.google.maps.DirectionsService) {
        directionsServiceRef.current = new window.google.maps.DirectionsService();
      } else {
        console.warn("Google Maps DirectionsService not available");
        return;
      }
      
      // Add property marker
      const propertyMarker = new window.google.maps.Marker({
        position: safeProperty.coordinates,
        map: map,
        title: safeProperty.title,
        icon: {
          url: 'https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png',
          scaledSize: new window.google.maps.Size(40, 40)
        },
        animation: window.google.maps.Animation.DROP
      });
      
      // Add property info window
      const propertyInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="max-width: 250px; padding: 10px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #2c3e50;">${safeProperty.title}</h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #7f8c8d;">${safeProperty.address}</p>
            <p style="margin: 0; font-weight: bold; font-size: 16px; color: #3498db;">$${safeProperty.price.toLocaleString()}</p>
          </div>
        `
      });
      propertyInfoWindow.open(map, propertyMarker);
      
      // Add amenity markers and calculate routes
      Object.values(amenities).forEach(amenity => {
        // Create marker
        const amenityMarker = new window.google.maps.Marker({
          position: amenity.coordinates,
          map: map,
          title: amenity.name,
          icon: {
            url: amenity.icon,
            scaledSize: new window.google.maps.Size(32, 32)
          },
          animation: window.google.maps.Animation.DROP
        });
        
        // Store marker reference
        amenityMarkersRef.current[amenity.id] = amenityMarker;
        
        // Add info window
        const amenityInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="max-width: 200px; padding: 10px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #2c3e50;">${amenity.name}</h3>
              <p style="margin: 0; font-size: 14px; color: #7f8c8d;">Distance: ${amenity.distance}</p>
            </div>
          `
        });
        
        // Add click listener
        amenityMarker.addListener('click', () => {
          amenityInfoWindow.open(map, amenityMarker);
          animateRoute(amenity.id);
        });
        
        // Calculate route
        calculateRoute(amenity.id);
      });
      
      // Fit map to show all markers
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(safeProperty.coordinates);
      Object.values(amenities).forEach(amenity => {
        bounds.extend(amenity.coordinates);
      });
      map.fitBounds(bounds);
      
      // Set map as loaded
      setMapLoaded(true);
    } catch (error) {
      console.error("Error loading map:", error);
      setMapError(true);
    }
  }, [safeProperty, amenities]);
  
  // Calculate route between property and amenity
  const calculateRoute = useCallback((amenityId) => {
    if (!mapRef.current || !directionsServiceRef.current) {
      console.warn("Map or DirectionsService not available for calculateRoute");
      return;
    }
    
    const amenity = amenities[amenityId];
    if (!amenity) {
      console.warn(`Amenity with id ${amenityId} not found`);
      return;
    }
    
    try {
      // Remove existing renderer for this amenity if it exists
      if (directionsRenderersRef.current[amenityId]) {
        directionsRenderersRef.current[amenityId].setMap(null);
        delete directionsRenderersRef.current[amenityId];
      }
      
      // Create new renderer
      directionsRenderersRef.current[amenityId] = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: amenity.routeColor,
          strokeOpacity: 0.7,
          strokeWeight: 5
        }
      });
      
      // Set map for renderer
      directionsRenderersRef.current[amenityId].setMap(mapRef.current);
      
      directionsServiceRef.current.route(
        {
          origin: safeProperty.coordinates,
          destination: amenity.coordinates,
          travelMode: window.google.maps.TravelMode[amenity.transportMode]
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result && result.routes && result.routes.length > 0) {
            // Display the route
            directionsRenderersRef.current[amenityId].setDirections(result);
            
            // Store route path for animation
            const route = result.routes[0].overview_path;
            
            setRouteAnimations(prev => ({
              ...prev,
              [amenityId]: {
                path: route,
                currentIndex: 0,
                isPlaying: false,
                polyline: new window.google.maps.Polyline({
                  path: [],
                  geodesic: true,
                  strokeColor: amenity.routeColor,
                  strokeOpacity: 1.0,
                  strokeWeight: 5,
                  map: mapRef.current
                })
              }
            }));
            
            // Add distance and duration to amenity info
            if (result.routes[0].legs && result.routes[0].legs.length > 0) {
              const leg = result.routes[0].legs[0];
              
              // Create distance marker with transport icon
              const midpoint = Math.floor(route.length / 2);
              if (midpoint > 0) {
                const transportIcon = amenity.transportMode === "WALKING" ? 
                  "https://maps.google.com/mapfiles/kml/shapes/walking.png" : 
                  "https://maps.google.com/mapfiles/kml/shapes/cabs.png";
                
                // Create standard marker for distance
                try {
                  const distanceMarker = new window.google.maps.Marker({
                    position: route[midpoint],
                    map: mapRef.current,
                    title: `${amenity.name}: ${leg.distance.text} (${leg.duration.text})`,
                    icon: {
                      url: transportIcon,
                      scaledSize: new window.google.maps.Size(24, 24)
                    },
                    visible: false
                  });
                  
                  setDistanceMarkers(prev => ({
                    ...prev,
                    [amenityId]: distanceMarker
                  }));
                } catch (error) {
                  console.error("Error creating distance marker:", error);
                }
              }
            }
          } else {
            console.error(`Directions request failed: ${status}`);
          }
        }
      );
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  }, [safeProperty, amenities]);
  
  // Animate a specific route
  const animateRoute = useCallback((amenityId) => {
    try {
      if (!mapLoaded || !mapRef.current) {
        console.warn("Map not loaded yet, cannot animate route");
        return;
      }
      
      const animation = routeAnimations[amenityId];
      if (!animation) {
        console.warn(`No animation data for amenity ${amenityId}`);
        return;
      }
      
      // If animation is already playing, stop it
      if (animation.isPlaying) {
        stopAnimation(amenityId);
        return;
      }
      
      // Reset animation if it was previously played
      animation.currentIndex = 0;
      if (animation.polyline && animation.polyline.setPath) {
        animation.polyline.setPath([]);
      } else {
        console.warn(`Polyline for amenity ${amenityId} is not properly initialized`);
        return;
      }
      
      // Add active class to amenity element
      const amenityElement = document.getElementById(`amenity-${amenityId}`);
      if (amenityElement) {
        amenityElement.classList.add('active');
        amenityElement.classList.add('pulse');
      }
      
      // Start animation
      setRouteAnimations(prev => ({
        ...prev,
        [amenityId]: {
          ...prev[amenityId],
          isPlaying: true
        }
      }));
      
      animateStep(amenityId);
      
      // Show distance marker
      if (distanceMarkers[amenityId] && distanceMarkers[amenityId].setVisible) {
        distanceMarkers[amenityId].setVisible(true);
      }
    } catch (error) {
      console.error("Error animating route:", error);
    }
  }, [routeAnimations, distanceMarkers, mapLoaded]);
  
  // Animation step function
  const animateStep = useCallback((amenityId) => {
    try {
      if (!mapLoaded || !mapRef.current) {
        console.warn("Map not loaded yet, cannot animate step");
        return;
      }
      
      const animation = routeAnimations[amenityId];
      if (!animation || !animation.path || !animation.polyline || !animation.polyline.getPath) {
        console.warn(`Animation data for amenity ${amenityId} is not properly initialized`);
        return;
      }
      
      const path = animation.path;
      const speed = 6 - animationSpeed; // Invert speed (1 = fastest, 5 = slowest)
      
      // If animation is complete, loop it
      if (animation.currentIndex >= path.length) {
        animation.currentIndex = 0;
        animation.polyline.setPath([]);
      }
      
      // Add next point to the polyline
      const currentPath = animation.polyline.getPath();
      currentPath.push(path[animation.currentIndex]);
      animation.currentIndex++;
      
      // Update distance marker position to follow the animation
      if (distanceMarkers[amenityId] && animation.currentIndex > Math.floor(path.length / 2)) {
        if (distanceMarkers[amenityId].setPosition) {
          distanceMarkers[amenityId].setPosition(path[Math.floor(path.length / 2)]);
          distanceMarkers[amenityId].setVisible(true);
        }
      }
      
      // Continue animation if not at the end
      if (animation.currentIndex < path.length) {
        animationIdsRef.current[amenityId] = setTimeout(() => {
          animateStep(amenityId);
        }, speed * 50); // Adjust speed based on slider
      } else {
        // When animation completes one cycle
        animationIdsRef.current[amenityId] = setTimeout(() => {
          if (animation.isPlaying) {
            animateStep(amenityId);
          }
        }, 1000); // Pause at the end before looping
      }
    } catch (error) {
      console.error("Error in animation step:", error);
    }
  }, [routeAnimations, animationSpeed, distanceMarkers, mapLoaded]);
  
  // Stop animation for a specific route
  const stopAnimation = useCallback((amenityId) => {
    try {
      // Clear timeout
      if (animationIdsRef.current[amenityId]) {
        clearTimeout(animationIdsRef.current[amenityId]);
      }
      
      // Reset animation state
      setRouteAnimations(prev => ({
        ...prev,
        [amenityId]: {
          ...prev[amenityId],
          isPlaying: false
        }
      }));
      
      // Remove active class from amenity element
      const amenityElement = document.getElementById(`amenity-${amenityId}`);
      if (amenityElement) {
        amenityElement.classList.remove('active');
        amenityElement.classList.remove('pulse');
      }
      
      // Hide distance marker
      if (distanceMarkers[amenityId] && distanceMarkers[amenityId].setVisible) {
        distanceMarkers[amenityId].setVisible(false);
      }
    } catch (error) {
      console.error("Error stopping animation:", error);
    }
  }, [distanceMarkers]);
  
  // Toggle all animations
  const toggleAllAnimations = useCallback(() => {
    try {
      if (!mapLoaded || !mapRef.current) {
        console.warn("Map not loaded yet, cannot toggle animations");
        return;
      }
      
      if (allAnimationsPlaying) {
        // Stop all animations
        Object.keys(routeAnimations).forEach(key => {
          stopAnimation(key);
        });
        setAllAnimationsPlaying(false);
      } else {
        // Start all animations
        Object.keys(routeAnimations).forEach(key => {
          const animation = routeAnimations[key];
          if (animation && animation.polyline && animation.polyline.setPath) {
            // Reset animation
            animation.currentIndex = 0;
            animation.polyline.setPath([]);
            
            // Add active class to amenity element
            const amenityElement = document.getElementById(`amenity-${key}`);
            if (amenityElement) {
              amenityElement.classList.add('active');
              amenityElement.classList.add('pulse');
            }
            
            // Start animation
            setRouteAnimations(prev => ({
              ...prev,
              [key]: {
                ...prev[key],
                isPlaying: true
              }
            }));
            
            // Show distance marker
            if (distanceMarkers[key] && distanceMarkers[key].setVisible) {
              distanceMarkers[key].setVisible(true);
            }
            
            // Start animation
            animateStep(key);
          }
        });
        setAllAnimationsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling animations:", error);
    }
  }, [routeAnimations, allAnimationsPlaying, animateStep, stopAnimation, distanceMarkers, mapLoaded]);
  
  // Reset all routes
  const resetAllRoutes = useCallback(() => {
    try {
      if (!mapLoaded || !mapRef.current) {
        console.warn("Map not loaded yet, cannot reset routes");
        return;
      }
      
      // Stop all animations
      Object.keys(routeAnimations).forEach(key => {
        stopAnimation(key);
      });
      setAllAnimationsPlaying(false);
      
      // Reset all animations
      Object.keys(routeAnimations).forEach(key => {
        const animation = routeAnimations[key];
        if (animation && animation.polyline && animation.polyline.setPath) {
          animation.currentIndex = 0;
          animation.polyline.setPath([]);
        }
      });
    } catch (error) {
      console.error("Error resetting routes:", error);
    }
  }, [routeAnimations, stopAnimation, mapLoaded]);
  
  // Update animation speed
  const handleSpeedChange = useCallback((e) => {
    setAnimationSpeed(parseInt(e.target.value));
  }, []);
  
  // Scroll handler for progress bar and section detection
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      
      setScrollProgress(progress);
      
      // Detect active section
      const sections = document.querySelectorAll('.property-section');
      let currentSection = 'overview';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - container.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollTop >= sectionTop - 100) {
          currentSection = section.id;
        }
      });
      
      setActiveSection(currentSection);
      
      // Update visible sections for animations
      const newVisibleSections = {};
      sections.forEach(section => {
        const sectionTop = section.offsetTop - container.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        newVisibleSections[section.id] = 
          (scrollTop + container.clientHeight >= sectionTop - 200) && 
          (scrollTop <= sectionBottom + 200);
      });
      
      setVisibleSections(newVisibleSections);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  // Scroll to section
  const scrollToSection = useCallback((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section && containerRef.current) {
      containerRef.current.scrollTo({
        top: section.offsetTop - containerRef.current.offsetTop,
        behavior: 'smooth'
      });
    }
  }, []);
  
  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      // Clear all timeouts
      Object.keys(animationIdsRef.current).forEach(key => {
        if (animationIdsRef.current[key]) {
          clearTimeout(animationIdsRef.current[key]);
        }
      });
      
      // Clear all polylines
      Object.keys(routeAnimations).forEach(key => {
        const animation = routeAnimations[key];
        if (animation && animation.polyline && animation.polyline.setMap) {
          animation.polyline.setMap(null);
        }
      });
      
      // Clear all markers
      Object.keys(distanceMarkers).forEach(key => {
        const marker = distanceMarkers[key];
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
      
      // Clear all renderers
      Object.keys(directionsRenderersRef.current).forEach(key => {
        if (directionsRenderersRef.current[key] && directionsRenderersRef.current[key].setMap) {
          directionsRenderersRef.current[key].setMap(null);
        }
      });
    };
  }, [routeAnimations, distanceMarkers]);
  
  // Render property details
  return (
    <div className="property-details-overlay">
      <div className="scroll-progress-container">
        <div 
          className="scroll-progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
      
      <button className="close-btn" onClick={onClose}>
        <FaTimes />
      </button>
      
      <div className="section-nav-dots">
        <div 
          className={`nav-dot ${activeSection === 'overview' ? 'active' : ''}`}
          data-section="Overview"
          onClick={() => scrollToSection('overview')}
        ></div>
        <div 
          className={`nav-dot ${activeSection === 'features' ? 'active' : ''}`}
          data-section="Features"
          onClick={() => scrollToSection('features')}
        ></div>
        <div 
          className={`nav-dot ${activeSection === 'investment' ? 'active' : ''}`}
          data-section="Investment"
          onClick={() => scrollToSection('investment')}
        ></div>
        <div 
          className={`nav-dot ${activeSection === 'location' ? 'active' : ''}`}
          data-section="Location"
          onClick={() => scrollToSection('location')}
        ></div>
        <div 
          className={`nav-dot ${activeSection === 'contact' ? 'active' : ''}`}
          data-section="Contact"
          onClick={() => scrollToSection('contact')}
        ></div>
      </div>
      
      <div className="property-details-container" ref={containerRef}>
        <div className="property-hero">
          <div 
            className="property-hero-image" 
            style={{ backgroundImage: `url(${safeProperty.image || 'https://via.placeholder.com/800x400?text=Property+Image'})` }}
          ></div>
          <div className="property-price">${safeProperty.price.toLocaleString()}</div>
        </div>
        
        <div className="property-section" id="overview">
          <h2 className="section-title">Property Overview</h2>
          
          <div className="property-address">
            <FaMapMarkerAlt className="address-icon" />
            {safeProperty.address}
          </div>
          
          <div className="property-description">
            {safeProperty.description}
          </div>
          
          <div className="property-specs-container">
            <div className="property-spec">
              <div className="spec-icon"><FaBed /></div>
              <div className="spec-value">{safeProperty.bedrooms}</div>
              <div className="spec-label">Bedrooms</div>
            </div>
            
            <div className="property-spec">
              <div className="spec-icon"><FaBath /></div>
              <div className="spec-value">{safeProperty.bathrooms}</div>
              <div className="spec-label">Bathrooms</div>
            </div>
            
            <div className="property-spec">
              <div className="spec-icon"><FaCar /></div>
              <div className="spec-value">{safeProperty.parking}</div>
              <div className="spec-label">Parking</div>
            </div>
            
            <div className="property-spec">
              <div className="spec-icon"><FaRulerCombined /></div>
              <div className="spec-value">{safeProperty.landSize}</div>
              <div className="spec-label">Land Size</div>
            </div>
            
            <div className="property-spec">
              <div className="spec-icon"><FaHome /></div>
              <div className="spec-value">{safeProperty.buildingSize}</div>
              <div className="spec-label">Building Size</div>
            </div>
            
            <div className="property-spec">
              <div className="spec-icon"><FaCalendarAlt /></div>
              <div className="spec-value">{safeProperty.yearBuilt}</div>
              <div className="spec-label">Year Built</div>
            </div>
          </div>
          
          <div className="property-highlights">
            <div className="highlight-item">
              <div className="highlight-icon"><FaDollarSign /></div>
              <div className="highlight-content">
                <h3>Current Price</h3>
                <p>${safeProperty.price.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="highlight-item">
              <div className="highlight-icon"><FaChartLine /></div>
              <div className="highlight-content">
                <h3>Capital Growth (5yr)</h3>
                <p>{safeProperty.capitalGrowth}%</p>
              </div>
            </div>
            
            <div className="highlight-item">
              <div className="highlight-icon"><FaChartBar /></div>
              <div className="highlight-content">
                <h3>Rental Yield</h3>
                <p>{safeProperty.rentalYield}%</p>
              </div>
            </div>
            
            <div className="highlight-item">
              <div className="highlight-icon"><FaPercentage /></div>
              <div className="highlight-content">
                <h3>Vacancy Rate</h3>
                <p>{safeProperty.vacancyRate}%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="property-section" id="features">
          <h2 className="section-title">Property Features</h2>
          
          <div className="features-grid">
            {safeProperty.features && safeProperty.features.length > 0 ? (
              safeProperty.features.map((feature, index) => (
                <div className="feature-item" key={index}>
                  <div className="feature-icon"><FaCheck /></div>
                  <div className="feature-text">{feature}</div>
                </div>
              ))
            ) : (
              <div className="feature-item">
                <div className="feature-text">No features available</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="property-section" id="investment">
          <h2 className="section-title">Investment Analysis</h2>
          
          <div className="investment-metrics">
            <div className="metric-card">
              <div className="metric-icon"><FaDollarSign /></div>
              <div className="metric-value">${safeProperty.weeklyRent}</div>
              <div className="metric-label">Weekly Rent</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon"><FaChartLine /></div>
              <div className="metric-value">{safeProperty.annualGrowth}%</div>
              <div className="metric-label">Annual Growth</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon"><FaRegCalendarAlt /></div>
              <div className="metric-value">{safeProperty.daysOnMarket}</div>
              <div className="metric-label">Avg. Days on Market</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon"><FaChartBar /></div>
              <div className="metric-value">{safeProperty.demandToSupply}</div>
              <div className="metric-label">Demand to Supply</div>
            </div>
          </div>
          
          <div className="comparable-sales">
            <h3>Recent Comparable Sales</h3>
            
            <div className="comparable-table">
              <div className="comparable-row header">
                <div className="comparable-cell">Address</div>
                <div className="comparable-cell">Sale Price</div>
                <div className="comparable-cell">Sale Date</div>
                <div className="comparable-cell">Bedrooms</div>
                <div className="comparable-cell">Bathrooms</div>
                <div className="comparable-cell">Land Size</div>
              </div>
              
              {safeProperty.comparableSales && safeProperty.comparableSales.length > 0 ? (
                safeProperty.comparableSales.map((sale, index) => (
                  <div className="comparable-row" key={index}>
                    <div className="comparable-cell">{sale.address}</div>
                    <div className="comparable-cell">${sale.price.toLocaleString()}</div>
                    <div className="comparable-cell">{sale.date}</div>
                    <div className="comparable-cell">{sale.bedrooms}</div>
                    <div className="comparable-cell">{sale.bathrooms}</div>
                    <div className="comparable-cell">{sale.landSize}</div>
                  </div>
                ))
              ) : (
                <div className="comparable-row">
                  <div className="comparable-cell" colSpan="6">No comparable sales data available</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="property-section" id="location">
          <h2 className="section-title">Location & Amenities</h2>
          
          <div className="map-container">
            {mapError ? (
              <div className="map-error">
                Sorry! There was an error loading the map.
              </div>
            ) : (
              <PropertyMap 
                property={safeProperty} 
                amenities={amenities} 
                onMapLoad={onMapLoad} 
                onMapError={setMapError}
              />
            )}
            
            {/* Map toolbar - Fixed position */}
            <div className="map-toolbar">
              <button 
                className={`control-btn ${allAnimationsPlaying ? 'active' : ''}`}
                onClick={toggleAllAnimations}
                title="Play All Routes"
                disabled={!mapLoaded}
              >
                {allAnimationsPlaying ? <FaPause /> : <FaPlay />}
              </button>
              
              <button 
                className="control-btn"
                onClick={resetAllRoutes}
                title="Reset Routes"
                disabled={!mapLoaded}
              >
                <FaRedo />
              </button>
            </div>
          </div>
          
          <div className="animation-controls">
            <button 
              className={`control-btn ${allAnimationsPlaying ? 'active' : ''}`}
              onClick={toggleAllAnimations}
              title="Play All Routes"
              disabled={!mapLoaded}
            >
              {allAnimationsPlaying ? <FaPause /> : <FaPlay />}
            </button>
            
            <button 
              className="control-btn"
              onClick={resetAllRoutes}
              title="Reset Routes"
              disabled={!mapLoaded}
            >
              <FaRedo />
            </button>
            
            <div className="speed-control">
              <label htmlFor="speed-slider">Animation Speed:</label>
              <input 
                type="range" 
                id="speed-slider" 
                min="1" 
                max="5" 
                value={animationSpeed}
                onChange={handleSpeedChange}
              />
            </div>
          </div>
          
          <div className="nearby-amenities">
            <h3>Nearby Amenities</h3>
            
            <div className="amenities-list">
              <div 
                className={`amenity-item ${routeAnimations.station?.isPlaying ? 'active' : ''}`}
                id="amenity-station"
                onClick={() => mapLoaded && animateRoute('station')}
              >
                <div className="amenity-icon"><FaWalking /></div>
                <div className="amenity-details">
                  <div className="amenity-name">{amenities.station.name}</div>
                  <div className="amenity-distance">{amenities.station.distance}</div>
                </div>
              </div>
              
              <div 
                className={`amenity-item ${routeAnimations.shopping?.isPlaying ? 'active' : ''}`}
                id="amenity-shopping"
                onClick={() => mapLoaded && animateRoute('shopping')}
              >
                <div className="amenity-icon"><FaShoppingCart /></div>
                <div className="amenity-details">
                  <div className="amenity-name">{amenities.shopping.name}</div>
                  <div className="amenity-distance">{amenities.shopping.distance}</div>
                </div>
              </div>
              
              <div 
                className={`amenity-item ${routeAnimations.school?.isPlaying ? 'active' : ''}`}
                id="amenity-school"
                onClick={() => mapLoaded && animateRoute('school')}
              >
                <div className="amenity-icon"><FaSchool /></div>
                <div className="amenity-details">
                  <div className="amenity-name">{amenities.school.name}</div>
                  <div className="amenity-distance">{amenities.school.distance}</div>
                </div>
              </div>
              
              <div 
                className={`amenity-item ${routeAnimations.medical?.isPlaying ? 'active' : ''}`}
                id="amenity-medical"
                onClick={() => mapLoaded && animateRoute('medical')}
              >
                <div className="amenity-icon"><FaHospital /></div>
                <div className="amenity-details">
                  <div className="amenity-name">{amenities.medical.name}</div>
                  <div className="amenity-distance">{amenities.medical.distance}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="property-section" id="contact">
          <h2 className="section-title">Contact Agent</h2>
          
          <div className="agent-profile">
            <div className="agent-avatar">
              {safeProperty.agent.avatar ? (
                <img src={safeProperty.agent.avatar} alt={safeProperty.agent.name} />
              ) : (
                <div className="avatar-placeholder">
                  {safeProperty.agent.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="agent-details">
              <h3>{safeProperty.agent.name}</h3>
              <div className="agent-title">{safeProperty.agent.title}</div>
              <div className="agent-agency">{safeProperty.agent.agency}</div>
              <div className="agent-contact">
                <span className="contact-label">Phone:</span> {safeProperty.agent.phone}
              </div>
              <div className="agent-contact">
                <span className="contact-label">Email:</span> {safeProperty.agent.email}
              </div>
            </div>
          </div>
          
          <div className="contact-form">
            <h3>Enquire About This Property</h3>
            
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" placeholder="Enter your full name" />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter your email address" />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" placeholder="Enter your phone number" />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                placeholder="I'm interested in this property and would like to know more about..."
              ></textarea>
            </div>
            
            <button className="contact-submit">Send Enquiry</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
