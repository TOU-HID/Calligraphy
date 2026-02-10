# Canvas Manager Feature

## 📋 Overview

The Canvas Manager feature provides multi-canvas management capabilities, allowing users to create, organize, navigate, and manage multiple independent drawing canvases. This is a core feature enabling users to organize their visual notes across different topics, projects, or contexts.

**Status**: 🚧 In Development  
**Priority**: HIGH  
**Est. Time**: 5-7 days  
**Phase**: 2

---

## 🎯 Goals & Requirements

### Core Requirements (from README.md)

1. **Multiple Independent Canvases**

   - Create unlimited canvases/boards
   - Each canvas supports 100+ shapes independently
   - Isolated state per canvas (no cross-canvas data leaks)

2. **Gallery View**

   - Visual thumbnail grid display
   - Canvas name and metadata
   - Last modified date
   - Shape count indicator

3. **Navigation**

   - Quick navigation between canvases
   - Smooth transitions (< 300ms)
   - Back navigation to gallery
   - Deep linking support (future)

4. **Search & Filter**

   - Search by canvas name
   - Filter by tags
   - Sort by: Name, Created date, Modified date, Shape count
   - Recent canvases list

5. **Batch Operations**
   - Duplicate canvas with all shapes
   - Delete multiple canvases
   - Archive canvases (soft delete)
   - Export/Import canvases

### Technical Requirements

1. **Performance**

   - Lazy load canvas data (only active canvas in memory)
   - Generate and cache thumbnails efficiently
   - Virtualized list for 100+ canvases
   - No memory leaks when switching canvases

2. **Storage**

   - MMKV storage for canvas metadata
   - Incremental saves (only changed data)
   - Thumbnail compression (< 50KB per thumbnail)
   - Efficient canvas list serialization

3. **State Management**
   - Zustand store for active canvas
   - Separate store for canvas list
   - Canvas metadata cache
   - Optimistic UI updates

---

## 🏗️ Architecture

### Data Flow

```
User Action → CanvasManager Hook → CanvasService → StorageService
                    ↓                      ↓              ↓
              UI Update ← Canvas Store ← Business Logic ← MMKV
```

### Component Hierarchy

```
CanvasGalleryScreen
├── CanvasGalleryHeader
│   ├── SearchBar
│   ├── FilterButton
│   └── SortButton
├── CanvasGrid (Virtualized FlatList)
│   └── CanvasThumbnail (Memoized)
│       ├── ThumbnailImage
│       ├── CanvasInfo
│       └── ContextMenu
└── CreateCanvasButton (FAB)
    └── CanvasTemplateModal
```

### Store Architecture

```typescript
// Canvas Manager Store
interface CanvasManagerState {
  // Canvas List
  canvases: CanvasMetadata[];
  activeCanvasId: string | null;

  // UI State
  isLoading: boolean;
  searchQuery: string;
  sortBy: SortOption;
  selectedTags: string[];

  // Actions
  loadCanvases: () => Promise<void>;
  createCanvas: (name: string, template?: CanvasTemplate) => Promise<string>;
  deleteCanvas: (id: string) => Promise<void>;
  duplicateCanvas: (id: string) => Promise<string>;
  updateCanvasMetadata: (id: string, updates: Partial<CanvasMetadata>) => void;
  setActiveCanvas: (id: string) => void;
  searchCanvases: (query: string) => void;
  setSortOption: (option: SortOption) => void;
}
```

---

## 📁 File Structure

