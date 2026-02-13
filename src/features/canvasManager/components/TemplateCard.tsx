/**
 * Template Card Component
 * 
 * Displays a single template in the template selector
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { SvgXml } from 'react-native-svg';

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  isSelected?: boolean;
  onPress: (id: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  name,
  description,
  thumbnail,
  isSelected = false,
  onPress,
}) => {
  return (
    <Pressable
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={() => onPress(id)}
    >
      <View style={styles.thumbnailContainer}>
        {thumbnail ? (
          <SvgXml xml={thumbnail} width="100%" height="100%" />
        ) : (
          <View style={styles.emptyThumbnail}>
            <Text style={styles.emptyIcon}>🎨</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>

      {isSelected && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedIcon}>✓</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  containerSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  thumbnailContainer: {
    width: '100%',
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  emptyThumbnail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
  },
  content: {
    padding: spacing.sm,
  },
  name: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  selectedBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
});
