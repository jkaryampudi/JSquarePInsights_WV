import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuburbCardList from '../components/SuburbCardList';

describe('SuburbCardList Component', () => {
  const mockSuburbs = [
    {
      id: 1,
      name: 'South Hobart',
      postcode: '7004',
      region: 'Hobart',
      rating: 8.5,
      medianPrice: 750000,
      unitPrice: 550000,
      rentalYield: '3.7%',
      highlights: ['Close to CBD', 'Scenic mountain views'],
      image: '/images/hobart-skyline.jpg'
    },
    {
      id: 2,
      name: 'Gregory Hills',
      postcode: '2557',
      region: 'Western Sydney',
      rating: 8.5,
      medianPrice: 0,
      unitPrice: 750000,
      rentalYield: '3.7%',
      highlights: ['Strong infrastructure development', 'Family-friendly community'],
      image: '/images/gregory-hills.jpg'
    },
    {
      id: 3,
      name: 'Leppington',
      postcode: '2179',
      region: 'Western Sydney',
      rating: 8.2,
      medianPrice: 0,
      unitPrice: 650000,
      rentalYield: '3.5%',
      highlights: ['Proximity to Western Sydney Airport', 'Growing commercial precinct'],
      image: '/images/leppington.jpg'
    },
    {
      id: 4,
      name: 'Parramatta',
      postcode: '2150',
      region: 'Western Sydney',
      rating: 7.8,
      medianPrice: 900000,
      unitPrice: 600000,
      rentalYield: '3.2%',
      highlights: ['Major business district', 'Excellent transport links'],
      image: '/images/parramatta.jpg'
    },
    {
      id: 5,
      name: 'Wollongong',
      postcode: '2500',
      region: 'Illawarra',
      rating: 7.5,
      medianPrice: 950000,
      unitPrice: 650000,
      rentalYield: '3.0%',
      highlights: ['Coastal lifestyle', 'University city'],
      image: '/images/wollongong.jpg'
    }
  ];

  const mockOnClick = jest.fn();

  test('renders suburb card list with 4 cards initially visible', () => {
    render(<SuburbCardList suburbs={mockSuburbs} onCardClick={mockOnClick} />);
    
    // Check if first 4 suburb names are rendered
    expect(screen.getByText('South Hobart')).toBeInTheDocument();
    expect(screen.getByText('Gregory Hills')).toBeInTheDocument();
    expect(screen.getByText('Leppington')).toBeInTheDocument();
    expect(screen.getByText('Parramatta')).toBeInTheDocument();
    
    // The 5th suburb should not be visible initially
    expect(screen.queryByText('Wollongong')).not.toBeInTheDocument();
  });

  test('shows right scroll arrow when more cards are available', () => {
    render(<SuburbCardList suburbs={mockSuburbs} onCardClick={mockOnClick} />);
    
    // Right arrow should be visible since we have more than 4 cards
    const rightArrow = screen.getByRole('button', { name: /next/i }) || 
                       document.querySelector('.scroll-arrow.right');
    expect(rightArrow).toBeInTheDocument();
  });

  test('does not show left scroll arrow initially', () => {
    render(<SuburbCardList suburbs={mockSuburbs} onCardClick={mockOnClick} />);
    
    // Left arrow should not be visible initially
    const leftArrow = screen.queryByRole('button', { name: /previous/i }) || 
                      document.querySelector('.scroll-arrow.left');
    expect(leftArrow).not.toBeInTheDocument();
  });

  test('navigates to next set of cards when right arrow is clicked', () => {
    render(<SuburbCardList suburbs={mockSuburbs} onCardClick={mockOnClick} />);
    
    // Find and click the right arrow
    const rightArrow = screen.getByRole('button', { name: /next/i }) || 
                       document.querySelector('.scroll-arrow.right');
    fireEvent.click(rightArrow);
    
    // After clicking, the 5th suburb should be visible
    expect(screen.getByText('Wollongong')).toBeInTheDocument();
    
    // And the left arrow should now be visible
    const leftArrow = screen.getByRole('button', { name: /previous/i }) || 
                      document.querySelector('.scroll-arrow.left');
    expect(leftArrow).toBeInTheDocument();
  });

  test('navigates back to previous set of cards when left arrow is clicked', () => {
    render(<SuburbCardList suburbs={mockSuburbs} onCardClick={mockOnClick} />);
    
    // First navigate to next set
    const rightArrow = screen.getByRole('button', { name: /next/i }) || 
                       document.querySelector('.scroll-arrow.right');
    fireEvent.click(rightArrow);
    
    // Then navigate back
    const leftArrow = screen.getByRole('button', { name: /previous/i }) || 
                      document.querySelector('.scroll-arrow.left');
    fireEvent.click(leftArrow);
    
    // First suburb should be visible again
    expect(screen.getByText('South Hobart')).toBeInTheDocument();
  });

  test('handles card click events correctly', () => {
    render(<SuburbCardList suburbs={mockSuburbs} onCardClick={mockOnClick} />);
    
    // Find and click a View Suburb Profile button
    const viewProfileButtons = screen.getAllByText(/View Suburb Profile/i);
    fireEvent.click(viewProfileButtons[0]);
    
    // Check if onClick handler was called with correct suburb id
    expect(mockOnClick).toHaveBeenCalledWith(1);
  });
});
