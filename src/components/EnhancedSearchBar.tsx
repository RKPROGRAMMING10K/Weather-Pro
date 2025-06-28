import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { spacing, elevation } from '../theme';

interface EnhancedSearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
  initialValue?: string;
}

export const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  onSearch,
  loading = false,
  placeholder = 'Search for a city...',
  initialValue = '',
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const styles = StyleSheet.create({
    container: {
      margin: spacing.md,
      marginBottom: spacing.lg,
    },
    searchbar: {
      borderRadius: 28,
      ...elevation.level3,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.outline,
    },
    searchbarFocused: {
      borderColor: theme.colors.primary,
      ...elevation.level4,
    },
  });

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        onSearch(searchQuery.trim());
      }, 500); // 500ms debounce
      setDebounceTimer(timer);
    }

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      onSearch(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        onClearIconPress={handleClear}
        loading={loading}
        style={[
          styles.searchbar,
          searchQuery ? styles.searchbarFocused : null,
        ]}
        inputStyle={{
          fontSize: 16,
          fontWeight: '500',
        }}
        icon={() => (
          <Icon 
            name="search" 
            size={24} 
            color={theme.colors.onSurfaceVariant} 
          />
        )}
        clearIcon={() => (
          <Icon 
            name="clear" 
            size={24} 
            color={theme.colors.onSurfaceVariant} 
          />
        )}
        traileringIcon={() => 
          loading ? undefined : (
            <Icon 
              name="location-on" 
              size={24} 
              color={theme.colors.primary} 
            />
          )
        }
        elevation={3}
      />
    </View>
  );
};

export default EnhancedSearchBar;
