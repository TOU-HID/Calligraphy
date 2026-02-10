/**
 * Empty State Component
 *
 * Displayed when no canvases exist or match filters
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

interface EmptyStateProps {
  hasFilters: boolean;
  onCreateCanvas?: () => void;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onCreateCanvas,
  onClearFilters,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📋</Text>

      {hasFilters ? (
        <>
          <Text style={styles.title}>No canvases found</Text>
          <Text style={styles.description}>Try adjusting your filters or search query</Text>
          {onClearFilters && (
            <Pressable style={styles.button} onPress={onClearFilters}>
              <Text style={styles.buttonText}>Clear Filters</Text>
            </Pressable>
          )}
        </>
      ) : (
        <>
          <Text style={styles.title}>No canvases yet</Text>
          <Text style={styles.description}>Create your first canvas to get started</Text>
          {onCreateCanvas && (
            <Pressable style={styles.button} onPress={onCreateCanvas}>
              <Text style={styles.buttonText}>Create Canvas</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  buttonText: {
    ...typography.button,
    color: colors.background,
    fontWeight: '600',
  },
});
