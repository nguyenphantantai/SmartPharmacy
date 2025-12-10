import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  }

  supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('✅ Supabase client initialized');
  return supabaseClient;
}

export class SupabaseStorageService {
  private static client: SupabaseClient = getSupabaseClient();

  /**
   * Upload image to Supabase Storage
   * @param bucket - Storage bucket name (e.g., 'medicine-images', 'user-avatars', 'prescriptions_images')
   * @param filePath - Path in bucket (e.g., 'medicines/medicine_123.jpg')
   * @param fileBuffer - File buffer data
   * @param contentType - MIME type (e.g., 'image/jpeg', 'image/png')
   * @returns Public URL of uploaded file
   */
  static async uploadImage(
    bucket: string,
    filePath: string,
    fileBuffer: Buffer,
    contentType: string = 'image/jpeg'
  ): Promise<{ url: string; path: string }> {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: true, // Overwrite if exists
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.client.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath,
      };
    } catch (error: any) {
      console.error(`❌ Error uploading to Supabase Storage:`, error);
      throw error;
    }
  }

  /**
   * Upload base64 image to Supabase Storage
   * @param bucket - Storage bucket name
   * @param filePath - Path in bucket
   * @param base64Data - Base64 image data (with or without data:image prefix)
   * @returns Public URL of uploaded file
   */
  static async uploadBase64Image(
    bucket: string,
    filePath: string,
    base64Data: string
  ): Promise<{ url: string; path: string }> {
    try {
      // Extract base64 data and mime type
      let mimeType = 'image/jpeg';
      let base64Content = base64Data;

      if (base64Data.startsWith('data:image/')) {
        const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
        if (matches) {
          mimeType = `image/${matches[1]}`;
          base64Content = matches[2];
        }
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(base64Content, 'base64');

      return await this.uploadImage(bucket, filePath, buffer, mimeType);
    } catch (error: any) {
      console.error(`❌ Error uploading base64 image to Supabase:`, error);
      throw error;
    }
  }

  /**
   * Delete image from Supabase Storage
   * @param bucket - Storage bucket name
   * @param filePath - Path in bucket
   */
  static async deleteImage(bucket: string, filePath: string): Promise<void> {
    try {
      const { error } = await this.client.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        throw new Error(`Supabase delete error: ${error.message}`);
      }
    } catch (error: any) {
      console.error(`❌ Error deleting from Supabase Storage:`, error);
      throw error;
    }
  }

  /**
   * Get public URL for an image
   * @param bucket - Storage bucket name
   * @param filePath - Path in bucket
   * @returns Public URL
   */
  static getPublicUrl(bucket: string, filePath: string): string {
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Check if file exists in bucket
   * @param bucket - Storage bucket name
   * @param filePath - Path in bucket
   * @returns true if file exists
   */
  static async fileExists(bucket: string, filePath: string): Promise<boolean> {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .list(filePath.split('/').slice(0, -1).join('/') || '', {
          search: filePath.split('/').pop() || '',
        });

      if (error) {
        return false;
      }

      return data?.some((file) => file.name === filePath.split('/').pop()) || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * List all files in a bucket folder
   * @param bucket - Storage bucket name
   * @param folderPath - Folder path in bucket (e.g., 'medicines/' or 'avatars/')
   * @param limit - Maximum number of files to return (default: 1000)
   * @returns Array of file information
   */
  static async listFiles(bucket: string, folderPath: string = '', limit: number = 1000): Promise<any[]> {
    try {
      const allFiles: any[] = [];
      let offset = 0;
      const pageSize = 100;

      while (true) {
        const { data, error } = await this.client.storage
          .from(bucket)
          .list(folderPath, {
            limit: pageSize,
            offset: offset,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (error) {
          throw new Error(`Supabase list error: ${error.message}`);
        }

        if (!data || data.length === 0) {
          break;
        }

        allFiles.push(...data);
        offset += pageSize;

        // Stop if we've reached the limit or no more files
        if (allFiles.length >= limit || data.length < pageSize) {
          break;
        }
      }

      return allFiles;
    } catch (error: any) {
      console.error(`❌ Error listing files from Supabase:`, error);
      throw error;
    }
  }

  /**
   * Download image from Supabase Storage as buffer
   * @param bucket - Storage bucket name
   * @param filePath - Path in bucket
   * @returns Image buffer
   */
  static async downloadImage(bucket: string, filePath: string): Promise<Buffer> {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .download(filePath);

      if (error) {
        throw new Error(`Supabase download error: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from Supabase');
      }

      // Convert Blob to Buffer
      const arrayBuffer = await data.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error: any) {
      console.error(`❌ Error downloading from Supabase:`, error);
      throw error;
    }
  }

  /**
   * Get signed URL for private files (expires after specified time)
   * @param bucket - Storage bucket name
   * @param filePath - Path in bucket
   * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
   * @returns Signed URL
   */
  static async getSignedUrl(
    bucket: string,
    filePath: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        throw new Error(`Supabase signed URL error: ${error.message}`);
      }

      return data.signedUrl;
    } catch (error: any) {
      console.error(`❌ Error creating signed URL:`, error);
      throw error;
    }
  }
}

