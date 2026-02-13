/**
 * Template Service
 * 
 * Handles loading and saving canvas templates
 */

import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '@core/storage/StorageService';
import { CanvasData, CanvasMetadata } from '@core/storage/StorageService';
import { Shape } from '@features/canvas/types';
import { getBuiltInTemplates, TemplateId } from '../types/template';

interface TemplateData {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  shapes: Shape[];
  backgroundColor: string;
  backgroundPattern: 'none' | 'grid' | 'dots' | 'lines';
}

export class TemplateService {
  private static readonly TEMPLATES_KEY = 'custom_templates';

  /**
   * Get all available templates (built-in + custom)
   */
  static getAllTemplates(): TemplateData[] {
    const builtIn = getBuiltInTemplates().map(template => ({
      ...template,
      shapes: template.defaultShapes || [],
    }));

    const custom = this.getCustomTemplates();

    return [...builtIn, ...custom];
  }

  /**
   * Get custom templates saved by user
   */
  static getCustomTemplates(): TemplateData[] {
    try {
      const stored = StorageService.getString(this.TEMPLATES_KEY);
      if (!stored) return [];

      const templates = JSON.parse(stored);
      return Array.isArray(templates) ? templates : [];
    } catch (error) {
      console.error('Failed to load custom templates:', error);
      return [];
    }
  }

  /**
   * Save a canvas as a template
   */
  static saveAsTemplate(
    canvasId: string,
    name: string,
    description: string
  ): boolean {
    try {
      const canvas = StorageService.loadCanvas(canvasId);
      if (!canvas) {
        console.error('Canvas not found:', canvasId);
        return false;
      }

      const thumbnail = StorageService.loadThumbnail(canvasId) || '';

      const newTemplate: TemplateData = {
        id: `custom-${uuidv4()}`,
        name,
        description,
        thumbnail,
        shapes: canvas.shapes,
        backgroundColor: '#FFFFFF',
        backgroundPattern: 'none',
      };

      const customTemplates = this.getCustomTemplates();
      customTemplates.push(newTemplate);

      StorageService.setString(this.TEMPLATES_KEY, JSON.stringify(customTemplates));
      return true;
    } catch (error) {
      console.error('Failed to save template:', error);
      return false;
    }
  }

  /**
   * Delete a custom template
   */
  static deleteTemplate(templateId: string): boolean {
    try {
      const customTemplates = this.getCustomTemplates();
      const filtered = customTemplates.filter(t => t.id !== templateId);

      StorageService.setString(this.TEMPLATES_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete template:', error);
      return false;
    }
  }

  /**
   * Create a new canvas from a template
   */
  static createCanvasFromTemplate(
    templateId: string,
    canvasName?: string
  ): string | null {
    try {
      const templates = this.getAllTemplates();
      const template = templates.find(t => t.id === templateId);

      if (!template) {
        console.error('Template not found:', templateId);
        return null;
      }

      const id = uuidv4();
      const now = Date.now();

      const canvasData: CanvasData = {
        id,
        shapes: template.shapes,
        version: 1,
        lastModified: now,
      };

      const metadata: CanvasMetadata = {
        id,
        name: canvasName || template.name,
        createdAt: now,
        updatedAt: now,
        shapeCount: template.shapes.length,
        tags: [],
        isArchived: false,
      };

      StorageService.saveCanvas(canvasData);
      StorageService.saveCanvasMetadata(metadata);

      // Add to canvas list
      const canvasList = StorageService.loadCanvasList();
      canvasList.unshift(metadata);
      StorageService.saveCanvasList(canvasList);

      return id;
    } catch (error) {
      console.error('Failed to create canvas from template:', error);
      return null;
    }
  }
}
