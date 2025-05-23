import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterSection from '../components/FilterSection';

describe('FilterSection Component', () => {
  // Basic functionality tests
  test('renders basic filter options', () => {
    render(<FilterSection />);
    
    // Check strategy options
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Cashflow')).toBeInTheDocument();
    expect(screen.getByText('Growth')).toBeInTheDocument();
    expect(screen.getByText('Balanced')).toBeInTheDocument();
    
    // Check property type options
    expect(screen.getByText('House')).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
    expect(screen.getByText('Townhouse')).toBeInTheDocument();
    
    // Check rental yield options
    const rentalYieldOptions = screen.getAllByText('Any');
    expect(rentalYieldOptions.length).toBeGreaterThan(0);
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('Apply Filters')).toBeInTheDocument();
  });
  
  test('toggles advanced filters', () => {
    render(<FilterSection />);
    
    // Advanced filters should be hidden initially
    expect(screen.queryByText('Bedrooms')).not.toBeInTheDocument();
    
    // Click to show advanced filters
    fireEvent.click(screen.getByText('Advanced Filters'));
    
    // Advanced filters should now be visible
    expect(screen.getByText('Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Bathrooms')).toBeInTheDocument();
    expect(screen.getByText('Parking')).toBeInTheDocument();
    expect(screen.getByText('Land Size')).toBeInTheDocument();
    expect(screen.getByText('Built After')).toBeInTheDocument();
    expect(screen.getByText('Capital Growth %')).toBeInTheDocument();
    expect(screen.getByText('Weekly Cashflow')).toBeInTheDocument();
    expect(screen.getByText('Suburbs')).toBeInTheDocument();
    expect(screen.getByText('Sort By')).toBeInTheDocument();
    
    // Click to hide advanced filters
    fireEvent.click(screen.getByText('Basic Filters'));
    
    // Advanced filters should be hidden again
    expect(screen.queryByText('Bedrooms')).not.toBeInTheDocument();
  });
  
  // Strategy filter tests
  test('selects strategy options', () => {
    render(<FilterSection />);
    
    // Click on Cashflow strategy
    fireEvent.click(screen.getByText('Cashflow'));
    
    // Cashflow should be active
    const cashflowButton = screen.getByText('Cashflow').closest('button');
    expect(cashflowButton).toHaveClass('active');
    
    // Click on Growth strategy
    fireEvent.click(screen.getByText('Growth'));
    
    // Growth should be active, Cashflow should not
    const growthButton = screen.getByText('Growth').closest('button');
    expect(growthButton).toHaveClass('active');
    expect(cashflowButton).not.toHaveClass('active');
  });
  
  // Property type filter tests
  test('selects multiple property types', () => {
    render(<FilterSection />);
    
    // Click on House
    fireEvent.click(screen.getByText('House'));
    
    // House should be active
    const houseButton = screen.getByText('House').closest('button');
    expect(houseButton).toHaveClass('active');
    
    // Click on Apartment
    fireEvent.click(screen.getByText('Apartment'));
    
    // Both House and Apartment should be active
    const apartmentButton = screen.getByText('Apartment').closest('button');
    expect(houseButton).toHaveClass('active');
    expect(apartmentButton).toHaveClass('active');
    
    // Click on House again to deselect
    fireEvent.click(screen.getByText('House'));
    
    // House should not be active, Apartment should still be active
    expect(houseButton).not.toHaveClass('active');
    expect(apartmentButton).toHaveClass('active');
  });
  
  // Rental yield filter tests
  test('selects rental yield options', () => {
    render(<FilterSection />);
    
    // Find the rental yield section
    const rentalYieldSection = screen.getByText('Rental Yield %').closest('.filter-group');
    
    // Click on Low
    const lowButton = rentalYieldSection.querySelector('button:nth-child(2)');
    fireEvent.click(lowButton);
    
    // Low should be active
    expect(lowButton).toHaveClass('active');
    
    // Click on High
    const highButton = rentalYieldSection.querySelector('button:nth-child(3)');
    fireEvent.click(highButton);
    
    // High should be active, Low should not
    expect(highButton).toHaveClass('active');
    expect(lowButton).not.toHaveClass('active');
  });
  
  // Reset button test
  test('reset button clears all filters', () => {
    render(<FilterSection />);
    
    // Set some filters
    fireEvent.click(screen.getByText('Cashflow'));
    fireEvent.click(screen.getByText('House'));
    fireEvent.click(screen.getByText('Low'));
    
    // Click reset button
    fireEvent.click(screen.getByText('Reset'));
    
    // All filters should be reset
    const cashflowButton = screen.getByText('Cashflow').closest('button');
    const houseButton = screen.getByText('House').closest('button');
    const rentalYieldSection = screen.getByText('Rental Yield %').closest('.filter-group');
    const lowButton = rentalYieldSection.querySelector('button:nth-child(2)');
    
    expect(cashflowButton).not.toHaveClass('active');
    expect(houseButton).not.toHaveClass('active');
    expect(lowButton).not.toHaveClass('active');
    
    // All should be active
    const allButton = screen.getByText('All').closest('button');
    expect(allButton).toHaveClass('active');
    
    // Any should be active for rental yield
    const anyButton = rentalYieldSection.querySelector('button:nth-child(1)');
    expect(anyButton).toHaveClass('active');
  });
  
  // Advanced filter tests
  test('selects bedroom options', async () => {
    render(<FilterSection />);
    
    // Show advanced filters
    fireEvent.click(screen.getByText('Advanced Filters'));
    
    // Wait for advanced filters to appear
    await waitFor(() => {
      expect(screen.getByText('Bedrooms')).toBeInTheDocument();
    });
    
    // Click on 3+ bedrooms
    const bedroomsSection = screen.getByText('Bedrooms').closest('.filter-group');
    const threeBedsButton = bedroomsSection.querySelector('button:nth-child(4)');
    fireEvent.click(threeBedsButton);
    
    // 3+ should be active
    expect(threeBedsButton).toHaveClass('active');
    
    // Click on 4+ bedrooms
    const fourBedsButton = bedroomsSection.querySelector('button:nth-child(5)');
    fireEvent.click(fourBedsButton);
    
    // 4+ should be active, 3+ should not
    expect(fourBedsButton).toHaveClass('active');
    expect(threeBedsButton).not.toHaveClass('active');
  });
  
  test('selects bathroom options', async () => {
    render(<FilterSection />);
    
    // Show advanced filters
    fireEvent.click(screen.getByText('Advanced Filters'));
    
    // Wait for advanced filters to appear
    await waitFor(() => {
      expect(screen.getByText('Bathrooms')).toBeInTheDocument();
    });
    
    // Click on 2+ bathrooms
    const bathroomsSection = screen.getByText('Bathrooms').closest('.filter-group');
    const twoBathsButton = bathroomsSection.querySelector('button:nth-child(3)');
    fireEvent.click(twoBathsButton);
    
    // 2+ should be active
    expect(twoBathsButton).toHaveClass('active');
  });
  
  test('selects parking options', async () => {
    render(<FilterSection />);
    
    // Show advanced filters
    fireEvent.click(screen.getByText('Advanced Filters'));
    
    // Wait for advanced filters to appear
    await waitFor(() => {
      expect(screen.getByText('Parking')).toBeInTheDocument();
    });
    
    // Click on 2+ parking
    const parkingSection = screen.getByText('Parking').closest('.filter-group');
    const twoParkingButton = parkingSection.querySelector('button:nth-child(3)');
    fireEvent.click(twoParkingButton);
    
    // 2+ should be active
    expect(twoParkingButton).toHaveClass('active');
  });
  
  test('adjusts land size range', async () => {
    render(<FilterSection />);
    
    // Show advanced filters
    fireEvent.click(screen.getByText('Advanced Filters'));
    
    // Wait for advanced filters to appear
    await waitFor(() => {
      expect(screen.getByText('Land Size')).toBeInTheDocument();
    });
    
    // Find land size sliders
    const landSizeSection = screen.getByText('Land Size').closest('.filter-group');
    const minSlider = landSizeSection.querySelector('.min-slider');
    const maxSlider = landSizeSection.querySelector('.max-slider');
    
    // Change min slider value
    fireEvent.change(minSlider, { target: { value: 200 } });
    
    // Change max slider value
    fireEvent.change(maxSlider, { target: { value: 1500 } });
    
    // Check if values are updated in the UI
    expect(landSizeSection.textContent).toContain('200m²');
    expect(landSizeSection.textContent).toContain('1500m²');
  });
  
  test('adjusts built after year', async () => {
    render(<FilterSection />);
    
    // Show advanced filters
    fireEvent.click(screen.getByText('Advanced Filters'));
    
    // Wait for advanced filters to appear
    await waitFor(() => {
      expect(screen.getByText('Built After')).toBeInTheDocument();
    });
    
    // Find built after slider
    const builtAfterSection = screen.getByText('Built After').closest('.filter-group');
    const slider = builtAfterSection.querySelector('.range-slider');
    
    // Change slider value
    fireEvent.change(slider, { target: { value: 1980 } });
    
    // Check if value is updated in the UI
    expect(builtAfterSection.textContent).toContain('1980');
  });
  
  test('adjusts capital growth range', async () => {
    render(<FilterSection />);
    
    // Show advanced filters
    fireEvent.click(screen.getByText('Advanced Filters'));
    
    // Wait for advanced filters to appear
    await waitFor(() => {
      expect(screen.getByText('Capital Growth %')).toBeInTheDocument();
    });
    
    // Find capital growth sliders
    const capitalGrowthSection = screen.getByText('Capital Growth %').closest('.filter-group');
    const minSlider = capitalGrowthSection.querySelector('.min-slider');
    const maxSlider = capitalGrowthSection.querySelector('.max-slider');
    
    // Change min slider value
    fireEvent.change(minSlider, { target: { value: 3 } });
    
    // Change max slider value
    fireEvent.change(maxSlider, { target: { value: 10 } });
    
    // Check if values are updated in the UI
    expect(capitalGrowthSection.textContent).toContain('3%');
    expect(capitalGrowthSection.textContent).toContain('10%');
  });
  
  test('selects weekly cashflow options', async () => {
    render(<FilterSection />);
    
    // Show advanced filters
    fireEvent.click(screen.getByText('Advanced Filters'));
    
    // Wait for advanced filters to appear
    await waitFor(() => {
      expect(screen.getByText('Weekly Cashflow')).toBeInTheDocument();
    });
    
    // Click on Positive cashflow
    const cashflowSection = screen.getByText('Weekly Cashflow').closest('.filter-group');
    const positiveButton = cashflowSection.querySelector('button:nth-child(2)');
    fireEvent.click(positiveButton);
    
    // Positive should be active
    expect(positiveButton).toHaveClass('active');
    
    // Click on Neutral cashflow
    const neutralButton = cashflowSection.querySelector('button:nth-child(3)');
    fireEvent.click(neutralButton);
    
    // Neutral should be active, Positive should not
    expect(neutralButton).toHaveClass('active');
    expect(positiveButton).not.toHaveClass('active');
  });
  
  test('searches and selects suburbs', async () => {
    render(<FilterSection />);
    
    // Show advanced filters
    fireEvent.click(screen.getByText('Advanced Filters'));
    
    // Wait for advanced filters to appear
    await waitFor(() => {
      expect(screen.getByText('Suburbs')).toBeInTheDocument();
    });
    
    // Find suburb search input
    const suburbsSection = screen.getByText('Suburbs').closest('.filter-group');
    const searchInput = suburbsSection.querySelector('input');
    
    // Type in search
    fireEvent.change(searchInput, { target: { value: 'Syd' } });
    
    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('Sydney')).toBeInTheDocument();
    });
    
    // Click on Sydney
    fireEvent.click(screen.getByText('Sydney'));
    
    // Sydney should be added to selected suburbs
    expect(screen.getByText('Sydney')).toBeInTheDocument();
    
    // Search input should be cleared
    expect(searchInput.value).toBe('');
    
    // Type another search
    fireEvent.change(searchInput, { target: { value: 'Mel' } });
    
    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('Melbourne')).toBeInTheDocument();
    });
    
    // Click on Melbourne
    fireEvent.click(screen.getByText('Melbourne'));
    
    // Both Sydney and Melbourne should be in selected suburbs
    const selectedSuburbs = screen.getAllByText(/Sydney|Melbourne/);
    expect(selectedSuburbs.length).toBe(2);
    
    // Remove Sydney
    const removeButtons = suburbsSection.querySelectorAll('.remove-suburb');
    fireEvent.click(removeButtons[0]);
    
    // Sydney should be removed, Melbourne should remain
    expect(screen.queryByText('Sydney')).not.toBeInTheDocument();
    expect(screen.getByText('Melbourne')).toBeInTheDocument();
  });
  
  test('changes sort option', async () => {
    render(<FilterSection />);
    
    // Show advanced filters
    fireEvent.click(screen.getByText('Advanced Filters'));
    
    // Wait for advanced filters to appear
    await waitFor(() => {
      expect(screen.getByText('Sort By')).toBeInTheDocument();
    });
    
    // Find sort select
    const sortSection = screen.getByText('Sort By').closest('.filter-group');
    const sortSelect = sortSection.querySelector('select');
    
    // Change sort option
    fireEvent.change(sortSelect, { target: { value: 'price_low' } });
    
    // Check if value is updated
    expect(sortSelect.value).toBe('price_low');
    
    // Change to another option
    fireEvent.change(sortSelect, { target: { value: 'yield_high' } });
    
    // Check if value is updated
    expect(sortSelect.value).toBe('yield_high');
  });
  
  test('displays active filters', async () => {
    render(<FilterSection />);
    
    // Show advanced filters
    fireEvent.click(screen.getByText('Advanced Filters'));
    
    // Wait for advanced filters to appear
    await waitFor(() => {
      expect(screen.getByText('Bedrooms')).toBeInTheDocument();
    });
    
    // Set some filters
    fireEvent.click(screen.getByText('Cashflow'));
    fireEvent.click(screen.getByText('House'));
    
    // Find bedrooms section and click 3+
    const bedroomsSection = screen.getByText('Bedrooms').closest('.filter-group');
    const threeBedsButton = bedroomsSection.querySelector('button:nth-child(4)');
    fireEvent.click(threeBedsButton);
    
    // Active filters should show these selections
    await waitFor(() => {
      expect(screen.getByText('Active Filters:')).toBeInTheDocument();
    });
    
    const activeFilters = screen.getByText('Active Filters:').closest('.active-filters');
    
    expect(activeFilters.textContent).toContain('Strategy: cashflow');
    expect(activeFilters.textContent).toContain('Property Types: house');
    expect(activeFilters.textContent).toContain('Bedrooms: 3+');
    
    // Remove a filter
    const removeButtons = activeFilters.querySelectorAll('.remove-filter');
    fireEvent.click(removeButtons[0]);
    
    // Strategy filter should be removed
    expect(activeFilters.textContent).not.toContain('Strategy: cashflow');
    expect(activeFilters.textContent).toContain('Property Types: house');
  });
});