```
src/features/canvasManager/
├── README.md                          # This file
├── components/
│   ├── CanvasGallery/
│   │   ├── CanvasGallery.tsx          # Main gallery component
│   │   ├── CanvasGrid.tsx             # Virtualized grid
│   │   ├── CanvasGalleryHeader.tsx    # Search, filter, sort
│   │   └── EmptyState.tsx             # No canvases state
│   ├── CanvasThumbnail/
│   │   ├── CanvasThumbnail.tsx        # Thumbnail card
│   │   ├── ThumbnailImage.tsx         # Cached image display
│   │   ├── CanvasInfo.tsx             # Name, date, count
│   │   └── ContextMenu.tsx            # Long-press actions
│   ├── CreateCanvas/
│   │   ├── CreateCanvasButton.tsx     # FAB button
│   │   ├── CreateCanvasModal.tsx      # Name input modal
│   │   └── TemplateSelector.tsx       # Template grid
│   └── CanvasActions/
│       ├── DeleteConfirmation.tsx     # Delete dialog
│       ├── DuplicateCanvas.tsx        # Duplicate with options
│       └── BatchActions.tsx           # Multi-select actions
├── hooks/
│   ├── useCanvasManager.ts            # Main canvas CRUD
│   ├── useCanvasNavigation.ts         # Navigation logic
│   ├── useCanvasSearch.ts             # Search & filter
│   ├── useThumbnailGenerator.ts       # Thumbnail creation
│   └── useCanvasSync.ts               # Metadata sync
├── services/
│   ├── CanvasService.ts               # Business logic
│   ├── ThumbnailService.ts            # Thumbnail generation
│   └── CanvasImportExport.ts          # Import/export logic
├── store/
│   └── canvasManagerStore.ts          # Zustand store
└── types/
    ├── canvas.ts                      # Canvas interfaces
    ├── template.ts                    # Template types
    └── filters.ts                     # Search/filter types
```

---

## 🔧 Implementation Plan

### Phase 1: Core Infrastructure (Days 1-2)

#### 1.1 Types & Interfaces

```typescript
// types/canvas.ts
export interface CanvasMetadata {
  id: string;
  name: string;
  thumbnail?: string;
  shapeCount: number;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  archived: boolean;
}

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  defaultShapes: Shape[];
  backgroundColor: string;
  backgroundPattern?: 'grid' | 'dots' | 'lines' | 'none';
}

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'date-newest'
  | 'date-oldest'
  | 'shapes-most'
  | 'shapes-least';

export interface CanvasFilters {
  searchQuery: string;
  tags: string[];
  sortBy: SortOption;
  showArchived: boolean;
}
```

#### 1.2 Canvas Service

```typescript
// services/CanvasService.ts
export class CanvasService {
  /**
   * Create a new canvas
   */
  static async createCanvas(name: string, template?: CanvasTemplate): Promise<string> {
    const canvasId = uuid();
    const now = Date.now();

    // Create canvas data
    const canvasData: CanvasData = {
      id: canvasId,
      name,
      shapes: template?.defaultShapes || [],
      viewport: { x: 0, y: 0, scale: 1 },
      createdAt: now,
      updatedAt: now,
    };

    // Save canvas
    StorageService.saveCanvas(canvasData);

    // Create metadata
    const metadata: CanvasMetadata = {
      id: canvasId,
      name,
      shapeCount: canvasData.shapes.length,
      createdAt: now,
      updatedAt: now,
      tags: [],
      archived: false,
    };

    // Update canvas list
    const canvases = StorageService.loadCanvasList();
    canvases.push(metadata);
    StorageService.saveCanvasList(canvases);

    // Generate thumbnail
    await ThumbnailService.generateAndSave(canvasId, canvasData);

    return canvasId;
  }

  /**
   * Delete a canvas
   */
  static async deleteCanvas(canvasId: string): Promise<void> {
    // Delete canvas data
    StorageService.deleteCanvas(canvasId);

    // Update canvas list
    const canvases = StorageService.loadCanvasList();
    const filtered = canvases.filter((c) => c.id !== canvasId);
    StorageService.saveCanvasList(filtered);

    // Clear active canvas if deleted
    const activeId = StorageService.getActiveCanvasId();
    if (activeId === canvasId) {
      StorageService.setActiveCanvasId(null);
    }
  }

  /**
   * Duplicate a canvas
   */
  static async duplicateCanvas(sourceId: string): Promise<string> {
    const sourceCanvas = StorageService.loadCanvas(sourceId);
    if (!sourceCanvas) {
      throw new Error('Source canvas not found');
    }

    const newId = uuid();
    const now = Date.now();

    // Create duplicate data
    const duplicateData: CanvasData = {
      ...sourceCanvas,
      id: newId,
      name: `${sourceCanvas.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
      shapes: sourceCanvas.shapes.map((shape) => ({
        ...shape,
        id: uuid(), // New IDs for shapes
      })),
    };

    // Save duplicate
    StorageService.saveCanvas(duplicateData);

    // Create metadata
    const metadata: CanvasMetadata = {
      id: newId,
      name: duplicateData.name,
      shapeCount: duplicateData.shapes.length,
      createdAt: now,
      updatedAt: now,
      tags: [],
      archived: false,
    };

    // Update list
    const canvases = StorageService.loadCanvasList();
    canvases.push(metadata);
    StorageService.saveCanvasList(canvases);

    // Generate thumbnail
    await ThumbnailService.generateAndSave(newId, duplicateData);

    return newId;
  }

  /**
   * Update canvas metadata
   */
  static updateCanvasMetadata(canvasId: string, updates: Partial<CanvasMetadata>): void {
    const canvases = StorageService.loadCanvasList();
    const index = canvases.findIndex((c) => c.id === canvasId);

    if (index === -1) return;

    canvases[index] = {
      ...canvases[index],
      ...updates,
      updatedAt: Date.now(),
    };

    StorageService.saveCanvasList(canvases);
  }

  /**
   * Search and filter canvases
   */
  static filterCanvases(canvases: CanvasMetadata[], filters: CanvasFilters): CanvasMetadata[] {
    let filtered = [...canvases];

    // Filter archived
    if (!filters.showArchived) {
      filtered = filtered.filter((c) => !c.archived);
    }

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter((c) => filters.tags.some((tag) => c.tags.includes(tag)));
    }

    // Sort
    switch (filters.sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date-newest':
        filtered.sort((a, b) => b.updatedAt - a.updatedAt);
        break;
      case 'date-oldest':
        filtered.sort((a, b) => a.updatedAt - b.updatedAt);
        break;
      case 'shapes-most':
        filtered.sort((a, b) => b.shapeCount - a.shapeCount);
        break;
      case 'shapes-least':
        filtered.sort((a, b) => a.shapeCount - b.shapeCount);
        break;
    }

    return filtered;
  }
}
```

---

### Phase 2: Thumbnail Generation (Day 2)

#### 2.1 Thumbnail Service

```typescript
// services/ThumbnailService.ts
import { Skia, DOMRect } from '@shopify/react-native-skia';

