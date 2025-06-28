import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { Appbar, Text, Snackbar, ActivityIndicator, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  SearchBar,
  WeatherCard,
  ForecastList,
  LoadingSpinner,
  ErrorDisplay,
} from '../components';
import { EnhancedSearchBar } from '../components/EnhancedSearchBar';
import { EnhancedWeatherCard } from '../components/EnhancedWeatherCard';
import { EnhancedForecastList } from '../components/EnhancedForecastList';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setLoading,
  setWeatherData,
  setForecastData,
  setError,
  clearError,
} from '../store/weatherSlice';
import { WeatherService } from '../services/weatherService';
import { LocationService } from '../services/locationService';
import { StorageService } from '../services/storageService';
import { isValidCityName } from '../utils/helpers';
import { spacing } from '../theme';

interface HomeScreenProps {
  navigation: any; // Will be properly typed with navigation types
}

/**
 * Home screen displaying weather search and current weather information
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { currentWeather, forecast, isLoading, error } = useAppSelector((state) => state.weather);
  const theme = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // Load cached data on component mount
  useEffect(() => {
    loadCachedData();
  }, []);

  // Ask for location permission and load current location weather on first visit
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const cachedWeather = await StorageService.getWeatherData();
        if (!cachedWeather) {
          // First time opening the app - try to get user's location
          console.log('🎯 First time opening app - attempting to get location...');
          showSnackbar('Getting your current location...');
          
          try {
            await getCurrentLocationWeather();
          } catch (locationError) {
            console.warn('❌ Location failed:', locationError);
            // If location fails, fall back to Nashik
            showSnackbar('Location unavailable, showing weather for Nashik');
            await searchWeather('Nashik, Maharashtra, India');
          }
        } else {
          console.log('📱 Using cached weather data');
        }
      } catch (error) {
        console.error('App initialization error:', error);
        showSnackbar('Failed to load weather data');
      }
    };

    initializeApp();
  }, []);

  /**
   * Load cached weather data and last search from AsyncStorage
   */
  const loadCachedData = async () => {
    try {
      const lastSearch = await StorageService.getLastSearch();

      if (lastSearch) {
        setSearchQuery(lastSearch);
      }
      
      // Don't load cached weather data automatically to always show fresh data
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  /**
   * Search for weather data for a specific city
   */
  const searchWeather = async (cityName: string) => {
    if (!isValidCityName(cityName)) {
      showSnackbar('Please enter a valid city name');
      return;
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      // Fetch current weather and forecast in parallel
      const [weatherData, forecastData] = await Promise.all([
        WeatherService.getCurrentWeather(cityName),
        WeatherService.getForecast(cityName),
      ]);

      // Update Redux state
      dispatch(setWeatherData(weatherData));
      dispatch(setForecastData(forecastData));

      // Cache the data for offline use
      await Promise.all([
        StorageService.saveWeatherData(weatherData),
        StorageService.saveLastSearch(cityName),
      ]);

      showSnackbar(`Weather updated for ${weatherData.name}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
      dispatch(setError(errorMessage));
      showSnackbar('Failed to fetch weather data');
    }
  };

  /**
   * Get weather for current location
   */
  const getCurrentLocationWeather = async () => {
    setIsLocationLoading(true);
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      console.log('🌍 Requesting device location...');
      showSnackbar('Getting your location...');
      
      const coords = await LocationService.getCurrentLocationWithPermission();
      console.log('📍 Location obtained:', coords);
      
      showSnackbar('Fetching weather data...');
      
      // Fetch current weather and forecast in parallel
      const [weatherData, forecastData] = await Promise.all([
        WeatherService.getCurrentWeatherByCoords(coords),
        WeatherService.getForecastByCoords(coords),
      ]);

      // Update Redux state
      dispatch(setWeatherData(weatherData));
      dispatch(setForecastData(forecastData));

      // Cache the data for offline use
      await StorageService.saveWeatherData(weatherData);
      
      console.log('✅ Weather loaded successfully for location:', weatherData.name);
      showSnackbar(`Weather loaded for ${weatherData.name}, ${weatherData.country}`);
      
    } catch (error) {
      console.error('❌ Location weather error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location weather';
      
      // Handle specific error types
      if (errorMessage.includes('permission denied') || errorMessage.includes('Location permission denied')) {
        showSnackbar('Location permission denied. Enable location access for accurate weather.');
        dispatch(setError('Location permission denied. Please enable location access in your device settings to get weather for your current location.'));
      } else if (errorMessage.includes('not available') || errorMessage.includes('POSITION_UNAVAILABLE')) {
        showSnackbar('Location unavailable. Please enable GPS and try again.');
        dispatch(setError('Location services unavailable. Please ensure GPS is enabled and try again.'));
      } else if (errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT')) {
        showSnackbar('Location request timed out. Please try again.');
        dispatch(setError('Location request timed out. Please try again or check your GPS signal.'));
      } else {
        dispatch(setError(errorMessage));
        showSnackbar('Failed to get location. Please try again.');
      }
      
      // Re-throw the error so the caller can handle fallback
      throw error;
    } finally {
      setIsLocationLoading(false);
      dispatch(setLoading(false));
    }
  };

  /**
   * Refresh current weather data
   */
  const refreshWeather = async () => {
    setRefreshing(true);
    try {
      if (currentWeather) {
        // Try to refresh with current location first, fallback to city name
        try {
          await getCurrentLocationWeather();
        } catch (locationError) {
          // If location fails, use the current weather city name
          await searchWeather(currentWeather.name);
        }
      } else {
        // No current weather, try location
        await getCurrentLocationWeather();
      }
    } catch (error) {
      showSnackbar('Failed to refresh weather data');
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Show snackbar message
   */
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  /**
   * Navigate to settings screen
   */
  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  /**
   * Retry after error
   */
  const handleRetry = () => {
    if (searchQuery) {
      searchWeather(searchQuery);
    } else {
      showSnackbar('Please search for a city');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    appBarWrapper: {
      backgroundColor: theme.colors.primary,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      elevation: 8,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    appBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      paddingTop: 20,
      height: 80,
    },
    appBarTitle: {
      color: theme.colors.onPrimary,
      fontSize: 24,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    appBarActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: `${theme.colors.onPrimary}15`, // 15% opacity
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: `${theme.colors.onPrimary}30`, // 30% opacity
      zIndex: 10,
      position: 'relative',
    },
    iconButtonWithText: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: `${theme.colors.onPrimary}20`, // 20% opacity
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: `${theme.colors.onPrimary}40`, // 40% opacity
      minWidth: 60,
    },
    iconText: {
      color: theme.colors.onPrimary,
      fontSize: 10,
      fontWeight: 'bold',
      marginTop: 2,
      textAlign: 'center',
    },
    textButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: `${theme.colors.onPrimary}25`, // 25% opacity
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: `${theme.colors.onPrimary}50`, // 50% opacity
      minWidth: 65,
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    content: {
      flex: 1,
      paddingTop: 16,
    },
    forecastSection: {
      marginTop: spacing.md,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
      marginTop: spacing.xxl,
    },
    emptyTitle: {
      textAlign: 'center',
      marginBottom: spacing.md,
      fontWeight: 'bold',
      color: theme.colors.onBackground,
      fontSize: 24,
    },
    emptyMessage: {
      textAlign: 'center',
      opacity: 0.7,
      lineHeight: 24,
      marginBottom: spacing.xl,
      color: theme.colors.onSurfaceVariant,
      fontSize: 16,
    },
    emptyActions: {
      alignItems: 'center',
    },
    locationButton: {
      backgroundColor: theme.colors.primary,
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      borderWidth: 2,
      borderColor: `${theme.colors.onPrimary}20`, // 20% opacity
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Clean Single App Bar */}
      <View style={styles.appBarWrapper}>
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>Weather App</Text>
          <View style={styles.appBarActions}>
            {isLocationLoading ? (
              <View style={styles.textButton}>
                <ActivityIndicator size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>GPS</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.textButton}
                onPress={getCurrentLocationWeather}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>📍 GPS</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.textButton}
              onPress={navigateToSettings}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>⚙️ SET</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshWeather}
            enabled={!!currentWeather}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <EnhancedSearchBar
          onSearch={searchWeather}
          placeholder="Search for a city..."
          loading={isLoading}
        />

        {/* Loading State */}
        {isLoading && !currentWeather && (
          <LoadingSpinner text="Fetching weather data..." />
        )}

        {/* Error State */}
        {error && !isLoading && !currentWeather && (
          <ErrorDisplay
            error={error}
            onRetry={handleRetry}
          />
        )}

        {/* Weather Content */}
        {currentWeather && !isLoading && (
          <>
            <EnhancedWeatherCard weather={currentWeather} />
            
            {forecast.length > 0 && (
              <View style={styles.forecastSection}>
                <EnhancedForecastList forecast={forecast} />
              </View>
            )}
          </>
        )}

        {/* Empty State */}
        {!currentWeather && !isLoading && !error && (
          <View style={styles.emptyState}>
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              Welcome to Weather App
            </Text>
            <Text variant="bodyLarge" style={styles.emptyMessage}>
              Enable location access to see weather for your current area, or search for any city
            </Text>
            <View style={styles.emptyActions}>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={getCurrentLocationWeather}
                activeOpacity={0.7}
              >
                <Icon name="my-location" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

export default HomeScreen;