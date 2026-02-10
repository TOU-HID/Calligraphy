import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SkiaCanvas } from '@/features/canvas/components/SkiaCanvas';
import { useShapeManipulation } from '@/features/canvas/hooks/useShapeManipulation';
import { useShapesStore } from '@store/shapesStore';
import { useUndoRedo } from '@/features/canvas/hooks/useUndoRedo';
import { GlassCard } from '@/shared/components/GlassCard';
import { PenIcon } from '@assets/icons/PenIcon';
import { colors, darkColors } from '@/theme';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/types';
import { StorageService } from '@core/storage/StorageService';
import { Shape } from '@features/canvas/types/shapes';
import { useCanvasManagerStore } from '@features/canvasManager';

// Memoized canvas to prevent re-mounting on toolbar state changes
const MemoizedSkiaCanvas = memo(SkiaCanvas);

type CanvasScreenProps = {
  route?: RouteProp<RootStackParamList, 'Canvas'>;
  navigation?: StackNavigationProp<RootStackParamList, 'Canvas'>;
};

export const CanvasScreen: React.FC<CanvasScreenProps> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? darkColors : colors;
  const canvasId = route?.params?.canvasId;

  const { createRectangle, createCircle, createTriangle, deleteShape } = useShapeManipulation();
  const selectedShapeId = useShapesStore((state) => state.selectedShapeId);
  const shapes = useShapesStore((state) => state.shapes);
  const clearAll = useShapesStore((state) => state.clearAll);
  const isDrawingMode = useShapesStore((state) => state.isDrawingMode);
  const setDrawingMode = useShapesStore((state) => state.setDrawingMode);
  const setShapes = useShapesStore((state) => state.setShapes);
  const setCanvasInfo = useShapesStore((state) => state.setCanvasInfo);
  const canvasName = useShapesStore((state) => state.canvasName);
  const { canUndo, canRedo, undo, redo } = useUndoRedo();
  const setActiveCanvas = useCanvasManagerStore((state) => state.setActiveCanvas);
  const renameCanvas = useCanvasManagerStore((state) => state.renameCanvas);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

  // Load canvas on mount
  useEffect(() => {
    if (!canvasId) return;

    const canvas = StorageService.loadCanvas(canvasId);
    if (canvas) {
      setShapes(canvas.shapes as Shape[]);
      setCanvasInfo(canvas.id, canvas.name);
      setActiveCanvas(canvas.id);
    }
  }, [canvasId, setShapes, setCanvasInfo, setActiveCanvas]);

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

  const handleGoBack = useCallback((): void => {
    navigation?.goBack();
  }, [navigation]);

  const handleStartEditName = useCallback((): void => {
    setEditedName(canvasName);
    setIsEditingName(true);
  }, [canvasName]);

  const handleSaveName = useCallback(async (): Promise<void> => {
    const trimmedName = editedName.trim();
    if (!trimmedName) {
      Alert.alert('Invalid Name', 'Canvas name cannot be empty');
      return;
    }
    if (canvasId && trimmedName !== canvasName) {
      await renameCanvas(canvasId, trimmedName);
      setCanvasInfo(canvasId, trimmedName);
    }
    setIsEditingName(false);
  }, [editedName, canvasId, canvasName, renameCanvas, setCanvasInfo]);

  const handleCancelEdit = useCallback((): void => {
    setIsEditingName(false);
    setEditedName('');
  }, []);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      {navigation && (
        <View style={[styles.backButtonContainer, { top: insets.top + 10 }]}>
          <GlassCard blurAmount="strong" blurType={isDark ? 'dark' : 'light'} padding={null}>
            <Pressable style={styles.backButton} onPress={handleGoBack}>
              <Text style={[styles.backButtonText, { color: themeColors.text }]}>← Gallery</Text>
            </Pressable>
          </GlassCard>
        </View>
      )}

      {/* Canvas Name Editor */}
      <View style={[styles.nameContainer, { top: insets.top + 10 }]}>
        <GlassCard blurAmount="strong" blurType={isDark ? 'dark' : 'light'} padding={null}>
          {isEditingName ? (
            <View style={styles.nameEditRow}>
              <TextInput
                style={[styles.nameInput, { color: themeColors.text }]}
                value={editedName}
                onChangeText={setEditedName}
                autoFocus
                selectTextOnFocus
                onSubmitEditing={handleSaveName}
                returnKeyType="done"
                placeholderTextColor={themeColors.textSecondary}
              />
              <Pressable style={styles.nameSaveButton} onPress={handleSaveName}>
                <Text style={styles.nameButtonText}>✓</Text>
              </Pressable>
              <Pressable style={styles.nameCancelButton} onPress={handleCancelEdit}>
                <Text style={styles.nameButtonText}>✕</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.nameDisplayRow} onPress={handleStartEditName}>
              <Text style={[styles.nameText, { color: themeColors.text }]} numberOfLines={1}>
                {canvasName}
              </Text>
              <Text style={[styles.editIcon, { color: themeColors.textSecondary }]}>✎</Text>
            </Pressable>
          )}
        </GlassCard>
      </View>

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
  backButtonContainer: {
    position: 'absolute',
    left: 20,
    zIndex: 1000,
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  nameContainer: {
    position: 'absolute',
    left: 110,
    right: 20,
    zIndex: 999,
  },
  nameDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  nameText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  editIcon: {
    fontSize: 13,
  },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 6,
  },
  nameInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 4,
    minHeight: 28,
  },
  nameSaveButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameCancelButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
