import { createClient } from '@supabase/supabase-js';

/**
 * Initializes supabase client instance
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
