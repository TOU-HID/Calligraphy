/**
 * Canvas Manager Store
 *
 * Zustand store for managing multiple canvases
 */

import { create } from 'zustand';
import { CanvasMetadata, StorageService } from '@core/storage/StorageService';
import { CanvasService, ThumbnailService } from '@features/canvasManager/services';
import { CanvasFilters, CanvasTemplate, SortOption } from '@features/canvasManager/types';

/**
 * Helper: Safely validate and return thumbnail or undefined
 */
const getValidThumbnail = (canvasId: string): string | undefined => {
  try {
    const thumbnail = ThumbnailService.getThumbnail(canvasId);
    if (thumbnail && typeof thumbnail === 'string' && thumbnail.trim().length > 0) {
      return thumbnail;
    }
    return undefined;
  } catch (error) {
    console.warn(`Failed to load thumbnail for canvas ${canvasId}:`, error);
    return undefined;
  }
};

interface CanvasManagerState {
  // State
  canvases: CanvasMetadata[];
  activeCanvasId: string | null;
  searchQuery: string;
  sortBy: SortOption;
  selectedTags: string[];
  showArchived: boolean;
  isLoading: boolean;

  // Computed
  filteredCanvases: () => CanvasMetadata[];
  activeCanvas: () => CanvasMetadata | undefined;
  allTags: () => string[];

  // Actions
  loadCanvases: () => void;
  refreshCanvases: () => void;
  createCanvas: (name: string, template?: CanvasTemplate) => Promise<string>;
  deleteCanvas: (canvasId: string) => Promise<void>;
  duplicateCanvas: (canvasId: string) => Promise<string>;
  renameCanvas: (canvasId: string, newName: string) => Promise<void>;
  setActiveCanvas: (canvasId: string | null) => void;
  updateCanvasMetadata: (canvasId: string, updates: Partial<CanvasMetadata>) => void;
  archiveCanvas: (canvasId: string) => void;
  restoreCanvas: (canvasId: string) => void;

  // Batch operations
  batchDelete: (canvasIds: string[]) => Promise<void>;
  batchDuplicate: (canvasIds: string[]) => Promise<void>;

  // Search & Filter
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  toggleShowArchived: () => void;

  // Tags
  addTagToCanvas: (canvasId: string, tag: string) => void;
  removeTagFromCanvas: (canvasId: string, tag: string) => void;

  // Thumbnails
  regenerateThumbnail: (canvasId: string) => Promise<void>;
  regenerateAllThumbnails: () => Promise<void>;
}