export class ThumbnailService {
  private static readonly THUMBNAIL_WIDTH = 320;
  private static readonly THUMBNAIL_HEIGHT = 240;
  private static readonly THUMBNAIL_QUALITY = 0.8;

  /**
   * Generate thumbnail from canvas data
   */
  static async generateThumbnail(canvasData: CanvasData): Promise<string> {
    try {
      // Create offscreen surface
      const surface = Skia.Surface.MakeOffscreen(this.THUMBNAIL_WIDTH, this.THUMBNAIL_HEIGHT);

      if (!surface) {
        throw new Error('Failed to create surface');
      }

      const canvas = surface.getCanvas();

      // Clear background
      canvas.drawColor(Skia.Color('white'));

      // Calculate bounds to fit all shapes
      const bounds = this.calculateBounds(canvasData.shapes);

      // Calculate scale to fit
      const scaleX = this.THUMBNAIL_WIDTH / bounds.width;
      const scaleY = this.THUMBNAIL_HEIGHT / bounds.height;
      const scale = Math.min(scaleX, scaleY) * 0.9; // 90% to add padding

      // Center on canvas
      const offsetX = (this.THUMBNAIL_WIDTH - bounds.width * scale) / 2 - bounds.x * scale;
      const offsetY = (this.THUMBNAIL_HEIGHT - bounds.height * scale) / 2 - bounds.y * scale;

      // Save canvas state
      canvas.save();

      // Apply transformations
      canvas.translate(offsetX, offsetY);
      canvas.scale(scale, scale);

      // Render shapes
      canvasData.shapes.forEach((shape) => {
        this.renderShape(canvas, shape);
      });

      // Restore canvas state
      canvas.restore();

      // Create image
      const image = surface.makeImageSnapshot();

      // Encode to base64 JPEG
      const base64 = image.encodeToBase64(
        Skia.ImageFormat.JPEG,
        Math.floor(this.THUMBNAIL_QUALITY * 100),
      );

      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
      return '';
    }
  }

  /**
   * Generate and save thumbnail
   */
  static async generateAndSave(canvasId: string, canvasData: CanvasData): Promise<void> {
    const thumbnail = await this.generateThumbnail(canvasData);
    if (thumbnail) {
      StorageService.saveThumbnail(canvasId, thumbnail);
    }
  }

