import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

console.log('Supabase Config:', { 
  url: supabaseUrl || 'MISSING', 
  key: supabaseAnonKey ? 'PRESENT' : 'MISSING',
  env: process.env.NODE_ENV 
});

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

