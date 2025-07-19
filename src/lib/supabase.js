import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eoiwbbsclzhvckgaftgs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvaXdiYnNjbHpodmNrZ2FmdGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzM4NDQsImV4cCI6MjA2ODMwOTg0NH0.fpTHFri01GXhJLPzn1gIUEe4s6LIVG6Jkh6sgaRccL4';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase variables. Please connect your Supabase project in settings first.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;