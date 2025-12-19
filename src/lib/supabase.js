import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tjlvivpxnltubacusphz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY is not set. Please add it to your .env file.');
  console.warn('Get your anon key from: https://supabase.com/dashboard/project/tjlvivpxnltubacusphz/settings/api');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'placeholder-key');

