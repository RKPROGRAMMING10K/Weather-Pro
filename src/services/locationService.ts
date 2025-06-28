import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

// Configure geolocation on app start
if (Platform.OS === 'android') {
  // Set configuration for better performance on Android
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'always',
    enableBackgroundLocationUpdates: false,
    locationProvider: 'auto' 
  });
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export class LocationService {
  /**
   * Check if geolocation is available
   */
  static isGeolocationAvailable(): boolean {
    console.log('Geolocation is available:', !!Geolocation);
    return !!Geolocation;
  }

  /**
   * Request location permission for Android
   */
  static async requestLocationPermission(): Promise<boolean> {
    console.log('🔐 Requesting location permission...');
    
    if (Platform.OS === 'android') {
      try {
        console.log('📱 Platform: Android - requesting ACCESS_FINE_LOCATION');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Weather App Location Permission',
            message: 'Weather App needs access to your location to show accurate weather for your current area.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Deny',
            buttonPositive: 'Allow',
          },
        );
        
        console.log('📝 Permission result:', granted);
        console.log('✅ Permission granted:', granted === PermissionsAndroid.RESULTS.GRANTED);
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('❌ Permission request failed:', err);
        return false;
      }
    }
    
    console.log('🍎 Platform: iOS - permissions handled by system');
    return true; // iOS permissions are handled differently
  }

  /**
   * Get current location coordinates using React Native Community Geolocation
   */
  static async getCurrentLocation(): Promise<LocationCoordinates> {
    console.log('Starting location detection...');
    
    return new Promise((resolve, reject) => {
      if (!Geolocation) {
        console.error('Geolocation is not available');
        reject(new Error('Location services are not available on this device'));
        return;
      }

      Geolocation.getCurrentPosition(
        (position: any) => {
          console.log('✅ Location found successfully:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
          
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error: any) => {
          console.error('❌ Geolocation error:', {
            code: error.code,
            message: error.message,
            PERMISSION_DENIED: error.code === 1,
            POSITION_UNAVAILABLE: error.code === 2,
            TIMEOUT: error.code === 3
          });
          
          let errorMessage = 'Unable to get your location. ';
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage += 'Location permission denied. Please enable location permissions in your device settings.';
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage += 'Location not available. Please ensure GPS is enabled and try again.';
              break;
            case 3: // TIMEOUT
              errorMessage += 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage += `Error code ${error.code}: ${error.message}`;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: false, // Try with less accuracy for faster response
          timeout: 15000, // Reduced timeout for quicker response
          maximumAge: 10000, // Accept location up to 10 seconds old
        }
      );
    });
  }

  /**
   * Get current location with permission check
   */
  static async getCurrentLocationWithPermission(): Promise<LocationCoordinates> {
    console.log('🚀 Starting location request with permission check...');
    
    // Check if geolocation is available
    if (!this.isGeolocationAvailable()) {
      throw new Error('Location services are not available on this device');
    }

    // Request permission for Android
    const hasPermission = await this.requestLocationPermission();
    console.log('📍 Location permission granted:', hasPermission);
    
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    // Get the actual location with fallback strategy
    return this.getCurrentLocationWithFallback();
  }

  /**
   * Wrapper for getCurrentLocation with custom timeout
   */
  static async getCurrentLocationWithTimeout(timeoutMs: number = 10000): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout;
      let resolved = false;

      // Create a timeout
      timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error(`Location request timed out after ${timeoutMs}ms`));
        }
      }, timeoutMs);

      // Try to get location
      this.getCurrentLocation()
        .then((coords) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            resolve(coords);
          }
        })
        .catch((error) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            reject(error);
          }
        });
    });
  }

  /**
   * Try getting location with both high and low accuracy
   */
  static async getCurrentLocationWithFallback(): Promise<LocationCoordinates> {
    console.log('🎯 Trying location with fallback strategy...');
    
    try {
      // Try high accuracy first (with shorter timeout)
      console.log('📍 Trying high accuracy location...');
      return await this.getCurrentLocationHighAccuracy();
    } catch (highAccuracyError) {
      console.log('⚠️ High accuracy failed, trying low accuracy...', highAccuracyError);
      
      try {
        // Try low accuracy as fallback
        return await this.getCurrentLocationLowAccuracy();
      } catch (lowAccuracyError) {
        console.error('❌ Both high and low accuracy failed');
        const highErrorMsg = highAccuracyError instanceof Error ? highAccuracyError.message : 'Unknown error';
        const lowErrorMsg = lowAccuracyError instanceof Error ? lowAccuracyError.message : 'Unknown error';
        throw new Error(`Location detection failed. High accuracy: ${highErrorMsg}. Low accuracy: ${lowErrorMsg}`);
      }
    }
  }

  /**
   * Get location with high accuracy
   */
  static async getCurrentLocationHighAccuracy(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!Geolocation) {
        reject(new Error('Geolocation not available'));
        return;
      }

      Geolocation.getCurrentPosition(
        (position: any) => {
          console.log('✅ High accuracy location found:', position.coords);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error: any) => {
          console.log('❌ High accuracy failed:', error);
          reject(new Error(`High accuracy location failed: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 8000, // Shorter timeout for high accuracy
          maximumAge: 5000,
        }
      );
    });
  }

  /**
   * Get location with low accuracy (faster fallback)
   */
  static async getCurrentLocationLowAccuracy(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!Geolocation) {
        reject(new Error('Geolocation not available'));
        return;
      }

      Geolocation.getCurrentPosition(
        (position: any) => {
          console.log('✅ Low accuracy location found:', position.coords);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error: any) => {
          console.log('❌ Low accuracy failed:', error);
          reject(new Error(`Low accuracy location failed: ${error.message}`));
        },
        {
          enableHighAccuracy: false,
          timeout: 15000, // Longer timeout for low accuracy
          maximumAge: 60000, // Accept older location data
        }
      );
    });
  }
}
