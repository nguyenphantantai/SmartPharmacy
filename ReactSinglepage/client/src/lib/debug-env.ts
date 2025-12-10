/**
 * Debug script to check environment variables
 * Add this to console to check if env vars are loaded
 */

export function debugEnv() {
  console.log('🔍 Environment Variables Debug:');
  console.log('VITE_API_BASE:', import.meta.env.VITE_API_BASE);
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  console.log('DEV mode:', import.meta.env.DEV);
  console.log('PROD mode:', import.meta.env.PROD);
  console.log('MODE:', import.meta.env.MODE);
}

// Auto-run in dev mode
if (import.meta.env.DEV) {
  debugEnv();
}

