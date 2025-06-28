import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WeatherState, WeatherData, ForecastItem } from '../types/weather';

const initialState: WeatherState = {
  currentWeather: null,
  forecast: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setWeatherData: (state, action: PayloadAction<WeatherData>) => {
      state.currentWeather = action.payload;
      state.isLoading = false;
      state.error = null;
      state.lastUpdated = Date.now();
    },
    setForecastData: (state, action: PayloadAction<ForecastItem[]>) => {
      state.forecast = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearWeatherData: (state) => {
      state.currentWeather = null;
      state.forecast = [];
      state.error = null;
      state.lastUpdated = null;
    },
  },
});

export const {
  setLoading,
  setWeatherData,
  setForecastData,
  setError,
  clearError,
  clearWeatherData,
} = weatherSlice.actions;

export default weatherSlice.reducer;
