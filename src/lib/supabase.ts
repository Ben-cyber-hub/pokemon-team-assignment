import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

/**
 * Environment variable validation
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Check .env file and ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set.'
  );
}

/**
 * Supabase client configuration
 */
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
};

/**
 * Typed Supabase client instance
 */
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseKey,
  supabaseOptions
);