# Android Setup Troubleshooting Guide

## 🚨 Android SDK Setup Required

The error you're seeing indicates that the Android SDK location needs to be configured. Here's how to fix it:

### Method 1: Set Android SDK Path

1. **Find your Android SDK location:**
   - Open Android Studio
   - Go to File → Settings (or Android Studio → Preferences on Mac)
   - Navigate to Appearance & Behavior → System Settings → Android SDK
   - Copy the "Android SDK Location" path

2. **Create/Edit local.properties file:**
   - Navigate to `android/local.properties` (already created for you)
   - Replace the path with your actual Android SDK location:
   ```
   sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
   ```

### Method 2: Set ANDROID_HOME Environment Variable

1. **Add ANDROID_HOME to Windows Environment Variables:**
   - Press Win + R, type `sysdm.cpl`, press Enter
   - Click "Environment Variables" button
   - Under "User variables" or "System variables", click "New"
   - Variable name: `ANDROID_HOME`
   - Variable value: Your Android SDK path (e.g., `C:\Users\YourUsername\AppData\Local\Android\Sdk`)
   - Click OK

2. **Add Android tools to PATH:**
   - In the same Environment Variables dialog
   - Find "Path" variable and click "Edit"
   - Add these new entries:
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\tools`
     - `%ANDROID_HOME%\tools\bin`

3. **Restart your terminal/command prompt**

### Method 3: Common Android SDK Locations

Try these common locations in your `local.properties` file:

```properties
# Most common location on Windows:
sdk.dir=C:\\Users\\%USERNAME%\\AppData\\Local\\Android\\Sdk

# Alternative locations:
# sdk.dir=C:\\Android\\Sdk
# sdk.dir=C:\\Program Files\\Android\\Sdk
# sdk.dir=C:\\Program Files (x86)\\Android\\Sdk
```

### Verification Steps

1. **Check if Android SDK is installed:**
   ```bash
   # Open Command Prompt and run:
   adb version
   ```

2. **Check if emulator is working:**
   ```bash
   # List available emulators
   emulator -list-avds
   ```

3. **Try building again:**
   ```bash
   cd d:\Weather
   npm run android
   ```

### If You Don't Have Android Studio

If you don't have Android Studio installed:

1. **Install Android Studio:**
   - Download from: https://developer.android.com/studio
   - Follow the installation wizard
   - Make sure to install Android SDK, Android SDK Platform, and Android Virtual Device

2. **Create an Android Virtual Device (AVD):**
   - Open Android Studio
   - Go to Tools → AVD Manager
   - Click "Create Virtual Device"
   - Choose a device (e.g., Pixel 4)
   - Select a system image (e.g., API 30)
   - Finish setup and start the emulator

### Alternative: Run on Physical Device

If you have an Android device:

1. **Enable Developer Options:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect device and run:**
   ```bash
   cd d:\Weather
   npx react-native run-android
   ```

### Quick Fix Command

Try this command to set up the SDK path automatically:

```bash
# Create local.properties with common SDK location
echo sdk.dir=C:\\Users\\%USERNAME%\\AppData\\Local\\Android\\Sdk > android\\local.properties
```

### Next Steps

After fixing the Android SDK setup:

1. Clean the project:
   ```bash
   cd d:\Weather
   cd android
   ./gradlew clean
   cd ..
   ```

2. Try running again:
   ```bash
   npm run android
   ```

If you continue to have issues, please share:
1. Your Android Studio SDK location path
2. Whether you have Android Studio installed
3. Your Windows username (for the SDK path)

The iOS version should work without these issues if you're on macOS with Xcode installed.
