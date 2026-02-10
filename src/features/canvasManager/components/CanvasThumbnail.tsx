/**
 * Canvas Thumbnail Component
 *
 * Displays a single canvas card with thumbnail, name, and metadata
 */

import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { CanvasMetadata } from '@core/storage/StorageService';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@shared/components/GlassCard';
import { useCanvasManagerStore } from '@store/canvasManagerStore';

interface CanvasThumbnailProps {
  canvas: CanvasMetadata;
  onPress: (canvasId: string) => void;
  onLongPress?: (canvasId: string) => void;
  selected?: boolean;
}

export const CanvasThumbnail: React.FC<CanvasThumbnailProps> = ({
  canvas,
  onPress,
  onLongPress,
  selected = false,
}) => {
  // Safely validate thumbnail with useMemo to prevent render issues
  const validThumbnail = useMemo(() => {
    const thumb = canvas.thumbnail;
    if (thumb && typeof thumb === 'string' && thumb.trim().length > 0) {
      return thumb;
    }
    return null;
  }, [canvas.thumbnail]);

  const updatedDate = new Date(canvas.updatedAt).toLocaleDateString();
  const renameCanvas = useCanvasManagerStore((state) => state.renameCanvas);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(canvas.name);

  const handleStartEdit = (e: any): void => {
    e.stopPropagation();
    setEditedName(canvas.name);
    setIsEditing(true);
  };

  const handleSaveName = async (): Promise<void> => {
    const trimmedName = editedName.trim();
    if (!trimmedName) {
      Alert.alert('Invalid Name', 'Canvas name cannot be empty');
      return;
    }
    if (trimmedName !== canvas.name) {
      await renameCanvas(canvas.id, trimmedName);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (): void => {
    setIsEditing(false);
    setEditedName(canvas.name);
  };

  return (
    <GlassCard blurAmount="medium" blurType="dark" onPress={() => onPress(canvas.id)}>
      <Pressable
        style={[styles.container, selected && styles.selected]}
        onPress={() => onPress(canvas.id)}
        onLongPress={() => onLongPress?.(canvas.id)}
      >
        <View style={styles.thumbnailContainer}>
          {validThumbnail ? (
            <SvgXml xml={validThumbnail} width="100%" height="100%" />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>No Preview</Text>
            </View>
          )}
          {canvas.archived && (
            <View style={styles.archivedBadge}>
              <Text style={styles.archivedText}>Archived</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            {isEditing ? (
              <View style={styles.nameEditContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={editedName}
                  onChangeText={setEditedName}
                  autoFocus
                  selectTextOnFocus
                  onSubmitEditing={handleSaveName}
                  returnKeyType="done"
                />
                <Pressable style={styles.saveButton} onPress={handleSaveName}>
                  <Text style={styles.buttonText}>✓</Text>
                </Pressable>
                <Pressable style={styles.cancelButton} onPress={handleCancelEdit}>
                  <Text style={styles.buttonText}>✕</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Text style={styles.name} numberOfLines={1}>
                  {canvas.name}
                </Text>
                <Pressable style={styles.editButton} onPress={handleStartEdit}>
                  <Text style={styles.editIcon}>✎</Text>
                </Pressable>
              </>
            )}
          </View>

          <View style={styles.metadataRow}>
            <Text style={styles.metadata}>{canvas.shapeCount} shapes</Text>
            <Text style={styles.metadata}>•</Text>
            <Text style={styles.metadata}>{updatedDate}</Text>
          </View>

          {canvas.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {canvas.tags.slice(0, 3).map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              {canvas.tags.length > 3 && (
                <Text style={styles.moreTagsText}>+{canvas.tags.length - 3}</Text>
              )}
            </View>
          )}
        </View>
      </Pressable>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  archivedBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.error,
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  archivedText: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '600',
  },
  infoContainer: {
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
  },
  editButton: {
    padding: spacing.xs,
  },
  editIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  nameInput: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  saveButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metadata: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    alignItems: 'center',
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  tagText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  moreTagsText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
