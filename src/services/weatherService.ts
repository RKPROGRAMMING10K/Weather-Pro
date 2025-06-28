import { OPENWEATHERMAP_API_KEY, API_BASE_URL } from '@env';
import { WeatherData, ForecastItem } from '../types/weather';
import { LocationCoordinates } from './locationService';

const API_KEY = OPENWEATHERMAP_API_KEY;
const BASE_URL = API_BASE_URL;

/**
 * Weather API service for fetching weather data from OpenWeatherMap
 */
export class WeatherService {
  /**
   * Fetch current weather for a city
   */
  static async getCurrentWeather(cityName: string): Promise<WeatherData> {
    try {
      const url = `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the city name and try again.');
        }
        throw new Error('Failed to fetch weather data. Please try again.');
      }
      
      const data = await response.json();
      
      return {
        id: data.id,
        name: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000, // Convert to km
        uvIndex: 0, // UV index requires separate API call
        timestamp: Date.now(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your internet connection.');
    }
  }

  /**
   * Fetch 5-day weather forecast for a city
   */
  static async getForecast(cityName: string): Promise<ForecastItem[]> {
    try {
      const url = `${BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the city name and try again.');
        }
        throw new Error('Failed to fetch forecast data. Please try again.');
      }
      
      const data = await response.json();
      
      // Group by day and get daily forecast (take the midday forecast for each day)
      const dailyForecasts: ForecastItem[] = [];
      const processedDays = new Set();
      
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        // Take the forecast around noon (12:00) for each day
        const hour = date.getHours();
        if (!processedDays.has(dayKey) && (hour >= 11 && hour <= 13)) {
          processedDays.add(dayKey);
          
          dailyForecasts.push({
            date: dayKey,
            temperature: {
              min: Math.round(item.main.temp_min),
              max: Math.round(item.main.temp_max),
            },
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
          });
        }
      });
      
      return dailyForecasts.slice(0, 5); // Return 5-day forecast
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your internet connection.');
    }
  }

  /**
   * Fetch current weather by coordinates
   */
  static async getCurrentWeatherByCoords(coords: LocationCoordinates): Promise<WeatherData> {
    try {
      const url = `${BASE_URL}/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&units=metric`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data for your location. Please try again.');
      }
      
      const data = await response.json();
      
      return {
        id: data.id,
        name: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000, // Convert to km
        uvIndex: 0, // UV index requires separate API call
        timestamp: Date.now(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your internet connection.');
    }
  }

  /**
   * Fetch 5-day weather forecast by coordinates
   */
  static async getForecastByCoords(coords: LocationCoordinates): Promise<ForecastItem[]> {
    try {
      const url = `${BASE_URL}/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&units=metric`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data for your location. Please try again.');
      }
      
      const data = await response.json();
      
      // Group by day and get daily forecast (take the midday forecast for each day)
      const dailyForecasts: ForecastItem[] = [];
      const processedDays = new Set();
      
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        // Take the forecast around noon (12:00) for each day
        const hour = date.getHours();
        if (!processedDays.has(dayKey) && (hour >= 11 && hour <= 13)) {
          processedDays.add(dayKey);
          
          dailyForecasts.push({
            date: dayKey,
            temperature: {
              min: Math.round(item.main.temp_min),
              max: Math.round(item.main.temp_max),
            },
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
          });
        }
      });
      
      return dailyForecasts.slice(0, 5); // Return 5-day forecast
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your internet connection.');
    }
  }

  /**
   * Get weather icon URL from OpenWeatherMap
   */
  static getIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}
