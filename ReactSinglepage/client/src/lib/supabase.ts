import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client for frontend
let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase configuration missing!');
    console.error('   VITE_SUPABASE_URL:', supabaseUrl || '❌ Missing');
    console.error('   VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
    console.error('   Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file');
    console.error('   File location: ReactSinglepage/client/.env');
    // Return a dummy client to prevent crashes, but operations will fail
    return createClient('https://placeholder.supabase.co', 'placeholder-key');
  }

  if (import.meta.env.DEV) {
    console.log('✅ Supabase configured:');
    console.log('   URL:', supabaseUrl);
    console.log('   Anon Key:', supabaseAnonKey.substring(0, 20) + '...');
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  return supabaseClient;
}

/**
 * Get public URL for an image from Supabase Storage
 * @param bucket - Storage bucket name (e.g., 'medicine-images', 'user-avatars', 'prescriptions_images')
 * @param filePath - Path in bucket
 * @returns Public URL
 */
export function getSupabaseImageUrl(bucket: string, filePath: string): string {
  try {
    const client = getSupabaseClient();
    
    // Check if client is valid (not placeholder)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ Supabase URL not configured, cannot generate Supabase image URL');
      }
      return '';
    }
    
    // Clean filePath - remove leading slash if present
    const cleanFilePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    
    const { data, error } = client.storage
      .from(bucket)
      .getPublicUrl(cleanFilePath);

    if (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Error getting Supabase public URL:', error);
        console.error('   Bucket:', bucket);
        console.error('   FilePath:', cleanFilePath);
      }
      return '';
    }

    if (!data || !data.publicUrl) {
      if (import.meta.env.DEV) {
        console.error('❌ No public URL returned from Supabase');
        console.error('   Bucket:', bucket);
        console.error('   FilePath:', cleanFilePath);
      }
      return '';
    }

    if (import.meta.env.DEV) {
      console.log('✅ Generated Supabase URL:', data.publicUrl);
    }

    return data.publicUrl;
  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.error('❌ Error in getSupabaseImageUrl:', error);
      console.error('   Bucket:', bucket);
      console.error('   FilePath:', filePath);
    }
    return '';
  }
}

/**
 * Upload image to Supabase Storage (for client-side uploads)
 * Note: This requires proper RLS policies on Supabase
 * @param bucket - Storage bucket name
 * @param filePath - Path in bucket
 * @param file - File object from input
 * @returns Public URL of uploaded file
 */
export async function uploadImageToSupabase(
  bucket: string,
  filePath: string,
  file: File
): Promise<{ url: string; path: string }> {
  const client = getSupabaseClient();

  const { data, error } = await client.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  const { data: urlData } = client.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    path: filePath,
  };
}

/**
 * List files in a Supabase Storage bucket folder
 * @param bucket - Storage bucket name
 * @param folderPath - Folder path in bucket (e.g., 'medicines/' or 'avatars/')
 * @returns Array of file information
 */
export async function listSupabaseFiles(
  bucket: string,
  folderPath: string = ''
): Promise<any[]> {
  const client = getSupabaseClient();

  const { data, error } = await client.storage
    .from(bucket)
    .list(folderPath, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

  if (error) {
    throw new Error(`Supabase list error: ${error.message}`);
  }

  return data || [];
}

/**
 * Download image from Supabase Storage as blob
 * @param bucket - Storage bucket name
 * @param filePath - Path in bucket
 * @returns Image blob
 */
export async function downloadSupabaseImage(
  bucket: string,
  filePath: string
): Promise<Blob> {
  const client = getSupabaseClient();

  const { data, error } = await client.storage
    .from(bucket)
    .download(filePath);

  if (error) {
    throw new Error(`Supabase download error: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from Supabase');
  }

  return data;
}

/**
 * Get signed URL for private files (expires after specified time)
 * @param bucket - Storage bucket name
 * @param filePath - Path in bucket
 * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @returns Signed URL
 */
export async function getSupabaseSignedUrl(
  bucket: string,
  filePath: string,
  expiresIn: number = 3600
): Promise<string> {
  const client = getSupabaseClient();

  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    throw new Error(`Supabase signed URL error: ${error.message}`);
  }

  return data.signedUrl;
}

