import { debounce, isValidCityName, capitalizeWords } from '../../utils/helpers';

describe('Helper Utils', () => {
  describe('debounce', () => {
    jest.useFakeTimers();

    it('should delay function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('should cancel previous calls when called multiple times', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn('test1');
      debouncedFn('test2');
      debouncedFn('test3');

      jest.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test3');
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('isValidCityName', () => {
    it('should return true for valid city names', () => {
      expect(isValidCityName('New York')).toBe(true);
      expect(isValidCityName('Paris')).toBe(true);
      expect(isValidCityName('San Francisco')).toBe(true);
      expect(isValidCityName("O'Fallon")).toBe(true);
      expect(isValidCityName('St. Louis')).toBe(true);
      expect(isValidCityName('Mexico City')).toBe(true);
    });

    it('should return false for invalid city names', () => {
      expect(isValidCityName('')).toBe(false);
      expect(isValidCityName(' ')).toBe(false);
      expect(isValidCityName('A')).toBe(false);
      expect(isValidCityName('123')).toBe(false);
      expect(isValidCityName('City@123')).toBe(false);
      expect(isValidCityName('City#Name')).toBe(false);
    });

    it('should handle whitespace correctly', () => {
      expect(isValidCityName('  Paris  ')).toBe(true);
      expect(isValidCityName('   ')).toBe(false);
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize first letter of each word', () => {
      expect(capitalizeWords('new york')).toBe('New York');
      expect(capitalizeWords('san francisco')).toBe('San Francisco');
      expect(capitalizeWords('los angeles california')).toBe('Los Angeles California');
    });

    it('should handle single words', () => {
      expect(capitalizeWords('paris')).toBe('Paris');
      expect(capitalizeWords('LONDON')).toBe('London');
    });

    it('should handle empty strings', () => {
      expect(capitalizeWords('')).toBe('');
    });

    it('should handle mixed case input', () => {
      expect(capitalizeWords('nEw YoRk')).toBe('New York');
      expect(capitalizeWords('PARIS france')).toBe('Paris France');
    });
  });
});
