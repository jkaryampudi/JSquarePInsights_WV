import React from 'react';
import { render, screen } from '@testing-library/react';
import SuburbCard from '../components/SuburbCard';

// Mock suburb data
const mockSuburb = {
  id: 1,
  name: 'Test Suburb',
  location: 'Sydney, NSW',
  image: '/images/suburb-1.jpg',
  rating: 8.5,
  medianPrice: 1200000,
  rentalYield: 3.7,
  highlights: [
    'Strong infrastructure development',
    'Family-friendly community',
    'Close to amenities'
  ]
};

describe('SuburbCard Component', () => {
  test('renders suburb card with correct styling', () => {
    render(<SuburbCard suburb={mockSuburb} />);
    
    // Check if the card is rendered with the correct class
    const card = screen.getByTestId('suburb-card');
    expect(card).toBeInTheDocument();
    
    // Verify the card has the correct styling (min-height instead of fixed height)
    const cardStyles = window.getComputedStyle(card);
    expect(cardStyles.minHeight).toBe('500px');
    
    // Ensure the card uses flex layout to allow content to expand
    expect(cardStyles.display).toBe('flex');
    expect(cardStyles.flexDirection).toBe('column');
  });

  test('renders suburb profile button fully visible', () => {
    render(<SuburbCard suburb={mockSuburb} />);
    
    // Check if the button is rendered
    const button = screen.getByText('View Suburb Profile');
    expect(button).toBeInTheDocument();
    
    // Verify the button is fully visible (not cut off)
    const buttonRect = button.getBoundingClientRect();
    const cardRect = screen.getByTestId('suburb-card').getBoundingClientRect();
    
    // Button should be fully contained within the card
    expect(buttonRect.bottom).toBeLessThanOrEqual(cardRect.bottom);
  });

  test('renders suburb content correctly', () => {
    render(<SuburbCard suburb={mockSuburb} />);
    
    // Check if suburb name is rendered
    expect(screen.getByText('Test Suburb')).toBeInTheDocument();
    
    // Check if suburb location is rendered
    expect(screen.getByText('Sydney, NSW')).toBeInTheDocument();
    
    // Check if suburb rating is rendered
    expect(screen.getByText('8.5')).toBeInTheDocument();
    
    // Check if median price is rendered
    expect(screen.getByText('$1,200,000')).toBeInTheDocument();
    
    // Check if rental yield is rendered
    expect(screen.getByText('3.7%')).toBeInTheDocument();
    
    // Check if highlights are rendered
    expect(screen.getByText('Strong infrastructure development')).toBeInTheDocument();
    expect(screen.getByText('Family-friendly community')).toBeInTheDocument();
    expect(screen.getByText('Close to amenities')).toBeInTheDocument();
  });
});