  /**
   * Calculate bounding box for all shapes
   */
  private static calculateBounds(shapes: unknown[]): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    if (shapes.length === 0) {
      return { x: 0, y: 0, width: 100, height: 100 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    shapes.forEach((shape: any) => {
      // Calculate shape bounds based on type
      let x1, y1, x2, y2;

      if (shape.type === 'rectangle' || shape.type === 'triangle') {
        x1 = shape.x;
        y1 = shape.y;
        x2 = shape.x + shape.width;
        y2 = shape.y + shape.height;
      } else if (shape.type === 'circle') {
        x1 = shape.x - shape.radius;
        y1 = shape.y - shape.radius;
        x2 = shape.x + shape.radius;
        y2 = shape.y + shape.radius;
      } else {
        return;
      }

      minX = Math.min(minX, x1);
      minY = Math.min(minY, y1);
      maxX = Math.max(maxX, x2);
      maxY = Math.max(maxY, y2);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * Render a single shape
   */
  private static renderShape(canvas: any, shape: any): void {
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(shape.color));
    paint.setAlpha(shape.opacity * 255);

    switch (shape.type) {
      case 'rectangle':
        canvas.drawRect(Skia.XYWHRect(shape.x, shape.y, shape.width, shape.height), paint);
        break;
      case 'circle':
        canvas.drawCircle(shape.x, shape.y, shape.radius, paint);
        break;
      case 'triangle':
        const path = Skia.Path.Make();
        path.moveTo(shape.x + shape.width / 2, shape.y);
        path.lineTo(shape.x + shape.width, shape.y + shape.height);
        path.lineTo(shape.x, shape.y + shape.height);
        path.close();
        canvas.drawPath(path, paint);
        break;
    }
  }
}
```

---

### Phase 3: State Management (Day 3)

#### 3.1 Canvas Manager Store

```typescript
// store/canvasManagerStore.ts
import { create } from 'zustand';
import { CanvasMetadata, CanvasFilters, SortOption } from '../types/canvas';
import { CanvasService } from '../services/CanvasService';
import { StorageService } from '@core/storage/StorageService';

interface CanvasManagerState {
  // Data
  canvases: CanvasMetadata[];
  activeCanvasId: string | null;

  // UI State
  isLoading: boolean;
  searchQuery: string;
  sortBy: SortOption;
  selectedTags: string[];
  showArchived: boolean;

  // Computed
  filteredCanvases: () => CanvasMetadata[];

  // Actions
  loadCanvases: () => Promise<void>;
  createCanvas: (name: string) => Promise<string>;
  deleteCanvas: (id: string) => Promise<void>;
  duplicateCanvas: (id: string) => Promise<string>;
  updateCanvasMetadata: (id: string, updates: Partial<CanvasMetadata>) => void;
  setActiveCanvas: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;
  toggleTag: (tag: string) => void;
  setShowArchived: (show: boolean) => void;
  refreshCanvases: () => void;
}

export const useCanvasManagerStore = create<CanvasManagerState>((set, get) => ({
  // Initial state
  canvases: [],
  activeCanvasId: null,
  isLoading: false,
  searchQuery: '',
  sortBy: 'date-newest',
  selectedTags: [],
  showArchived: false,

  // Computed values
  filteredCanvases: () => {
    const state = get();
    const filters: CanvasFilters = {
      searchQuery: state.searchQuery,
      tags: state.selectedTags,
      sortBy: state.sortBy,
      showArchived: state.showArchived,
    };
    return CanvasService.filterCanvases(state.canvases, filters);
  },

  // Actions
  loadCanvases: async () => {
    set({ isLoading: true });
    try {
      const canvases = StorageService.loadCanvasList();
      const activeId = StorageService.getActiveCanvasId();
      set({ canvases, activeCanvasId: activeId, isLoading: false });
    } catch (error) {
      console.error('Failed to load canvases:', error);
      set({ isLoading: false });
    }
  },

  createCanvas: async (name: string) => {
    try {
      const canvasId = await CanvasService.createCanvas(name);
      await get().loadCanvases();
      return canvasId;
    } catch (error) {
      console.error('Failed to create canvas:', error);
      throw error;
    }
  },

  deleteCanvas: async (id: string) => {
    try {
      await CanvasService.deleteCanvas(id);
      await get().loadCanvases();
    } catch (error) {
      console.error('Failed to delete canvas:', error);
      throw error;
    }
  },

  duplicateCanvas: async (id: string) => {
    try {
      const newId = await CanvasService.duplicateCanvas(id);
      await get().loadCanvases();
      return newId;
    } catch (error) {
      console.error('Failed to duplicate canvas:', error);
      throw error;
    }
  },

  updateCanvasMetadata: (id: string, updates: Partial<CanvasMetadata>) => {
    CanvasService.updateCanvasMetadata(id, updates);
    get().refreshCanvases();
  },

  setActiveCanvas: (id: string) => {
    StorageService.setActiveCanvasId(id);
    set({ activeCanvasId: id });
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setSortBy: (sortBy: SortOption) => set({ sortBy }),

  toggleTag: (tag: string) =>
    set((state) => {
      const tags = state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag];
      return { selectedTags: tags };
    }),

  setShowArchived: (show: boolean) => set({ showArchived: show }),

  refreshCanvases: () => {
    const canvases = StorageService.loadCanvasList();
    set({ canvases });
  },
}));
```

---

### Phase 4: UI Components (Days 4-5)

#### 4.1 Canvas Gallery Component

```typescript
// components/CanvasGallery/CanvasGallery.tsx
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useCanvasManagerStore } from '../../store/canvasManagerStore';
import { CanvasThumbnail } from '../CanvasThumbnail/CanvasThumbnail';
import { CanvasGalleryHeader } from './CanvasGalleryHeader';
import { EmptyState } from './EmptyState';
import { CreateCanvasButton } from '../CreateCanvas/CreateCanvasButton';

export const CanvasGallery: React.FC = () => {
  const { filteredCanvases, isLoading, loadCanvases } = useCanvasManagerStore();

  const canvases = filteredCanvases();

  useEffect(() => {
    loadCanvases();
  }, []);

  const renderItem = ({ item }: { item: CanvasMetadata }) => <CanvasThumbnail canvas={item} />;

  const keyExtractor = (item: CanvasMetadata) => item.id;

  return (
    <View style={styles.container}>
      <CanvasGalleryHeader />

      {canvases.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={canvases}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          contentContainerStyle={styles.grid}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={8}
        />
      )}

      <CreateCanvasButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    padding: 16,
  },
});
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
describe('CanvasService', () => {
  it('creates canvas with unique ID', async () => {
    const id = await CanvasService.createCanvas('Test Canvas');
    expect(id).toBeTruthy();

    const canvas = StorageService.loadCanvas(id);
    expect(canvas?.name).toBe('Test Canvas');
  });

  it('duplicates canvas with new IDs', async () => {
    const sourceId = await CanvasService.createCanvas('Original');
    const duplicateId = await CanvasService.duplicateCanvas(sourceId);

    expect(duplicateId).not.toBe(sourceId);

    const duplicate = StorageService.loadCanvas(duplicateId);
    expect(duplicate?.name).toContain('Copy');
  });

  it('filters canvases by search query', () => {
    const canvases = [
      { id: '1', name: 'Meeting Notes', tags: [] },
      { id: '2', name: 'Project Plan', tags: [] },
    ];

    const filtered = CanvasService.filterCanvases(canvases, {
      searchQuery: 'meeting',
      tags: [],
      sortBy: 'date-newest',
      showArchived: false,
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Meeting Notes');
  });
});
```

---

## 📊 Success Criteria

- [ ] Can create unlimited canvases
- [ ] Gallery displays with thumbnails
- [ ] Navigation < 300ms between canvases
- [ ] Search works instantly
- [ ] Sort options work correctly
- [ ] Duplicate preserves all shapes
- [ ] Delete requires confirmation
- [ ] Thumbnails generated efficiently (< 500ms)
- [ ] No memory leaks with 100+ canvases
- [ ] 70% test coverage

---

## 🚀 Future Enhancements

- **Cloud Sync**: Sync canvases across devices
- **Collaboration**: Share canvases with others
- **Version History**: Canvas snapshots and restore
- **Smart Collections**: Auto-organize by tags/content
- **Canvas Templates**: Save and share templates
- **Bulk Import**: Import multiple canvases
- **Analytics**: Track canvas usage

---

## 📖 Related Documentation

- [Phase 2 Plan](../../../PHASE_2_PLAN.md)
- [Canvas Feature](../canvas/README.md)
- [Storage Service](../../core/storage/README.md)

---

**Status**: Documentation Complete ✅ | Implementation Starting 🚀
