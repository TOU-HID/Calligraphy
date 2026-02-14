/**
 * Canvas Gallery Component
 *
 * Main screen showing all canvases in a scrollable grid
 */

import React, { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { spacing, typography, useAppTheme } from '@/theme';
import { useCanvasManagerStore } from '@store/canvasManagerStore';
import { CanvasThumbnail } from './CanvasThumbnail';
import { CanvasGalleryHeader } from './CanvasGalleryHeader';
import { EmptyState } from './EmptyState';

interface CanvasGalleryProps {
  onCanvasSelect: (canvasId: string) => void;
}

export const CanvasGallery: React.FC<CanvasGalleryProps> = ({ onCanvasSelect }) => {
  const { themeColors } = useAppTheme();
  const styles = useMemo(() => createStyles(themeColors as typeof import('@/theme').colors), [themeColors]);

  const {
    filteredCanvases,
    searchQuery,
    sortBy,
    selectedTags,
    showArchived,
    isLoading,
    allTags,
    loadCanvases,
    createCanvas,
    deleteCanvas,
    setSearchQuery,
    setSortBy,
    toggleTag,
    toggleShowArchived,
    clearFilters,
  } = useCanvasManagerStore();

  // Load canvases on mount
  useEffect(() => {
    loadCanvases();
  }, [loadCanvases]);

  const handleCreateNewCanvas = async (): Promise<void> => {
    const canvasId = await createCanvas('Untitled Canvas');
    onCanvasSelect(canvasId);
  };

  const handleDeleteCanvas = (canvasId: string): void => {
    Alert.alert(
      'Delete Canvas',
      'Are you sure you want to delete this canvas? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteCanvas(canvasId);
          },
        },
      ],
    );
  };

  const canvases = filteredCanvases();
  const hasFilters = searchQuery.length > 0 || selectedTags.length > 0 || showArchived;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={styles.loadingText}>Loading canvases...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Search & Filters */}
      <CanvasGalleryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedTags={selectedTags}
        allTags={allTags()}
        onToggleTag={toggleTag}
        showArchived={showArchived}
        onToggleArchived={toggleShowArchived}
        onClearFilters={clearFilters}
      />

      {/* Canvas List */}
      {canvases.length === 0 ? (
        <EmptyState
          hasFilters={hasFilters}
          onCreateCanvas={handleCreateNewCanvas}
          onClearFilters={clearFilters}
        />
      ) : (
        <FlatList
          data={canvases}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CanvasThumbnail
              canvas={item}
              onPress={onCanvasSelect}
              onLongPress={handleDeleteCanvas}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create Canvas FAB */}
      <Pressable style={styles.fab} onPress={handleCreateNewCanvas}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
};

const createStyles = (themeColors: typeof import('@/theme').colors): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.backgroundSecondary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColors.background,
      gap: spacing.md,
    },
    loadingText: {
      ...typography.body,
      color: themeColors.textSecondary,
    },
    listContent: {
      padding: spacing.md,
      gap: spacing.md,
      paddingBottom: spacing.xl * 2,
    },
    fab: {
      position: 'absolute',
      bottom: spacing.xl,
      right: spacing.xl,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: themeColors.primary,
      borderWidth: 1,
      borderColor: themeColors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    fabText: {
      fontSize: 32,
      color: themeColors.background,
      fontWeight: '300',
      lineHeight: 36,
    },
  });
