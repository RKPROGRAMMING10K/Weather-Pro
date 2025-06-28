import { convertTemperature, formatTemperature, getTemperatureDisplay } from '../../utils/temperature';

describe('Temperature Utils', () => {
  describe('convertTemperature', () => {
    it('should convert Celsius to Fahrenheit correctly', () => {
      expect(convertTemperature(0, 'celsius', 'fahrenheit')).toBe(32);
      expect(convertTemperature(20, 'celsius', 'fahrenheit')).toBe(68);
      expect(convertTemperature(100, 'celsius', 'fahrenheit')).toBe(212);
    });

    it('should convert Fahrenheit to Celsius correctly', () => {
      expect(convertTemperature(32, 'fahrenheit', 'celsius')).toBe(0);
      expect(convertTemperature(68, 'fahrenheit', 'celsius')).toBe(20);
      expect(convertTemperature(212, 'fahrenheit', 'celsius')).toBe(100);
    });

    it('should return same temperature when units are the same', () => {
      expect(convertTemperature(25, 'celsius', 'celsius')).toBe(25);
      expect(convertTemperature(77, 'fahrenheit', 'fahrenheit')).toBe(77);
    });

    it('should handle negative temperatures', () => {
      expect(convertTemperature(-10, 'celsius', 'fahrenheit')).toBe(14);
      expect(convertTemperature(14, 'fahrenheit', 'celsius')).toBe(-10);
    });
  });

  describe('formatTemperature', () => {
    it('should format Celsius temperature correctly', () => {
      expect(formatTemperature(25.7, 'celsius')).toBe('26°C');
      expect(formatTemperature(-5.2, 'celsius')).toBe('-5°C');
    });

    it('should format Fahrenheit temperature correctly', () => {
      expect(formatTemperature(77.8, 'fahrenheit')).toBe('78°F');
      expect(formatTemperature(23.1, 'fahrenheit')).toBe('23°F');
    });

    it('should round temperatures to nearest integer', () => {
      expect(formatTemperature(25.4, 'celsius')).toBe('25°C');
      expect(formatTemperature(25.6, 'celsius')).toBe('26°C');
    });
  });

  describe('getTemperatureDisplay', () => {
    it('should convert and format temperature correctly', () => {
      // Converting 20°C to Fahrenheit should be 68°F
      expect(getTemperatureDisplay(20, 'celsius', 'fahrenheit')).toBe('68°F');
      
      // Converting 68°F to Celsius should be 20°C
      expect(getTemperatureDisplay(68, 'fahrenheit', 'celsius')).toBe('20°C');
    });

    it('should return formatted temperature when units are the same', () => {
      expect(getTemperatureDisplay(25, 'celsius', 'celsius')).toBe('25°C');
      expect(getTemperatureDisplay(77, 'fahrenheit', 'fahrenheit')).toBe('77°F');
    });
  });
});
