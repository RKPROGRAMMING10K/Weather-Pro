import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3B82F6', // Modern blue
    primaryContainer: '#DBEAFE',
    secondary: '#F59E0B', // Warm amber
    secondaryContainer: '#FEF3C7',
    tertiary: '#10B981', // Fresh green
    tertiaryContainer: '#D1FAE5',
    surface: '#FFFFFF',
    surfaceVariant: '#F8FAFC',
    background: '#F8FAFC', // Very light blue-gray
    error: '#EF4444',
    errorContainer: '#FEE2E2',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#1E40AF',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#92400E',
    onSurface: '#1F2937',
    onSurfaceVariant: '#6B7280',
    onBackground: '#1F2937',
    outline: '#E5E7EB',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#FAFBFC',
      level3: '#F3F4F6',
      level4: '#E5E7EB',
      level5: '#D1D5DB',
    },
  },
  roundness: 16,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#60A5FA', // Brighter blue for dark mode
    primaryContainer: '#1E40AF',
    secondary: '#FBBF24', // Bright amber for dark mode
    secondaryContainer: '#D97706',
    tertiary: '#34D399', // Bright green for dark mode
    tertiaryContainer: '#059669',
    surface: '#1F2937',
    surfaceVariant: '#374151',
    background: '#111827', // Very dark blue-gray
    error: '#F87171',
    errorContainer: '#DC2626',
    onPrimary: '#1E3A8A',
    onPrimaryContainer: '#DBEAFE',
    onSecondary: '#92400E',
    onSecondaryContainer: '#FEF3C7',
    onSurface: '#F9FAFB',
    onSurfaceVariant: '#D1D5DB',
    onBackground: '#F9FAFB',
    outline: '#4B5563',
    elevation: {
      level0: 'transparent',
      level1: '#1F2937',
      level2: '#374151',
      level3: '#4B5563',
      level4: '#6B7280',
      level5: '#9CA3AF',
    },
  },
  roundness: 16,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
};

export const elevation = {
  level0: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  level2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  level3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 6,
  },
  level4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
  },
  level5: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 5.46,
    elevation: 12,
  },
};
