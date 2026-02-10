import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { useShapesStore } from '@store/shapesStore';
import { findResizeHandle, findShapeAtPoint, ResizeHandle } from '../utils/hitTesting';
import { commandManager } from '../commands/CommandManager';
import { UpdateShapeCommand } from '../commands/UpdateShapeCommand';
import { Shape } from '../types/shapes';

interface GestureResult {
  gesture: ReturnType<typeof Gesture.Race>;
}

export const useGestures = (): GestureResult => {
  // Shape dragging state
  const draggedShapeId = useSharedValue<string | null>(null);
  const shapeStartX = useSharedValue(0);
  const shapeStartY = useSharedValue(0);
  
  // Resize state
  const activeHandle = useSharedValue<ResizeHandle>(null);
  const initialShapeWidth = useSharedValue(0);
  const initialShapeHeight = useSharedValue(0);
  const initialShapeRadius = useSharedValue(0);

  // Read state lazily via getState() to avoid re-renders
  const getShapes = () => useShapesStore.getState().shapes;
  const getSelectedShapeId = () => useShapesStore.getState().selectedShapeId;
  const getIsDrawingMode = () => useShapesStore.getState().isDrawingMode;

  // Handle shape selection
  const handleShapeSelection = (x: number, y: number): void => {
    const shapes = getShapes();
    // Since the canvas is fixed (no pan/zoom), screen coords = canvas coords
    const point = { x, y };
    const hitShape = findShapeAtPoint(point, shapes);

    if (hitShape) {
      useShapesStore.getState().selectShape(hitShape.id);
    } else {
      useShapesStore.getState().selectShape(null);
    }
  };

  // Handle shape drag update
  const handleShapeMove = (shapeId: string, newX: number, newY: number): void => {
    useShapesStore.getState().updateShape(shapeId, { x: newX, y: newY });
  };

  const handleShapeResize = (shapeId: string, updates: Partial<Shape>): void => {
    useShapesStore.getState().updateShape(shapeId, updates);
  };
  
  const finalizeShapeUpdate = (id: string, oldProps: Partial<Shape>, newProps: Partial<Shape>) => {
    commandManager.execute(new UpdateShapeCommand(id, oldProps, newProps));
  };

  // Check drawing mode from JS thread for gesture start
  const checkDrawingAndSelect = (x: number, y: number) => {
    if (getIsDrawingMode()) return;
    handleShapeSelection(x, y);
  };

  const getPanStartState = (eventX: number, eventY: number) => {
    if (getIsDrawingMode()) return;

    const shapes = getShapes();
    const selectedShapeId = getSelectedShapeId();
    const point = { x: eventX, y: eventY };

    // Check for resize handle hit if a shape is selected
    if (selectedShapeId) {
      const selectedShape = shapes.find(s => s.id === selectedShapeId);
      if (selectedShape) {
        const handle = findResizeHandle(point, selectedShape);
        if (handle) {
          activeHandle.value = handle;
          draggedShapeId.value = selectedShape.id;
          shapeStartX.value = selectedShape.x;
          shapeStartY.value = selectedShape.y;
          if (selectedShape.type === 'rectangle' || selectedShape.type === 'triangle') {
            initialShapeWidth.value = selectedShape.width;
            initialShapeHeight.value = selectedShape.height;
          } else if (selectedShape.type === 'circle') {
            initialShapeRadius.value = selectedShape.radius;
          }
          return;
        }
      }
    }

    const hitShape = findShapeAtPoint(point, shapes);
    if (hitShape && hitShape.id === selectedShapeId) {
      // Start dragging this shape
      draggedShapeId.value = hitShape.id;
      shapeStartX.value = hitShape.x;
      shapeStartY.value = hitShape.y;
      activeHandle.value = null;
    } else {
      // No shape hit — do nothing (canvas is fixed)
      draggedShapeId.value = null;
      activeHandle.value = null;
    }
  };

  // Tap gesture (for shape selection)
  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .onEnd((event) => {
      runOnJS(checkDrawingAndSelect)(event.x, event.y);
    });

  // Pan gesture for one finger (shape dragging/resizing only)
  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .onStart((event) => {
      'worklet';
      runOnJS(getPanStartState)(event.x, event.y);
    })
    .onUpdate((event) => {
      'worklet';

      if (draggedShapeId.value) {
        const deltaX = event.translationX;
        const deltaY = event.translationY;

        if (activeHandle.value) {
           // Resizing logic
           const updates: any = {};
           
           if (activeHandle.value === 'bottom-right') {
             updates.width = initialShapeWidth.value + deltaX;
             updates.height = initialShapeHeight.value + deltaY;
             updates.radius = initialShapeRadius.value + Math.max(deltaX, deltaY);
           } else if (activeHandle.value === 'bottom-left') {
             updates.x = shapeStartX.value + deltaX;
             updates.width = initialShapeWidth.value - deltaX;
             updates.height = initialShapeHeight.value + deltaY;
           } else if (activeHandle.value === 'top-right') {
             updates.y = shapeStartY.value + deltaY;
             updates.width = initialShapeWidth.value + deltaX;
             updates.height = initialShapeHeight.value - deltaY;
           } else if (activeHandle.value === 'top-left') {
             updates.x = shapeStartX.value + deltaX;
             updates.y = shapeStartY.value + deltaY;
             updates.width = initialShapeWidth.value - deltaX;
             updates.height = initialShapeHeight.value - deltaY;
           }
           
           runOnJS(handleShapeResize)(draggedShapeId.value, updates);
        } else {
           // Dragging logic
           const newX = shapeStartX.value + deltaX;
           const newY = shapeStartY.value + deltaY;
           runOnJS(handleShapeMove)(draggedShapeId.value, newX, newY);
        }
      }
      // If no shape is being dragged, do nothing — canvas stays fixed
    })
    .onEnd((event) => {
      'worklet';
      
      if (draggedShapeId.value) {
         const deltaX = event.translationX;
         const deltaY = event.translationY;
         
         const oldProps: any = {};
         const newProps: any = {};

         if (activeHandle.value) {
             // Resize End - Create Command
             if (activeHandle.value === 'bottom-right') {
                oldProps.width = initialShapeWidth.value;
                oldProps.height = initialShapeHeight.value;
                oldProps.radius = initialShapeRadius.value;
                
                newProps.width = initialShapeWidth.value + deltaX;
                newProps.height = initialShapeHeight.value + deltaY;
                newProps.radius = initialShapeRadius.value + Math.max(deltaX, deltaY);
             } else if (activeHandle.value === 'bottom-left') {
                oldProps.x = shapeStartX.value;
                oldProps.width = initialShapeWidth.value;
                oldProps.height = initialShapeHeight.value;

                newProps.x = shapeStartX.value + deltaX;
                newProps.width = initialShapeWidth.value - deltaX;
                newProps.height = initialShapeHeight.value + deltaY;
             } else if (activeHandle.value === 'top-right') {
                oldProps.y = shapeStartY.value;
                oldProps.width = initialShapeWidth.value;
                oldProps.height = initialShapeHeight.value;

                newProps.y = shapeStartY.value + deltaY;
                newProps.width = initialShapeWidth.value + deltaX;
                newProps.height = initialShapeHeight.value - deltaY;
             } else if (activeHandle.value === 'top-left') {
                oldProps.x = shapeStartX.value;
                oldProps.y = shapeStartY.value;
                oldProps.width = initialShapeWidth.value;
                oldProps.height = initialShapeHeight.value;

                newProps.x = shapeStartX.value + deltaX;
                newProps.y = shapeStartY.value + deltaY;
                newProps.width = initialShapeWidth.value - deltaX;
                newProps.height = initialShapeHeight.value - deltaY;
             }
         } else {
             // Move End - Create Command
             oldProps.x = shapeStartX.value;
             oldProps.y = shapeStartY.value;
             
             newProps.x = shapeStartX.value + deltaX;
             newProps.y = shapeStartY.value + deltaY;
         }
         
         runOnJS(finalizeShapeUpdate)(draggedShapeId.value, oldProps, newProps);
      }
      
      draggedShapeId.value = null;
      activeHandle.value = null;
    });

  // Combine gestures — tap and pan only, no canvas panning or zooming
  const composedGesture = Gesture.Race(tapGesture, panGesture);

  return {
    gesture: composedGesture,
  };
};
