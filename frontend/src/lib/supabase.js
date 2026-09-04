import { createClient } from '@supabase/supabase-js'

// We will use standard env variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gssrhraybvyemhktyanj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pJzSGyZQQqczxFXQBfr_Zg_tD9W8VZV';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
