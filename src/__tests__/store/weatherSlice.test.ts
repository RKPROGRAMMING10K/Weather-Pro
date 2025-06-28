import weatherReducer, {
  setLoading,
  setWeatherData,
  setForecastData,
  setError,
  clearError,
  clearWeatherData,
} from '../../store/weatherSlice';
import { WeatherData, ForecastItem, WeatherState } from '../../types/weather';

const mockWeatherData: WeatherData = {
  id: 1,
  name: 'Test City',
  country: 'TC',
  temperature: 25,
  description: 'sunny',
  icon: '01d',
  humidity: 60,
  windSpeed: 5,
  pressure: 1013,
  feelsLike: 27,
  visibility: 10,
  uvIndex: 5,
  timestamp: 1234567890,
};

const mockForecastData: ForecastItem[] = [
  {
    date: '2024-01-01',
    temperature: { min: 15, max: 25 },
    description: 'sunny',
    icon: '01d',
    humidity: 60,
    windSpeed: 5,
  },
];

const initialState: WeatherState = {
  currentWeather: null,
  forecast: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

describe('Weather Slice', () => {
  it('should return the initial state', () => {
    expect(weatherReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setLoading', () => {
    const actual = weatherReducer(initialState, setLoading(true));
    expect(actual.isLoading).toBe(true);
    expect(actual.error).toBe(null);
  });

  it('should handle setWeatherData', () => {
    const previousState = { ...initialState, isLoading: true };
    const actual = weatherReducer(previousState, setWeatherData(mockWeatherData));
    
    expect(actual.currentWeather).toEqual(mockWeatherData);
    expect(actual.isLoading).toBe(false);
    expect(actual.error).toBe(null);
    expect(actual.lastUpdated).toBeDefined();
  });

  it('should handle setForecastData', () => {
    const actual = weatherReducer(initialState, setForecastData(mockForecastData));
    expect(actual.forecast).toEqual(mockForecastData);
  });

  it('should handle setError', () => {
    const previousState = { ...initialState, isLoading: true };
    const errorMessage = 'Something went wrong';
    const actual = weatherReducer(previousState, setError(errorMessage));
    
    expect(actual.error).toBe(errorMessage);
    expect(actual.isLoading).toBe(false);
  });

  it('should handle clearError', () => {
    const previousState = { ...initialState, error: 'Some error' };
    const actual = weatherReducer(previousState, clearError());
    expect(actual.error).toBe(null);
  });

  it('should handle clearWeatherData', () => {
    const previousState: WeatherState = {
      currentWeather: mockWeatherData,
      forecast: mockForecastData,
      isLoading: false,
      error: 'Some error',
      lastUpdated: 1234567890,
    };
    
    const actual = weatherReducer(previousState, clearWeatherData());
    expect(actual).toEqual(initialState);
  });
});
