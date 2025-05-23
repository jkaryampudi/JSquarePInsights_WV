import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaHome, FaInfoCircle, FaEnvelope, FaSearch, FaBuilding, FaUserCircle, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand animate-fade-in">
        <div className="brand-logo">
          <FaBuilding className="brand-icon" />
          <h1>J<span className="superscript">2</span>Prop Insights</h1>
        </div>
      </div>
      <div className="navbar-links">
        <a href="#home" className="navbar-link animate-fade-in hover-lift">
          <FaHome className="animate-float" />
        </a>
        <a href="#info" className="navbar-link animate-fade-in delay-100 hover-lift">
          <FaInfoCircle className="animate-float" />
        </a>
        <a href="#contact" className="navbar-link animate-fade-in delay-200 hover-lift">
          <FaEnvelope className="animate-float" />
        </a>
        <a href="#search" className="navbar-link animate-fade-in delay-300 hover-lift">
          <FaSearch className="animate-float" />
        </a>
        
        {currentUser ? (
          <div className="profile-dropdown" ref={dropdownRef}>
            <button 
              className="auth-button user-profile animate-fade-in delay-400 hover-lift"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaUserCircle className="animate-float" />
              <span className="profile-text">Profile</span>
              <FaChevronDown className="dropdown-icon" />
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <FaUserCircle /> My Profile
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout-item">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signup" className="auth-button login-button animate-fade-in delay-400 hover-lift">
            <FaUserCircle className="animate-float" />
            <span>Login / Sign Up</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
