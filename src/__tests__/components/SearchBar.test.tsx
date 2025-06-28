import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SearchBar } from '../../components/SearchBar';

// Mock the debounce utility
jest.mock('../../utils/helpers', () => ({
  debounce: (fn: Function, delay: number) => fn, // Remove debounce for testing
}));

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('should render correctly', () => {
    const { getByDisplayValue } = render(
      <SearchBar onSearch={mockOnSearch} placeholder="Search cities..." />
    );
    
    const searchInput = getByDisplayValue('');
    expect(searchInput).toBeDefined();
  });

  it('should call onSearch when text is entered', async () => {
    const { getByDisplayValue } = render(
      <SearchBar onSearch={mockOnSearch} />
    );
    
    const searchInput = getByDisplayValue('');
    fireEvent.changeText(searchInput, 'New York');
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('New York');
    });
  });

  it('should not call onSearch for short queries', async () => {
    const { getByDisplayValue } = render(
      <SearchBar onSearch={mockOnSearch} />
    );
    
    const searchInput = getByDisplayValue('');
    fireEvent.changeText(searchInput, 'A');
    
    await waitFor(() => {
      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  it('should call onSearch on submit', () => {
    const { getByDisplayValue } = render(
      <SearchBar onSearch={mockOnSearch} />
    );
    
    const searchInput = getByDisplayValue('');
    fireEvent.changeText(searchInput, 'Paris');
    fireEvent(searchInput, 'submitEditing');
    
    expect(mockOnSearch).toHaveBeenCalledWith('Paris');
  });

  it('should clear input when clear button is pressed', () => {
    const { getByDisplayValue, getByTestId } = render(
      <SearchBar onSearch={mockOnSearch} value="Test City" />
    );
    
    const searchInput = getByDisplayValue('Test City');
    expect(searchInput.props.value).toBe('Test City');
    
    // Simulate clear button press by changing text to empty
    fireEvent.changeText(searchInput, '');
    expect(searchInput.props.value).toBe('');
  });

  it('should handle loading state', () => {
    const { getByDisplayValue } = render(
      <SearchBar onSearch={mockOnSearch} loading={true} />
    );
    
    const searchInput = getByDisplayValue('');
    expect(searchInput).toBeDefined();
    // Note: Testing loading state visual feedback would require more complex setup
  });

  it('should handle disabled state', () => {
    const { getByDisplayValue } = render(
      <SearchBar onSearch={mockOnSearch} disabled={true} />
    );
    
    const searchInput = getByDisplayValue('');
    expect(searchInput.props.editable).toBe(false);
  });
});
