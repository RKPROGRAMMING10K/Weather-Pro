import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar, List, Switch, RadioButton, Text, Divider, Card, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../store';
import { setTemperatureUnit, setTheme } from '../store/settingsSlice';
import { StorageService } from '../services/storageService';
import { TemperatureUnit } from '../types/weather';
import { spacing, borderRadius } from '../theme';

interface SettingsScreenProps {
  navigation: any; // Will be properly typed with navigation types
}

/**
 * Settings screen for app configuration
 */
export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { temperatureUnit, theme } = useAppSelector((state) => state.settings);
  const appTheme = useTheme();

  // Save settings to AsyncStorage whenever they change
  useEffect(() => {
    StorageService.saveSettings({ temperatureUnit, theme });
  }, [temperatureUnit, theme]);

  /**
   * Handle temperature unit change
   */
  const handleTemperatureUnitChange = (unit: TemperatureUnit) => {
    dispatch(setTemperatureUnit(unit));
  };

  /**
   * Handle theme change
   */
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    dispatch(setTheme(newTheme));
  };

  /**
   * Navigate back to home
   */
  const navigateBack = () => {
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appTheme.colors.background,
    },
    appBarWrapper: {
      backgroundColor: appTheme.colors.primary,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      elevation: 8,
      shadowColor: appTheme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    appBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      paddingTop: 20,
      height: 80,
    },
    appBarTitle: {
      color: appTheme.colors.onPrimary,
      fontSize: 24,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: `${appTheme.colors.onPrimary}25`, // 25% opacity
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: `${appTheme.colors.onPrimary}40`, // 40% opacity
    },
    backButtonText: {
      color: appTheme.colors.onPrimary,
      fontSize: 20,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      padding: spacing.md,
    },
    card: {
      marginBottom: spacing.md,
      borderRadius: borderRadius.lg,
    },
    sectionTitle: {
      fontWeight: 'bold',
      marginBottom: spacing.xs,
    },
    sectionDescription: {
      opacity: 0.7,
      marginBottom: spacing.md,
      lineHeight: 20,
    },
    radioOption: {
      marginVertical: spacing.xs,
    },
    divider: {
      marginVertical: spacing.xs,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Modern App Bar matching HomeScreen */}
      <View style={styles.appBarWrapper}>
        <View style={styles.appBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={navigateBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Settings</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      {/* Settings Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Temperature Unit Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Temperature Unit
            </Text>
            <Text variant="bodyMedium" style={styles.sectionDescription}>
              Choose your preferred temperature unit
            </Text>
            
            <RadioButton.Group
              onValueChange={(value) => handleTemperatureUnitChange(value as TemperatureUnit)}
              value={temperatureUnit}
            >
              <View style={styles.radioOption}>
                <RadioButton.Item
                  label="Celsius (°C)"
                  value="celsius"
                  position="leading"
                />
              </View>
              <View style={styles.radioOption}>
                <RadioButton.Item
                  label="Fahrenheit (°F)"
                  value="fahrenheit"
                  position="leading"
                />
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {/* Theme Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Theme
            </Text>
            <Text variant="bodyMedium" style={styles.sectionDescription}>
              Choose your preferred app theme
            </Text>
            
            <RadioButton.Group
              onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'auto')}
              value={theme}
            >
              <View style={styles.radioOption}>
                <RadioButton.Item
                  label="Light"
                  value="light"
                  position="leading"
                />
              </View>
              <View style={styles.radioOption}>
                <RadioButton.Item
                  label="Dark"
                  value="dark"
                  position="leading"
                />
              </View>
              <View style={styles.radioOption}>
                <RadioButton.Item
                  label="Auto (System)"
                  value="auto"
                  position="leading"
                />
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {/* App Info Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              About
            </Text>
            
            <List.Item
              title="Version"
              description="1.0.0"
              left={(props) => <List.Icon {...props} icon="information" />}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Data Source"
              description="OpenWeatherMap API"
              left={(props) => <List.Icon {...props} icon="cloud" />}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Developed by"
              description="Weather App Team"
              left={(props) => <List.Icon {...props} icon="account-group" />}
            />
          </Card.Content>
        </Card>

        {/* Data Management Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Data Management
            </Text>
            
            <List.Item
              title="Offline Support"
              description="Weather data is cached for offline viewing"
              left={(props) => <List.Icon {...props} icon="cloud-download" />}
              right={() => <Switch value={true} disabled />}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Auto Refresh"
              description="Refresh weather data when app opens"
              left={(props) => <List.Icon {...props} icon="refresh" />}
              right={() => <Switch value={true} disabled />}
            />
          </Card.Content>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
};
