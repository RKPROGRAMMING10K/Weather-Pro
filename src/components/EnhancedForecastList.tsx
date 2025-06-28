import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { ForecastItem } from '../types/weather';
import { useAppSelector } from '../store';
import { getTemperatureDisplay } from '../utils/temperature';
import { spacing, elevation } from '../theme';

interface ForecastListProps {
  forecast: ForecastItem[];
}

export const EnhancedForecastList: React.FC<ForecastListProps> = ({ forecast }) => {
  const theme = useTheme();
  const temperatureUnit = useAppSelector(state => state.settings.temperatureUnit);

  const styles = StyleSheet.create({
    container: {
      margin: spacing.md,
    },
    title: {
      fontSize: 22,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginBottom: spacing.md,
      marginLeft: spacing.sm,
    },
    scrollContainer: {
      paddingHorizontal: spacing.sm,
    },
    forecastCard: {
      width: 160,
      marginRight: spacing.md,
      borderRadius: 20,
      ...elevation.level3,
    },
    cardContent: {
      padding: spacing.lg,
      alignItems: 'center',
    },
    dateText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.onSurfaceVariant,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    weatherIcon: {
      width: 80,
      height: 80,
      marginBottom: spacing.sm,
    },
    temperatureContainer: {
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    maxTemp: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.onSurface,
    },
    minTemp: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
    },
    description: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      textTransform: 'capitalize',
      marginBottom: spacing.sm,
    },
    detailsContainer: {
      width: '100%',
      borderTopWidth: 1,
      borderTopColor: theme.colors.outline,
      paddingTop: spacing.sm,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    detailLabel: {
      fontSize: 11,
      color: theme.colors.onSurfaceVariant,
      fontWeight: '500',
    },
    detailValue: {
      fontSize: 11,
      color: theme.colors.onSurface,
      fontWeight: '600',
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const ForecastCard: React.FC<{ item: ForecastItem }> = ({ item }) => {
    const maxTemp = getTemperatureDisplay(item.temperature.max, 'celsius', temperatureUnit);
    const minTemp = getTemperatureDisplay(item.temperature.min, 'celsius', temperatureUnit);
    const weatherIconUrl = `https://openweathermap.org/img/wn/${item.icon}@2x.png`;

    return (
      <Card style={styles.forecastCard} mode="elevated">
        <View style={styles.cardContent}>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          
          <Image 
            source={{ uri: weatherIconUrl }} 
            style={styles.weatherIcon}
            resizeMode="contain"
          />
          
          <View style={styles.temperatureContainer}>
            <Text style={styles.maxTemp}>{maxTemp}</Text>
            <Text style={styles.minTemp}>{minTemp}</Text>
          </View>
          
          <Text style={styles.description}>{item.description}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{item.humidity}%</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>{item.windSpeed}m/s</Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  if (!forecast.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Forecast</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {forecast.map((item, index) => (
          <ForecastCard key={index} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default EnhancedForecastList;
