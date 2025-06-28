export interface WeatherData {
  id: number;
  name: string;
  country: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  feelsLike: number;
  visibility: number;
  uvIndex: number;
  timestamp: number;
}

export interface ForecastItem {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface SettingsState {
  temperatureUnit: 'celsius' | 'fahrenheit';
  theme: 'light' | 'dark' | 'auto';
}

export interface RootState {
  weather: WeatherState;
  settings: SettingsState;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
