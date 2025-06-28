# Weather App

A modern React Native weather application built with TypeScript, featuring GPS location detection, theme support, and comprehensive error handling.

## 🏗️ Architecture & Design Decisions

### Project Structure
The app follows a scalable, modular architecture:

```
src/
├── components/          # Reusable UI components
│   ├── SearchBar.tsx
│   ├── WeatherCard.tsx
│   ├── ForecastList.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorDisplay.tsx
│   └── Enhanced*/       # Enhanced components with better styling
├── screens/             # Screen components
│   ├── HomeScreen.tsx   # Main weather display with GPS
│   └── SettingsScreen.tsx # App configuration
├── navigation/          # Navigation configuration
├── store/              # Redux Toolkit state management
│   ├── weatherSlice.ts  # Weather data state
│   └── settingsSlice.ts # User preferences
├── services/           # Business logic services
│   ├── weatherService.ts    # Weather API integration
│   ├── locationService.ts   # GPS location handling
│   └── storageService.ts    # AsyncStorage operations
├── utils/              # Utility functions
├── types/              # TypeScript definitions
├── theme/              # Theme configuration
└── __tests__/          # Unit tests
```

### Key Design Decisions

**1. Redux Toolkit for State Management**
- Centralized state management for weather data and user settings
- Immutable state updates with Redux Toolkit
- Persistent storage integration with AsyncStorage

**2. Service Layer Architecture**
- Separation of concerns between UI and business logic
- Dedicated services for location, weather API, and storage
- Robust error handling and fallback strategies

**3. TypeScript Integration**
- Full type safety across the application
- Custom type definitions for weather data and navigation
- Enhanced developer experience and runtime safety

**4. Component Architecture**
- Reusable UI components with consistent styling
- Enhanced components for better user experience
- Theme-aware components supporting light/dark modes

**5. Location Service Strategy**
- High-accuracy GPS with low-accuracy fallback
- Permission handling and error recovery
- Real device GPS support (not simulators)

## 🚀 Setup and Installation Instructions

### Prerequisites
- **Node.js** >= 18
- **React Native CLI** installed globally
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Java 17** (for Android builds)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Weather
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Android Setup**
   ```bash
   # Ensure ANDROID_HOME environment variable is set
   # Install Android SDK and build tools through Android Studio
   ```

4. **iOS Setup** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

5. **Environment Configuration**
   ```bash
   # Create .env file for API keys (optional for development)
   cp .env.example .env
   ```

### Running the Application

**Start Metro Bundler:**
```bash
npm start
# or with cache reset
npm start -- --reset-cache
```

**Run on Android:**
```bash
npm run android
# Ensure Android device is connected or emulator is running
```

**Run on iOS:**
```bash
npm run ios
# iOS Simulator will launch automatically
```

### Development Commands
```bash
npm test              # Run unit tests
npm test -- --watch   # Run tests in watch mode
npm test -- --coverage # Run tests with coverage report
npm run lint          # Lint code (if configured)
```

## 🧪 Unit Testing Strategy

### Test Coverage for Critical Components

**Current Test Suite: 38 Tests Passing**

#### 1. Component Tests
- **SearchBar Component** (5 tests)
  - Input validation and debounced search functionality
  - Loading states and error handling
  - User interaction testing

- **WeatherCard Component** (6 tests)
  - Weather data display accuracy
  - Temperature unit conversion
  - Loading and error states

- **ForecastList Component** (4 tests)
  - Forecast data rendering
  - Horizontal scrolling functionality
  - Date formatting accuracy

#### 2. Utility Function Tests
- **Temperature Conversion** (9 tests)
  - Celsius to Fahrenheit conversion accuracy
  - Edge cases (negative temperatures, zero)
  - Rounding precision validation

- **Helper Functions** (7 tests)
  - City name validation
  - Input sanitization
  - Date formatting utilities

#### 3. State Management Tests
- **Weather Slice** (7 tests)
  - Redux action creators
  - State mutations and immutability
  - Loading states and error handling
  - Async thunk behavior

### Test Configuration
```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run specific test files
npm test WeatherCard.test.tsx

# Run tests in watch mode during development
npm test -- --watch
```

### Test Setup
- **Jest** framework with React Native preset
- **React Testing Library** for component testing
- **Mock implementations** for location services and APIs
- **Coverage thresholds** enforced for critical paths

## ⚠️ Error Handling & Edge Cases

### Comprehensive Error Management

#### 1. Location Service Error Handling
```typescript
// locationService.ts - Robust GPS handling
- High-accuracy GPS with automatic fallback to low-accuracy
- Permission denied scenarios with user-friendly messages
- Network timeout handling (10-second timeout)
- Fallback to default location (Nashik) when GPS fails
- Real device vs simulator detection
```

#### 2. Weather API Error Handling
```typescript
// weatherService.ts - API resilience
- Network connectivity issues
- API rate limiting and timeout management
- Invalid city name handling with validation
- Malformed response data protection
- Retry mechanisms for failed requests
```

#### 3. Storage Error Handling
```typescript
// storageService.ts - Data persistence safety
- AsyncStorage read/write failures
- JSON parsing errors for corrupted data
- Storage quota exceeded scenarios
- Graceful degradation when storage unavailable
```

#### 4. UI Error States
- **Loading Spinners**: Clear feedback during operations
- **Error Messages**: User-friendly error descriptions
- **Retry Mechanisms**: Allow users to retry failed operations
- **Fallback UI**: Default states when data unavailable
- **Network Indicators**: Show offline/online status

#### 5. Input Validation & Edge Cases
```typescript
// Handled scenarios:
- Empty search queries
- Special characters in city names
- Very long input strings
- Invalid temperature values
- Malformed forecast data
- Theme switching edge cases
```

### Error Recovery Strategies
1. **Automatic Retry**: Failed network requests retry with exponential backoff
2. **Cached Data**: Show last known good data when new requests fail
3. **User Feedback**: Clear error messages with actionable solutions
4. **Graceful Degradation**: App remains functional even with partial failures
5. **Logging**: Comprehensive error logging for debugging

## 🛠️ Troubleshooting

### Common Development Issues

#### "Unable to load script" Error
```bash
# Solution 1: Restart Metro with cache reset
npx react-native start --reset-cache

# Solution 2: Clean and rebuild
rm -rf node_modules && npm install
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

#### Android Build Issues
```bash
# Check Java version (should be Java 17)
java -version

# Verify Android SDK path
echo $ANDROID_HOME

# Clean Android build
cd android && ./gradlew clean && cd ..
```

#### Location/GPS Issues
- Ensure location permissions are granted in device settings
- Test on real device (GPS doesn't work in emulators)
- Check that GPS/Location services are enabled
- Verify network connectivity

#### Metro Bundler Issues
```bash
# Kill existing Metro processes
npx react-native start --reset-cache

# Check port 8081 availability
lsof -ti:8081 | xargs kill -9  # Kill processes using port 8081
```

---

## 📋 Project Summary

This Weather App demonstrates:
- **Robust Architecture**: Modular design with clear separation of concerns
- **Comprehensive Testing**: 38 unit tests covering critical functionality
- **Error Resilience**: Extensive error handling and recovery mechanisms
- **Modern UI/UX**: Theme-aware design with GPS location integration
- **TypeScript Safety**: Full type coverage for enhanced developer experience

The application successfully handles real-world scenarios including network failures, location services, and user input validation while maintaining a smooth user experience.
