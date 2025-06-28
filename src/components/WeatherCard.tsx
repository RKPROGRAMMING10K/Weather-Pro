import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { WeatherData } from '../types/weather';
import { useAppSelector } from '../store';
import { getTemperatureDisplay } from '../utils/temperature';
import { formatTime, getRelativeTime } from '../utils/date';
import { spacing, borderRadius } from '../theme';

interface WeatherCardProps {
  weather: WeatherData;
  showDetails?: boolean;
}

/**
 * Reusable weather card component displaying current weather information
 */
export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  showDetails = true,
}) => {
  const { temperatureUnit } = useAppSelector((state) => state.settings);

  const temperature = getTemperatureDisplay(weather.temperature, 'celsius', temperatureUnit);
  const feelsLike = getTemperatureDisplay(weather.feelsLike, 'celsius', temperatureUnit);

  return (
    <Card style={styles.card} elevation={3}>
      <Card.Content>
        {/* Location and Time */}
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.location}>
            {weather.name}, {weather.country}
          </Text>
          <Text variant="bodySmall" style={styles.timestamp}>
            {getRelativeTime(weather.timestamp)}
          </Text>
        </View>

        {/* Main Weather Info */}
        <View style={styles.mainWeather}>
          <View style={styles.temperatureSection}>
            <Text variant="displayMedium" style={styles.temperature}>
              {temperature}
            </Text>
            <Text variant="bodyMedium" style={styles.feelsLike}>
              Feels like {feelsLike}
            </Text>
          </View>
          
          <View style={styles.descriptionSection}>
            <Text variant="titleMedium" style={styles.description}>
              {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
            </Text>
          </View>
        </View>

        {/* Weather Details */}
        {showDetails && (
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <DetailChip icon="water-percent" label="Humidity" value={`${weather.humidity}%`} />
              <DetailChip icon="weather-windy" label="Wind" value={`${weather.windSpeed} m/s`} />
            </View>
            <View style={styles.detailRow}>
              <DetailChip icon="gauge" label="Pressure" value={`${weather.pressure} hPa`} />
              <DetailChip icon="eye" label="Visibility" value={`${weather.visibility} km`} />
            </View>
            {weather.uvIndex > 0 && (
              <View style={styles.detailRow}>
                <DetailChip icon="weather-sunny" label="UV Index" value={weather.uvIndex.toString()} />
              </View>
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

interface DetailChipProps {
  icon: string;
  label: string;
  value: string;
}

const DetailChip: React.FC<DetailChipProps> = ({ icon, label, value }) => (
  <View style={styles.chipContainer}>
    <Text variant="bodySmall" style={styles.chipLabel}>
      {label}
    </Text>
    <Chip icon={icon} compact style={styles.chip}>
      {value}
    </Chip>
  </View>
);

const styles = StyleSheet.create({
  card: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  location: {
    fontWeight: 'bold',
    flex: 1,
  },
  timestamp: {
    opacity: 0.7,
    marginLeft: spacing.sm,
  },
  mainWeather: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  temperatureSection: {
    alignItems: 'flex-start',
  },
  temperature: {
    fontWeight: 'bold',
    lineHeight: 80,
  },
  feelsLike: {
    opacity: 0.7,
    marginTop: -spacing.sm,
  },
  descriptionSection: {
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: spacing.md,
  },
  description: {
    textAlign: 'right',
    fontWeight: '500',
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  chipContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  chipLabel: {
    marginBottom: spacing.xs,
    opacity: 0.7,
  },
  chip: {
    minWidth: 80,
  },
});
