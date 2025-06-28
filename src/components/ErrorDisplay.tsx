import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Icon } from 'react-native-paper';
import { spacing, borderRadius } from '../theme';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  retryText?: string;
  style?: any;
}

/**
 * Reusable error display component
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  retryText = 'Try Again',
  style,
}) => {
  return (
    <Card style={[styles.card, style]}>
      <Card.Content style={styles.content}>
        <Icon
          source="alert-circle-outline"
          size={48}
          color="error"
        />
        
        <Text variant="titleMedium" style={styles.title}>
          Something went wrong
        </Text>
        
        <Text variant="bodyMedium" style={styles.message}>
          {error}
        </Text>
        
        {onRetry && (
          <Button
            mode="contained"
            onPress={onRetry}
            style={styles.retryButton}
            icon="refresh"
          >
            {retryText}
          </Button>
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
  content: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    fontWeight: 'bold',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: spacing.sm,
  },
});
