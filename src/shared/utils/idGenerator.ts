/**
 * ID Generator Utility
 *
 * Generate unique IDs for canvases, shapes, and other entities
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return uuidv4();
};

/**
 * Generate a canvas ID with prefix
 */
export const generateCanvasId = (): string => {
  return `canvas_${generateId()}`;
};

/**
 * Generate a shape ID with prefix
 */
export const generateShapeId = (): string => {
  return `shape_${generateId()}`;
};

/**
 * Generate a command ID with prefix
 */
export const generateCommandId = (): string => {
  return `cmd_${generateId()}`;
};

/**
 * Check if a string is a valid UUID or a prefixed ID (e.g., "canvas_<uuid>")
 */
export const isValidId = (id?: string): boolean => {
  if (!id) return false;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  // Remove prefix if exists (use the last segment after underscore)
  const cleanId = id.includes('_') ? id.substring(id.lastIndexOf('_') + 1) : id;

  return uuidRegex.test(cleanId);
};
