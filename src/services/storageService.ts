import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData, SettingsState } from '../types/weather';

const KEYS = {
  WEATHER_DATA: '@weather_data',
  SETTINGS: '@settings',
  LAST_SEARCH: '@last_search',
} as const;

/**
 * Storage service for persisting app data
 */
export class StorageService {
  /**
   * Save weather data to AsyncStorage
   */
  static async saveWeatherData(weatherData: WeatherData): Promise<void> {
    try {
      const jsonValue = JSON.stringify(weatherData);
      await AsyncStorage.setItem(KEYS.WEATHER_DATA, jsonValue);
    } catch (error) {
      console.error('Error saving weather data:', error);
    }
  }

  /**
   * Get cached weather data from AsyncStorage
   */
  static async getWeatherData(): Promise<WeatherData | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.WEATHER_DATA);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error getting weather data:', error);
      return null;
    }
  }

  /**
   * Save user settings to AsyncStorage
   */
  static async saveSettings(settings: SettingsState): Promise<void> {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(KEYS.SETTINGS, jsonValue);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * Get user settings from AsyncStorage
   */
  static async getSettings(): Promise<SettingsState | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.SETTINGS);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  /**
   * Save last searched city
   */
  static async saveLastSearch(cityName: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LAST_SEARCH, cityName);
    } catch (error) {
      console.error('Error saving last search:', error);
    }
  }

  /**
   * Get last searched city
   */
  static async getLastSearch(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.LAST_SEARCH);
    } catch (error) {
      console.error('Error getting last search:', error);
      return null;
    }
  }

  /**
   * Clear all stored data
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        KEYS.WEATHER_DATA,
        KEYS.SETTINGS,
        KEYS.LAST_SEARCH,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}
