/**
 * Canvas Gallery Header Component
 *
 * Search, filter, and sort controls
 */

import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { spacing, typography, useAppTheme } from '@/theme';
import { SortOption } from '../types';
import { GlassCard } from '@shared/components/GlassCard';

interface CanvasGalleryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  selectedTags: string[];
  allTags: string[];
  onToggleTag: (tag: string) => void;
  showArchived: boolean;
  onToggleArchived: () => void;
  onClearFilters: () => void;
  onImportSuccess?: () => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date-newest', label: 'Newest' },
  { value: 'date-oldest', label: 'Oldest' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'shapes-most', label: 'Most Shapes' },
  { value: 'shapes-least', label: 'Least Shapes' },
];

export const CanvasGalleryHeader: React.FC<CanvasGalleryHeaderProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedTags,
  allTags,
  onToggleTag,
  showArchived,
  onToggleArchived,
  onClearFilters,
  // onImportSuccess,
}) => {
  const { isDark, themeColors } = useAppTheme();
  const styles = useMemo(
    () => createStyles(themeColors as typeof import('@/theme').colors, isDark),
    [themeColors, isDark],
  );
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showTagsMenu, setShowTagsMenu] = useState(false);

  const hasActiveFilters = searchQuery.length > 0 || selectedTags.length > 0 || showArchived;

  return (
    <GlassCard
      blurAmount="medium"
      blurType={isDark ? 'dark' : 'light'}
      style={{ marginHorizontal: spacing.md, marginTop: spacing.md }}
    >
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchInputContainer}>
          {/* <Text style={styles.searchIcon}>⌕</Text> */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search canvases..."
            placeholderTextColor={themeColors.textSecondary}
            value={searchQuery}
            onChangeText={onSearchChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Filter Row */}
        <View style={styles.filterRow}>
          {/* Sort Button */}
          <Pressable
            style={[styles.filterButton, sortBy !== 'date-newest' && styles.filterButtonActive]}
            onPress={() => setShowSortMenu(!showSortMenu)}
          >
            <Text style={styles.filterButtonText}>
              Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
            </Text>
          </Pressable>

          {/* Tags Button */}
          {allTags.length > 0 && (
            <Pressable
              style={[styles.filterButton, selectedTags.length > 0 && styles.filterButtonActive]}
              onPress={() => setShowTagsMenu(!showTagsMenu)}
            >
              <Text style={styles.filterButtonText}>
                Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
              </Text>
            </Pressable>
          )}

          {/* Archived Toggle */}
          <Pressable
            style={[styles.filterButton, showArchived && styles.filterButtonActive]}
            onPress={onToggleArchived}
          >
            <Text style={styles.filterButtonText}>
              {showArchived ? 'Hide Archived' : 'Show Archived'}
            </Text>
          </Pressable>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Pressable style={styles.clearButton} onPress={onClearFilters}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>
          )}
        </View>

        {/* Sort Menu */}
        {showSortMenu && (
          <View style={styles.menuContainer}>
            {SORT_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[styles.menuItem, sortBy === option.value && styles.menuItemActive]}
                onPress={() => {
                  onSortChange(option.value);
                  setShowSortMenu(false);
                }}
              >
                <Text
                  style={[
                    styles.menuItemText,
                    sortBy === option.value && styles.menuItemTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Tags Menu */}
        {showTagsMenu && allTags.length > 0 && (
          <ScrollView
            horizontal
            style={styles.tagsMenu}
            contentContainerStyle={styles.tagsMenuContent}
            showsHorizontalScrollIndicator={false}
          >
            {allTags.map((tag) => (
              <Pressable
                key={tag}
                style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipActive]}
                onPress={() => onToggleTag(tag)}
              >
                <Text
                  style={[
                    styles.tagChipText,
                    selectedTags.includes(tag) && styles.tagChipTextActive,
                  ]}
                >
                  {tag}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </GlassCard>
  );
};

const createStyles = (
  themeColors: typeof import('@/theme').colors,
  isDark: boolean,
): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      padding: spacing.xs,
      gap: spacing.sm,
    },
    searchInput: {
      flex: 1,
      backgroundColor: 'transparent',
      borderRadius: 14,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.sm,
      ...typography.body,
      color: themeColors.text,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 14,
      paddingHorizontal: spacing.sm,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.24)' : 'rgba(120, 120, 120, 0.24)',
      shadowColor: isDark ? '#FFFFFF' : '#000000',
      shadowOpacity: isDark ? 0.08 : 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 3,
    },
    searchIcon: {
      ...typography.body,
      color: themeColors.textSecondary,
      marginRight: spacing.xs,
      fontWeight: '700',
    },
    filterRow: {
      flexDirection: 'row',
      gap: spacing.xs,
      flexWrap: 'wrap',
    },
    filterButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    filterButtonActive: {
      backgroundColor: 'rgba(79, 70, 229, 0.3)',
      borderColor: themeColors.primary,
    },
    filterButtonText: {
      ...typography.caption,
      color: themeColors.text,
      fontWeight: '500',
    },
    clearButton: {
      backgroundColor: themeColors.error,
      borderRadius: 8,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    clearButtonText: {
      ...typography.caption,
      color: themeColors.background,
      fontWeight: '600',
    },
    menuContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      padding: spacing.xs,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    menuItem: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 4,
    },
    menuItemActive: {
      backgroundColor: 'rgba(79, 70, 229, 0.3)',
    },
    menuItemText: {
      ...typography.body,
      color: themeColors.text,
    },
    menuItemTextActive: {
      color: themeColors.primary,
      fontWeight: '600',
    },
    tagsMenu: {
      maxHeight: 50,
    },
    tagsMenuContent: {
      gap: spacing.xs,
      paddingVertical: spacing.xs,
    },
    tagChip: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 16,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    tagChipActive: {
      backgroundColor: themeColors.primary,
      borderColor: themeColors.primary,
    },
    tagChipText: {
      ...typography.caption,
      color: themeColors.text,
      fontWeight: '500',
    },
    tagChipTextActive: {
      color: themeColors.background,
    },
    actionButton: {
      backgroundColor: themeColors.primary,
      borderRadius: 8,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    actionButtonText: {
      ...typography.caption,
      color: themeColors.background,
      fontWeight: '600',
    },
  });
