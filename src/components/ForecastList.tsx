import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { ForecastItem } from '../types/weather';
import { useAppSelector } from '../store';
import { getTemperatureDisplay } from '../utils/temperature';
import { formatDate } from '../utils/date';
import { spacing, borderRadius } from '../theme';

interface ForecastListProps {
  forecast: ForecastItem[];
  horizontal?: boolean;
}

/**
 * Reusable forecast list component displaying weather forecast
 */
export const ForecastList: React.FC<ForecastListProps> = ({
  forecast,
  horizontal = true,
}) => {
  const { temperatureUnit } = useAppSelector((state) => state.settings);

  if (forecast.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.emptyText}>
            No forecast data available
          </Text>
        </Card.Content>
      </Card>
    );
  }

  const renderForecastItem = (item: ForecastItem, index: number) => {
    const minTemp = getTemperatureDisplay(item.temperature.min, 'celsius', temperatureUnit);
    const maxTemp = getTemperatureDisplay(item.temperature.max, 'celsius', temperatureUnit);
    const date = formatDate(new Date(item.date).getTime() / 1000);

    return (
      <View key={index} style={[styles.forecastItem, horizontal && styles.horizontalItem]}>
        <Text variant="bodyMedium" style={styles.date}>
          {date}
        </Text>
        
        <View style={styles.weatherInfo}>
          <Text variant="bodySmall" style={styles.description}>
            {item.description}
          </Text>
          
          <View style={styles.temperatureRange}>
            <Text variant="titleMedium" style={styles.maxTemp}>
              {maxTemp}
            </Text>
            <Text variant="bodyMedium" style={styles.minTemp}>
              {minTemp}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <Chip icon="water-percent" compact style={styles.detailChip}>
            {item.humidity}%
          </Chip>
          <Chip icon="weather-windy" compact style={styles.detailChip}>
            {item.windSpeed}m/s
          </Chip>
        </View>
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          5-Day Forecast
        </Text>
        
        {horizontal ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalContainer}
          >
            {forecast.map(renderForecastItem)}
          </ScrollView>
        ) : (
          <View style={styles.verticalContainer}>
            {forecast.map(renderForecastItem)}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
  },
  title: {
    marginBottom: spacing.md,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  horizontalContainer: {
    paddingRight: spacing.md,
  },
  verticalContainer: {
    gap: spacing.sm,
  },
  forecastItem: {
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  horizontalItem: {
    width: 140,
    marginRight: spacing.sm,
    marginBottom: 0,
  },
  date: {
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  weatherInfo: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    textAlign: 'center',
    marginBottom: spacing.xs,
    opacity: 0.8,
  },
  temperatureRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  maxTemp: {
    fontWeight: 'bold',
  },
  minTemp: {
    opacity: 0.7,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.xs,
  },
  detailChip: {
    flex: 1,
    minWidth: 60,
  },
});
