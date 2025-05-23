import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyCardList from '../components/PropertyCardList';

describe('PropertyCardList Component', () => {
  const mockProperties = [
    {
      id: 1,
      title: "Luxury Waterfront Apartment",
      address: "8/22 Harbour Street",
      suburb: "Wollongong",
      state: "NSW",
      postcode: "2500",
      price: 1500000,
      beds: 3,
      baths: 2,
      parking: 2,
      area: 150,
      image: "/images/property-1.jpg",
      rentalYield: 2.5,
      capitalGrowth: 6.8,
      weeklyCashflow: -65,
      agent: "Sarah Johnson",
      listingDate: "15 Feb 2025"
    },
    {
      id: 2,
      title: "Modern 3 Bedroom Apartment",
      address: "123 Main Avenue",
      suburb: "Gregory Hills",
      state: "NSW",
      postcode: "2557",
      price: 850000,
      beds: 3,
      baths: 2,
      parking: 1,
      area: 95,
      image: "/images/property-2.jpg",
      rentalYield: 3.5,
      capitalGrowth: 6.4,
      weeklyCashflow: 35,
      agent: "Jessica Smith",
      listingDate: "28 Mar 2025"
    },
    {
      id: 3,
      title: "Spacious Family Home",
      address: "45 Park Street",
      suburb: "Gregory Hills",
      state: "NSW",
      postcode: "2557",
      price: 1200000,
      beds: 4,
      baths: 3,
      parking: 2,
      area: 220,
      image: "/images/property-3.jpg",
      rentalYield: 2.8,
      capitalGrowth: 7.2,
      weeklyCashflow: -45,
      agent: "Robert Brown",
      listingDate: "5 Mar 2025"
    },
    {
      id: 4,
      title: "Contemporary Townhouse",
      address: "7/15 Railway Parade",
      suburb: "Leppington",
      state: "NSW",
      postcode: "2179",
      price: 650000,
      beds: 3,
      baths: 2.5,
      parking: 1,
      area: 120,
      image: "/images/property-4.jpg",
      rentalYield: 3.5,
      capitalGrowth: 6.4,
      weeklyCashflow: 35,
      agent: "Jessica Smith",
      listingDate: "28 Mar 2025"
    },
    {
      id: 5,
      title: "Modern Apartment with City Views",
      address: "12/45 Church Street",
      suburb: "Parramatta",
      state: "NSW",
      postcode: "2150",
      price: 850000,
      beds: 2,
      baths: 2,
      parking: 1,
      area: 110,
      image: "/images/property-5.jpg",
      rentalYield: 3.0,
      capitalGrowth: 5.2,
      weeklyCashflow: 15,
      agent: "Robert Brown",
      listingDate: "5 Mar 2025"
    }
  ];

  const mockOnClick = jest.fn();

  test('renders property card list with 4 cards initially visible', () => {
    render(<PropertyCardList properties={mockProperties} onCardClick={mockOnClick} />);
    
    // Check if first 4 property titles are rendered
    expect(screen.getByText('Luxury Waterfront Apartment')).toBeInTheDocument();
    expect(screen.getByText('Modern 3 Bedroom Apartment')).toBeInTheDocument();
    expect(screen.getByText('Spacious Family Home')).toBeInTheDocument();
    expect(screen.getByText('Contemporary Townhouse')).toBeInTheDocument();
    
    // The 5th property should not be visible initially
    expect(screen.queryByText('Modern Apartment with City Views')).not.toBeInTheDocument();
  });

  test('shows right scroll arrow when more cards are available', () => {
    render(<PropertyCardList properties={mockProperties} onCardClick={mockOnClick} />);
    
    // Right arrow should be visible since we have more than 4 cards
    const rightArrow = screen.getByRole('button', { name: /next/i }) || 
                       document.querySelector('.scroll-arrow.right');
    expect(rightArrow).toBeInTheDocument();
  });

  test('does not show left scroll arrow initially', () => {
    render(<PropertyCardList properties={mockProperties} onCardClick={mockOnClick} />);
    
    // Left arrow should not be visible initially
    const leftArrow = screen.queryByRole('button', { name: /previous/i }) || 
                      document.querySelector('.scroll-arrow.left');
    expect(leftArrow).not.toBeInTheDocument();
  });

  test('navigates to next set of cards when right arrow is clicked', () => {
    render(<PropertyCardList properties={mockProperties} onCardClick={mockOnClick} />);
    
    // Find and click the right arrow
    const rightArrow = screen.getByRole('button', { name: /next/i }) || 
                       document.querySelector('.scroll-arrow.right');
    fireEvent.click(rightArrow);
    
    // After clicking, the 5th property should be visible
    expect(screen.getByText('Modern Apartment with City Views')).toBeInTheDocument();
    
    // And the left arrow should now be visible
    const leftArrow = screen.getByRole('button', { name: /previous/i }) || 
                      document.querySelector('.scroll-arrow.left');
    expect(leftArrow).toBeInTheDocument();
  });

  test('navigates back to previous set of cards when left arrow is clicked', () => {
    render(<PropertyCardList properties={mockProperties} onCardClick={mockOnClick} />);
    
    // First navigate to next set
    const rightArrow = screen.getByRole('button', { name: /next/i }) || 
                       document.querySelector('.scroll-arrow.right');
    fireEvent.click(rightArrow);
    
    // Then navigate back
    const leftArrow = screen.getByRole('button', { name: /previous/i }) || 
                      document.querySelector('.scroll-arrow.left');
    fireEvent.click(leftArrow);
    
    // First property should be visible again
    expect(screen.getByText('Luxury Waterfront Apartment')).toBeInTheDocument();
  });

  test('handles card click events correctly', () => {
    render(<PropertyCardList properties={mockProperties} onCardClick={mockOnClick} />);
    
    // Find and click a View Details button
    const viewDetailsButtons = screen.getAllByText(/View Details/i);
    fireEvent.click(viewDetailsButtons[0]);
    
    // Check if onClick handler was called with correct property id
    expect(mockOnClick).toHaveBeenCalledWith(1);
  });
});
