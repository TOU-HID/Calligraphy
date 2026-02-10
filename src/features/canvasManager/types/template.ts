/**
 * Template Types
 *
 * Pre-defined canvas templates
 */

import { CanvasTemplate } from './canvas';

/**
 * Built-in Template IDs
 */
export enum TemplateId {
  BLANK = 'blank',
  GRID = 'grid',
  DOTS = 'dots',
  LINES = 'lines',
  MINDMAP = 'mindmap',
  FLOWCHART = 'flowchart',
  WIREFRAME = 'wireframe',
}

/**
 * Get built-in templates
 */
export const getBuiltInTemplates = (): CanvasTemplate[] => [
  {
    id: TemplateId.BLANK,
    name: 'Blank Canvas',
    description: 'Start with a clean slate',
    thumbnail: '',
    defaultShapes: [],
    backgroundColor: '#FFFFFF',
    backgroundPattern: 'none',
  },
  {
    id: TemplateId.GRID,
    name: 'Grid',
    description: 'Perfect for wireframes and layouts',
    thumbnail: '',
    defaultShapes: [],
    backgroundColor: '#FFFFFF',
    backgroundPattern: 'grid',
  },
  {
    id: TemplateId.DOTS,
    name: 'Dotted',
    description: 'Subtle guide for sketching',
    thumbnail: '',
    defaultShapes: [],
    backgroundColor: '#FFFFFF',
    backgroundPattern: 'dots',
  },
  {
    id: TemplateId.LINES,
    name: 'Lined',
    description: 'Great for note-taking',
    thumbnail: '',
    defaultShapes: [],
    backgroundColor: '#FFFFFF',
    backgroundPattern: 'lines',
  },
];
