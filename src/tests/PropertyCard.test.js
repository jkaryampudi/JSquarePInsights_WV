import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyCard from '../components/PropertyCard';

describe('PropertyCard Component', () => {
  const mockProperty = {
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
  };

  const mockOnClick = jest.fn();

  test('renders property card with all required elements matching reference design', () => {
    render(<PropertyCard property={mockProperty} onClick={mockOnClick} />);
    
    // Check if property title is rendered
    expect(screen.getByText('Luxury Waterfront Apartment')).toBeInTheDocument();
    
    // Check if address is rendered
    expect(screen.getByText('8/22 Harbour Street, Wollongong, NSW 2500')).toBeInTheDocument();
    
    // Check if property specs are rendered with correct values
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Both baths and parking are 2
    expect(screen.getByText('150m²')).toBeInTheDocument();
    
    // Check if metrics are rendered with correct values
    expect(screen.getByText('2.5%')).toBeInTheDocument();
    expect(screen.getByText('6.8%')).toBeInTheDocument();
    expect(screen.getByText('$-65')).toBeInTheDocument();
    
    // Check if agent info is rendered
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Listed 15 Feb 2025')).toBeInTheDocument();
    
    // Check if price is rendered
    expect(screen.getByText('$1,500,000')).toBeInTheDocument();
    
    // Check if View Details button is rendered
    expect(screen.getByText(/View Details/i)).toBeInTheDocument();
  });

  test('renders image with correct attributes', () => {
    render(<PropertyCard property={mockProperty} onClick={mockOnClick} />);
    
    // Check if image is rendered with correct src and alt
    const image = screen.getByAltText('Luxury Waterfront Apartment');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/property-1.jpg');
  });

  test('handles image loading error with fallback', () => {
    render(<PropertyCard property={mockProperty} onClick={mockOnClick} />);
    
    // Find the image
    const image = screen.getByAltText('Luxury Waterfront Apartment');
    
    // Simulate an error loading the image
    fireEvent.error(image);
    
    // Check if fallback image is used
    expect(image).toHaveAttribute('src', '/images/property-1.jpg');
  });

  test('calls onClick handler when View Details button is clicked', () => {
    render(<PropertyCard property={mockProperty} onClick={mockOnClick} />);
    
    // Find and click the button
    const button = screen.getByText(/View Details/i);
    fireEvent.click(button);
    
    // Check if onClick handler was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
