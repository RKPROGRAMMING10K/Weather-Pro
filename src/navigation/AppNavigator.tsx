import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { useAppSelector } from '../store';
import { HomeScreen, SettingsScreen } from '../screens';
import { RootStackParamList } from '../types/navigation';
import { lightTheme, darkTheme } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main navigation component for the app
 */
export const AppNavigator: React.FC = () => {
  const systemColorScheme = useColorScheme();
  const { theme: userTheme } = useAppSelector((state) => state.settings);
  
  // Determine the actual theme to use
  const isDarkMode = userTheme === 'auto' 
    ? systemColorScheme === 'dark'
    : userTheme === 'dark';
  
  const navigationTheme = {
    dark: isDarkMode,
    colors: isDarkMode ? {
      primary: darkTheme.colors.primary,
      background: darkTheme.colors.background,
      card: darkTheme.colors.surface,
      text: darkTheme.colors.onSurface,
      border: darkTheme.colors.outline,
      notification: darkTheme.colors.error,
    } : {
      primary: lightTheme.colors.primary,
      background: lightTheme.colors.background,
      card: lightTheme.colors.surface,
      text: lightTheme.colors.onSurface,
      border: lightTheme.colors.outline,
      notification: lightTheme.colors.error,
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400' as const,
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '700' as const,
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '900' as const,
      },
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // We're using custom app bars
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Weather',
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Settings',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
