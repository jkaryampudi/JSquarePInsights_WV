import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Mock the useAuth hook
jest.mock('../auth/AuthContext', () => {
  return {
    useAuth: jest.fn()
  };
});

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Navbar Component', () => {
  const { useAuth } = require('../auth/AuthContext');
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders login button when user is not authenticated', () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({ currentUser: null });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Check if login button is rendered
    const loginButton = screen.getByText(/Login \/ Sign Up/i);
    expect(loginButton).toBeInTheDocument();
    
    // Check if profile dropdown is not rendered
    const profileButton = screen.queryByText(/Profile/i);
    expect(profileButton).not.toBeInTheDocument();
  });

  test('renders profile dropdown when user is authenticated', () => {
    // Mock authenticated user
    useAuth.mockReturnValue({ 
      currentUser: { 
        displayName: 'Test User',
        email: 'test@example.com'
      }
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Check if profile button is rendered
    const profileButton = screen.getByText(/Profile/i);
    expect(profileButton).toBeInTheDocument();
    
    // Check if login button is not rendered
    const loginButton = screen.queryByText(/Login \/ Sign Up/i);
    expect(loginButton).not.toBeInTheDocument();
  });

  test('logout button calls logout function when clicked', () => {
    // Mock logout function
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    
    // Mock authenticated user with logout function
    useAuth.mockReturnValue({ 
      currentUser: { 
        displayName: 'Test User',
        email: 'test@example.com'
      },
      logout: mockLogout
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Click profile button to show dropdown
    const profileButton = screen.getByText(/Profile/i);
    fireEvent.click(profileButton);

    // Click logout button
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    // Check if logout function was called
    expect(mockLogout).toHaveBeenCalled();
  });

  test('renders all navigation links', () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({ currentUser: null });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Check if all navigation links are rendered
    const navLinks = screen.getAllByRole('link');
    expect(navLinks.length).toBeGreaterThanOrEqual(5); // 4 nav links + login button
  });
});
