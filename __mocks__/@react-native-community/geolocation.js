/**
 * Mock for @react-native-community/geolocation
 */

const mockGeolocation = {
  getCurrentPosition: jest.fn((success, error, options) => {
    // Mock successful location response for Nashik
    const mockPosition = {
      coords: {
        latitude: 19.9975,  // Nashik latitude
        longitude: 73.7898, // Nashik longitude
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };
    
    // Simulate successful geolocation
    setTimeout(() => success(mockPosition), 100);
  }),
  
  watchPosition: jest.fn(() => 1),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
  requestAuthorization: jest.fn(() => Promise.resolve('granted')),
  setRNConfiguration: jest.fn(),
};

export default mockGeolocation;
