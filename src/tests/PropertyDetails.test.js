import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertyDetails from '../components/PropertyDetails';

// Mock property data
const mockProperty = {
  id: 1,
  title: 'Test Property',
  address: '123 Test Street, Test Suburb',
  price: 1000000,
  coordinates: { lat: -33.865143, lng: 151.209900 },
  image: '/images/property-1.jpg',
  beds: 3,
  baths: 2,
  parking: 1,
  area: 150,
  type: 'House',
  features: ['Air Conditioning', 'Pool', 'Garden']
};

describe('PropertyDetails Component', () => {
  test('renders property details overlay with correct styling', () => {
    render(<PropertyDetails property={mockProperty} onClose={() => {}} />);
    
    // Check if the overlay is rendered with the correct class
    const overlay = screen.getByTestId('property-details-overlay');
    expect(overlay).toBeInTheDocument();
    
    // Verify the overlay has the correct styling
    const overlayStyles = window.getComputedStyle(overlay);
    expect(overlayStyles.backgroundColor).toBe('rgba(255, 255, 255, 0.98)');
    expect(overlayStyles.zIndex).toBe('1000');
    expect(overlayStyles.position).toBe('fixed');
    
    // Check if the container is rendered with the correct class
    const container = screen.getByTestId('property-details-container');
    expect(container).toBeInTheDocument();
    
    // Verify the container has the correct styling
    const containerStyles = window.getComputedStyle(container);
    expect(containerStyles.backgroundColor).toBe('rgba(255, 255, 255, 0.98)');
    expect(containerStyles.zIndex).toBe('1001');
  });

  test('renders property details content correctly', () => {
    render(<PropertyDetails property={mockProperty} onClose={() => {}} />);
    
    // Check if property title is rendered
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    
    // Check if property address is rendered
    expect(screen.getByText('123 Test Street, Test Suburb')).toBeInTheDocument();
    
    // Check if property price is rendered
    expect(screen.getByText('$1,000,000')).toBeInTheDocument();
    
    // Check if property specs are rendered
    expect(screen.getByText('3')).toBeInTheDocument(); // Beds
    expect(screen.getByText('2')).toBeInTheDocument(); // Baths
    expect(screen.getByText('1')).toBeInTheDocument(); // Parking
  });

  test('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<PropertyDetails property={mockProperty} onClose={mockOnClose} />);
    
    // Find and click the close button
    const closeButton = screen.getByTestId('close-button');
    closeButton.click();
    
    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
