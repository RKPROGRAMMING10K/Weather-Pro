// Mock AsyncStorage first - before any other imports
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock RefreshControl
jest.mock('react-native/Libraries/Components/RefreshControl/RefreshControl', () => {
  const MockRefreshControl = ({ children, ...props }) => children;
  return MockRefreshControl;
});

// Mock React Native Paper
jest.mock('react-native-paper', () => {
  const ActualPaperProvider = jest.requireActual('react-native-paper').PaperProvider;
  return {
    ...jest.requireActual('react-native-paper'),
    PaperProvider: ({ children }) => children,
    Provider: ActualPaperProvider,
  };
});

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: jest.fn(),
}));

// Mock @react-native-community/geolocation
jest.mock('@react-native-community/geolocation', () => {
  return {
    __esModule: true,
    default: {
      getCurrentPosition: jest.fn((success, error, options) => {
        // Mock dynamic location response (this is only for testing)
        // In real app, this will use actual device location
        const mockPosition = {
          coords: {
            latitude: 40.7128,  // Default test coordinates (New York for testing only)
            longitude: -74.0060,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        };
        
        // Simulate successful geolocation for tests only
        setTimeout(() => success(mockPosition), 100);
      }),
      
      watchPosition: jest.fn(() => 1),
      clearWatch: jest.fn(),
      stopObserving: jest.fn(),
      requestAuthorization: jest.fn(() => Promise.resolve('granted')),
      setRNConfiguration: jest.fn(),
    },
  };
});

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

// Mock PermissionsAndroid
const { PermissionsAndroid } = require('react-native');
PermissionsAndroid.request = jest.fn(() => Promise.resolve('granted'));
PermissionsAndroid.RESULTS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  NEVER_ASK_AGAIN: 'never_ask_again',
};
PermissionsAndroid.PERMISSIONS = {
  ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
};
