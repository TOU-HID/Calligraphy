import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SkiaCanvas } from '@/features/canvas/components/SkiaCanvas';
import { ShapeIcon } from '@/features/canvas/components/ShapeIcon';

import { useCanvasRef } from '@shopify/react-native-skia';
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
import { ImageExportService } from '@/features/canvas/services/ImageExportService';
import { commandManager } from '@/features/canvas/commands/CommandManager';
import { ClearAllCommand } from '@/features/canvas/commands/ClearAllCommand';

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
  const canvasRef = useCanvasRef();

  const { 
    createRectangle, createCircle, createTriangle, createOval, createStar, createHexagon, createDiamond, 
    createPentagon, createOctagon, createHeptagon, createHeart, createArrow,
    deleteShape 
  } = useShapeManipulation();
  const selectedShapeId = useShapesStore((state) => state.selectedShapeId);
  const shapes = useShapesStore((state) => state.shapes);
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

  const handleCreateRect = useCallback(() => createRectangle(150, 300), [createRectangle]);
  const handleCreateCircle = useCallback(() => createCircle(150, 300), [createCircle]);
  const handleCreateTriangle = useCallback(() => createTriangle(150, 300), [createTriangle]);
  const handleCreateOval = useCallback(() => createOval(150, 300), [createOval]);
  const handleCreateStar = useCallback(() => createStar(150, 300), [createStar]);
  const handleCreateHexagon = useCallback(() => createHexagon(150, 300), [createHexagon]);
  const handleCreateDiamond = useCallback(() => createDiamond(150, 300), [createDiamond]);
  const handleCreatePentagon = useCallback(() => createPentagon(150, 300), [createPentagon]);
  const handleCreateOctagon = useCallback(() => createOctagon(150, 300), [createOctagon]);
  const handleCreateHeptagon = useCallback(() => createHeptagon(150, 300), [createHeptagon]);
  const handleCreateHeart = useCallback(() => createHeart(150, 300), [createHeart]);
  const handleCreateArrow = useCallback(() => createArrow(150, 300), [createArrow]);
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
    commandManager.execute(new ClearAllCommand());
  }, []);

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

  const handleShare = useCallback(async (): Promise<void> => {
    try {
      const snapshot = canvasRef.current?.makeImageSnapshot();
      if (!snapshot) {
        Alert.alert('Capture failed', 'Could not capture canvas snapshot.');
        return;
      }
      await ImageExportService.exportAsPNG(snapshot, canvasName);
    } catch (error) {
      console.error('Share failed:', error);
      Alert.alert('Share Failed', 'Could not share your drawing. Please try again.');
    }
  }, [canvasRef, canvasName]);

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={[styles.headerRowContainer, { top: insets.top + 4 }]}>
        {navigation && (
          <GlassCard style={styles.headerCard} blurAmount="strong" blurType={isDark ? 'dark' : 'light'} padding={null}>
            <Pressable style={styles.backButton} onPress={handleGoBack}>
              <Text style={[styles.backButtonText, { color: themeColors.text }]}>← Gallery</Text>
            </Pressable>
          </GlassCard>
        )}

        {/* Canvas Name Editor */}
        <GlassCard 
          style={styles.nameCard} 
          blurAmount="strong" 
          blurType={isDark ? 'dark' : 'light'} 
          padding={null}
        >
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
              <View style={styles.editActions}>
                <Pressable style={styles.nameSaveButton} onPress={handleSaveName}>
                  <Text style={styles.nameButtonText}>✓</Text>
                </Pressable>
                <Pressable style={styles.nameCancelButton} onPress={handleCancelEdit}>
                  <Text style={styles.nameButtonText}>✕</Text>
                </Pressable>
              </View>
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

      {/* Side Utility Column */}
      <View style={[styles.rightColumn, { top: insets.top + 4 }]}>
        {/* Side Utility Bar */}
        <GlassCard
          style={styles.sideUtilityBar}
          blurAmount="strong"
          blurType={isDark ? 'dark' : 'light'}
          padding={null}
        >
          <View style={styles.sideUtilityContent}>
            <TouchableOpacity
              style={[styles.toolButton, shapes.length === 0 && styles.toolButtonDisabled]}
              onPress={handleShare}
              disabled={shapes.length === 0}
            >
              <View style={styles.iconPlaceholder}>
                <Text style={{ fontSize: 14 }}>📤</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.sideDivider, { backgroundColor: themeColors.border }]} />

            <TouchableOpacity
              style={[styles.toolButton, !canUndo && styles.toolButtonDisabled]}
              onPress={undo}
              disabled={!canUndo}
            >
              <View style={styles.iconPlaceholder}>
                <Text style={{ fontSize: 14 }}>↩️</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolButton, !canRedo && styles.toolButtonDisabled]}
              onPress={redo}
              disabled={!canRedo}
            >
              <View style={styles.iconPlaceholder}>
                <Text style={{ fontSize: 14 }}>↪️</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.sideDivider, { backgroundColor: themeColors.border }]} />

            <TouchableOpacity
              style={[
                styles.toolButton,
                !selectedShapeId && styles.toolButtonDisabled,
              ]}
              onPress={handleDelete}
              disabled={!selectedShapeId}
            >
              <View style={styles.iconPlaceholder}>
                <Text style={{ fontSize: 14 }}>🗑️</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolButton,
                shapes.length === 0 && styles.toolButtonDisabled,
              ]}
              onPress={handleClearAll}
              disabled={shapes.length === 0}
            >
              <View style={styles.iconPlaceholder}>
                <Text style={{ fontSize: 14 }}>🧹</Text>
              </View>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>

      {/* Full screen canvas relative to this container */}
      <View style={StyleSheet.absoluteFill}>
        <MemoizedSkiaCanvas ref={canvasRef} />
      </View>

      {/* Bottom Shape Palette (Top layer now single layer) */}
      <View style={[styles.toolbarContainer, { bottom: insets.bottom + 10 }]}>
        <GlassCard
          style={styles.drawButtonCard}
          blurAmount="strong"
          blurType={isDark ? 'dark' : 'light'}
          padding={null}
        >
          <TouchableOpacity
            style={[
              styles.toolButton, 
              { minWidth: 0, paddingHorizontal: 12, paddingVertical: 6 }, 
              isDrawingMode && styles.toolButtonActive
            ]}
            onPress={handleToggleDraw}
          >
            <View style={styles.iconPlaceholder}>
              <PenIcon size={20} color={themeColors.text} />
            </View>
            <Text style={[styles.toolLabel, { color: themeColors.text, fontSize: 10 }]}>Draw</Text>
          </TouchableOpacity>
        </GlassCard>

        <GlassCard
          style={styles.shapesToolbar}
          blurAmount="strong"
          blurType={isDark ? 'dark' : 'light'}
          padding={null}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.shapesScrollView}
            contentContainerStyle={styles.shapesContent}
          >

            <TouchableOpacity style={styles.toolButton} onPress={handleCreateTriangle}>
              <View style={styles.iconPlaceholder}>
                <ShapeIcon type="triangle" color={themeColors.shapeGreen} />
              </View>
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Tri</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleCreateCircle}>
              <View style={styles.iconPlaceholder}>
                <ShapeIcon type="circle" color={themeColors.shapeRed} />
              </View>
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Circle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleCreateRect}>
              <View style={styles.iconPlaceholder}>
                <ShapeIcon type="rectangle" color={themeColors.shapeBlue} />
              </View>
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Rect</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleCreateOval}>
              <View style={styles.iconPlaceholder}>
                <ShapeIcon type="oval" color="#9b59b6" />
              </View>
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Oval</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleCreateStar}>
              <View style={styles.iconPlaceholder}>
                <ShapeIcon type="star" color="#f1c40f" />
              </View>
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Star</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleCreateHexagon}>
              <View style={styles.iconPlaceholder}>
                <ShapeIcon type="hexagon" color="#e67e22" />
              </View>
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Hex</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleCreateDiamond}>
              <View style={styles.iconPlaceholder}>
                <ShapeIcon type="diamond" color="#1abc9c" />
              </View>
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Diamond</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleCreatePentagon}>
              <View style={styles.iconPlaceholder}>
                <ShapeIcon type="pentagon" color="#3498db" />
              </View>
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Pent</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleCreateOctagon}>
              <View style={styles.iconPlaceholder}>
                <ShapeIcon type="octagon" color="#9b59b6" />
              </View>
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Oct</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleCreateHeptagon}>
              <View style={styles.iconPlaceholder}>
                <ShapeIcon type="heptagon" color="#2ecc71" />
              </View>
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Hept</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleCreateHeart}>
              <View style={styles.iconPlaceholder}>
                <ShapeIcon type="heart" color="#e74c3c" />
              </View>
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Heart</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleCreateArrow}>
              <View style={styles.iconPlaceholder}>
                <ShapeIcon type="arrow" color="#34495e" />
              </View>
              <Text style={[styles.toolLabel, { color: themeColors.text }]}>Arrow</Text>
            </TouchableOpacity>
          </ScrollView>
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
    left: 10,
    right: 10,
    alignItems: 'center',
    gap: 8, // Vertical gap between Draw button and shapes list
  },
  shapesToolbar: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 2,
  },
  drawButtonCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 0, // Highlight fills the button
    alignSelf: 'flex-start', // Position to the left
  },
  rightColumn: {
    position: 'absolute',
    right: 8,
    zIndex: 1001,
    alignItems: 'center',
    gap: 8,
  },
  sideUtilityBar: {
    borderRadius: 8, // Sharper corners
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    width: 36, // Thinner width
  },
  sideUtilityContent: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  sideDivider: {
    width: '60%',
    height: 1,
    marginVertical: 4,
  },
  shapesScrollView: {
    flex: 1,
  },
  shapesContent: {
    paddingHorizontal: 15,
    paddingVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  toolButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1, // Minimal vertical space
    minWidth: 36, // Match thinner bar width
  },
  toolButtonActive: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderRadius: 8,
  },
  toolButtonDisabled: {
    opacity: 0.5,
  },
  toolLabel: {
    fontSize: 9,
    fontWeight: '500',
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 14, // Even shorter divider
    marginHorizontal: 8,
  },
  headerRowContainer: {
    position: 'absolute',
    left: 8,
    right: 52, // 8pt gap from the side bar (36 width + 8 right padding + 8 gap = 52)
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerCard: {
    borderRadius: 8,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    minHeight: 30,
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 8,
  },
  nameCard: {
    flex: 1,
    borderRadius: 8,
  },
  nameDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    minHeight: 30,
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
    minHeight: 30,
    gap: 6,
  },
  nameInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
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
