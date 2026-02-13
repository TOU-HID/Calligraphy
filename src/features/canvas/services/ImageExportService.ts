/**
 * Image Export Service
 * 
 * Handles exporting canvas drawings as PNG/JPEG images
 */

import { ImageFormat, SkImage } from '@shopify/react-native-skia';
import Share from 'react-native-share';

export class ImageExportService {
  /**
   * Export canvas as PNG image
   * @param canvasRef - Reference to the Skia canvas
   * @param canvasName - Name for the exported file
   */
  static async exportAsPNG(
    snapshot: SkImage | null,
    canvasName: string = 'drawing'
  ): Promise<void> {
    try {
      if (!snapshot) {
        console.warn('No canvas snapshot available');
        return;
      }

      // Encode as PNG
      const pngData = snapshot.encodeToBase64();
      
      if (!pngData) {
        throw new Error('Failed to encode canvas as PNG');
      }

      const fileName = `${canvasName.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.png`;

      await Share.open({
        title: `Share ${canvasName}`,
        message: `Created with Calligraphy App`,
        url: `data:image/png;base64,${pngData}`,
        filename: fileName,
        type: 'image/png',
        failOnCancel: false,
        useInternalStorage: true,
      } as any);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage !== 'User did not share' && !errorMessage.includes('cancel')) {
          console.error('PNG export failed:', error);
          throw error;
        }
      }
    }
  }

  /**
   * Export canvas as JPEG image
   * @param snapshot - Canvas image snapshot
   * @param canvasName - Name for the exported file
   * @param quality - JPEG quality (0-100)
   */
  static async exportAsJPEG(
    snapshot: SkImage | null,
    canvasName: string = 'drawing',
    quality: number = 90
  ): Promise<void> {
    try {
      if (!snapshot) {
        console.warn('No canvas snapshot available');
        return;
      }

      // Encode as JPEG with quality
      const jpegData = snapshot.encodeToBase64(ImageFormat.JPEG, quality);
      
      if (!jpegData) {
        throw new Error('Failed to encode canvas as JPEG');
      }

      const fileName = `${canvasName.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.jpg`;

      await Share.open({
        title: `Share ${canvasName}`,
        message: `Created with Calligraphy App`,
        url: `data:image/jpeg;base64,${jpegData}`,
        filename: fileName,
        type: 'image/jpeg',
        failOnCancel: false,
        useInternalStorage: true,
      } as any);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage !== 'User did not share' && !errorMessage.includes('cancel')) {
          console.error('JPEG export failed:', error);
          throw error;
        }
      }
    }
  }
}
