import React, { JSX, memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SkiaCanvas } from '@/features/canvas/components/SkiaCanvas';
import { useShapeManipulation } from '@/features/canvas/hooks/useShapeManipulation';
import { useShapesStore } from '@store/shapesStore';
import { useUndoRedo } from '@/features/canvas/hooks/useUndoRedo';
import { GlassCard } from '@/shared/components/GlassCard';
import { PenIcon } from '@assets/icons/PenIcon';
import { colors, darkColors } from '@/theme';

// Memoized canvas to prevent re-mounting on toolbar state changes
const MemoizedSkiaCanvas = memo(SkiaCanvas);

export const CanvasScreen = (): JSX.Element => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? darkColors : colors;

  const { createRectangle, createCircle, createTriangle, deleteShape } = useShapeManipulation();
  const selectedShapeId = useShapesStore((state) => state.selectedShapeId);
  const shapes = useShapesStore((state) => state.shapes);
  const clearAll = useShapesStore((state) => state.clearAll);
  const isDrawingMode = useShapesStore((state) => state.isDrawingMode);
  const setDrawingMode = useShapesStore((state) => state.setDrawingMode);
  const { canUndo, canRedo, undo, redo } = useUndoRedo();

  const handleCreateRect = useCallback(() => createRectangle(100, 100), [createRectangle]);
  const handleCreateCircle = useCallback(() => createCircle(200, 200), [createCircle]);
  const handleCreateTriangle = useCallback(() => createTriangle(150, 300), [createTriangle]);
  const handleToggleDraw = useCallback(
    () => setDrawingMode(!isDrawingMode),
    [setDrawingMode, isDrawingMode],
  );

  const handleDelete = useCallback((): void => {
    if (selectedShapeId) {
      deleteShape(selectedShapeId);
    }
  }, [selectedShapeId, deleteShape]);

  const handleClearAll = useCallback((): void => {
    clearAll();
  }, [clearAll]);

  return (
    <View style={styles.container}>
      {/* Full screen canvas relative to this container */}
      <View style={StyleSheet.absoluteFill}>
        <MemoizedSkiaCanvas />
      </View>

      {/* Toolbar */}
      <View style={[styles.toolbarContainer, { bottom: insets.bottom + 20 }]}>
        <GlassCard
          style={styles.toolbar}
          blurAmount="strong"
          blurType={isDark ? 'dark' : 'light'}
          padding="md"
        >
          <View style={styles.toolbarContent}>
            <TouchableOpacity style={styles.toolButton} onPress={handleCreateRect}>
              <View
                style={[
                  styles.iconPlaceholder,
                  styles.rectangleIcon,
                  { backgroundColor: themeColors.shapeBlue },
                ]}
              />
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Rect</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleCreateCircle}>
              <View
                style={[
                  styles.iconPlaceholder,
                  styles.circleIcon,
                  { backgroundColor: themeColors.shapeRed },
                ]}
              />
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Circle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleCreateTriangle}>
              <View style={[styles.triangleIcon, { borderBottomColor: themeColors.shapeGreen }]} />
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Tri</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolButton, isDrawingMode && styles.toolButtonActive]}
              onPress={handleToggleDraw}
            >
              <View style={styles.iconPlaceholder}>
                <PenIcon size={24} color={themeColors.text} />
              </View>
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Draw</Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

            <TouchableOpacity
              style={[styles.toolButton, !canUndo && styles.toolButtonDisabled]}
              onPress={undo}
              disabled={!canUndo}
            >
              <View
                style={[styles.iconPlaceholder, { justifyContent: 'center', alignItems: 'center' }]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: canUndo ? themeColors.text : themeColors.textSecondary,
                  }}
                >
                  ↩️
                </Text>
              </View>
              <Text
                style={[
                  styles.toolLabel,
                  { color: canUndo ? themeColors.text : themeColors.textSecondary },
                ]}
              >
                Undo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolButton, !canRedo && styles.toolButtonDisabled]}
              onPress={redo}
              disabled={!canRedo}
            >
              <View
                style={[styles.iconPlaceholder, { justifyContent: 'center', alignItems: 'center' }]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: canRedo ? themeColors.text : themeColors.textSecondary,
                  }}
                >
                  ↪️
                </Text>
              </View>
              <Text
                style={[
                  styles.toolLabel,
                  { color: canRedo ? themeColors.text : themeColors.textSecondary },
                ]}
              >
                Redo
              </Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[
                  styles.toolButton,
                  styles.compactButton,
                  !selectedShapeId && styles.toolButtonDisabled,
                ]}
                onPress={handleDelete}
                disabled={!selectedShapeId}
              >
                <Text
                  style={[
                    styles.toolLabel,
                    { color: selectedShapeId ? themeColors.error : themeColors.textSecondary },
                  ]}
                >
                  {selectedShapeId ? 'Delete' : 'Select'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toolButton,
                  styles.compactButton,
                  shapes.length === 0 && styles.toolButtonDisabled,
                ]}
                onPress={handleClearAll}
                disabled={shapes.length === 0}
              >
                <Text
                  style={[
                    styles.toolLabel,
                    { color: shapes.length > 0 ? themeColors.error : themeColors.textSecondary },
                  ]}
                >
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Background is handled by SkiaCanvas for themes
  },
  toolbarContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  toolbar: {
    width: '100%',
    maxWidth: 400,
  },
  toolbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  toolButton: {
    alignItems: 'center',
    padding: 8,
  },
  buttonGroup: {
    alignItems: 'center',
    gap: 2,
  },
  compactButton: {
    paddingVertical: 4,
  },
  toolButtonDisabled: {
    opacity: 0.5,
  },
  toolButtonActive: {
    backgroundColor: 'rgba(128,128,128,0.2)',
    borderRadius: 8,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  rectangleIcon: {
    borderRadius: 4,
  },
  circleIcon: {
    borderRadius: 12,
  },
  triangleIcon: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 4,
  },
  toolLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 30,
    marginHorizontal: 8,
  },
});
