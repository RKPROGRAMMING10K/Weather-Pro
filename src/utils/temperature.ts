import { TemperatureUnit } from '../types/weather';

/**
 * Convert temperature between Celsius and Fahrenheit
 */
export const convertTemperature = (
  temperature: number,
  fromUnit: TemperatureUnit,
  toUnit: TemperatureUnit
): number => {
  if (fromUnit === toUnit) return temperature;
  
  if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
    return (temperature * 9/5) + 32;
  } else {
    return (temperature - 32) * 5/9;
  }
};

/**
 * Format temperature with unit
 */
export const formatTemperature = (
  temperature: number,
  unit: TemperatureUnit
): string => {
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${Math.round(temperature)}${symbol}`;
};

/**
 * Get temperature display value based on current unit preference
 */
export const getTemperatureDisplay = (
  temperature: number,
  currentUnit: TemperatureUnit,
  preferredUnit: TemperatureUnit
): string => {
  const convertedTemp = convertTemperature(temperature, currentUnit, preferredUnit);
  return formatTemperature(convertedTemp, preferredUnit);
};
