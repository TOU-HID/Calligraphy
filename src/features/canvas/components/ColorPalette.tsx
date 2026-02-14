import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useShapesStore } from '@store/shapesStore';

const COLORS = [
  '#000000', // Black
  '#ffffff', // White
  '#e74c3c', // Alizarin (Red)
  '#e67e22', // Carrot (Orange)
  '#f1c40f', // Sun Flower (Yellow)
  '#2ecc71', // Emerald (Green)
  '#1abc9c', // Turquoise (Teal)
  '#3498db', // Peter River (Blue)
  '#9b59b6', // Amethyst (Purple)
  '#34495e', // Wet Asphalt (Dark Blue/Gray)
  '#7f8c8d', // Asbestos (Gray)
  '#d35400', // Pumpkin
  '#c0392b', // Pomegranate
  '#27ae60', // Nephritis
  '#2980b9', // Belize Hole
  '#8e44ad', // Wisteria
];

export const ColorPalette: React.FC = () => {
  const activeColor = useShapesStore((state) => state.drawingConfig.color);
  const setDrawingConfig = useShapesStore((state) => state.setDrawingConfig);
  const selectedShapeId = useShapesStore((state) => state.selectedShapeId);
  const updateShape = useShapesStore((state) => state.updateShape);

  const handleColorSelect = (color: string) => {
    // Update global drawing color
    setDrawingConfig({ color });

    // If a shape is selected, update its color too
    if (selectedShapeId) {
      updateShape(selectedShapeId, { color });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => handleColorSelect(color)}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              activeColor === color && styles.activeColorCircle,
              color === '#ffffff' && styles.whiteBorder,
            ]}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 15,
    gap: 12,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeColorCircle: {
    borderColor: 'rgba(255, 255, 255, 0.8)',
    transform: [{ scale: 1.15 }],
  },
  whiteBorder: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});
