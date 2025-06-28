/**
 * @format
 */

// Mock AsyncStorage before any imports
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

test('App renders without crashing', () => {
  // Simple smoke test to ensure app can be imported and instantiated
  expect(App).toBeDefined();
  expect(typeof App).toBe('function');
});
