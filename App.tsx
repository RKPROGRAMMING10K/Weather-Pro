/**
 * Weather App
 * A comprehensive React Native weather application
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { store, useAppSelector } from './src/store';
import { AppNavigator } from './src/navigation';
import { StorageService } from './src/services/storageService';
import { setTemperatureUnit, setTheme } from './src/store/settingsSlice';
import { lightTheme, darkTheme } from './src/theme';

/**
 * App component wrapper with theme provider
 */
const AppContent: React.FC = () => {
  const systemColorScheme = useColorScheme();
  const { theme: userTheme } = useAppSelector((state) => state.settings);
  
  // Determine the actual theme to use
  const isDarkMode = userTheme === 'auto' 
    ? systemColorScheme === 'dark'
    : userTheme === 'dark';
  
  const paperTheme = isDarkMode ? darkTheme : lightTheme;

  // Load saved settings on app start
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await StorageService.getSettings();
      if (savedSettings) {
        store.dispatch(setTemperatureUnit(savedSettings.temperatureUnit));
        store.dispatch(setTheme(savedSettings.theme));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={paperTheme.colors.surface}
      />
      <AppNavigator />
    </PaperProvider>
  );
};

/**
 * Main App component with Redux provider
 */
function App() {
  return (
    <ReduxProvider store={store}>
      <AppContent />
    </ReduxProvider>
  );
}

export default App;
