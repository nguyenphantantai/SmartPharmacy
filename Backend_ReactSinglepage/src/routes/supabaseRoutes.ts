import { Router } from 'express';
import { SupabaseStorageService } from '../services/supabaseService.js';

const router = Router();

/**
 * GET /api/supabase/images/:bucket/:path
 * Get public URL for an image from Supabase Storage
 * Example: /api/supabase/images/medicine-images/medicines/medicine_123.jpg
 */
router.get('/images/:bucket/:path(*)', async (req, res) => {
  try {
    const { bucket, path } = req.params;
    
    // Validate bucket name
    const allowedBuckets = ['medicine-images', 'user-avatars', 'prescriptions_images'];
    if (!allowedBuckets.includes(bucket)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bucket name',
      });
    }

    const publicUrl = SupabaseStorageService.getPublicUrl(bucket, path);
    
    res.json({
      success: true,
      url: publicUrl,
    });
  } catch (error: any) {
    console.error('Error getting Supabase image URL:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting image URL',
      error: error.message,
    });
  }
});

/**
 * GET /api/supabase/list/:bucket
 * List files in a Supabase Storage bucket
 * Query params: folder (optional) - folder path in bucket
 */
router.get('/list/:bucket', async (req, res) => {
  try {
    const { bucket } = req.params;
    const { folder = '' } = req.query;
    
    // Validate bucket name
    const allowedBuckets = ['medicine-images', 'user-avatars', 'prescriptions_images'];
    if (!allowedBuckets.includes(bucket)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bucket name',
      });
    }

    const files = await SupabaseStorageService.listFiles(bucket, folder as string);
    
    res.json({
      success: true,
      data: files,
      count: files.length,
    });
  } catch (error: any) {
    console.error('Error listing Supabase files:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing files',
      error: error.message,
    });
  }
});

/**
 * GET /api/supabase/download/:bucket/:path(*)
 * Download image from Supabase Storage
 * Example: /api/supabase/download/medicine-images/medicines/medicine_123.jpg
 */
router.get('/download/:bucket/:path(*)', async (req, res) => {
  try {
    const { bucket, path } = req.params;
    
    // Validate bucket name
    const allowedBuckets = ['medicine-images', 'user-avatars', 'prescriptions_images'];
    if (!allowedBuckets.includes(bucket)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bucket name',
      });
    }

    const buffer = await SupabaseStorageService.downloadImage(bucket, path);
    
    // Determine content type from file extension
    const extension = path.split('.').pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      avif: 'image/avif',
    };
    const contentType = contentTypeMap[extension || ''] || 'image/jpeg';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error: any) {
    console.error('Error downloading Supabase image:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading image',
      error: error.message,
    });
  }
});

export default router;

