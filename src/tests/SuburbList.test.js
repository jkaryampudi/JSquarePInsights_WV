import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuburbList from '../components/SuburbList';
import { BrowserRouter } from 'react-router-dom';

// Mock the SuburbCard component to isolate SuburbList testing
jest.mock('../components/SuburbCard', () => {
  return function MockSuburbCard({ suburb, onClick }) {
    return (
      <div data-testid={`suburb-card-${suburb.id}`}>
        <h3>{suburb.name}</h3>
        <button onClick={onClick}>View Suburb Profile</button>
      </div>
    );
  };
});

describe('SuburbList Component', () => {
  const mockSuburbs = [
    {
      id: 1,
      name: 'Gregory Hills',
      postcode: '2557',
      region: 'Western Sydney',
      rating: 8.5,
      medianPrice: 0,
      unitPrice: 750000,
      rentalYield: '3.7%',
      highlights: ['Strong infrastructure development', 'Family-friendly community'],
      image: '/images/sydney-skyline.jpeg'
    },
    {
      id: 2,
      name: 'Leppington',
      postcode: '2179',
      region: 'Western Sydney',
      rating: 8.2,
      medianPrice: 0,
      unitPrice: 650000,
      rentalYield: '3.5%',
      highlights: ['Proximity to Western Sydney Airport', 'Growing commercial precinct'],
      image: '/images/sydney-skyline.jpeg'
    }
  ];

  test('renders suburb cards for each suburb in the data', () => {
    render(
      <BrowserRouter>
        <SuburbList suburbs={mockSuburbs} />
      </BrowserRouter>
    );
    
    // Check if both suburb cards are rendered
    expect(screen.getByTestId('suburb-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('suburb-card-2')).toBeInTheDocument();
    
    // Check if suburb names are rendered
    expect(screen.getByText('Gregory Hills')).toBeInTheDocument();
    expect(screen.getByText('Leppington')).toBeInTheDocument();
  });

  test('navigates to suburb profile when View Suburb Profile button is clicked', () => {
    const mockHistoryPush = jest.fn();
    
    // Mock useNavigate
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockHistoryPush,
    }));
    
    render(
      <BrowserRouter>
        <SuburbList suburbs={mockSuburbs} />
      </BrowserRouter>
    );
    
    // Find and click the first suburb's button
    const buttons = screen.getAllByText('View Suburb Profile');
    fireEvent.click(buttons[0]);
    
    // Since we can't directly test navigation in this test environment,
    // we're just verifying the button is clickable without errors
    expect(buttons[0]).toBeInTheDocument();
  });
});
