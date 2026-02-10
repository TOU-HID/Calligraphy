/**
 * Canvas Manager Types
 *
 * Type definitions for multi-canvas management system
 */

import { Shape } from '@features/canvas/types/shapes';

/**
 * Canvas Template
 * Pre-defined canvas layouts and styles
 */
export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  defaultShapes: Shape[];
  backgroundColor: string;
  backgroundPattern?: 'grid' | 'dots' | 'lines' | 'none';
}

/**
 * Sort Options for Canvas List
 */
export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'date-newest'
  | 'date-oldest'
  | 'shapes-most'
  | 'shapes-least';

/**
 * Canvas Filters
 * Applied to canvas list for search and filtering
 */
export interface CanvasFilters {
  searchQuery: string;
  tags: string[];
  sortBy: SortOption;
  showArchived: boolean;
}

/**
 * Canvas Creation Options
 */
export interface CreateCanvasOptions {
  name: string;
  template?: CanvasTemplate;
  tags?: string[];
}

/**
 * Canvas Duplication Options
 */
export interface DuplicateCanvasOptions {
  sourceId: string;
  newName?: string;
  includeTags?: boolean;
}

/**
 * Batch Operation Result
 */
export interface BatchOperationResult {
  success: string[];
  failed: Array<{ id: string; error: string }>;
}

/**
 * Canvas Statistics
 */
export interface CanvasStats {
  totalCanvases: number;
  totalShapes: number;
  averageShapesPerCanvas: number;
  mostRecentUpdate: number;
  storageUsed: number; // in bytes
}