export const useCanvasManagerStore = create<CanvasManagerState>((set, get) => ({
  // Initial state
  canvases: [],
  activeCanvasId: null,
  searchQuery: '',
  sortBy: 'date-newest',
  selectedTags: [],
  showArchived: false,
  isLoading: false,

  // Computed values
  filteredCanvases: () => {
    const { canvases, searchQuery, sortBy, selectedTags, showArchived } = get();

    const filters: CanvasFilters = {
      searchQuery,
      sortBy,
      tags: selectedTags,
      showArchived,
    };

    return CanvasService.filterCanvases(canvases, filters);
  },

  activeCanvas: () => {
    const { canvases, activeCanvasId } = get();
    return canvases.find((c) => c.id === activeCanvasId);
  },

  allTags: () => {
    return CanvasService.getAllTags();
  },

  // Load canvases from storage
  loadCanvases: () => {
    set({ isLoading: true });
    const canvases = StorageService.loadCanvasList();
    // Load thumbnails for each canvas with validation
    const canvasesWithThumbnails = canvases.map((canvas) => ({
      ...canvas,
      thumbnail: getValidThumbnail(canvas.id),
    }));
    const activeCanvasId = StorageService.getActiveCanvasId();
    set({ canvases: canvasesWithThumbnails, activeCanvasId, isLoading: false });
  },

  // Refresh canvases list
  refreshCanvases: () => {
    const canvases = StorageService.loadCanvasList();
    // Load thumbnails for each canvas with validation
    const canvasesWithThumbnails = canvases.map((canvas) => ({
      ...canvas,
      thumbnail: getValidThumbnail(canvas.id),
    }));
    set({ canvases: canvasesWithThumbnails });
  },

  // Create new canvas
  createCanvas: async (name: string, template?: CanvasTemplate) => {
    const canvasId = await CanvasService.createCanvas(name, template);

    // Regenerate thumbnail if template has shapes
    if (template?.defaultShapes && template.defaultShapes.length > 0) {
      await ThumbnailService.generateAndSave(canvasId);
    }

    get().refreshCanvases();
    return canvasId;
  },

  // Delete canvas
  deleteCanvas: async (canvasId: string) => {
    await CanvasService.deleteCanvas(canvasId);
    ThumbnailService.deleteThumbnail(canvasId);
    get().refreshCanvases();
  },

  // Duplicate canvas
  duplicateCanvas: async (canvasId: string) => {
    const newId = await CanvasService.duplicateCanvas(canvasId);

    // Copy thumbnail
    const thumbnail = ThumbnailService.getThumbnail(canvasId);
    if (thumbnail) {
      StorageService.saveThumbnail(newId, thumbnail);
    }

    get().refreshCanvases();
    return newId;
  },

  // Rename canvas
  renameCanvas: async (canvasId: string, newName: string) => {
    await CanvasService.renameCanvas(canvasId, newName);
    get().refreshCanvases();
  },

  // Set active canvas
  setActiveCanvas: (canvasId: string | null) => {
    StorageService.setActiveCanvasId(canvasId);
    set({ activeCanvasId: canvasId });
  },

  // Update canvas metadata
  updateCanvasMetadata: (canvasId: string, updates: Partial<CanvasMetadata>) => {
    CanvasService.updateCanvasMetadata(canvasId, updates);
    get().refreshCanvases();
  },

  // Archive canvas
  archiveCanvas: (canvasId: string) => {
    CanvasService.archiveCanvas(canvasId);
    get().refreshCanvases();
  },

  // Restore canvas
  restoreCanvas: (canvasId: string) => {
    CanvasService.restoreCanvas(canvasId);
    get().refreshCanvases();
  },

  // Batch delete
  batchDelete: async (canvasIds: string[]) => {
    const result = await CanvasService.batchDeleteCanvases(canvasIds);

    // Delete thumbnails for successful deletes
    result.success.forEach((id) => {
      ThumbnailService.deleteThumbnail(id);
    });

    get().refreshCanvases();

    if (result.failed.length > 0) {
      console.warn('Some canvases failed to delete:', result.failed);
    }
  },

  // Batch duplicate
  batchDuplicate: async (canvasIds: string[]) => {
    const result = await CanvasService.batchDuplicateCanvases(canvasIds);

    // Copy thumbnails for successful duplicates
    result.success.forEach((newId, index) => {
      const sourceId = canvasIds[index];
      if (sourceId && newId) {
        const thumbnail = ThumbnailService.getThumbnail(sourceId);
        if (thumbnail) {
          StorageService.saveThumbnail(newId, thumbnail);
        }
      }
    });

    get().refreshCanvases();

    if (result.failed.length > 0) {
      console.warn('Some canvases failed to duplicate:', result.failed);
    }
  },

  // Set search query
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  // Set sort order
  setSortBy: (sortBy: SortOption) => {
    set({ sortBy });
  },

  // Toggle tag filter
  toggleTag: (tag: string) => {
    const { selectedTags } = get();
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    set({ selectedTags: newTags });
  },

  // Clear all filters
  clearFilters: () => {
    set({
      searchQuery: '',
      selectedTags: [],
      showArchived: false,
      sortBy: 'date-newest',
    });
  },

  // Toggle show archived
  toggleShowArchived: () => {
    set((state) => ({ showArchived: !state.showArchived }));
  },

  // Add tag to canvas
  addTagToCanvas: (canvasId: string, tag: string) => {
    CanvasService.addTagToCanvas(canvasId, tag);
    get().refreshCanvases();
  },

  // Remove tag from canvas
  removeTagFromCanvas: (canvasId: string, tag: string) => {
    CanvasService.removeTagFromCanvas(canvasId, tag);
    get().refreshCanvases();
  },

  // Regenerate thumbnail
  regenerateThumbnail: async (canvasId: string) => {
    await ThumbnailService.generateAndSave(canvasId);
    get().refreshCanvases();
  },

  // Regenerate all thumbnails
  regenerateAllThumbnails: async () => {
    set({ isLoading: true });
    await ThumbnailService.regenerateAllThumbnails();
    get().refreshCanvases();
    set({ isLoading: false });
  },
}));
