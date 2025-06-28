import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState, TemperatureUnit } from '../types/weather';

const initialState: SettingsState = {
  temperatureUnit: 'celsius',
  theme: 'auto',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTemperatureUnit: (state, action: PayloadAction<TemperatureUnit>) => {
      state.temperatureUnit = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    resetSettings: () => initialState,
  },
});

export const {
  setTemperatureUnit,
  setTheme,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
