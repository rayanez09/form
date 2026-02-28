import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Standard client for public-facing parts (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client with service_role key to bypass RLS (only use in Admin Dashboard/API)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
