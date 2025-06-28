import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WeatherData } from '../types/weather';
import { useAppSelector } from '../store';
import { getTemperatureDisplay } from '../utils/temperature';
import { spacing, elevation } from '../theme';

interface WeatherCardProps {
  weather: WeatherData;
}

export const EnhancedWeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const theme = useTheme();
  const temperatureUnit = useAppSelector(state => state.settings.temperatureUnit);
  
  const temperature = getTemperatureDisplay(weather.temperature, 'celsius', temperatureUnit);
  const feelsLike = getTemperatureDisplay(weather.feelsLike, 'celsius', temperatureUnit);

  const weatherIconUrl = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;

  const styles = StyleSheet.create({
    card: {
      margin: spacing.md,
      borderRadius: 20,
      ...elevation.level4,
    },
    content: {
      padding: spacing.xl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.xl,
    },
    locationContainer: {
      flex: 1,
    },
    locationText: {
      fontSize: 32,
      fontWeight: '700',
      color: theme.colors.onSurface,
      marginBottom: spacing.xs,
    },
    countryText: {
      fontSize: 18,
      color: theme.colors.onSurfaceVariant,
      fontWeight: '500',
    },
    weatherIcon: {
      width: 140,
      height: 140,
      marginLeft: spacing.md,
    },
    temperatureSection: {
      alignItems: 'center',
      marginBottom: spacing.xxl,
    },
    temperatureText: {
      fontSize: 72,
      fontWeight: '200',
      color: theme.colors.primary,
      marginBottom: spacing.sm,
    },
    descriptionText: {
      fontSize: 20,
      textTransform: 'capitalize',
      color: theme.colors.onSurfaceVariant,
      marginBottom: spacing.sm,
      fontWeight: '500',
    },
    feelsLikeText: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
    },
    detailsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    detailCard: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 16,
      padding: spacing.lg,
      width: '48%',
      alignItems: 'center',
      minHeight: 100,
      marginBottom: spacing.sm,
      ...elevation.level2,
    },
    detailIcon: {
      color: theme.colors.primary,
      marginBottom: spacing.sm,
    },
    detailLabel: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: spacing.xs,
    },
    detailValue: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.onSurface,
    },
    chipContainer: {
      marginTop: spacing.xl,
      alignItems: 'center',
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 100,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      opacity: 0.1,
    },
  });

  const DetailCard: React.FC<{
    icon: string;
    label: string;
    value: string;
  }> = ({ icon, label, value }) => (
    <View style={styles.detailCard}>
      <Icon name={icon} size={32} style={styles.detailIcon} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <Card style={styles.card} mode="elevated">
      <View style={styles.content}>
        {/* Header with location and weather icon */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{weather.name}</Text>
            <Text style={styles.countryText}>{weather.country}</Text>
          </View>
          <Image 
            source={{ uri: weatherIconUrl }} 
            style={styles.weatherIcon}
            resizeMode="contain"
          />
        </View>

        {/* Temperature section */}
        <View style={styles.temperatureSection}>
          <Text style={styles.temperatureText}>
            {temperature}
          </Text>
          <Text style={styles.descriptionText}>{weather.description}</Text>
          <Text style={styles.feelsLikeText}>
            Feels like {feelsLike}
          </Text>
        </View>

        {/* Weather details grid */}
        <View style={styles.detailsContainer}>
          <DetailCard
            icon="water"
            label="Humidity"
            value={`${weather.humidity}%`}
          />
          <DetailCard
            icon="nature"
            label="Wind Speed"
            value={`${weather.windSpeed}m/s`}
          />
          <DetailCard
            icon="compress"
            label="Pressure"
            value={`${weather.pressure}hPa`}
          />
          <DetailCard
            icon="remove-red-eye"
            label="Visibility"
            value={`${weather.visibility}km`}
          />
        </View>

        {/* Temperature unit chip */}
        <View style={styles.chipContainer}>
          <Chip 
            icon="thermostat" 
            mode="outlined"
            compact
            style={{ backgroundColor: theme.colors.primaryContainer }}
          >
            {temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'}
          </Chip>
        </View>
      </View>
    </Card>
  );
};

export default EnhancedWeatherCard;
