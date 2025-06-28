import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, IconButton } from 'react-native-paper';
import { debounce } from '../utils/helpers';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * Reusable search bar component with debounced search functionality
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search for a city...',
  value = '',
  loading = false,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState(value);

  // Debounced search to prevent excessive API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length >= 2) {
        onSearch(query.trim());
      }
    }, 500),
    [onSearch]
  );

  const handleChangeText = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleSubmit = () => {
    if (searchQuery.trim().length >= 2) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        value={searchQuery}
        loading={loading}
        style={styles.searchbar}
        inputStyle={styles.input}
        icon="magnify"
        clearIcon="close"
        onClearIconPress={handleClear}
        elevation={2}
        editable={!disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchbar: {
    borderRadius: 12,
    elevation: 2,
  },
  input: {
    fontSize: 16,
  },
});
