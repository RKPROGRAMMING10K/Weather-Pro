import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { WeatherCard } from '../../components/WeatherCard';
import weatherReducer from '../../store/weatherSlice';
import settingsReducer from '../../store/settingsSlice';
import { WeatherData, WeatherState, SettingsState } from '../../types/weather';

const mockWeatherData: WeatherData = {
  id: 1,
  name: 'Test City',
  country: 'TC',
  temperature: 25,
  description: 'partly cloudy',
  icon: '02d',
  humidity: 60,
  windSpeed: 5.5,
  pressure: 1013,
  feelsLike: 27,
  visibility: 10,
  uvIndex: 5,
  timestamp: 1234567890,
};

const mockWeatherState: WeatherState = {
  currentWeather: null,
  forecast: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const mockSettingsState: SettingsState = {
  temperatureUnit: 'celsius' as const,
  theme: 'auto' as const,
};

const mockStore = configureStore({
  reducer: {
    weather: weatherReducer,
    settings: settingsReducer,
  },
  preloadedState: {
    weather: mockWeatherState,
    settings: mockSettingsState,
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ReduxProvider store={mockStore}>
      <PaperProvider>
        {component}
      </PaperProvider>
    </ReduxProvider>
  );
};

describe('WeatherCard Component', () => {
  it('should render weather data correctly', () => {
    const { getByText } = renderWithProviders(
      <WeatherCard weather={mockWeatherData} />
    );
    
    expect(getByText('Test City, TC')).toBeDefined();
    expect(getByText('25°C')).toBeDefined();
    expect(getByText('Partly cloudy')).toBeDefined();
    expect(getByText('Feels like 27°C')).toBeDefined();
  });

  it('should display weather details when showDetails is true', () => {
    const { getByText } = renderWithProviders(
      <WeatherCard weather={mockWeatherData} showDetails={true} />
    );
    
    expect(getByText('60%')).toBeDefined(); // Humidity
    expect(getByText('5.5 m/s')).toBeDefined(); // Wind speed
    expect(getByText('1013 hPa')).toBeDefined(); // Pressure
    expect(getByText('10 km')).toBeDefined(); // Visibility
  });

  it('should hide weather details when showDetails is false', () => {
    const { queryByText } = renderWithProviders(
      <WeatherCard weather={mockWeatherData} showDetails={false} />
    );
    
    expect(queryByText('60%')).toBeNull(); // Humidity should not be visible
    expect(queryByText('5.5 m/s')).toBeNull(); // Wind speed should not be visible
  });

  it('should show UV index when available', () => {
    const { getByText } = renderWithProviders(
      <WeatherCard weather={mockWeatherData} showDetails={true} />
    );
    
    expect(getByText('5')).toBeDefined(); // UV Index
  });

  it('should capitalize description correctly', () => {
    const weatherWithLowercaseDescription = {
      ...mockWeatherData,
      description: 'sunny skies',
    };
    
    const { getByText } = renderWithProviders(
      <WeatherCard weather={weatherWithLowercaseDescription} />
    );
    
    expect(getByText('Sunny skies')).toBeDefined();
  });
});
